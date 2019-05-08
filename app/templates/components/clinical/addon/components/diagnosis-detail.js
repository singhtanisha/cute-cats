import { all } from 'rsvp';
import { isEmpty } from '@ember/utils';
import { scheduleOnce, next, once } from '@ember/runloop';
import { on } from '@ember/object/evented';
import { or, empty, not, alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import EmberObject, {
  get,
  computed,
  observer
} from '@ember/object';
import session from 'boot/models/session';
import diagnosesRepository from 'clinical/repositories/diagnoses';
import SpinnerSupport from 'common/mixins/spinner';
import ViewPreferences from 'boot/mixins/view-preferences';
import { isDuplicate } from 'clinical/models/favorite-diagnosis';
import encounterUtils from 'charting/utils/encounter';
import favoriteDiagnosesSettings from 'clinical/models/favorite-diagnoses-settings';
import { task, waitForQueue } from 'ember-concurrency';

export default Component.extend(SpinnerSupport, ViewPreferences, {
    analytics: service(),
    pfRouting: service('pf-routing'),
    authorization: service('authorization'),
    // attrs
    closing: false, // Two-way bound for routnes transition
    isDirty: false, // One-way bound for routes transition
    patientGuid: null,
    transcriptGuid: null,
    diagnosisGuid: undefined,    // Passed when editing a diagnosis.
    isRecordedFromAssessment: false,
    canAddMultiple: true,
    canAddMedications: true,
    canAddCustom: true,
    isLabResultDiagnosis: false,
    tabSources: null,
    defaultDropdownTab: 1,

    // actions
    close: null,
    recordMedication: null, // (diagnosisGuid, term)
    editMedication: null,   // (medicationGuid, diagnosisGuid)
    saveDiagnosis: null,    // Used by labs since they delete/save differently
    deleteDiagnosis: null,  // Used by labs since they delete/save differently

    isLoading: or('loadTask.isRunning', 'saveTask.isRunning', 'deleteTask.isRunning', 'cancelTask.isRunning', 'saveThenClose.isRunning'),

    // Overrides
    // SpinnerSupport Overrides
    showSpinner: alias('isLoading'),
    contentElement: '.well.right-module',
    classNames: ['diagnosis-icd10-container', 'type-v2'],
    // ViewPreferences overrides
    viewPreferencesKey: 'diagnosis-detail',
    viewPreferenceProperties: computed(() => ['isShowCodesInSearch']),
    // Detail Pane overrides
    detailsPaneTitle: computed('isAddingNewDiagnosis', 'isRecordedFromAssessment', function () {
        let baseText = this.get('isAddingNewDiagnosis') ?
            'Record diagnosis' :
            'Review diagnosis';
        if (this.get('isRecordedFromAssessment')) {
            baseText += ' in assessment';
        }
        return baseText;
    }),
    isToolboxVisible: computed('displayDiagnosisTypeAhead', function () {
        return false;
    }),

    // Analytics properties
    addedViaFavorite: false,
    addedViaSearch: false,
    addedViaCustom: false,

    disabled: computed(function () {
        return !session.get('canEditChart') || !this.get('isAllowedToEditDiagnoses');
    }),

    // State management (adding -> editing -> refining -> and back)
    isAddingNewDiagnosis: empty('diagnosisGuid'),
    isRefiningDiagnosis: false,
    displayDiagnosisTypeAhead: computed('isAddingNewDiagnosis', 'isRefiningDiagnosis', function () {
        return this.get('isAddingNewDiagnosis') && !this.get('isRefiningDiagnosis');
    }),
    isEditingDiagnosisDetails: computed('isRefiningDiagnosis', 'diagnosis', function () {
        return !this.get('isRefiningDiagnosis') && this.get('diagnosis');
    }),
    isFrequentDiagnosisOpen: true,

    isShowCodesInSearch: true,

    codesInSearchText: computed('isShowCodesInSearch', function () {
        return (this.get('isShowCodesInSearch') ? 'Hide' : 'Show') + ' codes in search';
    }),
    refineCodeSystem: 'icd10Code',

    isICD9ModalShowing: false,

    diagnosis: null,
    hasValidDates: true,
    isAllowedToEditDiagnoses: computed('authorization.entitledFeatures.[]', function () {
        return this.get('authorization').isEntitledFor('Chart.Diagnoses.Edit');
    }),
    isNotAllowedToEditDiagnoses: not('isAllowedToEditDiagnoses'),
    init() {
        this._super();
        this.setProperties({
            resizables: [],
            tabSources: [{
                category: 'My Dx list',
                noResultsMessage: 'Create personalized Dx favorites list in Settings to quickly select diagnoses that you use most often',
                options: [],
                customLink: {
                    text: 'Update My Dx list',
                    action: 'updateFavorites'
                }
            }]
        });
    },
    _loadDiagnosis: on('init', observer('diagnosisGuid', function () {
        this.get('loadTask').perform();
    })),

    _loadIcd10RelatedDiagnoses() {
        if (!this.get('diagnosis.needsIcd10Refinement')) {
            return;
        }

        this.set('relatedDiagnoses', []);
        diagnosesRepository.loadIcd10RelatedDiagnoses(this.get('diagnosis')).then(icd10Diagnoses => {
            this.set('relatedDiagnoses', icd10Diagnoses);
        }).errorMessage('Can\'t load related diagnoses. Try again later.');
    },

    canToggleAttachToEncounter: computed('transcriptGuid', 'isRecordedFromAssessment', 'isAllowedToEditDiagnoses', function () {
        return this.get('transcriptGuid') && !this.get('isRecordedFromAssessment') && this.get('isAllowedToEditDiagnoses');
    }),

    canDelete: computed(
      'attachedToAdditionalEncounter',
      'associatedWithAMedication',
      function () {
          // This checks are here, because we only edit one at a time and the "Delete" button is at this level
          // not the form
          return !this.get('attachedToAdditionalEncounter') && !this.get('associatedWithAMedication');
      }
    ),

    attachedToAdditionalEncounter: computed('diagnosis.encounterComments.[]', 'transcriptGuid', function () {
        const encounterComments = this.get('diagnosis.encounterComments') || [];
        const length = encounterComments.get('length');
        if (length > 1) {
            return true;
        } else if (length === 1) {
            return encounterComments.objectAt(0).transcriptGuid !== this.get('transcriptGuid');
        }
        return false;
    }),

    associatedWithAMedication: computed('associatedMedications.[]', function () {
        // Note that computed.bool considers an empty array to be true.
        return !!this.get('associatedMedications.length');
    }),

    recordMedicationActionName: computed(function () {
        // We only bind to this action if we have someone to delegate to
        if (this.get('recordMedication')) {
            return 'recordMedication';
        }
    }),
    editMedicationActionName: computed(function () {
        // We only bind to this action if we have someone to delegate to
        if (this.get('editMedication')) {
            return 'editMedication';
        }
    }),

    focusOnSearch: on('didInsertElement', observer('isAddingNewDiagnosis', function () {
        scheduleOnce('afterRender', () => {
            if (this.get('isAddingNewDiagnosis')) {
                this.$('.diagnosis-typeahead input').focus();
            }
        });
    })),
    deleteMessage: computed('isLabResultDiagnosis', function () {
        if (this.get('isLabResultDiagnosis')) {
            return 'This action is final and will remove this diagnosis from this lab result, but not this patient\'s history.';
        }
        return 'This action is final and will remove this diagnosis from this patient\'s history.';
    }),

    saveThenClose: task(function* () {
        yield this.get('saveTask').perform();
        this.sendAction('close');
    }),

    loadTask: task(function* () {
        const patientGuid = this.get('patientGuid');
        const diagnosisGuid = this.get('diagnosisGuid');
        yield this.get('saveTask').perform();

        this.set('diagnosis', null);
        this.set('relatedDiagnoses', []);
        if (this.get('isAddingNewDiagnosis')) {
            this.set('query', '');
        } else {
            const diagnosis = yield diagnosesRepository.loadDiagnosis(patientGuid, diagnosisGuid);
            this.set('diagnosis', diagnosis);
            this.set('hasValidDates', true);
            this._loadIcd10RelatedDiagnoses();
        }

        yield this.get('_loadFavoriteDiagnosesForIcd10').perform();
    }).restartable(),

    cancelTask: task(function* () {
        if (!this.get('diagnosis.isDirty')) {
            this.sendAction('close');
            return;
        }
        if (!this.get('diagnosis.isNew')) {  // For existing Dx revert the changes by reloading
            yield diagnosesRepository.loadDiagnosis(this.get('patientGuid'), this.get('diagnosis.diagnosisGuid'));
            this.sendAction('close');
        } else {
            // It's a new diagnoses, simply clear isDirty, so we can close and discard the in memory changes
            this.set('diagnosis.isDirty', false);
            // NOTE: makes sure isDirty propagates to the controller before sending the close action
            scheduleOnce('sync', () => {
                this.sendAction('close');
            });
        }
    }).drop(),

    saveThenAdd: task(function* () {
        yield this.get('saveTask').perform();
        this.setProperties({
            diagnosis: null,
            query: ''
        });
        yield waitForQueue('afterRender');
        this.set('defaultDropdownTab', 1);
        const $input = this.$('.filtered-search-input');
        if ($input) {
            $input.focus();
        }
    }).drop(),

    actions: {
        save() {
            this.get('saveThenClose').perform();
        },
        saveAndAdd() {
            this.get('saveThenAdd').perform();
        },
        cancel() {
            this.get('cancelTask').perform();
        },
        deleteDiagnosis() {
            this.get('deleteTask').perform();
        },
        refineDx(relatedDiagnoses) {
            this.set('relatedDiagnoses', relatedDiagnoses);
            this.set('isRefiningDiagnosis', true);
            this.set('showRefineFacets', true);
        },
        diagnosisSelected(diagnosis) {
            this.set('addedViaSearch', true);
            this._setSelectedDiagnosis(diagnosis);
            this.set('isRefiningDiagnosis', false);
        },
        customDiagnosisSelected(customDiagnosis) {
            this.set('addedViaCustom', true);
            this._setSelectedDiagnosis(customDiagnosis);
        },
        favoriteDiagnosisSelected(diagnosis) {
            this.set('addedViaFavorite', true);
            this._setSelectedDiagnosis(diagnosis);
            this._loadIcd10RelatedDiagnoses();
        },

        recordMedication(ignoredLegacyParameter, term) {
            this.get('saveTask').perform().then(() => {
                this.sendAction('recordMedication', this.get('diagnosis.diagnosisGuid'), term);
            });
        },
        editMedication(medicationGuid) {
            this.get('saveTask').perform().then(() => {
                this.sendAction('editMedication', medicationGuid, this.get('diagnosis.diagnosisGuid'));
            });
        },
        associateMedication(medication) {
            this.get('associatedMedications').pushObject(medication);
        },
        disassociateMedication(medication) {
            this.get('associatedMedications').removeObject(medication);
        },
        hasValidDatesChanged(diagnosisGuid, hasValidDates) {
            this.set('hasValidDates', hasValidDates);
        },
        refineDiagnosis() {
            this.set('isRefiningDiagnosis', true);
            this.set('showRefineFacets', true);
        },
        goBackToDiagnoisDetails() {
            this.set('isRefiningDiagnosis', false);
        },
        diagnosisRefined() {
            this.set('isRefiningDiagnosis', false);
        },
        toggleProperty(propertyName) {
            this.toggleProperty(propertyName);
        },
        closeICD9Modal() {
            this.set('isICD9ModalShowing', false);
        },
        closeICD10Modal() {
            this.set('isICD10ModalShowing', false);
        },
        saveToMyDxList () {
            const diagnosis = this.get('diagnosis');

            if (diagnosis.get('diagnosisCodes.length') === 0) {
                toastr.error('Diagnosis requires codes for My Dx List');
            } else if (isDuplicate(diagnosis, this.store.peekAll('favoriteDiagnosis'))) {
                toastr.error('Item already on the list');
            } else {
                const newRecord = this.store.createRecord('favoriteDiagnosis', {
                    name: diagnosis.get('name'),
                    code: diagnosis.get('code'),
                    diagnosisCodes: diagnosis.get('diagnosisCodes')
                });

                next(() => {
                    newRecord.save().then(() => {
                        toastr.success('Added to My Dx List');
                    });
                });
            }
        },
        editDiagnosisSelection() {
            this.set('addedViaSearch', false);
            this.set('diagnosis', null);
            this.set('isRefiningDiagnosis', false);
            this.set('searchControlOpen', true);
        },
        updateMyDxList() {
            this.get('pfRouting').transitionToRoute('settings.favoriteDiagnoses');
        }
    },
    associatedMedications: computed(function () {
        return [];
    }),
    _setAssociatedMedications: observer('diagnosis.medications.[]', function () {
        // NOTE: relying on an observer since we don't have an easy way to have a read-only or oneway binding
        const medications = this.get('diagnosis.medications') || [];
        const medicationsCopy = medications.slice(0);
        this.set('associatedMedications', medicationsCopy);
    }),

    _setSelectedDiagnosis(diagnosis) {
        diagnosis.set('patientPracticeGuid', this.get('patientGuid'));
        diagnosis.set('isDirty', true);
        this.set('relatedDiagnoses', []);
        if (this.get('transcriptGuid')) {
            diagnosis.attachToEncounter(this.get('transcriptGuid'));
        }
        this.set('diagnosis', diagnosis);
    },

    _getAnalyticsActionDetails(diagnosis) {
        const actionDetails = {};
        const transcriptGuid = this.get('transcriptGuid');
        actionDetails['Dx Comment'] = !!diagnosis.get('diagnosisComment.comment');
        actionDetails['Tx Comment'] = !!(transcriptGuid && diagnosis.getTranscriptDiagnosis(transcriptGuid) && get(diagnosis.getTranscriptDiagnosis(transcriptGuid), 'comment'));
        actionDetails['Has Medications'] = !!this.get('associatedMedications.length');
        actionDetails['Is Acute'] = diagnosis.get('isAcute');
        actionDetails['Is Chronic'] = diagnosis.get('acuity') ? diagnosis.get('acuity').toLowerCase() === 'chronic': false;
        actionDetails['Is Undefined'] = diagnosis.get('acuity') ? diagnosis.get('acuity').toLowerCase() === 'unspecified': true;
        actionDetails['Has Date'] = diagnosis.get('startDate') || diagnosis.get('stopDate');
        actionDetails['Via Favorite'] = this.get('addedViaFavorite');
        actionDetails['Via Search'] = this.get('addedViaSearch');
        actionDetails['Via Custom'] = this.get('addedViaCustom');
        return actionDetails;
    },

    saveTask: task(function* () {
        const transcriptGuid = this.get('transcriptGuid');
        const associatedMedications = this.get('associatedMedications');
        const diagnosis = this.get('diagnosis') || EmberObject.create();
        const originalMeds = diagnosis.get('medications');
        const addedMeds = _.difference(associatedMedications, originalMeds);
        const removedMeds = _.difference(originalMeds, associatedMedications);

        if (!diagnosis.get('isDirty') && isEmpty(addedMeds) && isEmpty(removedMeds)) {
            // It isn't dirty and we didn't change meds nothing to do here, thank you very much for opening the detail pane
            return;
        }

        if (!this.get('hasValidDates')) {
            toastr.warning('Please validate the date before saving a diagnosis');
            throw 'Can\'t save diagnoses due to validation errors';
        }

        // Add logic for ICD-10 refinement here
        if (diagnosis.get('needsIcd10Refinement') && this.get('isAddingNewDiagnosis')) {
            this.set('isICD10ModalShowing', true);
            this.set('isRefiningDiagnosis', true);
            this.set('showRefineFacets', true);
            throw 'Can\'t save diagnoses due to validation errors';
        }

        this._prepareDiagnosisForSave(diagnosis);
        this.get('analytics').track('Save Diagnosis', this._getAnalyticsActionDetails(diagnosis));
        if (this.get('saveDiagnosis')) {
            this.sendAction('saveDiagnosis', diagnosis);
            // If someone (e.g. lab results) is handling this, we don't want to call the server
            return;
        }

        try {
            if (this.get('isDirty')) {
                yield diagnosesRepository.saveDiagnosis(diagnosis, transcriptGuid);
            }
            if (!isEmpty(addedMeds)) {
                yield all(addedMeds.map(addedMed => diagnosis.associateMedication(addedMed)));
            }
            if (!isEmpty(removedMeds)) {
                yield all(removedMeds.map(removedMed => diagnosis.disassociateMedication(removedMed)));
            }
        } catch (error) {
            this._handleSaveError(error, 'Failed to save diagnosis');
        }
    }).drop(),

    _prepareDiagnosisForSave(diagnosis) {
        const transcriptGuid = this.get('transcriptGuid');
        // We always create at least one TranscriptDiagnosis
        if (this.get('isRecordedFromAssessment')) {
            diagnosis.attachToEncounter(transcriptGuid);
        } else {
            diagnosis.createDefaultTranscriptDiagnosis();
        }
        diagnosis.set('name', (diagnosis.get('name') || '').substring(0, 255));
    },
    deleteTask: task(function* () {
        const transcriptGuid = this.get('transcriptGuid');
        const diagnosis = this.get('diagnosis');

        if (this.get('deleteDiagnosis')) {
            this.sendAction('deleteDiagnosis', diagnosis);
            // If someone (e.g. lab results) is handling this, we don't want to call the server
        } else {
            try {
                if (diagnosis.get('medications.length')) {
                    yield all(diagnosis.get('medications').map(medication => {
                        return diagnosis.disassociateMedication(medication);
                    }));
                }

                yield diagnosesRepository.deleteDiagnosis(diagnosis, transcriptGuid);
                toastr.success('Deleted diagnosis');
                if (this.attrs.diagnosisDeleted) {
                    this.attrs.diagnosisDeleted(diagnosis);
                }
            } catch (error) {
                this._handleSaveError(error, 'Failed to delete the diagnosis');
                return;
            }
        }
        this.sendAction('close');
    }).drop(),
    _closingChanged: observer('closing', function () {
        once(this, () => {
            if (!this.get('closing')) {
                return;
            }
            this.set('closing', false);
            if (this.get('diagnosis.isDirty')) {
                this.get('saveThenClose').perform();
            }
        });
    }),
    _setIsDirty: observer('diagnosis.isDirty', function () {
        this.sendAction('updateDirty', !!this.get('diagnosis.isDirty'));
    }),
    _handleSaveError(error, message) {
        let action = diagnosesRepository.mapSaveErrorToAction(error, this.get('diagnosis'));
        // The error message could be a dx associated with a lab result or a timing issue (e.g. an encounter was signed or a dx was associated with a med without this client knowing)
        const errorMessage = get(error, 'responseJSON.message');
        const validErrorMessages = ['Patient diagnosis associated to a medication.', 'Patient diagnosis associated to a lab result.'];
        if (validErrorMessages.indexOf(errorMessage) === -1 && !action) {
            action = encounterUtils.mapSaveErrorToAction(error, 403);
        }
        if (action) {
            this.sendAction('updateDirty', false);
            next(this, 'sendAction', action);
        } else {
            toastr.error(errorMessage || message);
        }
        throw error;
    },
    _loadFavoriteDiagnosesForIcd10: task(function* () {
        const store = this.get('store');
        try {
            const displayCodeSystem = yield favoriteDiagnosesSettings.getDisplayCodeSystem(store);
            this.set('displayCodeSystem', displayCodeSystem);

            const sortOrder = yield favoriteDiagnosesSettings.getSortOrder(store);
            const diagnoses = yield store.findAll('favoriteDiagnosis');
            let options = [];
            if (diagnoses.get('length')) {
                diagnoses.forEach(code => code.set('displayCodeSystem', displayCodeSystem));
                options = diagnoses.sortBy(sortOrder.property);
                if (!sortOrder.sortAscending) {
                    options.reverse();
                }
            }
            this.set('tabSources', [{
                category: 'My Dx list',
                noResultsMessage: 'Create personalized Dx favorites list in Settings to quickly select diagnoses that you use most often',
                customLink: {
                    text: 'Update My Dx list',
                    action: 'updateFavorites'
                },
                options
            }]);
        } catch (e) {
            this.set('didFailToLoadFavorites', true);
            throw e;
        } finally {
            this.set('isLoading', false);
        }
    }).drop()
});
