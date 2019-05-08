import { or, not } from '@ember/object/computed';
import { isEmpty, isPresent } from '@ember/utils';
import { computed, get, getProperties } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { task } from 'ember-concurrency';

export default Controller.extend({
    authorization: service('authorization'),
    tunnel: service(),

    demographicOptions: null,
    displaySetting: null,
    socialHealth: null,

    disableSave: computed('socialHealthField.content', function() {
        return isEmpty(this.get('socialHealthField.content'));
    }),
    isLoading: or('load.isRunning', 'save.isRunning'),
    isNotAllowedToEdit: not('isAllowedToEdit'),

    headerText: computed('model.socialHealthFieldKey', 'socialHealthCardField.title', 'isAllowedToEdit', function() {
        const suffix = this.get('isAllowedToEdit') ? 'Record' : 'Review';
        let prefix = this.get('socialHealthCardField.title');

        if (this.get('model.socialHealthFieldKey') === 'socialHistory') {
            prefix = 'Social history (free-text)';
        }

        return `${prefix} > ${suffix}`;
    }),

    isAllowedToEdit: computed('authorization.entitledFeatures.[]', function () {
        return this.get('authorization').isEntitledFor('Chart.Summary.Edit');
    }),

    isUsingOptionGuidToDelete: computed('model.socialHealthFieldKey', function() {
        const key = this.get('model.socialHealthFieldKey');

        return key === 'education' || key === 'financialResourceStatus';
    }),

    socialHealthCardField: computed('model.socialHealthFieldKey', 'displaySetting', function() {
        const displaySetting = this.get('displaySetting');

        if (isPresent(displaySetting)) {
            const card = displaySetting.get('cards').findBy('componentName', 'social-behavioral-health');

            if (isPresent(card)) {
                return card.get('fields').findBy('key', this.get('model.socialHealthFieldKey'));
            }
        }
    }),

    socialHealthField: computed('socialHealth', 'model.socialHealthFieldKey', function() {
        const socialHealth = this.get('socialHealth');

        if (isPresent(socialHealth)) {
            return get(socialHealth, this.get('model.socialHealthFieldKey'));
        }
    }),

    socialHealthFieldComponent: computed('socialHealthCardField.title', function() {
        const socialHealthCardField = this.get('socialHealthCardField');

        if (isPresent(socialHealthCardField)) {
            const titleCode = socialHealthCardField.get('title').dasherize();
            return `social-health/${titleCode}-details`;
        }
    }),

    actions: {
        cancel() {
            const fieldName = this.get('model.socialHealthFieldKey');
            this.get('tunnel').send('patient-summary-mixpanel-event', {
                event: 'Social Behavioral Health Cancelled',
                properties: {
                    'Section': this.get('socialHealthCardField.title'),
                    'Completed Questionnaire': this.get(`socialHealth.${fieldName}.isComplete`)
                }
            });

            const socialHealth = this.get('socialHealth');

            if (isPresent(socialHealth)) {
                socialHealth.undoChanges();
            }

            this.transitionToRoute('patient.summary', this.get('model.patientPracticeGuid'));
            this.send('resetSelectedItem');
        },

        selectOption(demographicOption) {
            const fieldOption = getProperties(demographicOption, [
                'optionGuid',
                'description'
            ]);
            this.get('socialHealthField').setProperties(fieldOption);
        },

        undo(content) {
            content.undoSelect();
        }
    },

    delete: task(function * () {
        const field = this.get('socialHealthField');
        const saveOptions = {
            operation: 'delete',
            optionGuid: this.get('isUsingOptionGuidToDelete') ? field.get('optionGuid') : undefined
        };
        field.clear();
        yield this.get('save').perform(saveOptions);
    }).drop(),

    save: task(function * (options) {
        const saveOperation = options.operation === 'delete' ? options.operation : 'save';
        const fieldName = this.get('model.socialHealthFieldKey');
        const sectionTitle = this.get('socialHealthCardField.title');
        const canMarkAsReviewed = this.get(`socialHealth.${fieldName}.canMarkAsReviewed`);
        const event = canMarkAsReviewed ? 'Social Behavioral Health Reviewed' : 'Social Behavioral Health Saved';
        const properties = canMarkAsReviewed ?
            { 'Section': sectionTitle } :
            { 'Section': sectionTitle, 'Completed Questionnaire': this.get(`socialHealth.${fieldName}.isComplete`) };

        this.get('tunnel').send('patient-summary-mixpanel-event', { event, properties });

        try {
            if (this.get('socialHealthField.supportsEffectiveDate')) {
                this.set('socialHealthField.effectiveDate', moment.utc().toISOString());
            }
            yield this.get('socialHealth').save({
                adapterOptions: {
                    fieldName,
                    isDelete: options.operation === 'delete',
                    optionGuid: options.optionGuid
                }
            });
            this.get('tunnel').send('social-health-refresh');
            this.transitionToRoute('patient.summary', this.get('model.patientPracticeGuid'));
            this.send('resetSelectedItem');
        } catch(e) {
            toastr.error(`Unable to ${saveOperation} ${this.get('socialHealthCardField.title').toLowerCase()} information`);
        }
    }).drop(),

    load: task(function * () {
        const store = this.get('store');

        try {
            const socialHealth = yield store.findRecord('social-health', this.get('model.patientPracticeGuid'));
            const displaySetting = yield store.findRecord('patient-summary-display-setting', this.get('session.userGUID'));
            const demographicOptions = yield store.queryRecord('profile-demographics-option', {
                optionKeys: [
                    'gi',
                    'so',
                    'ed',
                    'frs'
                ]
            });

            this.setProperties({
                socialHealth,
                displaySetting,
                demographicOptions
            });
            this.get('socialHealthField').setInitValues();
        } catch(e) {
            toastr.error('Unable to load social history details');
            this.transitionToRoute('patient.summary', this.get('model.patientPracticeGuid'));
        }
    })
});
