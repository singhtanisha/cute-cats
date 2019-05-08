import { computed } from '@ember/object';
import Component from '@ember/component';
export default Component.extend({
    classNames: ['side-fixed', 'col-xs-6', 'worksheet-details'],

    disabled: false,
    permittedStates: null,
    reason: null,
    reasonCode: null,
    reasonCodes: null,
    responses: null,
    resizables: computed(() => []),
    selectedStatus: null,

    actions: {
        responseChecked(question, option) {
            const value = option.value.split('-')[0] ? option.value.split('-')[0] : 0;
            const componentGuid = question.get('componentGuid');

            question.setInternalValue(parseInt(value, 10));

            this.get('responses.questions').forEach(responseQuestion => {
                if (responseQuestion.get('isConditionalComponent') && responseQuestion.get('conditionalComponentGuid') === componentGuid) {
                    responseQuestion.set('conditionalQuestionValue', question.get('value'));
                }
            });
        }
    }
});
