import Controller, { inject as controller } from '@ember/controller';
import Encounter from 'charting/models/encounter';
import flowsheetDataRepository from 'flowsheets/repositories/flowsheet-data';

export default Controller.extend({
    patientController: controller('patient'),
    isLoading: false,
    actions: {
        toggleIsMetric() {
            this.toggleProperty('isMetric');
            flowsheetDataRepository.saveIsMetric(this.get('isMetric'));
        },
        newEncounter(noteTypeId) {
            var patientPracticeGuid = this.get('patientController.patientPracticeGuid'),
                store = this.get('store');
            Encounter.createNewEncounter(store, patientPracticeGuid, {
                chartNoteTypeId: parseInt(noteTypeId, 0)
            }, store).then(function (encounter) {
                this.transitionToRoute('encounter', patientPracticeGuid, encounter);
            }.bind(this), function () {
                toastr.error('Error creating new encounter');
            });
        }
    }
});
