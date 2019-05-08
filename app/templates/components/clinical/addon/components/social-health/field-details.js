import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import Component from '@ember/component';
export default Component.extend({
    isNotAllowedToEdit: false,
    content: null,

    isNotesDisabled: computed('isNotAllowedToEdit', 'content.optionGuid', function() {
        return isEmpty(this.get('content.optionGuid')) || this.get('isNotAllowedToEdit');
    })
});