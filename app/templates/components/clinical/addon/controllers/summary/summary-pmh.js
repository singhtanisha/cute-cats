import { isPresent } from '@ember/utils';
import { not, or, alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller, { inject as controller } from '@ember/controller';
import WithPMH from 'clinical/mixins/with-pmh';
import { task } from 'ember-concurrency';

export default Controller.extend(WithPMH, {
    patientController: controller('patient'),
    authorization: service('authorization'),

    tunnel: service(),
    routing: service('pf-routing'),

    isAllowedToEdit: computed('authorization.entitledFeatures.[]', function () {
        return this.get('authorization').isEntitledFor('Chart.Summary.Edit');
    }),
    isNotAllowedToEdit: not('isAllowedToEdit'),

    isLoading: or('save.isRunning', 'loadDisplaySetting.isRunning'),
    displaySetting: null,

    pmhCardField: computed('model.section', 'displaySetting', function() {
        const displaySetting = this.get('displaySetting');

        if (isPresent(displaySetting)) {
            const card = displaySetting.get('cards').findBy('componentName', 'pmh-section');

            if (isPresent(card)) {
                return card.get('fields').findBy('key', this.get('model.section'));
            }
        }
    }),
    headerText: computed('pmhCardField', 'isAllowedToEdit', function() {
        const suffix = this.get('isAllowedToEdit') ? 'Record' : 'Review';
        let prefix = this.get('pmhCardField.title');

        return `${prefix} > ${suffix}`;
    }),
    title: alias('pmhCardField.displayTitle'),
    placeholderText: computed('pmhCardField.title', function() {
        return `Enter ${(this.get('pmhCardField.title') || 'past medical history').toLowerCase()}`;
    }),
    pmhField: computed('model.section', 'pastMedicalHistory',function() {
        const pastMedicalHistory = this.get('pastMedicalHistory');

        if (isPresent(pastMedicalHistory)) {
            return (this.get('pastMedicalHistory.sections') || []).findBy('key', this.get('model.section'));
        }

    }),

    loadDisplaySetting: task (function * () {
        try {
            const displaySetting = yield this.get('store').findRecord('patient-summary-display-setting', this.get('session.userGUID'));
            this.set('displaySetting', displaySetting);
        } catch (e) {
            toastr.error('Failed to load display setting');
            this.transitionToRoute('patient.summary', this.get('model.patientPracticeGuid'));
        }

    }).drop(),

    save: task(function* (isDelete) {
        if (isDelete) {
            (this.get('pastMedicalHistory.sections') || []).findBy('key', this.get('model.section')).set('value', null);
        } else {
            const pmhField = (this.get('pmhField.value') || '').trim();
            (this.get('pastMedicalHistory.sections') || []).findBy('key', this.get('model.section')).set('value', pmhField);
        }
        const text = isDelete ? 'delete' : 'save';

        if (this.get('pastMedicalHistory.hasDirtyAttributes')) {
            try {
                yield this.get('pastMedicalHistory').save();
                this._close();
            } catch (e) {
                toastr.error(`Failed to ${text} ${(this.get('pmhCardField.title') || 'past medical history').toLowerCase()}`);
            }
        } else {
            this.transitionToRoute('patient.summary', this.get('model.patientPracticeGuid'));
        }
    }).drop(),
    _close() {
        const pmh = this.get('pastMedicalHistory');
        if (pmh.get('hasDirtyAttributes')) {
            pmh.rollbackAttributes();
            pmh.notifyPropertyChange('sections');
        }

        this.transitionToRoute('patient.summary', this.get('model.patientPracticeGuid'));
        this.send('resetSelectedItem');
    },
    actions: {
        cancel() {
            this._close();
        },
    },
});
