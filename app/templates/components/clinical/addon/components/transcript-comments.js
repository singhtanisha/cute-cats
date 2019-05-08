import { computed } from '@ember/object';
import Component from '@ember/component';
import RowHeightHack from 'clinical/mixins/row-height-hack';

export default Component.extend(RowHeightHack, {
    attributeBindings: ['data-element'],
    isExpanded: false,
    isCollapsible: true,
    oneline: true,
    firstCommentOneLine: true,
    patientPracticeGuid: null,
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
    filteredItems: computed('items', function () {
        if (this.get('expandAll')) {
            return this.get('items');
        } else {
            return this.get('items').slice(1);
        }
    })
});
