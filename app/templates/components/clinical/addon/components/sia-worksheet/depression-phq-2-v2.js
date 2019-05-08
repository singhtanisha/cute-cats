import { get, setProperties } from '@ember/object';
import { isEmpty } from '@ember/utils';
import DefaultWorksheet from 'clinical/components/sia-worksheet/default-v2';

export default DefaultWorksheet.extend({
    init() {
        this._super();
        if (isEmpty(this.get('selectedStatus'))) {
            this.set('selectedStatus', 'Performed');
        }
        if (isEmpty(this.get('responses.startDateTimeUtc'))) {
            this.set('responses.startDateTime', moment.utc(this.get('responses.encounterDateOfService')).format('MM/DD/YYYY hh:mm A'));
        }
        this.handleDeclinedToSpecifyChecked(this.get('responses.declinedToSpecifyQuestion'));
    },
    actions: {
        responseChecked(question, option) {
            question.handleOptionChecked(option);
        },
        declineChecked(declinedToSpecifyQuestion) {
            declinedToSpecifyQuestion.handleDeclinedToSpecifyChecked();
            this.handleDeclinedToSpecifyChecked(declinedToSpecifyQuestion);
        },
        undo(question) {
            question.undo();
        }
    },
    handleDeclinedToSpecifyChecked(declinedToSpecifyQuestion) {
        const isChecked = get(declinedToSpecifyQuestion, 'value') === 1;
        if (isChecked) {
            this.get('responses.scorableQuestions').forEach((question) => {
                setProperties(question, {
                    value: null,
                    selectedOptionValue: null,
                    isEnabled: false,
                    isResetByDecline: true
                });
            });
        } else {
            this.get('responses.scorableQuestions').forEach((question) => {
                setProperties(question, {
                    isEnabled: true,
                    isResetByDecline: false
                });
            });
        }
    }
});
