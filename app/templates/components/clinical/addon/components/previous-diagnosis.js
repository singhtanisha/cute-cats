import { computed } from '@ember/object';
import Component from '@ember/component';
export default Component.extend({
    // Consumer provided properties.
    transcriptGuid: null,
    diagnosis: null,

    isEncounterDiagnosis: computed('diagnosis.transcriptDiagnoses.[]', 'transcriptGuid', function () {
        return this.get('diagnosis') && this.get('diagnosis').isEncounterDiagnosis(this.get('transcriptGuid'));
    }),

    actions: {
        toggleSelection(diagnosis) {
            var action = this.get('isEncounterDiagnosis') ? 'diagnosisDeselected' : 'diagnosisSelected';
            this.sendAction(action, diagnosis);
        }
    }
});
