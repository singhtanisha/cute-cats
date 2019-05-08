import { computed } from '@ember/object';
import Component from '@ember/component';
export default Component.extend({
    attributeBindings: ['data-element'],
    tagName: 'li',
    classNameBindings: ['isSelected:is-active'],
    isSelected: computed('selectedDiagnosisGuid', 'diagnosis.diagnosisGuid', function () {
        return this.get('selectedDiagnosisGuid') === this.get('diagnosis.diagnosisGuid');
    }),
    click() {
        this.attrs.editDiagnosis(this.get('diagnosis'));
    }
});
