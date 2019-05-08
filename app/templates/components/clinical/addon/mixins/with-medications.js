import { on } from '@ember/object/evented';
import { alias, or } from '@ember/object/computed';
import { isPresent, isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { get, computed, observer } from '@ember/object';
import medicationsRepository from 'clinical/repositories/medications';
import MedicationsArray from 'clinical/models/medications-array';
import LoadingMixin from 'clinical/mixins/loading';
import DestroyedMixin from 'tyrion/mixins/destroyed';
import WithPatientPrintTitleMixin from 'charting/mixins/with-patient-print-title';
import session from 'boot/models/session';

/**
 * Loads medications on init based on patientGuid and transcriptGuid properties
 * Sets medications (see clinical/models/medications) and encounterMedications
 * (see clinical/models/medications-encounter) and the noKnownMedications flag
 */
export default Mixin.create(LoadingMixin, DestroyedMixin, WithPatientPrintTitleMixin, {
    analytics: service(),
    authorization: service(),
    printOptions: computed(() => [
        { value: 'all', label: 'All medications' },
        { value: 'active', label: 'Active medications' },
        { value: 'historical', label: 'Historical medications' }
    ]),
    selectedMedicationGuid: computed('selectedItem', {
        get() {
            return this.get('selectedItem');
        },
        set(value) {
            return value;
        }
    }),
    actions: {
        loadMedications() {
            this._loadMedications();
        },
        reloadMedications() {
            this._loadMedications(true);
        },
        editMedication(medication, event) {
            if (isPresent(event) && ($(event.target).hasClass('prolia-modal-open-link') || $(event.target).hasClass('icon-assessment-info'))) {
                return;
            }
            this.sendAction('editMedication', medication);
        },
        recordMedication() {
            this.sendAction('recordMedication');
        },
        toggleHistoricalMedications() {
            this.toggleProperty('historicalMedicationsVisible');
        },

        print(option) {
            // Load the patient info first to ensure that it gets rendered on the print preview
            switch (option) {
                case 'active':
                    this.setProperties({
                        'showMedicationsActive': true,
                        'showMedicationsHistorical': false
                    });
                    break;
                case 'historical':
                    this.setProperties({
                        'showMedicationsActive': false,
                        'showMedicationsHistorical': true
                    });
                    break;
                case 'all':
                    this.setProperties({
                        'showMedicationsActive': true,
                        'showMedicationsHistorical': true
                    });
                    break;
            }

            this.get('store').findRecord('patient', this.get('patientGuid')).then(function() {
                this.sendAction('printAudit', 'Medications');
                this.set('isPrintVisible', true);
            }.bind(this));
        }
    },

    loadMedicationsFailed: false,
    patientGuidMismatch: false,
    medications: undefined,
    noKnownMedications: alias('medications.noKnownMedications'),
    showMedicationsHistorical: true,
    showMedicationsActive: true,
    medicationsError: or('loadMedicationsFailed', 'patientGuidMismatch'),
    activeMedications: alias('medications.active'),
    activePatientMedications: computed('activeMedications.[]', 'patientGuid', function () {
        return this.filterPatientMedications(this.get('activeMedications'));
    }),
    historicalMedications: alias('medications.historical'),
    historicalPatientMedications: computed('historicalMedications.[]', 'patientGuid', function () {
        return this.filterPatientMedications(this.get('historicalMedications'));
    }),
    filterPatientMedications(medications) {
        const patientGuid = this.get('patientGuid');
        if (isEmpty(patientGuid) || isEmpty(medications)) {
            return [];
        }
        return medications.filterBy('patientPracticeGuid', patientGuid);
    },

    selectedMedication: computed('selectedMedicationGuid', 'medications.@each.medicationGuid', {
        get() {
            return this.getWithDefault('medications', []).findBy('medicationGuid', this.get('selectedMedicationGuid'));
        },
        set(key, value) {
            this.set('selectedMedicationGuid', get(value || {}, 'medicationGuid'));
            return this.getWithDefault('medications', []).findBy('medicationGuid', this.get('selectedMedicationGuid'));
        }
    }),

    isEntitledToEditMedications: computed('authorization.entitledFeatures.[]', function () {
        return this.get('authorization').isEntitledFor('Chart.Medications.Edit');
    }),

    canRecordMedication: computed('loadMedicationsFailed', 'isLoading', 'isEntitledToEditMedications', function () {
        return session.get('canEditChart') && !this.get('loadMedicationsFailed') && !this.get('isLoading') && this.get('isEntitledToEditMedications');
    }),

    _loadMedicationsOnInit: on('didInsertElement', observer('patientGuid', function () {
        this._loadMedications();
    })),

    _loadMedications(forceReload) {
        const patientGuid = this.get('patientGuid');

        if (!patientGuid) {
            if (DEBUG) {
                window.console.error('This is designed to be used with a patientGuid. Are you missing something?');
            }
            return;
        }
        this.setProperties({
            loadMedicationsFailed: false,
            patientGuidMismatch: false,
            medications: MedicationsArray.create({ content: [] })
        });
        this._withProgress(medicationsRepository.loadMedications(patientGuid, { forceReload }).then(medications => {
            this._unlessDestroyed(() => {
                // Make sure the patientGuid hasn't changed since the call was initiated.
                // TODO: Refactor to use ember-concurrency
                if (this.get('patientGuid') === patientGuid) {
                    this.setProperties({
                        patientGuidMismatch: isPresent(medications) && medications.every(medication => medication.get('patientPracticeGuid') !== patientGuid),
                        medications
                    });
                }

                const medicationAssociatedProgramsBody = medications.map(medication => {
                    return {
                        Ndc: medication.get('ndc'),
                        RxNormCui: medication.get('rxNormCui'),
                        MedicationGuid: medication.get('medicationGuid')
                    };
                });
                medicationsRepository.loadAssociatedPrograms(medicationAssociatedProgramsBody).then(programs => {
                    if (isPresent(programs)) {
                        programs.forEach(program => {
                            const currentMedications = this.get('medications') || [];
                            const medication = currentMedications.findBy('medicationGuid', program.medicationGuid);
                            if (isPresent(medication)) {
                                medication.set('associatedProgram', program.worksheetTypes);
                            }
                        });
                    }
                });
            });
        })).catch(() => {
            // Make sure the patientGuid hasn't changed since the call was initiated.
            // TODO: Refactor to use ember-concurrency
            if (this.get('patientGuid') === patientGuid) {
                this._setUnlessDestroyed('loadMedicationsFailed', true);
            }
        });
    },

    encounterMedications: computed('medications.[]', 'transcriptGuid', 'patientGuid', function () {
        const transcriptGuid = this.get('transcriptGuid');
        if (transcriptGuid) {
            const medications = this.get('medications');
            if (medications) {
                const patientMedications = MedicationsArray.create({ content: this.filterPatientMedications(medications) });
                return patientMedications.encounterMedications(transcriptGuid);
            }
        }
        return [];
    }),

    isNoKnownChecked: computed('noKnownMedications', {
        get() {
            return this.get('noKnownMedications');
        },
        set(key, value) {
            const patientGuid = this.get('patientGuid');
            this.set('noKnownMedications', value);
            medicationsRepository.recordNoKnownMedications(patientGuid, value)
                .errorMessage('Failed to record no active medications status', {
                    rethrow: true
                }).catch((error) => {
                    // revert to the previous value if we couldn't update it.
                    this._setUnlessDestroyed('noKnownMedications', !value);
                    throw error;
                });
            return value;
        }
    }),

    patientSummary: alias('patient'),
    displayName: 'Medications'
});
