import { computed } from '@ember/object';
import Component from '@ember/component';
export default Component.extend({
    classNames: ['print-section'],
    includeHeaderAndFooter: true,
    title: computed('patient.fullName', function() {
        return 'Family history for ' + this.get('patient.fullName');
    }),
});
