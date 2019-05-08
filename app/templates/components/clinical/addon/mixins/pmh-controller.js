import { equal } from '@ember/object/computed';
import { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';
export default Mixin.create({
    currentPMHSection: computed('isEditingPMH', 'currentAutoFocusSection', function() {
        return this.get('isEditingPMH') ? this.get('currentAutoFocusSection') : null;
    }),
    isEditingSocialHistoryFreeText: equal('currentPMHSection', 'socialHistory'),
    scrollToPMH: () => {},
    isEditingPMH: false,
    actions: {
        editPMHSection(key) {
            var baseRoute = this.get('transcriptGuid') ? 'encounter' : 'summary';
            this.transitionToRoute(baseRoute + '.pmh', { section: key || 'all' });
        },
        pmhAction(action) {
            var pmh = this.get('pastMedicalHistory');
            if (pmh && pmh.get('hasDirtyAttributes')) {
                pmh.save().then(function() {
                    this.send(action);
                }.bind(this)).errorMessage('Failed to save PMH');
            } else {
                this.send(action);
            }
        }
    }
});
