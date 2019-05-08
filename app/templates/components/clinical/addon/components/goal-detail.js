import { scheduleOnce } from '@ember/runloop';
import { isEmpty } from '@ember/utils';
import { observer } from '@ember/object';
import Component from '@ember/component';
export default Component.extend({
    resizables: null,
    addingNewGoal: false,
    errors: null,
    placeholderText: 'Add a goal',
    init() {
        this._super();
        this.setProperties({
            addingNewGoal: !this.get('goal.description'),
            resizables: []
        });
        this.focusSearch();
    },
    willDestroy() {
        this.set('errors', null);
    },
    goalResetObserver: observer('goal', function(){
        if (isEmpty(this.get('goal.description'))){
            let textarea = this.$('textarea');
            textarea[0].value = '';
            autosize.update(textarea);
        }
    }),
    isValidObserver: observer('isValid', 'goal', function() {
        if (this.get('isValid')) {
            this.focusSearch();
        }
    }),
    focusIn() {
        this.set('errors', null);
    },
    focusSearch() {
        scheduleOnce('afterRender', () => {
            this.$('textarea').focus();
        });
    },
    actions: {
        delete() {
            this.sendAction('delete');
        },
        cancel() {
            this.sendAction('cancel');
        },
        save(shouldAddAnother) {
            this.sendAction('save', shouldAddAnother);
        },
    },
});
