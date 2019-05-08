import { observer } from '@ember/object';
import Component from '@ember/component';
export default Component.extend({
    advanceDirectiveObserver: observer('advanceDirective', function() {
        this.rerender();
    }),
    init() {
        this._super();
        this.set('resizables', []);
    },
    actions: {
        delete() {
            this.sendAction('delete');
        },
        save() {
            this.sendAction('save');
        },
        cancel() {
            this.sendAction('cancel');
        }
    }
});
