import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import Component from '@ember/component';
import WithAllergiesMixin from 'clinical/mixins/with-allergies';

export default Component.extend(WithAllergiesMixin, {
    attributeBindings: ['data-element'],
    'data-element': 'print-allergies',
    includeHeaderAndFooter: true,
    patientPracticeGuid: alias('patient.patientPracticeGuid'),
    title: computed('patient.fullName', function() {
        return 'Allergies for ' + this.get('patient.fullName');
    }),
});
