import { isEmpty } from '@ember/utils';
import { or, not, alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { task } from 'ember-concurrency';

export default Controller.extend({
    authorization: service('authorization'),
    tunnel: service(),
    isAllowedToEdit: computed('authorization.entitledFeatures.[]', function () {
        return this.get('authorization').isEntitledFor('Chart.Summary.Edit');
    }),
    isLoading: or('load.isRunning', 'save.isRunning'),
    isNotAllowedToEdit: not('isAllowedToEdit'),
    isDirty: computed('nutritionHistoryImage', 'nutritionHistory', function() {
        return this.get('nutritionHistoryImage').trim() !== this.get('nutritionHistory').trim();
    }),
    nutritionHistory: '',
    patientPracticeGuid: alias('model.patientPracticeGuid'),
    isNew: computed('nutritionHistory', 'nutritionHistoryImage', function() {
        return isEmpty((this.get('nutritionHistoryImage') || '').trim());
    }),
    disableSave: computed('nutritionHistory', function() {
        return isEmpty((this.get('nutritionHistory') || '').trim());
    }),
    load: task(function * () {
        try {
            const behavioralHealth = yield this.get('store').findRecord('behavioral-health', this.get('model.patientPracticeGuid'));
            this.setProperties({
              nutritionHistory: behavioralHealth.get('nutritionHistory.content.description'),
              nutritionHistoryImage: behavioralHealth.get('nutritionHistory.content.description'),
              error: false,
            });
        } catch(e) {
            toastr.error('Failed to load nutrition history');
        }
    }).drop(),
    save: task(function * () {
        try {
            if (this.get('isDirty')) {
                const personalMedicalHistory = yield this.get('store').findRecord('personal-medical-History', this.get('patientPracticeGuid'));
                personalMedicalHistory.set('nutritionHistory', this.get('nutritionHistory'));
                personalMedicalHistory.save().then(() => {
                    this.get('tunnel').send('behavioral-health-refresh', { patientPracticeGuid: this.get('patientPracticeGuid'), reload: true });
                    this.send('close');
                }, (e) => {
                    throw e;
                });
            } else {
                this.send('close');
            }
        } catch(e) {
            toastr.error('Failed to save nutrition history');
        }
    }).drop(),
    delete: task(function * () {
        try {
            const personalMedicalHistory = yield this.get('store').findRecord('personal-medical-History', this.get('patientPracticeGuid'));
            personalMedicalHistory.set('nutritionHistory', '');
            personalMedicalHistory.save().then(() => {
                this.get('tunnel').send('behavioral-health-refresh', { patientPracticeGuid: this.get('patientPracticeGuid'), reload: true });
                this.send('close');
            }, (e) => {
                throw e;
            });
        } catch(e) {
            toastr.error('Failed to delete nutrition history');
        }
    }).drop(),
    actions: {
        save() {
            const sectionTitle = 'Nutrition history';
            const event = 'Social Behavioral Health Saved';
            const properties = { 'Section': sectionTitle, 'Completed Questionnaire': !!this.get('nutritionHistory') };
            this.get('tunnel').send('patient-summary-mixpanel-event', { event, properties });
            this.get('save').perform();
        },
        delete() {
            this.get('delete').perform();
        },
        closeDetailPane() {
            this.get('tunnel').send('patient-summary-mixpanel-event', {
                event: 'Social Behavioral Health Cancelled',
                properties: {
                    'Section': 'Nutrition history',
                    'Completed Questionnaire': !!this.get('nutritionHistory')
                }
            });
            this.send('close');
        }
    }
});
