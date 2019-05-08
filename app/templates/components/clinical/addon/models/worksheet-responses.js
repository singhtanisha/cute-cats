import { on } from '@ember/object/evented';
import { isEmpty, isPresent } from '@ember/utils';
import { computed, get, observer } from '@ember/object';
import { notEmpty, alias, equal } from '@ember/object/computed';
import ObjectProxy from '@ember/object/proxy';
import TranscriptEvent from 'charting/models/transcript-event';
import WorksheetQuestion from 'clinical/models/worksheet-question';

export const worksheetEventTypeGuids = {
    adultAsthmaControlTestEventTypeGuid: 'ed4c88e0-9083-492d-930b-5d9c1552b924',
    midasAssessmentWorksheetEventTypeGuid: '9fc12137-0078-442a-9120-d5270b71463f',
    depressionPhq2AssessmentWorksheetEventTypeGuid: 'c6f1e72a-6312-49f4-b85c-cb93277873f1'
};

export const midasResultCategories = {
    gradeI: { id: 6, description: 'Grade I, little or no disability' },
    gradeII: { id: 7, description: 'Grade II, mild disability' },
    gradeIII: { id: 8, description: 'Grade III, moderate disability' },
    gradeIV: { id: 9, description: 'Grade IV, severe disability' }
};

const socialHistory = {
    socialIsolation: 'd26a18f7-3bc6-4658-a68b-f1457d568694',
    alcoholUse: '071a8fd1-425b-4596-ad86-c19adfa53dc6',
    exposureToViolence: 'd6b09429-0ec1-4c82-be76-5c8e943075df',
    stress: '56294fd9-c3d8-47bb-8433-7f7165e6f1ee',
    physicalActivity: '25b76f00-067e-4916-94f2-1a8f40eaaa88'
};

const stressCategories = {
    '1-0': { description: 'Not at all' },
    '2-1': { description: 'Only a little' },
    '3-2': { description: 'To some extent' },
    '4-3': { description: 'Rather much' },
    '5-4': { description: 'Very much' },
    '0-5': { description: 'Patient declined to specify' }
};

/**
 * TODO:
 * Worksheets are becoming less maintainable as new worksheets are added with custom requirements.
 * The next time a custom worksheet is incepted, it would be beneficial to include in the sizing room to refactor
 * the worksheets and transcript encounter event code.
 */
