import { on } from '@ember/object/evented';
import { isEmpty, isPresent } from '@ember/utils';
import { computed, observer } from '@ember/object';
import { alias, or, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import diagnosesRepository from 'clinical/repositories/diagnoses';
import DiagnosesArray from 'clinical/models/diagnoses-array';
import LoadingMixin from 'clinical/mixins/loading';
import session from 'boot/models/session';
import DestroyedMixin from 'tyrion/mixins/destroyed';

/***
 * Loads medications on init based on patientGuid and transcriptGuid properties
 * Sets medications (see clinical/models/medications) and encounterMedications
 * (see clinical/models/medications-encounter) and the noKnownMedications flag
 */

export default Mixin.create(LoadingMixin, DestroyedMixin, {
    actions: {
        loadDiagnoses() {
            this._loadDiagnoses();
        },
        reloadDiagnoses() {
            this._loadDiagnoses(true);
        },
        editDiagnosis(diagnosis) {
            this.sendAction('editDiagnosis', diagnosis);
        },
        recordDiagnoses() {
            this.sendAction('recordDiagnoses');
        },
        toggleProperty(key) {
            this.toggleProperty(key);
        },
        print() {
            this.get('store').findRecord('patient', this.get('patientGuid')).then(() => {
                this.sendAction('printAudit', 'Diagnoses');
                this.set('isPrintVisible', true);
            });
        }
    },

    authorization: service('authorization'),
    diagnoses: undefined,
    patientGuidMismatch: false,
    noKnownDiagnoses: alias('diagnoses.noKnownDiagnoses'),
    isPrintVisible: false,
    diagnosesError: or('loadDiagnosesFailed', 'patientGuidMismatch'),
    activeDiagnoses: alias('diagnoses.active'),
    historicalDiagnoses: alias('diagnoses.historical'),
    chronicActiveDiagnoses: alias('activeDiagnoses.chronic'),
    chronicHistoricalDiagnoses: alias('historicalDiagnoses.chronic'),
    acuteActiveDiagnoses: alias('activeDiagnoses.acute'),
    acuteHistoricalDiagnoses: alias('historicalDiagnoses.acute'),
    unspecifiedActiveDiagnoses: alias('activeDiagnoses.unspecified'),
    activePatientDiagnoses: computed('activeDiagnoses.[]', 'patientGuid', function () {
        return this.filterPatientDiagnoses(this.get('activeDiagnoses'));
    }),
    historicalPatientDiagnoses: computed('historicalDiagnoses.[]', 'patientGuid', function () {
        return this.filterPatientDiagnoses(this.get('historicalDiagnoses'));
    }),
    chronicActivePatientDiagnoses: computed('chronicActiveDiagnoses.[]', 'patientGuid', function () {
        return this.filterPatientDiagnoses(this.get('chronicActiveDiagnoses'));
    }),
    chronicHistoricalPatientDiagnoses: computed('chronicHistoricalDiagnoses.[]', 'patientGuid', function () {
        return this.filterPatientDiagnoses(this.get('chronicHistoricalDiagnoses'));
    }),
    acuteActivePatientDiagnoses: computed('acuteActiveDiagnoses.[]', 'patientGuid', function () {
        return this.filterPatientDiagnoses(this.get('acuteActiveDiagnoses'));
    }),
    acuteHistoricalPatientDiagnoses: computed('acuteHistoricalDiagnoses.[]', 'patientGuid', function () {
        return this.filterPatientDiagnoses(this.get('acuteHistoricalDiagnoses'));
    }),
    unspecifiedActivePatientDiagnoses: computed('unspecifiedActiveDiagnoses.[]', 'patientGuid', function () {
        return this.filterPatientDiagnoses(this.get('unspecifiedActiveDiagnoses'));
    }),
    filterPatientDiagnoses(diagnoses) {
        const patientGuid = this.get('patientGuid');
        if (isEmpty(patientGuid) || isEmpty(diagnoses)) {
            return [];
        }
        return diagnoses.filterBy('patientPracticeGuid', patientGuid);
    },

    unsortedEncounterDiagnoses: computed('diagnoses.@each.eachTranscriptDiagnoses', 'transcriptGuid', function () {
        var transcriptGuid = this.get('transcriptGuid');
        return transcriptGuid ?
            this.get('diagnoses').getEncounterDiagnoses(transcriptGuid) : [];
    }),
    encounterDiagnosesSortProperties: computed(() => ['sortOrder']),
    encounterDiagnoses: sort('unsortedEncounterDiagnoses', 'encounterDiagnosesSortProperties'),

    _loadDiagnosesOnInit: on('init', observer('patientGuid', function () {
        this._loadDiagnoses();
    })),

    _loadDiagnoses(forceReload) {
        const patientGuid = this.get('patientGuid');

        if (!patientGuid) {
            if (DEBUG) {
                window.console.error('This is designed to be used with a patientGuid. Are you missing something?');
            }
            return;
        }
        this.setProperties({
            diagnoses: DiagnosesArray.create({ content: [] }),
            loadDiagnosesFailed: false,
            patientGuidMismatch: false
        });
        this._withProgress(diagnosesRepository.loadDiagnoses(patientGuid, { forceReload }).then(diagnoses => {
            // Make sure the patientGuid hasn't changed since the call was initiated.
            // TODO: Refactor to use ember-concurrency
            if (this.get('patientGuid') === patientGuid) {
                this._setPropertiesUnlessDestroyed({
                    patientGuidMismatch: isPresent(diagnoses) && diagnoses.every(diagnosis => diagnosis.get('patientPracticeGuid') !== patientGuid),
                    diagnoses
                });
            }
        })).catch(() => {
            // Make sure the patientGuid hasn't changed since the call was initiated.
            // TODO: Refactor to use ember-concurrency
            if (this.get('patientGuid') === patientGuid) {
                this._setUnlessDestroyed('loadDiagnosesFailed', true);
                toastr.error('Failed to load diagnoses');
            }
        });
    },

    canRecordDiagnoses: computed('loadDiagnosesFailed', 'isLoading', 'authorization.entitledFeatures.[]', function () {
        return session.get('canEditChart') && !this.get('loadDiagnosesFailed') && !this.get('isLoading') && this.get('authorization').isEntitledFor('Chart.Diagnoses.Edit');
    }),

    isNoKnownChecked: computed('noKnownDiagnoses', {
        get() {
            return this.get('noKnownDiagnoses');
        },
        set(key, value) {
            const patientGuid = this.get('patientGuid');
            this.set('noKnownDiagnoses', value);
            diagnosesRepository.recordNoKnownDiagnoses(patientGuid, value)
                .errorMessage('Failed to record no active diagnoses status', { rethrow: true })
                .catch((error) => {
                    // revert to the previous value if we couldn't update it.
                    this._setUnlessDestroyed('noKnownDiagnoses', !value);
                    throw error;
                });
            return value;
        }
    })
});
