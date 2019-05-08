import { inject as service } from '@ember/service';
import Component from '@ember/component';
export default Component.extend({
    analytics: service(),
    tunnel: service(),
    maxDate: moment(new Date()).format('MM/DD/YYYY'),
    resizables: null,
    init() {
        this._super();
        this.set('resizables', []);
    },
    actions: {
        delete() {
            this.sendAction('delete');
        },
        save() {
            this.get('analytics').track('Save Smoking Status');
            this.sendAction('save');
        },
        cancel() {
            this.sendAction('cancel');
        }
    }
});
