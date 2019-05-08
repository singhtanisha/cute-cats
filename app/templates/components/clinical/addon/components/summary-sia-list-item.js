import { computed } from '@ember/object';
import Component from '@ember/component';
export default Component.extend({
    tagName: 'li',
    classNameBindings: ['isSelected:is-active'],
    isSelected: computed('selectedItem', 'sia', function() {
        return this.get('selectedItem') === this.get('sia.id');
    }),
    click() {
        this.attrs.edit(this.get('sia'));
    }
});
