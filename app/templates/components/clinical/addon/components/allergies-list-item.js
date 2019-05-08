import { computed } from '@ember/object';
import Component from '@ember/component';
export default Component.extend({
    attributeBindings: ['data-element'],
    tagName: 'li',
    classNameBindings: ['isSelected:active', 'isSelected:is-active'],
    isSelected: computed('allergy', 'selectedAllergy', function() {
        return this.get('allergy') === this.get('selectedAllergy');
    }),
    click() {
        this.sendAction('editAllergy', this.get('allergy'));
    },
    actions: {
        toggleShowMoreComments() {
            this.toggleProperty('showMoreComments');
        },
        delete() {
            this.sendAction('delete', this.get('allergy'));
        }
    }
});
