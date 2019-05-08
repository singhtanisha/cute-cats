import { sort, notEmpty } from '@ember/object/computed';
import { computed } from '@ember/object';
import Component from '@ember/component';
import medicationsRepository from 'clinical/repositories/medications';
import WithMedication from 'clinical/mixins/with-medications';
import SpinnerMixin from 'common/mixins/spinner';
import encounterUtils from 'charting/utils/encounter';
import DestroyedMixin from 'tyrion/mixins/destroyed';

export default Component.extend(SpinnerMixin, WithMedication, DestroyedMixin, {
    patientGuid: '',
    transcriptGuid: '',
    classNames: ['medications-plan-list'],
    classNameBindings: ['hasMedications:with-meds'],
    hasMedications: notEmpty('encounterMedications.inEncounter'),

    medicationsSortProperty: computed(() => ['drugName:asc']),
    sortedMedications: sort('encounterMedications.inEncounter', 'medicationsSortProperty'),

    actions: {
        removeMedication(item) {
            const medicationToRemove = item.get('content');
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

            this._withProgress(deletePromise).catch(error => {
                const action = encounterUtils.mapSaveErrorToAction(error, 409);
                if (action) {
                    this._sendActionUnlessDestroyed(action);
                } else {
                    toastr.error('Failed to remove medication');
                }
            });
        }
    }
});
