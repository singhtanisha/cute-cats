import { merge } from '@ember/polyfills';
import { isPresent, isEmpty } from '@ember/utils';
import EmberObject, { computed, get } from '@ember/object';
import { or, alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import WithPatientPrintTitleMixin from 'charting/mixins/with-patient-print-title';
import { task } from 'ember-concurrency';
import WorksheetsRepository from 'clinical/repositories/worksheets';

const canHaveMultipleRecord = {
    'tobaccoUse': true
};
export default Component.extend(WithPatientPrintTitleMixin, {
    analytics: service(),
    authorization: service('authorization'),
    routing: service('pf-routing'),

    alcoholUse: null,
    card: null,
    error: false,
    fieldBeingEdited: null,
    exposureToViolence: null,
    nutritionHistory: null,
    patient: null,
    physicalActivity: null,
    socialHealth: null,
    socialIsolation: null,
    stress: null,
    worksheetResponsesGuids: null,

    isLoading: or('loadBehavioralHealth.isRunning', 'loadSocialHealth.isRunning'),
    patientPracticeGuid: alias('patient.patientPracticeGuid'),

    // give non-empty social history content an ID for highlight purpose
    education: computed('socialHealth.education', function() {
        const content = this.get('socialHealth.education.content');
        return isPresent(content) ? { content: merge({ id: 'education' }, content) } : { content };
    }),
    financialResourceStatus: computed('socialHealth.financialResourceStatus', function() {
        const content = this.get('socialHealth.financialResourceStatus.content');
        return isPresent(content) ? { content: merge({ id: 'financialResourceStatus' }, content) } : { content };
    }),
    genderIdentity: computed('socialHealth.genderIdentity', function() {
        const content = this.get('socialHealth.genderIdentity.content');
        return isPresent(content) ? { content: merge({ id: 'genderIdentity' }, content) } : { content };
    }),
    sexualOrientation: computed('socialHealth.sexualOrientation', function() {
        const content = this.get('socialHealth.sexualOrientation.content');
        return isPresent(content) ? { content: merge({ id: 'sexualOrientation' }, content) } : { content };
    }),
    socialHistory: computed('socialHealth.socialHistory', function() {
        const content = this.get('socialHealth.socialHistory.content');
        return isPresent(content) ? { content: merge({ id: 'socialHistory' }, content) } : { content };
    }),

    isAllowedToEdit: computed('authorization.entitledFeatures.[]', function () {
        return this.get('authorization').isEntitledFor('Chart.Summary.Edit'); // TODO: Edit when new feature code is added to DB (Chart.BehavioralHealth.Edit)
    }),
    cardFields: computed('card.activeFields.[]', 'alcoholUse', 'tobaccoUse', 'physicalActivity', 'nutritionHistory', 'stress', 'socialIsolation', 'exposureToViolence', 'socialHealth', 'fieldBeingEdited', function() {
        const fieldBeingEdited = this.get('fieldBeingEdited');
        return this.get('card.activeFields').filterBy('isVisible').map(field => {
            const key = field.get('key');
            return EmberObject.create({
                title: field.get('displayTitle'),
                key,
                content: this.get(`${key}.isEmpty`) ? [] : this.get(`${key}.content`),
                worksheet: this.get(`${key}.worksheet`),
                canHaveMultipleRecord: canHaveMultipleRecord[key],
                isEditing: key === fieldBeingEdited
            });
        });
    }),
    printInfo: computed('alcoholUseWorksheetPrint', 'tobaccoUse.[]', 'physicalActivityWorksheetPrint', 'nutritionHistoryPrint', 'stressWorksheetPrint', 'socialIsolationWorksheetPrint', 'exposureToViolenceWorksheetPrint', 'socialHealth', function() {
        return {
            alcoholUseWorksheet: this.get('alcoholUseWorksheetPrint'),
            tobaccoUse: this.get('tobaccoUse'),
            physicalActivityWorksheet: this.get('physicalActivityWorksheetPrint'),
            nutritionHistory: this.get('nutritionHistory'),
            stressWorksheet: this.get('stressWorksheetPrint'),
            socialIsolationWorksheet: this.get('socialIsolationWorksheetPrint'),
            exposureToViolenceWorksheet: this.get('exposureToViolenceWorksheetPrint'),
            socialHealth: this.get('socialHealth')
        };
    }),
    loadBehavioralHealth: task(function * ({ patientPracticeGuid, reload }) {
        if (isEmpty(patientPracticeGuid)) {
            patientPracticeGuid = this.get('patientPracticeGuid');
        }
        try {
            const data = yield this.get('store').findRecord('behavioral-health', patientPracticeGuid, { reload });

            if (data) {
                if (isEmpty(data.get('errorMessages'))) {
                    this.setProperties({
                        error: false,
                        alcoholUse: data.get('alcoholUse'),
                        physicalActivity: data.get('physicalActivity'),
                        nutritionHistory: data.get('nutritionHistory'),
                        stress: data.get('stress'),
                        socialIsolation: data.get('socialIsolation'),
                        exposureToViolence: data.get('exposureToViolence'),
                        worksheetResponsesGuids: data.get('worksheetResponsesGuids')
                    });
                    const tobaccoUse = yield this.get('store').query('smoking-status', { patientPracticeGuid: this.get('patientPracticeGuid') }, { reload });
                    this.set('tobaccoUse', {
                        content: tobaccoUse.toArray().sortBy('effectiveDate').reverse(),
                        worksheet: data.get('tobaccoUse.worksheet')
                    });
                } else {
                    throw 'error';
                }
            }
        } catch(e) {
            this.setProperties({
                error: true,
                alcoholUse: null,
                tobaccoUse: null,
                physicalActivity: null,
                nutritionHistory: null,
                stress: null,
                socialIsolation: null,
                exposureToViolence: null
            });
        }
    }).drop(),
    loadSocialHealth: task(function * (patientPracticeGuid) {
        try {
            const socialHealth = yield this.get('store').findRecord('social-health', patientPracticeGuid);
            this.set('socialHealth', socialHealth);
        } catch(e) {
            this.set('error', true);
        }
    }).drop(),
    loadWorksheet: task(function * (propertyName, responsesGuid) {
        try {
            const responses = yield WorksheetsRepository.loadResponses(responsesGuid);
            this.set(propertyName, responses);
        } catch(e) {
            this.set('error', true);
        }
    }).drop(),
    loadPrintInfo: task(function * () {
        const worksheetResponsesGuids = this.get('worksheetResponsesGuids');
        for (let worksheet in worksheetResponsesGuids) {
            if (worksheetResponsesGuids[worksheet]) {
                const worksheetGuid = worksheetResponsesGuids[worksheet];
                yield this.get('loadWorksheet').perform(`${worksheet}Print`, worksheetGuid);
            } else {
                this.set(`${worksheet}Print`, null);
            }
        }
    }).drop(),
    print: task(function * () {
        yield this.get('loadPrintInfo').perform();
        yield this.get('store').findRecord('patient', this.get('patientPracticeGuid'));

        this.sendAction('printAudit', 'SocialHistory');
        this.set('isPrintPreviewVisible', true);
    }).drop(),
    init() {
        this._super();
        const patientPracticeGuid = this.get('patientPracticeGuid');
        this.get('loadBehavioralHealth').perform({ patientPracticeGuid });
        this.get('loadSocialHealth').perform(patientPracticeGuid);
    },
    editWorksheet(worksheet, fieldContent) {
        this.get('routing').transitionToRoute('summary.behavioral', worksheet.worksheetGuid, isPresent(fieldContent) ? fieldContent.worksheetResponseGuid : 'new');
    },
    createSmokingStatus() {
        const status = this.get('store').createRecord('smoking-status', {
            effectiveDate: new Date(),
            patientPracticeGuid: this.get('patientPracticeGuid')
        });
        this.get('routing').transitionToRoute('summary.smoking', status.get('patientPracticeGuid'), status);
    },
    editSmokingStatus(status) {
        this.get('routing').transitionToRoute('summary.smoking', status.get('patientPracticeGuid'), status);
    },
    editNutritionHistory() {
        this.get('routing').transitionToRoute('summary.nutrition');
    },
    transitionToFieldDetails(field, fieldContent) {
        const fieldKey = field.get('key');
        const worksheet = get(field, 'worksheet') || {};

        switch (fieldKey) {
            case 'tobaccoUse':
                if (isPresent(fieldContent) && isPresent(get(fieldContent, 'smokingStatusGuid'))) {
                    this.editSmokingStatus(fieldContent);
                    this.attrs.setControllerProperties({
                        selectedItem: get(fieldContent, 'id')
                    });
                } else {
                    this.createSmokingStatus();
                    this.attrs.setControllerProperties({
                        selectedItem: null
                    });
                }
                break;
            case 'nutritionHistory':
                this.editNutritionHistory();
                this.attrs.setControllerProperties({
                    selectedItem: 'nutritionHistory'
                });
                break;
            case 'education':
            case 'financialResourceStatus':
            case 'genderIdentity':
            case 'sexualOrientation':
            case 'socialHistory':
                this.get('routing').transitionToRoute('summary.social-health', fieldKey);
                this.attrs.setControllerProperties({
                    selectedItem: fieldKey
                });
                break;
            default:
                if (isPresent(worksheet.worksheetGuid)) {
                    this.editWorksheet(worksheet, fieldContent);
                }
                this.attrs.setControllerProperties({
                    selectedItem: worksheet.worksheetGuid
                });
                break;
        }
    },
    actions: {
        create(field) {
            this.transitionToFieldDetails(field);
            this.get('analytics').track('Social Behavioral Health Plus Icon Clicked', {
                'Section': get(field, 'title')
            });
        },
        edit(field, fieldContent) {
            this.transitionToFieldDetails(field, fieldContent);
        },
        refreshSocialHealth() {
            const socialHealth = this.get('store').peekRecord('social-health', this.get('patientPracticeGuid'));
            this.set('socialHealth', socialHealth);
            this.notifyPropertyChange('socialHealth');
        },
        setIsEditing(options) {
            if (options.isEditing) {
                this.set('fieldBeingEdited', options.fieldKey);
            } else {
                this.set('fieldBeingEdited', null);
            }
        },
        updateTobaccoUse(options) {
            this.set('tobaccoUse.content', options.smokingStatuses);
        }
    }
});
