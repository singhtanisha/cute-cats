
import { isPresent } from '@ember/utils';
import { computed } from '@ember/object';
import Component from '@ember/component';
export default Component.extend({
    attributeBindings: ['dataElement:data-element'],
    classNameBindings: ['isSelected:is-active'],
    tagName: 'li',

    dataElement: computed('medication.medicationGuid', function() {
        return `medication-summary-list-item-${this.get('medication.medicationGuid')}`;
    }),

    isSelected: computed('selectedMedicationGuid', 'medication.medicationGuid', function () {
        return this.get('selectedMedicationGuid') === this.get('medication.medicationGuid');
    }),
    showProliaModalLink: computed('medication.hasProliaPermanentPlacelink', 'isEntitledToEditMedications', function() {
        return this.get('medication.hasProliaPermanentPlacelink') && this.get('isEntitledToEditMedications');
    }),
    click() {
        if (this.get('medication')) {
            this.attrs.editMedicationOnSummary(this.get('medication'));
        }
    },
    actions: {
        openAssessment(assessmentName) {
            if (isPresent(assessmentName)) {
                this.attrs.openAssessment(assessmentName);
            }
        },
        stopBubble() {
            return false;
        }
    }
});