const WorksheetResponses = ObjectProxy.extend({
    isDirty: false,
    transcriptEncounterEvents: null,
    encounterDateOfService: null,

    hasConditionalQuestions: notEmpty('conditionalQuestions.[]'),

    hasRangeErrors: computed('questions.@each.rangeError', function() {
        return !this.get('questions').every(question => {
              return isEmpty(question.get('rangeError'));
        });
    }),

    conditionalQuestions: computed('questions.@each.isConditionalComponent', function() {
        return this.get('questions').filterBy('isConditionalComponent');
    }),

    transcriptEncounterEvent: alias('transcriptEncounterEvents.firstObject'),

    eventTypeGuid: alias('transcriptEncounterEvent.eventType.eventTypeGuid'),

    displaySecondarySummary: computed('score', function () {
        if (this.get('worksheet.secondaryConditionOption') === 'gte') {
            return this.get('score') >= this.get('worksheet.secondaryScoreBoundary');
        }

        if (this.get('worksheet.secondaryConditionOption') === 'lt') {
            return this.get('score') < this.get('worksheet.secondaryScoreBoundary');
        }

        return true;
    }),

    displaySummary: computed('score', 'isMidasAssessment', 'isPhq2Assessment', 'isComplete', function () {
        if (this.get('isMidasAssessment') && this.get('isComplete')) {
            return true;
        }

        if (this.get('isPhq2Assessment')) {
            return false;
        }

        if (this.get('worksheet.conditionOption') === 'gte') {
            return this.get('score') >= this.get('worksheet.scoreBoundary');
        } else {
            return true;
        }
    }),

    isPhq2Assessment: equal('eventTypeGuid', worksheetEventTypeGuids.depressionPhq2AssessmentWorksheetEventTypeGuid),

    isMidasAssessment: equal('eventTypeGuid', worksheetEventTypeGuids.midasAssessmentWorksheetEventTypeGuid),

    midasAssessmentResult: computed('midasAssessmentResultCategory', function () {
        return this.get('midasAssessmentResultCategory.description') || '';
    }),

    midasAssessmentResultCategory: computed('score', 'isIncomplete', 'isMidasAssessment', function () {
        if (this.get('isIncomplete') || !this.get('isMidasAssessment')) {
            return null;
        }

        const score = this.get('score');

        if (score <= 5) {
            return midasResultCategories.gradeI;
        }
        if (score <= 10) {
            return  midasResultCategories.gradeII;
        }
        if (score <= 20) {
            return  midasResultCategories.gradeIII;
        }
        if (score > 20) {
            return  midasResultCategories.gradeIV;
        }

        return null;
    }),

    resultCode: computed(
        'midasAssessmentResultCategory',
        'transcriptEncounterEvent.resultCode',
        'transcriptEncounterEvent.isNegated', function() {

        const midasAssessmentResultCategory = this.get('midasAssessmentResultCategory');

        if (!this.get('transcriptEncounterEvent.isNegated')) {

            if (isPresent(midasAssessmentResultCategory)) {
                return { id: midasAssessmentResultCategory.id };
            }
            return this.get('transcriptEncounterEvent.resultCode');
        }
    }),

    scoreLabel: computed('score', 'isMidasAssessment', function() {
        if (this.get('isMidasAssessment')) {
            return 'Score:';
        }
        return 'Total score:';
    }),

    socialHistoryKey: computed('worksheetGuid', function() {
        const worksheetGuid = this.get('worksheetGuid');
        return Object.keys(socialHistory).find((key) => {
            return socialHistory[key] === worksheetGuid;
        });
    }),

    summaryLabel: computed('score', 'isMidasAssessment', function() {
        if (this.get('isMidasAssessment')) {
            return ' -';
        }
        return 'Result:';
    }),

    assessmentSummary: computed('score', 'isMidasAssessment', function() {
        if (this.get('isMidasAssessment')) {
            return this.get('midasAssessmentResult');
        }
        return this.get('worksheet.summary');
    }),

    isComplete: computed('questions.@each.isComplete', 'isDeclinedChecked', function() {
        return this.get('isDeclinedChecked') || this.get('questions').isEvery('isComplete');
    }),

    isIncomplete: computed('transcriptEncounterEvent.isNegated', 'isComplete', function() {
        if (this.get('transcriptEncounterEvent.isNegated')) {
            return false;
        }

        return !this.get('isComplete');
    }),

    isNegated: alias('transcriptEncounterEvent.isNegated'),

    isSelected: computed('transcriptEncounterEvents.@each.isSelected', {
        get() {
            return this.get('transcriptEncounterEvents').isEvery('isSelected', true);
        },
        set(key, value) {
            this.get('transcriptEncounterEvents').setEach('isSelected', value);

            return value;
        }
    }),

    questions: computed('responses.[]', 'isMidasAssessment', function() {
        const responses = this.get('responses') || [];
        const components = this.get('worksheet.components') || [];

        return components.map(component => {
            const response = responses.findBy('componentGuid', component.componentGuid);
            let selectedOptionValue = null;
            let value = null;
            let enteredAt = null;

            if (isPresent(response)) {
                selectedOptionValue = response.value;
                enteredAt = response.enteredAt;

                if (isPresent(response.value)) {
                    // respone.value should always be of format "4-2" (value-index) or a number literal
                    // parseInt should stop at the first non-numeric character i.e. parseInt("4-2") === 4
                    value = parseInt(response.value, 10);
                }
            }

            const question = WorksheetQuestion.create({
                content: component,
                selectedOptionValue,
                value,
                enteredAt
            });
            if (this.get('isMidasAssessment') && question.get('isNumericType')) {
                question.set('options', [{label: 0, value: 0}, {label: 92, value: 92}]);
            }
            return question;
        });
    }),

    scorableQuestions: computed('questions.@each.shouldBeExcludedInScoring', function() {
        return (this.get('questions') || []).rejectBy('shouldBeExcludedInScoring');
    }),

    declinedToSpecifyQuestion: computed('questions.@each.shouldBeExcludedInScoring', function() {
        return (this.get('questions') || []).findBy('shouldBeExcludedInScoring');
    }),

    isDeclinedChecked: computed('declinedToSpecifyQuestion.value', function() {
        const declinedToSpecifyQuestion = this.get('declinedToSpecifyQuestion');

        // patient declined to answer is checked, value is 1
        return isPresent(declinedToSpecifyQuestion) ? get(declinedToSpecifyQuestion, 'value') === 1 : false;
    }),

    isQuestionnaireComplete: computed('isDeclinedChecked', 'questions.@each.value', function() {
        if (this.get('isDeclinedChecked')) {
            return true;
        }

        return this.get('scorableQuestions').isEvery('isAnswered');
    }),

    isWorksheetThatRequiresCompletionToScore: computed('worksheetGuid', 'eventTypeGuid', function() {
        switch (this.get('worksheetGuid')) {
            case socialHistory.alcoholUse:
            case socialHistory.socialIsolation:
            case socialHistory.exposureToViolence:
                return true;
        }

        return this.get('eventTypeGuid') === worksheetEventTypeGuids.depressionPhq2AssessmentWorksheetEventTypeGuid;
    }),

    scoreMethod: computed('worksheet.scoreMethod', 'worksheet.showScore', 'isDeclinedChecked', 'isPhq2Assessment', function() {
        if (this.get('isDeclinedChecked') && this.get('isPhq2Assessment')) {
            return false;
        }
        return this.get('worksheet.scoreMethod') !== 'none' && this.get('worksheet.showScore');
    }),

    score: computed('questions.@each.value', 'worksheet.scoreMethod', 'transcriptEncounterEvent.isNegated', 'worksheet.worksheetGuid', function () {
        const questions = this.get('scorableQuestions');
        let score = 0;

        if (this.get('worksheet.scoreMethod') === 'sum') {
            if (this.get('worksheet.worksheetGuid') === socialHistory.socialIsolation) {
                score = this._calculatesocialIsolationScore(questions, score);
            } else if (!this.get('transcriptEncounterEvent.isNegated')) {
                questions.forEach((question) => {
                    if (question.get('isVisible') || question.get('isEnabled')) {
                        if (this.get('isMidasAssessment') && !question.get('isRequired')) {
                            return;
                        }
                        const value = Number(question.get('value'));

                        if (value > 0) {
                            score += value;
                        }
                    }
                });
            }
        }

        return score;
    }),

    // scoreText property is used to override score and isComplete functions for social history worksheets
    scoreText: computed('score', 'isQuestionnaireComplete', 'isWorksheetThatRequiresCompletionToScore', function() {
        const hasNoScore = this.get('worksheetGuid') === socialHistory.stress || this.get('worksheetGuid') === socialHistory.physicalActivity;
        if (hasNoScore) {
            // prevent set score to be 0 as default
            return null;
        }
        if (this.get('isWorksheetThatRequiresCompletionToScore')) {
            // Some worksheets doesn't show score untill all questions are answered
            return this.get('isQuestionnaireComplete') && !this.get('isDeclinedChecked') ? this.get('score').toString() : null;
        }
        return this.get('score');
    }),

    /**
     * resultDescription property is used to override isComplete functions and generate resultSummary text for social history
     * worksheets
     */
    resultDescription: computed('isQuestionnaireComplete', 'worksheet.showScore', 'isDeclinedChecked', function() {
        const isComplete = this.get('isQuestionnaireComplete');
        if (this.get('isDeclinedChecked')) {
            return 'Patient declined to specify';
        }
        if (this.get('worksheetGuid') === socialHistory.physicalActivity && isComplete) {
            return 'Recorded';
        }
        if (this.get('worksheetGuid') === socialHistory.stress && isComplete) {
            return stressCategories[this.get('responses.firstObject.value')]['description'];
        }
        if (!isComplete) {
            return 'Partially completed';
        }
    }),

    instructionText: computed('worksheetGuid', function() {
        const worksheetGuid = this.get('worksheetGuid');
        const hasInstructionText = worksheetGuid === socialHistory.alcoholUse || worksheetGuid === socialHistory.socialIsolation || worksheetGuid === socialHistory.exposureToViolence;
        if (hasInstructionText) {
            return 'Complete questionnaire to generate a score.';
        }
        return null;
    }),

    comments: computed('transcriptEncounterEvents.@each.comments', {
        get() {
            return (this.get('transcriptEncounterEvents') || []).get('firstObject.comments');
        },
        set(key, value) {
            (this.get('transcriptEncounterEvents') || []).setEach('comments', value);
            return value;
        }
    }),

    endDateTime: computed('endDateTimeUtc', {
        get() {
            const dateTimeUtc = this.get('endDateTimeUtc');
            return isPresent(dateTimeUtc) ? moment.utc(dateTimeUtc).local().format('MM/DD/YYYY hh:mm A') : '';
        },
        set(key, value) {
            const dateTimeUtc = isPresent(value) ? moment(value).utc().toISOString() : '';
            (this.get('transcriptEncounterEvents') || []).setEach('endDateTimeUtc', dateTimeUtc);
            return value;
        }
    }),

    endDateTimeUtc: computed('transcriptEncounterEvents.@each.endDateTimeUtc', function() {
        return (this.get('transcriptEncounterEvents') || []).get('firstObject.endDateTimeUtc');
    }),

    startDateTime: computed('startDateTimeUtc', {
        get() {
            const dateTimeUtc = this.get('startDateTimeUtc');
            return isPresent(dateTimeUtc) ? moment.utc(dateTimeUtc).local().format('MM/DD/YYYY hh:mm A') : '';
        },
        set(key, value) {
            const dateTimeUtc = isPresent(value) ? moment(value).utc().toISOString() : '';
            (this.get('transcriptEncounterEvents') || []).setEach('startDateTimeUtc', dateTimeUtc);
            return value;
        }
    }),

    startDateTimeUtc: computed('transcriptEncounterEvents.@each.startDateTimeUtc', function() {
        return (this.get('transcriptEncounterEvents') || []).get('firstObject.startDateTimeUtc');
    }),

    _calculatesocialIsolationScore(questions, score) {
        const Q1 = questions.findBy('componentGuid', '5fa95ebe-b80a-480d-8e37-cd8d3b59f71e');
        const Q2 = questions.findBy('componentGuid', '15beb0f7-83f9-44d0-928e-7081842c32b3');
        const Q3 = questions.findBy('componentGuid', '3a3f517a-8b24-4267-a602-fb01b94c5c86');
        let partialScore = Number(Q1.get('value')) + Number(Q2.get('value')) > 6 ? 1 : 0;
        partialScore += Number(Q3.get('value')) > 4 ? 1 : 0;
        const rest = questions.rejectBy('componentGuid', '5fa95ebe-b80a-480d-8e37-cd8d3b59f71e').rejectBy('componentGuid', '15beb0f7-83f9-44d0-928e-7081842c32b3').rejectBy('componentGuid', '3a3f517a-8b24-4267-a602-fb01b94c5c86');
        rest.forEach((question) => {
            if (question.get('isVisible') || question.get('isEnabled')) {
                const value = Number(question.get('value'));
                if (value > 0) {
                    score += value;
                }
            }
        });
        score += partialScore;
        return score;
    },

    revert() {
        this.notifyPropertyChange('responses');
        this._transcriptEncounterEventsObserver();
    },

    save() {
        var transcriptEncounterEvents = this.get('transcriptEncounterEvents') || [];
        this.set('responses', this.get('questions').mapBy('response'));
        this.set('content.transcriptEncounterEvents', transcriptEncounterEvents.mapBy('content'));
        this.set('calculatedScore', this.get('scoreText'));
        this.set('resultSummary', this.get('resultDescription'));
    },

    _transcriptEncounterEventsObserver: on('init', observer('content.transcriptEncounterEvents.[]', function() {
        const oldEvents = this.get('transcriptEncounterEvents');
        let events = this.get('content.transcriptEncounterEvents') || [];

        events = TranscriptEvent.wrap(events);

        // Don't overwrite the existing transcriptEncounterEvents if they have already been set.
        if (isPresent(oldEvents)) {
            events.forEach(function(newEvent) {
                let transcriptEvent = oldEvents.findBy('eventType.eventTypeGuid', newEvent.get('eventType.eventTypeGuid'));

                if (transcriptEvent) {
                    transcriptEvent.setProperties(newEvent.getProperties('transcriptEventGuid', 'status', 'isNegated', 'reasonCode'));
                }
            });

            return;
        }

        this.set('transcriptEncounterEvents', events);

        events.setEach('worksheetResponses', this);
    }))

});

WorksheetResponses.reopenClass({
    wrap(object) {
        if (object instanceof WorksheetResponses) {
            return object;
        } else {
            return WorksheetResponses.create({
                content: object
            });
        }
    },
    createFromWorksheetAndEvent(worksheet, patientPracticeGuid, transcriptEvent) {
        const content = {
            worksheetGuid: worksheet.worksheetGuid,
            patientGuid: patientPracticeGuid,
            responses: worksheet.components.mapBy('componentGuid'),
            worksheet: worksheet,
            transcriptEncounterEvents: [ transcriptEvent ],
            transcriptEncounterEventGuids: [ get(transcriptEvent, 'transcriptEventGuid') ]
        };

        return WorksheetResponses.create({
            content: content
        });
    },
    createFromWorksheet(worksheet, patientPracticeGuid) {
        const content = {
            worksheetGuid: worksheet.worksheetGuid,
            patientGuid: patientPracticeGuid,
            responses: worksheet.components.mapBy('componentGuid'),
            worksheet: worksheet,
            transcriptEncounterEvents: [],
            transcriptEncounterEventGuids: [],
            calculatedScore: '',
            resultSummary: ''
        };

        return WorksheetResponses.create({
            content: content
        });
    }
});

export default WorksheetResponses;
