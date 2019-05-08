import { computed } from '@ember/object';
import Component from '@ember/component';
export default Component.extend({
    classNames: ['print-section', 'diagnoses-print'],
    attributeBindings: ['data-element'],
    'data-element': 'print-diagnoses',
    includeHeaderAndFooter: true,
    title: computed('patient.fullName', function() {
        return 'Diagnoses for ' + this.get('patient.fullName');
    })

});
