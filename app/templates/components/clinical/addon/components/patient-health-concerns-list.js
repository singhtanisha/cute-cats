import { isPresent, isEmpty } from '@ember/utils';
import { on } from '@ember/object/evented';
import { alias, not, or } from '@ember/object/computed';
import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task, all } from 'ember-concurrency';
import diagnosesRepository from 'clinical/repositories/diagnoses';
import WithHealthConcerns from 'clinical/mixins/with-health-concerns';
import WithPatientPrintTitle from 'charting/mixins/with-patient-print-title';

export default Component.extend(WithHealthConcerns, WithPatientPrintTitle, {
    patientService: service('patient'),
    authorization: service(),
    routing: service('pf-routing'),

    classNames: ['patient-health-concerns-list'],
    useIcons: computed('routing.currentRouteName', {
        get() {
            return this.get('routing.currentRouteName').indexOf('encounter') === -1;
        },
        set(key, value) {
            return value;
        }
    }),
    isEditingNote: false,
    noKnownHealthConcerns: false,
    showInactiveHealthConcerns: false,
    healthConcerns: null,
    patientSummary: alias('patient'),
    patientPracticeGuid: alias('patient.patientPracticeGuid'),
    displayName: 'Health concerns',
    printOptions: computed(() => [
        { value: 'all', label: 'All health concerns' },
        { value: 'active', label: 'Active health concerns' },
        { value: 'inactive', label: 'Inactive health concerns' }
    ]),
    isAllowedToEditHealthConcerns: computed('authorization.entitledFeatures.[]', function () {
        return this.get('authorization').isEntitledFor('Chart.Encounter.Edit');
    }),
    isNotAllowedToEditHealthConcerns: not('isAllowedToEditHealthConcerns'),
    isLoadingOrError: or('loadHealthConcerns.isRunning', 'loadHealthConcerns.last.isError'),
    loadingOrErrorText: computed('loadHealthConcerns.isRunning', 'loadHealthConcerns.last.isError', function () {
        if (this.get('loadHealthConcerns.isRunning')) {
            return 'Loading patient health concerns...';
        }
        if (this.get('loadHealthConcerns.last.isError')) {
            return 'Failed to load health concerns. Try again later.';
        }
        return null;
    }),
    toggleInactiveText: computed('showInactiveHealthConcerns', 'inactiveHealthConcerns.[]', function () {
        if (this.get('showInactiveHealthConcerns')) {
            return 'Hide inactive';
        }
        return `Show inactive (${this.get('inactiveHealthConcerns.length')})`;
    }),
    hideAddNoteButton: or('isLoadingOrError', 'isEditingNote'),
    addHealthConcernButtonText: computed('useIcons', function () {
        if (this.get('useIcons')) {
            return null;
        }
        return 'Add';
    }),
    addHealthConcernNoteButtonText: computed('useIcons', 'healthConcernNote', function () {
        if (this.get('useIcons')) {
            return null;
        }
        return this.get('healthConcernNote') ? 'Edit note' : 'Note';
    }),
    healthConcernRoute: computed('useIcons', function () {
        return this.get('useIcons') ? 'summary.health-concern' : 'encounter.health-concern';
    }),
    addHealthConcernClass: computed('useIcons', 'isLoadingOrError', function () {
        let classNames;
        if (this.get('useIcons')) {
            classNames = 'icon icon-add icon--md text-color-placeholder box-margin-Lmd-v2';
        } else if (this.get('useIcons')) {
            classNames = 'icon icon-add edit';
        } else {
            classNames = 'btn heading-action';
        }
        if (this.get('isLoadingOrError')) {
            return `${classNames} hidden`;
        }
        return classNames;
    }),
    printDropdownClass: computed('isLoadingOrError', function () {
        return this.get('isLoadingOrError') ? 'hidden' : '';
    }),
    init() {
        this._super();
        this.set('healthConcerns', []);
        const onRefreshChart = data => {
            if (data.patientPracticeGuid === this.get('patientPracticeGuid')) {
                this.get('onLoadedHealthConcerns').perform(data.healthConcerns || []);
            }
        };
        this.get('patientService').on('refreshChart', onRefreshChart);
        this.set('onRefreshChart', onRefreshChart);
    },
    willDestroyElement() {
        this.get('patientService').off('refreshChart', this.get('onRefreshChart'));
    },
    initHealthConcerns: on('init', observer('patientPracticeGuid', function () {
        this.get('loadHealthConcerns').perform();
    })),
    loadHealthConcerns: task(function* () {
        const patientPracticeGuid = this.get('patientPracticeGuid');
        const data = yield this.get('store').query('patient-health-concern', { patientPracticeGuid });
        yield this.get('onLoadedHealthConcerns').perform(data);
    }).restartable(),
    onLoadedHealthConcerns: task(function* (data) {
        const healthConcerns = data.toArray();
        const properties = {
            noKnownHealthConcerns: data.get('meta.noKnownHealthConcerns'),
            healthConcerns
        };
        yield all([
            this.get('loadDiagnosesReferenceItems').perform(healthConcerns),
            this.get('loadAllergiesReferenceItems').perform(healthConcerns)
        ]);
        this.setProperties(properties);
        if (this.attrs.setControllerProperties) {
            this.attrs.setControllerProperties(properties);
        } else if (this.attrs.loadedHealthConcerns) {
            this.attrs.loadedHealthConcerns(properties);
        }
    }),
    loadAllergiesReferenceItems: task(function* (healthConcerns) {
        const allergiesHealthConcerns = healthConcerns.filterBy('healthConcernType', 'Allergy');
        if (isPresent(allergiesHealthConcerns)) {
            const allergies = yield this.loadAllergies(this.get('patientPracticeGuid'));
            allergiesHealthConcerns.forEach(healthConcern => {
                const allergy = allergies.findBy('allergyGuid', healthConcern.get('healthConcernReferenceGuid'));
                healthConcern.set('healthConcernReferenceItem', allergy);
            });
        }
    }),
    loadAllergies(patientPracticeGuid) {
        return this.get('store').query('patient-allergy', { patientPracticeGuid });
    },
    loadDiagnosesReferenceItems: task(function* (healthConcerns) {
        const diagnosesHealthConcerns = healthConcerns.filterBy('healthConcernType', 'Diagnosis');
        if (isPresent(diagnosesHealthConcerns)) {
            const diagnoses = yield diagnosesRepository.loadDiagnoses(this.get('patientPracticeGuid'), {});
            diagnosesHealthConcerns.forEach(healthConcern => {
                const diagnosis = diagnoses.findBy('diagnosisGuid', healthConcern.get('healthConcernReferenceGuid'));
                healthConcern.set('healthConcernReferenceItem', diagnosis);
            });
        }
    }),
    saveNote: task(function* (value) {
        const healthConcern = this.get('healthConcernNote');
        const text = value ? value.trim() : '';
        let wasNewNoteSaved;
        try {
            if (healthConcern) {
                yield this.get('saveExistingNote').perform(healthConcern, text);
            } else {
                wasNewNoteSaved = yield this.get('saveNewNote').perform(text);
            }
            this.set('isEditingNote', false);
            if (wasNewNoteSaved) {
                const adapter = this.get('store').adapterFor('patient-health-concern');
                adapter.clearNoKnownValue(this.get('patientPracticeGuid'));
                this.set('noKnownHealthConcerns', false);
            }
        } catch (e) {
            toastr.error('Failed to save the health concern note');
            this.$('textarea')[0].focus();
        }
    }).drop(),
    saveExistingNote: task(function* (healthConcern, text) {
        if (text === healthConcern.get('healthConcernNote')) {
            return;
        }
        if (isEmpty(text)) {
            healthConcern.deleteRecord();
        } else {
            healthConcern.set('healthConcernNote', text);
        }
        try {
            yield healthConcern.save();
            if (isEmpty(text)) {
                this.get('healthConcerns').removeObject(healthConcern);
            }
        } catch (e) {
            healthConcern.rollbackAttributes();
            throw e;
        }
    }),
    saveNewNote: task(function* (text) {
        if (isEmpty(text)) {
            return false;
        }
        const store = this.get('store');
        const healthConcern = store.createRecord('patient-health-concern', {
            healthConcernNote: text,
            patientPracticeGuid: this.get('patientPracticeGuid'),
            healthConcernType: 'Note'
        });
        try {
            const newHealthConcern = yield healthConcern.save();
            this.get('healthConcerns').pushObject(newHealthConcern);
        } catch (e) {
            store.unloadRecord(healthConcern);
            throw e;
        }
        return true;
    }),
    actions: {
        editNote() {
            const healthConcernNote = this.get('healthConcernNote');
            this.setProperties({
                noteText: healthConcernNote ? healthConcernNote.get('healthConcernNote') : '',
                isEditingNote: true
            });
        },
        noKnownChecked(value) {
            const adapter = this.get('store').adapterFor('patient-health-concern');
            adapter.saveNoKnownValue(this.get('patientPracticeGuid'), value).catch(() => {
                this.set('noKnownHealthConcerns', !value);
            });
        },
        saveNote(text) {
            this.get('saveNote').perform(text);
        },
        toggleShowInactive() {
            this.toggleProperty('showInactiveHealthConcerns');
        },
        print(type) {
            this.get('store').findRecord('patient', this.get('patientPracticeGuid')).then(() => {
                let printActiveHealthConcerns = false;
                let printInactiveHealthConcerns = false;
                if (type === 'inactive') {
                    printInactiveHealthConcerns = true;
                } else if (type === 'active') {
                    printActiveHealthConcerns = true;
                } else {
                    printActiveHealthConcerns = true;
                    printInactiveHealthConcerns = true;
                }
                this.setProperties({
                    isPrintVisible: true,
                    printActiveHealthConcerns,
                    printInactiveHealthConcerns
                });
                this.sendAction('printAudit', 'PatientHealthConcerns');
            });
        }
    }
});
