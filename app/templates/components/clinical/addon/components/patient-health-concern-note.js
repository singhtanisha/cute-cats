import { isPresent } from '@ember/utils';
import { computed } from '@ember/object';
import Component from '@ember/component';
export default Component.extend({
    classNames: 'patient-health-concern-note',
    isAllowedToEditHealthConcerns: true,
    isEditing: false,
    textAreaValue: computed('healthConcernNote', function() {
        if (isPresent(this.get('healthConcernNote.healthConcernNote'))) {
            return this.get('healthConcernNote.healthConcernNote');
        }
        return '';
    }),
    actions: {
        saveNote() {
            this.attrs.saveNote(this.get('textAreaValue'));
        }
    }
});
