import { computed } from '@ember/object';
import Component from '@ember/component';
export default Component.extend({
    classNameBindings: [':item', 'isSelected:active'],
    isSelected: computed('selectedDiagnosisGuid', 'diagnosis.diagnosisGuid', function () {
        return this.get('selectedDiagnosisGuid') === this.get('diagnosis.diagnosisGuid');
    })
});
