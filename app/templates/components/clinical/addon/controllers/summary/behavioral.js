import { resolve } from 'rsvp';
import { typeOf, isPresent } from '@ember/utils';
import { computed, observer } from '@ember/object';
import { alias, or, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller, { inject as controller } from '@ember/controller';
import worksheetRepository from 'clinical/repositories/worksheets';
import { task } from 'ember-concurrency';

export default Controller.extend({
    authorization: service('authorization'),
    tunnel: service(),
    patientController: controller('patient'),

    questions: alias('model.questions'),
    isDirty: computed('questions.@each.isDirty', 'isNew', function() {
        return this.get('questions').isAny('isDirty') && !this.get('isNew');
    }),
    isNew: false,
    showSave: or('isNew', 'isDirty'),
    isComplete: computed('question.@each.value', 'isDeclinedChecked', function() {
        if (this.get('isDeclinedChecked')) {
            return true;
        }
        const allOtherQuestions = this.get('questions').rejectBy('label', 'Patient declined to specify on all questions');
        return allOtherQuestions.rejectBy('shouldBeExcludedInScoring', true).filterBy('value', null).length === 0;
    }),
    disableSave: or('hasValidationError', 'isEmpty'),
    hasValidationError: alias('model.hasRangeErrors'),
    isEmpty: computed('questions.@each.value', 'isDeclinedChecked', function() {
        if (this.get('isDeclinedChecked')) {
            return false;
        }
        const allOtherQuestions = this.get('questions').rejectBy('label', 'Patient declined to specify on all questions');

        const nonEmptyQuestion = allOtherQuestions.filter(question => {
            const isNotEmpty = typeOf(question.value) === 'string' ? isPresent(question.value.trim()) : isPresent(question.value);
            if (isNotEmpty) {
                return question;
            }
        });
        return nonEmptyQuestion.length === 0;
    }),
    isAllowedToEdit: computed('authorization.entitledFeatures.[]', function () {
        return this.get('authorization').isEntitledFor('Chart.Summary.Edit');
    }),
    isNotAllowedToEdit: not('isAllowedToEdit'),
    bigHeaderText: computed('isAllowedToEdit', function() {
        return this.get('isAllowedToEdit') ? 'Record' : 'Review';
    }),
    smallHeaderText: alias('model.worksheet.title'),
    isDeclinedChecked: alias('model.isDeclinedChecked'),
    disableAllQuestions: observer('isDeclinedChecked', 'isAllowedToEdit', 'questions', function () {
        const allOtherQuestions = this.get('questions').rejectBy('label', 'Patient declined to specify on all questions');
        if (this.get('isDeclinedChecked') && this.get('isAllowedToEdit')) {
            allOtherQuestions.setEach('isDisabledByDecline', true); // disable questions
            allOtherQuestions.setEach('value', null); // remove all selections and values
            allOtherQuestions.setEach('selectedOptionValue', null);
            allOtherQuestions.setEach('isResetByDecline', true); // prevent showing undo link when value and selection are set to null
        } else if (!this.get('isAllowedToEdit')) {
            this.get('questions').setEach('isEnabled', false); // disable all questions
        } else {
            allOtherQuestions.setEach('isDisabledByDecline', false); // enable questions
        }
    }),
    saveWorksheet: task(function * () {
        const patientPracticeGuid = this.get('patientController.id');
        const responses = this.get('model');
        try {
            if (this.get('disabled')) {
                return resolve();
            }
            responses.save();
            yield worksheetRepository.saveResponses(patientPracticeGuid, responses, { isEncounterRelated: false });
            this.get('tunnel').send('behavioral-health-refresh', { patientPracticeGuid, reload: true });
            this.send('close');
        } catch(e) {
            toastr.error('Failed to save assessment');
        }
    }).drop(),
    deleteWorksheet: task(function * () {
        const patientPracticeGuid = this.get('patientController.id');
        const responses = this.get('model');
        try {
            yield worksheetRepository.deleteResponses(patientPracticeGuid, responses);
            this.get('tunnel').send('behavioral-health-refresh', { patientPracticeGuid, reload: true });
            this.send('close');
        } catch(e) {
            toastr.error('Failed to delete assessment');
        }
    }).drop(),
    actions: {
        responseEntered(question, response) {
            const value = parseInt(response, 10);
            const inputMin = parseInt((question.get('inputMin') || '0'), 10);
            let rangeError = null;
            if (isPresent(question.get('inputMax'))) {
                const inputMax = parseInt(question.get('inputMax'), 10);
                if (value > inputMax || value < inputMin) {
                    rangeError = `${inputMin} - ${inputMax} only`;
                }
            } else {
                if (value < inputMin) {
                    rangeError = `${inputMin} or greater only`;
                }
            }
            question.set('rangeError', rangeError);
        },
        closeDetailPane() {
            this.get('tunnel').send('patient-summary-mixpanel-event', {
                event: 'Social Behavioral Health Cancelled',
                properties: {
                    'Section': this.get('smallHeaderText'),
                    'Completed Questionnaire': this.get('isComplete')
                }
            });
            this.send('close');
        },
        save() {
            const sectionTitle = this.get('smallHeaderText');
            const event = this.get('showSave') ? 'Social Behavioral Health Saved' : 'Social Behavioral Health Reviewed';
            const properties = this.get('showSave') ?
                { 'Section': sectionTitle, 'Completed Questionnaire': this.get('isComplete') } :
                { 'Section': sectionTitle };

            this.get('tunnel').send('patient-summary-mixpanel-event', { event, properties });
            this.get('saveWorksheet').perform();
        },
        delete() {
            this.get('deleteWorksheet').perform();
        },
        undo(item) {
            item.set('selectedOptionValue', isPresent(item.get('imageSelection')) ? item.get('imageSelection') : undefined);
            item.set('value', isPresent(item.get('imageValue')) ? item.get('imageValue') : undefined);
        },
        responseChecked(question, option) {
            const value = option.value.split('-')[0] ? option.value.split('-')[0] : 0;
            question.setInternalValue(parseInt(value, 10));
        },
        toggleCheckbox(question) {
            const value = !question.value;
            question.setInternalValue(value + false); // convert boolean to int, because response value cannot be boolean
        }
    }
});
