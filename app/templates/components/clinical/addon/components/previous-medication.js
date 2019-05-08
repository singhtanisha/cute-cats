import { sort, alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import Component from '@ember/component';
import WithMedication from 'clinical/mixins/with-medications';
import medicationsRepository from 'clinical/repositories/medications';
import SpinnerMixin from 'common/mixins/spinner';

export default Component.extend(WithMedication, SpinnerMixin, {
    classNames: ['flex-grow', 'flex-column'],

    showSpinner: alias('isLoading'),

    medicationsSortProperty: computed(() => ['drugName:asc']),
    activeMedications: sort('encounterMedications.active', 'medicationsSortProperty'),
    historicalMedications: sort('encounterMedications.historical', 'medicationsSortProperty'),

    actions: {
        // TODO: consider removing these two actions, they should bubble if setup correctly.
        selectMedication(medication) {
            this.sendAction('selectMedication', medication);
        },
        deselectMedication(medication) {
            this.sendAction('deselectMedication', medication);
        },

        addAllMedications() {
            var medicationsToAdd = this.get('encounterMedications.active.notInEncounter');
            this._withProgress(medicationsRepository.addMedicationsToEncounter(
                this.get('patientGuid'), medicationsToAdd, this.get('transcriptGuid'))
            ).catch(error => this.sendAction('saveError', error, 'Failed to add medications'));
        }
    }
});
