import { resolve } from 'rsvp';
import { copy } from '@ember/object/internals';
import { on } from '@ember/object/evented';
import {
  once,
  scheduleOnce,
  next,
  later,
  cancel
} from '@ember/runloop';
import { isEmpty, isPresent } from '@ember/utils';
import { computed, get, observer, trySet, setProperties } from '@ember/object';
import { alias, notEmpty, empty, and, sort, or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import ClinicalAssessment from 'clinical/models/assessment';
import clinicalAssessmentsRepository from 'clinical/repositories/assessments';
import diagnosisRepository from 'clinical/repositories/diagnoses';
import ErxProviderRepository from 'erx/repositories/erx-provider';
import LGTM from 'common/helpers/validation';
import Medication from 'clinical/models/medication';
import medicationsRepository from 'clinical/repositories/medications';
import proliaAesiMedicationHistory from 'clinical/models/assessments/prolia-aesi-medication-history';
import session from 'boot/models/session';
import SpinnerSupport from 'common/mixins/spinner';
import Validatable from 'ember-lgtm/mixins/validatable';
import WithMedications from 'clinical/mixins/with-medications';
import encounterUtils from 'charting/utils/encounter';
import DestroyedMixin from 'tyrion/mixins/destroyed';
import { task } from 'ember-concurrency';
import PrescriptionDiagnosis from 'erx/models/prescription-diagnosis';

const scheduleMapping = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V' };

export default Component.extend(SpinnerSupport, WithMedications, Validatable, DestroyedMixin, {
    classNames: ['detail-pane', 'col-sm-5', 'summary-details', 'side-fixed'],
    tagName: 'section',

    analytics: service(),
    routing: service('pf-routing'),
    erxOrderService: service('erx-order'),

    contentElement: '.medication-detail .detail-pane-body-wrapper',
    showSpinner: or('isLoading', 'isOrdering'),

    attachToEncounter: false,
    bigHeaderText: 'Record medication',
    daysSupply: null,
    editedMedicationGuid: undefined,
    erxProviders: null,
    isDirty: false,
    isEditing: false,
    isFrequentMedsOpen: true,
    isRecordedFromPlan: false,
    newMedicationFromSearchResult: undefined,
    prescriptionUnitQuery: '',
    prescriptionUnits: null,
    quantity: null,
    searchText: '',
    selectedPrescriptionUnit: null,
    sigText: null,
    showDiscontinuedWarning: false,
    smallHeaderText: 'Medication',
    startDateIsValid: true,
    stopDateIsValid: true,
    transcriptGuid: null,

    controlledSubstanceScheduleChanged: false,
    showDeprecatedMedicationWarning: false,
    deprecatedMedication: null,
    deprecatedReason: null,
    isMedicationDeprecated: false,

    erxOrderDrafts: [],
    hasErxOrderDrafts: notEmpty('erxOrderDrafts'),

    isCustomMedication: empty('newMedicationFromSearchResult.isCustom'),
    isMedOrderable: and('newMedicationFromSearchResult', 'isMedNotDiscontinued'),
    isToolboxVisible: computed('isEditing', 'isEntitledToEditMedications', function () {
        return this.get('isEntitledToEditMedications') && !this.get('isEditing');
    }),
    startDateTime: alias('newMedicationFromSearchResult.startDateTime'),
    stopDateTime: alias('newMedicationFromSearchResult.stopDateTime'),
    disabledOrNotEntitled: computed('disabled', 'isEntitledToEditMedications', function () {
        return this.get('disabled') || !this.get('isEntitledToEditMedications');
    }),
    showProliaPanel: computed('newMedicationAssessmentCardToken', 'isEntitledToEditMedications', function() {
        return this.get('isEntitledToEditMedications') && this.get('newMedicationAssessmentCardToken');
    }),
    validator: LGTM.validator()
        .validates('startDateIsValid').required().isTrue('Please correct the start date')
        .validates('stopDateIsValid').required().isTrue('Please correct the stop date')
        .validates('startDateTime').using('startDateTime', 'stopDateTime', function (start, stop) {
            var startMoment = moment(start),
                stopMoment = moment(stop);
            if (!start || !stop || !startMoment.isValid() || !stopMoment.isValid() || start === stop) {
                // If either is null, invalid or they're the same no need to check for range
                return true;
            }
            return startMoment.isBefore(stopMoment);
        }, 'The start date needs to be before the end date')
        .validates('selectedPrescriptionUnit')
            .using('prescriptionUnitQuery', 'selectedPrescriptionUnit', function(prescriptionUnitQuery, selectedPrescriptionUnit) {
                return isEmpty(prescriptionUnitQuery) || isPresent(selectedPrescriptionUnit);
            }, 'Select a valid prescription unit')
        .validates('sigText').doesntHaveOpeningHtmlTags('Cannot contain html tags.')
        .validates('medicationComment').doesntHaveOpeningHtmlTags('Cannot contain html tags.')
            .build(),

    canDelete: computed(
      'transcriptGuid',
      'newMedicationFromSearchResult.encounterComments.[]',
      function () {
          var encounterComments = this.getWithDefault('newMedicationFromSearchResult.encounterComments', []),
              length = encounterComments.get('length');
          if (length > 1) {
              // Can't delete if we have more than one encounterComment
              return false;
          } else if (length === 1) {
              // If we only have one, it has to be the current one.
              return encounterComments.objectAt(0).transcriptGuid === this.get('transcriptGuid');
          }
          return true;
      }
    ),

    canToggleAttachToEncounter: computed('transcriptGuid', 'isRecordedFromPlan', function () {
        return this.get('transcriptGuid') &&
            !this.get('isRecordedFromPlan');
    }),

    controlledSubstanceSchedule: computed('newMedicationFromSearchResult', function () {
        var controlledSubstanceSchedule = this.get('newMedicationFromSearchResult.controlledSubstanceSchedule');
        return scheduleMapping[controlledSubstanceSchedule];
    }),

    disabled: computed(function () {
        return !session.get('canEditChart');
    }),

    isMedNotDiscontinued: computed('stopDateTime', function() {
        // med is not discontinued if stopDateTime is null OR if stopDateTime is after now
        return isEmpty(this.get('stopDateTime')) || moment(this.get('stopDateTime')).isAfter(moment());
    }),

    recordedProvider: computed('newMedicationFromSearchResult.providerGuid', function(){
        var providerGuid = this.getWithDefault('newMedicationFromSearchResult.providerGuid');
        if (providerGuid) {
            return this.store.findRecord('provider', providerGuid);
        }
        return '';
    }),

    recordedText: computed('newMedicationFromSearchResult.lastModifiedDateTimeUtc', function(){
        var lastModified = this.get('newMedicationFromSearchResult.lastModifiedDateTimeUtc');
        if (lastModified) {
            lastModified = moment(lastModified).format('MM/DD/YYYY hh:mm A');
        }
        return lastModified;
    }),

    restartStopLabel: computed('stopDateTime', function () {
        return (this.get('stopDateTime')) ? 'Restart Med' : 'Move to historical';
    }),

    selectedDiagnosisText: computed('selectedDiagnosis', function(){
        const selectedDiagnosis = this.get('selectedDiagnosis');
        if (isPresent(selectedDiagnosis)) {
            const diagnosis = PrescriptionDiagnosis.createFromListResult(selectedDiagnosis, 'Icd10');
            if (isPresent(diagnosis)) {
                return diagnosis.get('display');
            }
            return get(selectedDiagnosis, 'name');
        }
        return null;
    }),

    shouldShowDuplicateWarning: computed('newMedicationFromSearchResult.duplicates', 'isLoading', 'isOrdering', function() {
        return !this.get('isLoading') && !this.get('isOrdering') && this.get('newMedicationFromSearchResult.duplicates');
    }),

    prescriptionsSortProperty: computed(() => ['prescriptionDate:desc']),
    sortedPrescriptions: sort('newMedicationFromSearchResult.prescriptions', 'prescriptionsSortProperty'),

    _closing: observer('closing', function () {
        if (!this.get('closing')) {
            return;
        }
        this.set('closing', false);
        if (this.get('isDirty')) {
            once(this, '_saveMedication');
        }
    }),

    _markDirty: observer(
      'medicationComment',
      'encounterComment',
      'attachToEncounter',
      'sigText',
      'startDateTime',
      'stopDateTime',
      'selectedMedicationDiscontinuedReason',
      'selectedDiagnosis',
      'startDateIsValid',
      'stopDateIsValid',
      'prescriptionUnitQuery',
      function (obj, prop) {
          if (!this.get('isDirty')) {
              this.updateDirtyAfterRender(true);
          }
          if (prop === 'selectedMedicationDiscontinuedReason') {
              this.set('goToDrugAllergy', this.get('selectedMedicationDiscontinuedReason.id') === 12 /*Allergic to medication*/);
          }
      }
    ),

    clearGoToDrugAllergy: observer('isDirty', function () {
        if (this.get('isDirty') === false) {
            this.set('goToDrugAllergy', false);
        }
    }),

    onControlledSubstanceScheduleChanged: observer('controlledSubstanceScheduleChanged', function () {
        if (this.get('controlledSubstanceScheduleChanged')) {
            return this.setProperties({
                showDeprecatedMedicationWarning: true,
                deprecatedMedication: this.get('newMedicationFromSearchResult'),
                deprecatedReason: {
                    description: 'Medication no longer available',
                    id: 13
                },
                isMedicationDeprecated: true
            });
        }
        this.setProperties({
            showDeprecatedMedicationWarning: false,
            deprecatedMedication: null,
            deprecatedReason: null,
            isMedicationDeprecated: false
        });
    }),

    focusOnSearch: on('didInsertElement', observer('isEditing', function() {
        var _this = this;
        scheduleOnce('afterRender', function(){
            if (!_this.get('isEditing')) {
                _this.$('.medication-search input').focus();
            }
        });
    })),

    loadEditedMedication: on(
      'init',
      observer('editedMedicationGuid', 'isRecordedFromPlan', function () {
          var medicationGuid = this.get('editedMedicationGuid'),
              isEditing = !isEmpty(medicationGuid);

          this.setProperties({
              erxOrderDrafts: [],
              isEditing: isEditing,
              newMedicationFromSearchResult: undefined
          });
          if (isEditing) {
              this._loadMedication();
              this.get('erxOrderService').getDraftsByMedicationGuid(this.get('patientGuid'), medicationGuid).then(drafts => {
                  this.set('erxOrderDrafts', drafts);
              });
          }
          // Change the title.
          if (this.get('isRecordedFromPlan')) {
              this.set('smallHeaderText', 'Note');
              this.set('bigHeaderText', 'Review medications in plan');
          } else {
              this.set('smallHeaderText', 'Medication');
              if (this.get('isEntitledToEditMedications')) {
                  this.set('bigHeaderText', 'Record medication');
              } else {
                  this.set('bigHeaderText', 'Review medication');
              }
          }

      })
    ),

    init() {
        this._super();
        this.get('loadErxProviders').perform();
        this.onControlledSubstanceScheduleChanged();
    },

    actions: {
        addCustomMedication(customMedText) {
            var customMed = {
                'drugName' : customMedText,
                'tradeName' : customMedText,
                'professionalDescription': customMedText,
                'genericName': '',
                'productStrength': '',
                'route': '',
                'doseForm': '',
                'isGeneric': false,
                'isOverTheCounter': false,
                'isMedicalSupply': false,
                'isObsolete': false
            };
            this.doNewMedicationSelected(customMed);
        },

        cancel() {
            // Setting it to false so we don't save
            this.sendAction('updateDirty', false);
            this._close();
        },

        close() {
            this._saveMedication(false, true);
        },

        closeDeprecatedMedicationWarning() {
            this.set('showDeprecatedMedicationWarning', false);
            if (this.get('controlledSubstanceScheduleChanged')) {
                this.set('controlledSubstanceScheduleChanged', false);
            }
        },

        createOrder() {
            this.get('analytics').track('Order Rx - QTY, Unit, and Days Supply', {
                'Entered Quantity': isPresent(this.get('quantity')),
                'Entered Unit': isPresent(this.get('selectedPrescriptionUnit')),
                'Entered Days Supply': isPresent(this.get('daysSupply'))
            });

            const newMedicationFromSearchResult = this.get('newMedicationFromSearchResult');
            const isPending = isEmpty(newMedicationFromSearchResult.get('medicationGuid'));
            this.set('isMedicationDeprecated', false);
            this.set('deprecatedMedication', null);
            this.set('deprecatedReason', null);
            // Check to make sure that the medication has not been deprecated
            this._checkMedicationStatus(newMedicationFromSearchResult).then(() => {
                if(this.get('isMedicationDeprecated')) {
                    this.set('showDeprecatedMedicationWarning', true);
                } else {
                    this.set('isOrdering', true);
                    this._saveMedication(false, false, isPending);
                }
            });
        },

        chooseNewMedication() {
            const medication = this.get('deprecatedMedication');
            const transcriptGuid = this.get('transcriptGuid');
            const deprecatedReason = this.get('deprecatedReason');

            this.set('showDeprecatedMedicationWarning', false);
            this.set('isEditing', false);
            this._withProgress(medicationsRepository.replaceDeprecatedMedication(medication, transcriptGuid, deprecatedReason)).then((newMedication) => {
                this.doNewMedicationSelected(newMedication);
                this.set('searchText', medication.get('drugName'));
                medicationsRepository.loadMedications(this.get('patientGuid'), {forceReload: true});
                next(() => {
                    this.$('.medication-search input').click();
                });
            }).catch(error => this._handleSaveError(error, 'Failed to discontinue the deprecated medication'));
        },

        deleteMedicationDetail() {
            const medication = this.get('newMedicationFromSearchResult');
            if (!medication) {
                return;
            }
            const transcriptGuid = this.get('transcriptGuid');
            const medications = this.get('medications');
            this._withProgress(medicationsRepository.deleteMedication(medication, transcriptGuid)).then(() => {
                medications.removeMedication(medication);
                toastr.success('Deleted Medication');
                this._unlessDestroyed(() => {
                    this.sendAction('updateDirty', false);
                    this._close();
                });
            }).catch(error => this._handleSaveError(error, 'Failed to delete the medication'));
        },

        discontinueDuplicate(duplicateMedication) {
            duplicateMedication.set('stopDateTime', new Date(moment(new Date()).format('MM/DD/YYYY')));
            const currentMedication = this.get('newMedicationFromSearchResult');
            medicationsRepository.saveMedication(duplicateMedication, this.get('transcriptGuid')).then(() => {
                toastr.success('Duplicate discontinued and changed to historical');
                if (currentMedication) {
                    currentMedication.get('duplicates').removeObject(duplicateMedication);
                }
            }).catch(error => this._handleSaveError(error));
        },

        doStartDateTimeToToday() {
            this.set('startDateTime', moment(new Date()).format('MM/DD/YYYY'));
        },

        doStopDateTimeToToday() {
            this.set('stopDateTime', moment(new Date()).format('MM/DD/YYYY'));
        },

        /***
         * This action is called when we click on a dupe to go an edit a different medication
         * We replace instead of transitioning to avoid leaving this in the history.
         * for new meds, we also discard the current changes to avoid saving the dupe.
         */
        editMedication(medication) {
            if (!this.get('isEditing')) {
                // Discard changes if this is a new medication and they clicked a dupe, that means they don't want to save it
                this.updateDirtyAfterRender(false);
            }
            // NOTE: We have to delay this to let the controller update the binding with isDirty so it doesn't avoid the transition
            later(() => {
                const medicationGuid = medication.get('medicationGuid');
                const routing = this.get('routing');
                const transcriptGuid = this.get('transcriptGuid');
                const patientPracticeGuid = medication.get('patientPracticeGuid');
                if (transcriptGuid) {
                    routing.replaceWith(routing.get('currentRouteName'), patientPracticeGuid, transcriptGuid, medicationGuid);
                } else {
                    routing.replaceWith(routing.get('currentRouteName'), patientPracticeGuid, medicationGuid);
                }
            });
        },

        goToPrescriptionDetails(prescription) {
            this.sendAction('goToPrescriptionDetails', prescription);
        },

        loadMedication() {
            this._loadMedication();
        },

        newMedicationAssessmentCardRecorded(model) {
            this.set('newMedicationAssessmentCardModel', model);
        },

        newMedicationSelected(value) {
            if(value === undefined){
                return;
            }
            this.doNewMedicationSelected(value);
        },

        openAssessment(token) {
            // TODO: Open the assessment modal
            this.set('showAssessmentModal', true);
            this.set('newMedicationAssessmentModalModel', {
                token: token,
                isComplete: true
            });
        },

        removeAssociatedDiagnosis() {
            this.set('associatedDiagSearch', null);
            this.set('selectedDiagnosis', null);
        },

        reopenAssessment(model) {
            // TODO: Reopen the assessment modal
            model = model;
        },

        restartMedication() {
            if (this.get('stopDateTime')) {
                this.setProperties({
                    stopDateTime: null,
                    showDiscontinuedWarning: false
                });
            } else {
                this.setProperties({
                    stopDateTime: moment(new Date()).format('MM/DD/YYYY'),
                    showDiscontinuedWarning: true
                });
            }
        },

        saveMedication() {
            this.get('analytics').track('Record Rx - QTY, Unit, and Days Supply', {
                'Entered Quantity': isPresent(this.get('quantity')),
                'Entered Unit': isPresent(this.get('selectedPrescriptionUnit')),
                'Entered Days Supply': isPresent(this.get('daysSupply'))
            });
            this._saveMedication(true, true);
        },

        selectedAssociatedDiag(value) {
            this.set('selectedDiagnosis', value);
            this.set('associatedDiagSearch', null);
        },

        sigSelected(value) {
            this.set('selectedSig', value);
            this.set('sigText', value.labelText);
        }
    },

    _close(medication, goToDrugAllergy) {
        // This is needed to introduce a delay so the isDirtyBinding is updated back (to the controller)
        // before we retry the transition
        later(() => this._unlessDestroyed(() => this.sendAction('close', medication, goToDrugAllergy)));
    },

    _handleSaveError(error, message) {
        if (isPresent(this.get('transcriptGuid'))) {
            const action = encounterUtils.mapSaveErrorToAction(error, 403);
            if (action) {
                this._sendActionUnlessDestroyed('updateDirty', false);
                next(this, 'sendAction', action);
                return true;
            }
        }

        if (message) {
            toastr.error(message);
        }
        return false;
    },

    _loadMedication() {
        var _this = this,
            patientGuid = this.get('patientGuid'),
            medicationGuid = this.get('editedMedicationGuid');
        this.set('loadMedicationFailed', false);
        this._withProgress(medicationsRepository.loadMedication(patientGuid, medicationGuid)).then(function (medication) {
            const medicationCodes = {
                Ndc: medication.get('ndc'),
                RxNormCui: medication.get('rxNormCui'),
                MedicationGuid: medication.get('medicationGuid')
            };
            medicationsRepository.loadAssociatedPrograms([medicationCodes]).then(programs => {
                if (isPresent(programs)) {
                    programs.forEach(program => {
                        if (isPresent(medication) && medication.get('medicationGuid') === program.medicationGuid) {
                            medication.set('associatedProgram', program.worksheetTypes);
                        }
                    });
                }
                _this._unlessDestroyed(function() {
                    _this.doNewMedicationSelected(medication);
                });
            });
        }).errorMessage('The medication could not be loaded', {rethrow: true}).catch(function () {
            _this._unlessDestroyed(function() {
                _this.set('loadMedicationFailed', true);
            });
        });
    },

    _medicationSaved(medication, goToDrugAllergy) {
        // This is needed to introduce a delay so the isDirtyBinding is updated back (to the controller)
        // before we retry the transition
        later(() => this._unlessDestroyed(() => {
            if (this.get('isOrdering')) {
                this.sendAction('createOrder', medication.get('medicationGuid'), this.get('quantity'),
                    this.get('selectedPrescriptionUnit.name'), this.get('daysSupply'));
            } else {
                this._close(medication, goToDrugAllergy);
            }
        }));
    },

    _saveMedication(showSuccess, saveAssessment, isPending) {
        const originalMedication = this.get('newMedicationFromSearchResult');
        if (!this.get('isDirty')) {
            this._medicationSaved(originalMedication);
            return;
        }
        this.validate().then(isValid => {
            // Errors in production have occurred because 'addComment' is called on undefined
            if (isEmpty(originalMedication)) {
                return;
            }

            if (!isValid) {
                this.set('isOrdering', false);
                const errors = this.get('errors');
                const { selectedPrescriptionUnit, startDateTime, medicationComment, sigText } = errors;
                if (isEmpty(selectedPrescriptionUnit) && isEmpty(medicationComment) && isEmpty(sigText)) {
                    toastr.warning(startDateTime || 'Please validate the dates before saving a medication');
                }
                return;
            }

            originalMedication.addComment(this.get('medicationComment'));

            if (this.get('attachToEncounter')) {
                originalMedication.addComment(this.get('encounterComment'), this.get('transcriptGuid'));
            } else {
                originalMedication.detachFromEncounter(this.get('transcriptGuid'));
            }

            const medicationToSave = JSON.parse(JSON.stringify(originalMedication.get('content')));
            const providerGuid = session.get('providerGuid');
            const sig = this.getSig();

            // Set additional
            setProperties(medicationToSave, {
                diagnosisGuid: this.get('selectedDiagnosis.diagnosisGuid'),
                startDateTime: null,
                stopDateTime: null,
                transcriptMedications: originalMedication.get('transcriptMedications'),
                patientPracticeGuid: this.get('patientGuid'),
                isPending,
                providerGuid,
                sig
            });

            if (this.get('isEditing')) {
                // TODO: Seems unnecessary consider removing
                medicationToSave.medicationGuid = this.get('newMedicationFromSearchResult.medicationGuid');
            }

            if (this.get('startDateTime')) {
                medicationToSave.startDateTime = new Date(this.get('startDateTime'));
            }

            if (this.get('stopDateTime')) {
                medicationToSave.stopDateTime = new Date(this.get('stopDateTime'));
                medicationToSave.medicationDiscontinuedReason = this.get('selectedMedicationDiscontinuedReason');
            } else {
                // If there is no stopdate, we have to clear out the medicationDiscontinuedReason
                medicationToSave.medicationDiscontinuedReason = null;
            }

            this.get('analytics').track('Save Medication');

            const goToDrugAllergy = this.get('goToDrugAllergy');
            const transcriptGuid = this.get('transcriptGuid');
            const medications = this.get('medications');
            this._withProgress(medicationsRepository.saveMedication(medicationToSave, transcriptGuid).then(medication => {
                if (showSuccess) {
                    if (saveAssessment) {
                        toastr.success('Medication recorded', '', { timeOut: '1000' });
                    } else {
                        toastr.success('Medication recorded');
                    }
                }

                medications.replaceMedication(medication);

                this._unlessDestroyed(() => {
                    if (saveAssessment) {
                        this._saveAssessment(medication);
                    }

                    this.sendAction('updateDirty', false);
                    this._medicationSaved(medication, goToDrugAllergy);
                });
            }, error => {
                // NOTE: we don't use catch to intentionally avoid success callback errors
                // server error, resets the isDirty so we can retry.
                if (!this._handleSaveError(error, 'Failed to save medication')) {
                    this.sendAction('updateDirty', true);
                }
            }));
        });
    },
    getSig() {
        const { sigText, selectedSig } = this.getProperties('sigText', 'selectedSig');
        if (selectedSig) {
            // Replace the Sig patient description to the Textarea value.
            trySet(selectedSig, 'patientDescription', sigText);
            // Remove this property
            delete selectedSig.labelText;
            return selectedSig;
        }
        // Lets construct a sig since they didn't select one.
        return {
            dose: null,
            route: null,
            frequency: null,
            duration: null,
            professionalDescription: sigText,
            patientDescription: sigText
        };
    },

    doNewMedicationSelected(medicationSelected) {
        const transcriptGuid = this.get('transcriptGuid');
        const isRecordedFromPlan = this.get('isRecordedFromPlan');
        let medication = Medication.wrap(medicationSelected);
        const transcriptMedication = transcriptGuid ? medication.getTranscriptMedication(transcriptGuid) : null;
        const defaultTranscriptMedication = medication.getTranscriptMedication() || {};
        const medications = this.get('medications');

        medication.set('patientPracticeGuid', this.get('patientGuid'));
        medication = copy(medication.get('content'), true);
        medication = Medication.wrap(medication);
        medication.setProperties({
            startDateTime: medication.get('startDateTime') ? moment.utc(medication.get('startDateTime')).format('MM/DD/YYYY') : '',
            stopDateTime: medication.get('stopDateTime') ? moment.utc(medication.get('stopDateTime')).format('MM/DD/YYYY') : '',
            duplicates: medications ? medications.getDuplicatesForMedication(medication) : []
        });

        this.setProperties({
            sigText: medication.get('sig.patientDescription'),
            newMedicationFromSearchResult: medication,
            medicationComment: defaultTranscriptMedication.comment,
            encounterComment: (transcriptMedication || {}).comment,
            attachToEncounter: !!transcriptMedication || isRecordedFromPlan || this.get('isAddingNewMedicationFromEncounter'),
            newMedicationAssessmentCardToken: null,
            newMedicationAssessmentCardModel: null
        });
        if (this.get('isEditing')) {
            // We just load this med, isn't really dirty if we're editing.
            this.updateDirtyAfterRender(false);
        }
        this.getSigSearchResult(medication);
        this.sendAction('refreshMedicationAd', medication.get('ndc'));
    },

    getSigSearchResult(medication) {
        medicationsRepository.loadMedicationReferenceData(medication, this.get('patientGuid'), this.get('store')).then(data => {
            // TODO: rework this function so it doesn't make the med dirty due to a race condition
            // this could be called after the med was saved, triggering a new save if it's dirty
            var medicationDiscontinuedReasons = [],
                associatedDiagnosis = [],
                sortedDiscontinuedReason = [],
                isEditing = this.get('isEditing');

            if (this.get('isDestroyed')) {
                return;
            }

            //lets add property to the sigs
            if (isPresent(data.sigs)) {
                data.sigs.forEach(function(value){
                    value.labelText = value.patientDescription;
                });
            }

            this.set('sigResults',data.sigs);

            //Clean up
            this.set('patientAssociatedDiagnoses', associatedDiagnosis);
            this.set('medicationDiscontinuedReasons', medicationDiscontinuedReasons);
            this.set('selectedSig', null);
            this.set('selectedMedicationDiscontinuedReason', {
                'id': 11,
                'description': 'No reason selected'
            });
            this.set('prescriptionUnits', data.prescriptionUnits);

            // Default the dispense and unit fields to the most recent prescription
            if (isPresent(this.get('newMedicationFromSearchResult.prescriptions'))) {
                this.setProperties({
                    selectedPrescriptionUnit: (data.prescriptionUnits || []).findBy('name', this.get('sortedPrescriptions.firstObject.prescriptionUnit')),
                    quantity: this.get('sortedPrescriptions.firstObject.quantity')
                });
            }

            if (isPresent(data.medicationDiscontinuedReasons)) {
                sortedDiscontinuedReason = data.medicationDiscontinuedReasons.sortBy('description');
            }

            //Make sure we put this guy on top.
            medicationDiscontinuedReasons.push({
                'id': 11,
                'description': 'No reason selected'
            });

            sortedDiscontinuedReason.forEach(value => {
                if (isEditing) {
                    if (value.id === this.get('newMedicationFromSearchResult.medicationDiscontinuedReason.id')) {
                        //Set the default dropdown.
                        this.set('selectedMedicationDiscontinuedReason', value);
                        return;
                    }
                } else {
                    //Skip 'id': 11, 'description': 'No reason selected' since we want this on top.
                    if (value.id !== 11) {
                        medicationDiscontinuedReasons.push(value);
                        return;
                    }
                }
            });

            if (!isEditing && isPresent(data.worksheetTokens)) {
                this.set('newMedicationAssessmentCardToken', data.worksheetTokens[0].name);
            }

            this.set('medicationDiscontinuedReasons', sortedDiscontinuedReason);

            diagnosisRepository.getDiagnoses(this.get('patientGuid')).then(diagnoses => {
                // Typeahead does not work with EmberObjects
                this.set('patientAssociatedDiagnoses', diagnoses);

                this.set('selectedDiagnosis', this.get('patientAssociatedDiagnoses').findBy('diagnosisGuid',
                    this.get('newMedicationFromSearchResult.diagnosisGuid') || this.get('diagnosisGuid')));

                this.updateDirtyAfterRender(!isEditing);
            });
        });
    },
    loadErxProviders: task(function* () {
        const providers = yield ErxProviderRepository.getErxProviders();
        this.set('erxProviders', providers);
    }),
    _saveAssessment(medication) {
        let assessment = this.get('newMedicationAssessmentCardModel'),
            token = this.get('newMedicationAssessmentCardToken'),
            transcriptGuid = this.get('transcriptGuid'),
            patientPracticeGuid = this.get('patientGuid');

        if (!assessment && token === 'proliaAesiMedicationHistory') {
            assessment = ClinicalAssessment.wrap(proliaAesiMedicationHistory, this.get('patientGuid'));
            this.set('newMedicationAssessmentCardModel', assessment);
        }

        if (assessment) {
            assessment.set('medicationGuid', medication.get('medicationGuid'));
            if (isPresent(transcriptGuid)) {
                assessment.set('transcriptGuid', transcriptGuid);
            }

            let nextAssessment = assessment.getNextAssessment(assessment.get('isDismissed'));
            if(nextAssessment) {
                this.sendAction('showAssessmentModal', {
                    token: nextAssessment.token,
                    source: 'Medication Form',
                    medicationGuid: medication.get('medicationGuid'),
                    transcriptGuid: transcriptGuid,
                    patientPracticeGuid: patientPracticeGuid,
                    defaults: nextAssessment.defaultSettings
                });
            }
            return clinicalAssessmentsRepository.saveAssessment(assessment);
        }
        return resolve();
    },
    _checkMedicationStatus(medication) {
        const ndc = medication.get('ndc');

        if (isEmpty(ndc)) {
            // Allow custom medications to be ordered
            return resolve();
        }
        return medicationsRepository.checkMedicationIsValid(ndc).then((data) => {
            if (!data.isValidMedication) {
                this.set('deprecatedMedication', medication);
                this.set('deprecatedReason', data.medicationDiscontinuedReason);
                this.set('isMedicationDeprecated', true);
            }
        });
    },
    updateDirtyAfterRender(isDirty) {
        const scheduledDirtyUpdate = this.get('scheduledDirtyUpdate');
        const wasDirty = scheduledDirtyUpdate ? scheduledDirtyUpdate.value : this.get('isDirty');
        if (isDirty !== wasDirty) {
            if (scheduledDirtyUpdate) {
                cancel(scheduledDirtyUpdate.timer);
            }
            this.set('scheduledDirtyUpdate', {
                value: isDirty,
                timer: scheduleOnce('afterRender', () => {
                    this.set('scheduledDirtyUpdate');
                    this.sendAction('updateDirty', isDirty);
                })
            });
        }
    }
});
