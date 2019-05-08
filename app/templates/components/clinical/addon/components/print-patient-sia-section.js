import { computed } from '@ember/object';
import Component from '@ember/component';
export default Component.extend({
    classNames: ['print-section'],
    includeHeaderAndFooter: true,
    title: computed('patient.fullName', function() {
        return 'Screenings/ Interventions/ Assessments for ' + this.get('patient.fullName');
    })
});
