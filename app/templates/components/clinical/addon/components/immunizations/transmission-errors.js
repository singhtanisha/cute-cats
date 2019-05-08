import { alias } from '@ember/object/computed';
import { run } from '@ember/runloop';
import Component from '@ember/component';
import { computed, get, set } from '@ember/object';

export default Component.extend({
    classNames: ['transmission-errors'],
    tagName: 'section',
    isExpanded: false,

    errorCount: alias('errors.length'),

    setIsExpanded(value) {
        if (this.get('isExpanded') === value) {
            return;
        }
        run(() => {
            this.set('isExpanded', value);
        });
        if (value) {
            this.$('.transmission-errors-content').slideDown(250);
        } else {
            this.$('.transmission-errors-content').slideUp(250);
        }
    },

    actions: {
        toggleExpanded() {
            run(() => {
                // Prevents tests from spazzing
                this.setIsExpanded(!this.get('isExpanded'));
            });
        }
    }
});
