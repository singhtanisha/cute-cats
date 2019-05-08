import { computed } from '@ember/object';
import Component from '@ember/component';
export default Component.extend({
    classNames: ['patient-header-insurance-info'],
    isPopoverVisible: false,
    targetSelector: computed('elementId', function() {
        return '#' + this.get('elementId');
    }),
    click(event) {
        var tagName = event.target.tagName;
        // Only close when clicking on the original target, the link to profile, or the close button
        if ($(event.target).is('.ellipses') || tagName === 'A' || tagName === 'BUTTON') {
            this.toggleProperty('isPopoverVisible');
        }
    }
});
