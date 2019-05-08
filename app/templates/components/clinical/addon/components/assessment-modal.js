import ObjectProxy from '@ember/object/proxy';
import { merge } from '@ember/polyfills';
import { resolve } from 'rsvp';
import { isEmpty, isPresent } from '@ember/utils';
import { computed, observer } from '@ember/object';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import Assessment from 'clinical/models/assessment';
import proliaAesiModal from 'clinical/models/assessments/prolia-aesi-modal';
import proliaAesiModalUtil from 'clinical/util/assessments/prolia-aesi-modal';
import clinicalAssessmentsRepository from 'clinical/repositories/assessments';
import SpinnerSupport from 'common/mixins/spinner';

export default Component.extend(SpinnerSupport, {
    isVisible: false,
    source: '',
    validationErrors: null,
    showSpinner: alias('isLoading'),
    contentElement: '.assessment-modal-content',
    isLoading: false,

    contentTemplate: computed('token', {
        get() {
            const token = this.get('token.name');
            if (isEmpty(token)) {
                return '';
            }
            return 'assessments/' + token.dasherize();
        }
    }),
    modalClassNames: computed('isUpdatedProliaModal', function () {
        let classNames = 'assessment-modal-control';
        if (this.get('isUpdatedProliaModal')) {
            classNames += ' taller-modal';
        }
        return classNames;
    }),
    model: computed('token', 'defaults', {
        get() {
            const patientPracticeGuid = this.get('patientPracticeGuid'),
                token = this.get('token.name'),
                defaults= this.get('defaults');

            if (token === 'proliaAesiModal') {
                return Assessment.wrap(proliaAesiModal, patientPracticeGuid, defaults);
            }
        }
    }),
    title: computed('token', {
        get() {
            const token = this.get('token.name');
            if (token === 'proliaAesiModal') {
                return 'Safety Program';
            }
        }
    }),
    util: computed('token', {
        get() {
            const token = this.get('token.name');
            if (token === 'proliaAesiModal') {
                return proliaAesiModalUtil;
            }
        }
    }),

    isUpdatedProliaModal: computed('token', function () {
        const tokenName = this.get('token.name');
        return tokenName === 'proliaAesiModal';
    }),

    _recordWithStatus(status) {
        let assessment = this.get('model'),
            transcriptGuid = this.get('transcriptGuid'),
            medicationGuid = this.get('medicationGuid'),
            patientPracticeGuid = this.get('patientPracticeGuid'),
            source = this.get('source');

        if (assessment) {
            assessment.set('status', status);

            if (isPresent(source)) {
                assessment.set('source', source);
            }
            if (isPresent(medicationGuid)) {
                assessment.set('medicationGuid', medicationGuid);
            }
            if (isPresent(transcriptGuid)) {
                assessment.set('transcriptGuid', transcriptGuid);
            }
            if (isPresent(patientPracticeGuid)) {
                assessment.set('patientPracticeGuid', patientPracticeGuid);
            }

            return clinicalAssessmentsRepository.saveAssessment(assessment);
        }
        return resolve();
    },

    _saveValidAssessment() {
        this.set('isLoading', true);
        this._recordWithStatus('Completed').then(() => {
            let completionState = this.get('util.getCompletionState'),
                state = completionState ? completionState(this.get('model')) : null;

            if(state) {
                if(state.isComplete) {
                    toastr.success(state.message, '', { toastClass: 'assessment-complete-message'});
                } else {
                    this.sendAction('confirmAssessment', state.message);
                }
            }
        }).finally(() => {
            this._closeAssessment();
        });
    },

    _closeAssessment() {
        this.set('validationErrors', null);
        this.set('isLoading', false);
        this.set('isVisible', false);
        this.set('token', null);
    },
    trackingType: computed('token', {
        get() {
            if (this.get('token.name') === 'proliaAesiModal') {
                return 'Prolia Adverse Events';
            }
        }
    }),
    _trackShown: observer('isVisible', function() {
        if (this.get('isVisible')) {
            this._track('Assessment Modal Displayed');
        }
    }),
    _track(text, details) {
        let trackingType = this.get('trackingType');
        details = details || {};
        if (isPresent(trackingType)) {
            this.get('analytics').track(text, merge(details, {
                'Assessment Type': trackingType,
                'Assessment Source': this.get('source'),
                'Patient Practice Guid': this.get('patientPracticeGuid')
            }));
        }
    },
    actions: {
        cancel() {
            const details = {};
            this._recordWithStatus('Dismissed');
            details['Prolia adverse effects present'] = false;
            this._track('Assessment Modal Dismissed');
            this._closeAssessment();
        },
        save() {
            this.set('isLoading', true);
            let toValidate = ObjectProxy.create({
                content: this.get('model')
            });
            this.get('util.validator').validate(toValidate).then(result => {
                this.set('isLoading', false);
                if (result.valid) {
                    const details = {};
                    this._saveValidAssessment();

                    details['Prolia adverse effects present'] = this.get('model.proliaAnyAesi.isSelected');
                    this._track('Assessment Modal Saved', details);
                } else {
                    // clean validation results
                    let errorObject = {};
                    Object.keys(result.errors).forEach(key => {
                        if(result.errors[key].length > 0) {
                            errorObject[key] = result.errors[key];
                        }
                    });
                    this.set('validationErrors', errorObject);
                }
            });
        },
        propertyChanged(value, key) {
            let changedKey = key || value.property,
                model = this.get('model'),
                changeLogic = this.get('util.enforceChangeLogic');

            if(isPresent(changeLogic) && isPresent(model)) {
                changeLogic(changedKey, model).forEach(change => {
                    this.set(`model.${change.property}`, change.value);
                });
                this.set('validationErrors', null);
            }
        },
        setProperty(key, value) {
            this.set(`model.${key}`, value);
        },
        trackAndSetProperty(trackingText, key, value) {
            this._track(trackingText);
            this.send('setProperty', key, value);
        }
    }
});
