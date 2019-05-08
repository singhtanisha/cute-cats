import { computed } from '@ember/object';
import { not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { task } from 'ember-concurrency';

export default Controller.extend({
    analytics: service(),
    authorization: service(),
    isNotAllowedToEdit: not('isAllowedToEdit'),
    isAllowedToEdit: computed('authorization.entitledFeatures.[]', function () {
        return this.get('authorization').isEntitledFor('Chart.Encounter.Edit');
    }),
    smallHeaderText: computed('isAllowedToEdit', function() {
        return this.get('isAllowedToEdit') ? 'Record' : 'Review';
    }),

    actions: {
        cancel() {
            this.get('model').rollbackAttributes();
            this.send('close');
        }
    },

    save: task(function * () {
        if (this.get('model.hasDirtyAttributes')) {
            this.get('analytics').track('Save PMH');
            try {
                yield this.get('model').save();
                this.send('close');
            } catch (e) {
                toastr.error('Failed to save family health history');
            }
        } else {
            this.send('close');
        }
    }).drop(),
});