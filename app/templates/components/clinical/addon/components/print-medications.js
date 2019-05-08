import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import Component from '@ember/component';
import WithMedications from 'clinical/mixins/with-medications';

export default Component.extend(WithMedications, {
    attributeBindings: ['data-element'],
    'data-element': 'print-medications',
    includeHeaderAndFooter: true,
    patientGuid: alias('patient.patientPracticeGuid'),
    classNames: ['print-section'],
    showHistoricalMeds: true,
    showActiveMeds: true,
    title: computed('patient.fullName', function() {
        return 'Medications for ' + this.get('patient.fullName');
    }),
});
