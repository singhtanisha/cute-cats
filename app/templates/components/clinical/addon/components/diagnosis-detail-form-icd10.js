import { later } from '@ember/runloop';
import { or } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
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
    canRefine: computed('refineDiagnosis', 'diagnosis.isCustom', 'isAllowedToEditDiagnoses', function () {
        return this.get('refineDiagnosis') && !this.get('diagnosis.isCustom') && this.get('isAllowedToEditDiagnoses');
    }),
    associatedMedications: computed(function () {
        return [];
    }),
    // TODO: remove once we remove d-diagnosis-detail
    showAllDescriptions: false,
    isAddingNewDiagnosis: false,
    showMedicationEdit: false,
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
    needsRefine: computed('diagnosis.needsIcd10Refinement', 'diagnosis.needsIcd9Refinement', 'relatedDiagnoses', function () {
        if (this.get('diagnosis.needsIcd10Refinement') && isPresent(this.get('relatedDiagnoses'))) {
            return true;
        }
        return this.get('diagnosis.needsIcd9Refinement') && this.get('isAddingNewDiagnosis') && isPresent(this.get('relatedDiagnoses'));
    }),

    showExistingIsTerminal: computed('diagnosis', function () {
        return this.get('diagnosis.isTerminal');
    }),

    showEncounterCommentsSection: or('attachToEncounter', 'diagnosis.encounterCommentsWithComment'),
    showResourcesSection: computed('diagnosis.ic10orIcd9Code', function () {
        return this.get('diagnosis.ic10orIcd9Code');
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
    encounterComment: computed('diagnosis.transcriptDiagnosis.@each.comment', 'transcriptGuid', {
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
    availableMedications: computed('activePatientMedications.[]', 'medications.withoutDiagnosis.[]', function () {
        return this.get('activePatientMedications');
    }),
    acuity: computed('diagnosis.acuity', 'diagnosis.isAcute', {
        get() {
            const diagnosisAcuity = this.get('diagnosis.acuity') || '';
            const diagnosisIsAcute = this.get('diagnosis.isAcute');
            if (diagnosisIsAcute || diagnosisAcuity.toLowerCase() === 'acute') {
                return 'acute';
            }
            if (diagnosisAcuity.toLowerCase() === 'chronic') {
                return 'chronic';
            }
            return 'unspecified';
        },
        set(key, value) {
            this.set('diagnosis.acuity', value || 'unspecified');
            this.set('diagnosis.isAcute', value === 'acute');
            return value;
        }
    }),

    recordMedicationActionName: computed(function () {
        // We only bind to this action if we have someone to delegate to
        if (this.get('recordMedication')) {
            return 'recordMedication';
        }
    }),
    canEditMedications: computed('associatedMedications.[]', 'isAllowedToEditDiagnoses', function () {
        return isPresent(this.get('associatedMedications')) && this.get('isAllowedToEditDiagnoses');
    }),
    canAddMedicationsLink: computed('showMedicationAdd', 'isAllowedToEditDiagnoses', function() {
        return !this.get('showMedicationAdd') && this.get('isAllowedToEditDiagnoses');
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
            // Check for duplicates in list-style
            if (isPresent(medication) && !this.get('associatedMedications').findBy('medicationGuid', medication.get('medicationGuid'))) {
                this.sendAction('associateMedication', medication);
            }
        },
        disassociateMedication(medication) {
            this.sendAction('disassociateMedication', medication);
        },
        recordMedication(searchTerm) {
            this.sendAction('recordMedication', this.get('diagnosis.diagnosisGuid'), searchTerm || '');
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
        },
        toggleComment() {
            this.toggleProperty('showComment');
        },
        toggleEncounterComment() {
            this.toggleProperty('showEncounterComment');
        },
        clearAcuity() {
            this.set('acuity', null);
        },
        toggleAddMedications() {
            this.toggleProperty('showMedicationAdd');
            this.set('showMedicationEdit', false);
            this.set('medicationsQuery', '');
            if (!this.get('availableMedications.length') && !this.get('showMedicationAdd')) {
                this._focusOnDiagnosisComment();
            }
        },
        toggleEditMedications() {
            this.toggleProperty('showMedicationEdit');
            this.set('showMedicationAdd', false);
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
