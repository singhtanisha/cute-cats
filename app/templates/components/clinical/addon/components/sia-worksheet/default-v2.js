import { computed } from '@ember/object';
import Component from '@ember/component';
export default Component.extend({
    classNames: ['worksheet-details-v2'],
    disabled: false,
    permittedStates: computed(() => []),
    statusOptions: computed('permittedStates.[]', function() {
        return (this.get('permittedStates') || []).map((option) => {
            return {
                label: option,
                value: option
            };
        });
    }),
    reason: null,
    reasonCode: null,
    reasonCodes: null,
    responses: null,
    selectedStatus: null,
    selectedStatusOption: computed('selectedStatus', function() {
        return { value: this.get('selectedStatus'), label: this.get('selectedStatus')};
    }),

    actions: {
        responseChecked(question, option) {
            const value = option.value.split('-')[0] ? option.value.split('-')[0] : 0;
            const componentGuid = question.get('componentGuid');

            question.setInternalValue(parseInt(value, 10));

            this.get('responses.questions').forEach((responseQuestion) => {
                if (responseQuestion.get('isConditionalComponent') && responseQuestion.get('conditionalComponentGuid') === componentGuid) {
                    responseQuestion.set('conditionalQuestionValue', question.get('value'));
                }
            });
        }
    }
});
