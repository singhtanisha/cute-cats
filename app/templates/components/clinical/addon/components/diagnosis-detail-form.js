import { later } from '@ember/runloop';
import { computed, observer, get } from '@ember/object';
import Component from '@ember/component';
import WithMedications from 'clinical/mixins/with-medications';
import ViewPreferencesMixin from 'boot/mixins/view-preferences';


export default Component.extend(ViewPreferencesMixin, WithMedications, {
    // attrs
    diagnosis: null,
    relatedDiagnoses: computed(function () {
        return [];
    }),
    patientGuid: null,
    transcriptGuid: null,
    canToggleAttachToEncounter: false,
    disabled: false,
    canRefine: computed('refineDiagnosis', 'diagnosis.isCustom', function () {
        return this.get('refineDiagnosis') && !this.get('diagnosis.isCustom');
    }),
    associatedMedications: computed(function () {
        return [];
    }),
    // TODO: remove once we remove d-diagnosis-detail
    showAllDescriptions: false,
    canAddMedications: true,
    isAddingNewDiagnosis: false,

    // actions:
    // recordMedication(),
    // editMedication(medicationGuid, dxGuid),
    // isValidDiagnosisChanged(dxGuid, isValid),
    // refineDiagnosis(),
    // associateMedication(med),
    // disassociateMedication(med),

    viewPreferencesKey: 'diagnosis-detail-form',
    viewPreferenceProperties: computed(() => ['showingCodes']),
    showingCodes: true,
    needsRefine: computed('diagnosis.needsIcd10Refinement', 'diagnosis.needsIcd9Refinement',  function () {
        if (this.get('diagnosis.needsIcd10Refinement')) {
            return true;
        }
        return this.get('diagnosis.needsIcd9Refinement') && this.get('isAddingNewDiagnosis');
    }),

    isStartDateValid: true,
    isStopDateValid: true,
    _isValidDiagnosisChanged: observer(
      'isStartDateValid',
      'isStopDateValid',
      'diagnosis.startDate',
      'diagnosis.stopDate',
      function () {
          var isValid = this.get('isStartDateValid') && this.get('isStopDateValid') && this._isValidDateRange();
          this.sendAction('isValidDiagnosisChanged', this.get('diagnosis.diagnosisGuid'), isValid);
      }
    ),
    _isValidDateRange() {
        var start = this.get('diagnosis.startDate'),
            stop =  this.get('diagnosis.stopDate'),
            startMoment = moment(start),
            stopMoment = moment(stop);
        if (!start || !stop || !startMoment.isValid() || !stopMoment.isValid() || start === stop) {
            // If either is null, invalid or they're the same no need to check for range
            return true;
        }
        return startMoment.isBefore(stopMoment);
    },
    diagnosisComment: computed('diagnosis.diagnosisComment', {
        get() {
            return this.get('diagnosis.diagnosisComment.comment');
        },
        set(key, value) {
            const diagnosis = this.get('diagnosis');
            if (diagnosis) {
                diagnosis.addComment(value);
                return diagnosis.get('diagnosisComment.comment');
            }
            return null;
        }
    }),
    attachToEncounter: computed('diagnosis.transcriptDiagnosis.@each.transcriptGuid', 'transcriptGuid', {
        get() {
            const diagnosis = this.get('diagnosis');
            const transcriptGuid = this.get('transcriptGuid');
            return diagnosis && diagnosis.isEncounterDiagnosis(transcriptGuid);
        },
        set(key, value) {
            const diagnosis = this.get('diagnosis');
            const transcriptGuid = this.get('transcriptGuid');
            if (value) {
                diagnosis.attachToEncounter(transcriptGuid);
            } else {
                diagnosis.detachFromEncounter(transcriptGuid);
            }
            return diagnosis && diagnosis.isEncounterDiagnosis(transcriptGuid);
        }
    }),
    encounterComment: computed('diagnosis.transcriptDiagnosis.@each.comment', {
        get() {
            const diagnosis = this.get('diagnosis');
            const transcriptGuid = this.get('transcriptGuid');
            const transcriptDiagnosis = (diagnosis && diagnosis.getTranscriptDiagnosis(transcriptGuid)) || {};
            return get(transcriptDiagnosis, 'comment');
        },
        set(key, value) {
            const diagnosis = this.get('diagnosis');
            const transcriptGuid = this.get('transcriptGuid');
            diagnosis.addComment(value, transcriptGuid);

            const transcriptDiagnosis = (diagnosis && diagnosis.getTranscriptDiagnosis(transcriptGuid)) || {};
            return get(transcriptDiagnosis, 'comment');
        }
    }),

    availableMedications: computed('associatedMedications.[]', 'medications.active.[]','medications.withoutDiagnosis.[]', function () {
        return _.difference(this.get('medications.withoutDiagnosis.active'),
            this.get('associatedMedications'));
    }),

    recordMedicationActionName: computed(function () {
        // We only bind to this action if we have someone to delegate to
        if (this.get('recordMedication')) {
            return 'recordMedication';
        }
    }),

    actions: {
        // TODO: remove once we remove d-diagnosis-detail
        deleteDiagnosis() {
            this.sendAction('deleteDiagnosis', this.get('diagnosis'));
        },
        startToday() {
            this.set('diagnosis.startDate', moment().format('MM/DD/YYYY'));
        },
        stopToday() {
            this.set('diagnosis.stopDate', moment().format('MM/DD/YYYY'));
        },
        associateMedication(medication) {
            if (this.get('associateMedication')) {
                this.sendAction('associateMedication', medication);
            } else {
                // TODO: remove this branch once we remove d-diagnosis-detail
                this.get('diagnosis').associateMedication(medication);
            }
            if (!this.get('availableMedications.length')) {
                this._focusOnDiagnosisComment();
            }
        },
        disassociateMedication(medication) {
            if (this.get('disassociateMedication')) {
                this.sendAction('disassociateMedication', medication);
            } else {
                // TODO: remove this branch once we remove d-diagnosis-detail
                this.get('diagnosis').disassociateMedication(medication);
            }
            if (this.get('availableMedications.length')) {
                this._focusOnMedicationSelect();
            } else {
                this._focusOnDiagnosisComment();
            }
        },
        recordMedication(searchTerm) {
            this.sendAction('recordMedication', this.get('diagnosis.diagnosisGuid'), searchTerm);
        },
        editMedication(medication) {
            var diagnosisGuid = this.get('diagnosis.diagnosisGuid'),
                medicationGuid = medication.get('medicationGuid');
            this.sendAction('editMedication', medicationGuid, diagnosisGuid);
        },
        toggleProperty(propertyName) {
            this.toggleProperty(propertyName);
        },

        refineDiagnosis() {
            this.sendAction('refineDiagnosis');
        }
    },

    _focusOnDiagnosisComment() {
        this.$('.diagnosis-detail--diagnosis-comment textarea').focus();
    },
    _focusOnMedicationSelect() {
        later(()=>
            this.$('.diagnosis-detail-medication-search input').focus());
    }
});
