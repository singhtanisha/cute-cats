import { sort } from '@ember/object/computed';
import { computed } from '@ember/object';
import Component from '@ember/component';
import RowHeightHack from 'clinical/mixins/row-height-hack';

export default Component.extend(RowHeightHack, {
    isExpanded: false,
    items: computed(function () {
        return [];
    }),
    actions: {
        expand() {
            this.set('isExpanded', true);
            this._resizeRowByCell();
        },
        collapse() {
            this.set('isExpanded', false);
            this._resizeRowByCell();
        }
    },

    sortBy: computed(() => ['prescriptionDate:desc']),
    sortedItems: sort('items', 'sortBy'),
    filteredItems: computed('sortedItems', function () {
        if (this.get('expandAll')) {
            return this.get('sortedItems');
        }
        return this.get('sortedItems').slice(1);
    })
});
