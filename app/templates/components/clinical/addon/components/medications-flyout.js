import { equal, alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import Component from '@ember/component';
import medicationsRepository from 'clinical/repositories/medications';
import Medication from 'clinical/models/medication';
import WithMedication from 'clinical/mixins/with-medications';
import SpinnerMixin from 'common/mixins/spinner';
import ViewPreferences from 'boot/mixins/view-preferences';
import encounterUtils from 'charting/utils/encounter';
import DestroyedMixin from 'tyrion/mixins/destroyed';

export default Component.extend(SpinnerMixin, WithMedication, ViewPreferences, DestroyedMixin, {
    classNames: ['med-flyout-pane','flex-grow','flex-column'],

    viewPreferencesKey: 'medications-flyout',
    viewPreferenceProperties: computed(() => ['currentTab']),

    currentTab: 'frequent-meds',
    previousMedsSelected: equal('currentTab', 'previous-meds'),
    frequentMedsSelected: equal('currentTab', 'frequent-meds'),

    showSearchInput: false,
    showSpinner: alias('isLoading'),
    patientGuid: '',

    actions: {
        setCurrentTab(tab) {
            this.set('currentTab', tab);
        },

        selectMedication(medicationSelected) {
            medicationSelected = Medication.wrap(medicationSelected.get('content'));
            const transcriptGuid = this.get('transcriptGuid');
            const isNewMedication = !medicationSelected.get('medicationGuid');
            const medications = this.get('medications');
            let promise;

            if (isNewMedication) {
                medicationSelected.set('patientPracticeGuid', this.get('patientGuid'));
                medicationSelected.attachToEncounter(transcriptGuid);
                promise = medicationsRepository.saveMedication(medicationSelected);
            } else {
                promise = medicationsRepository.saveTranscriptMedication(medicationSelected, transcriptGuid);
            }

            this._withProgress(promise.then(medication => medications.replaceMedication(medication)))
                .catch(error => this.send('saveError', error, 'Failed to save medication'));
        },

        removeMedication(medicationToRemove) {
            // Need to get the med since this might be an EncounterMedication
            medicationToRemove = Medication.wrap(medicationToRemove.get('content'));
            // TODO: dry with medication-list#removeMedication
            const transcriptGuid = this.get('transcriptGuid');
            const medications = this.get('medications');
            let deletePromise;

            if (medicationToRemove.get('transcriptMedications').length === 1) {
                deletePromise = medicationsRepository.deleteMedication(medicationToRemove, transcriptGuid)
                    .then(() => medications.removeMedication(medicationToRemove));
            } else {
                deletePromise = medicationsRepository.deleteTranscriptMedication(medicationToRemove, transcriptGuid)
                    .then(updatedMedication => medications.replaceMedication(updatedMedication));
            }

            this._withProgress(deletePromise).catch(error => this.send('saveError', error, 'Failed to remove medication'));
        },
        saveError(error, message) {
            const action = encounterUtils.mapSaveErrorToAction(error, 409);
            if (action) {
                this._sendActionUnlessDestroyed(action);
            } else {
                toastr.error(message);
            }
        }
    }
});
