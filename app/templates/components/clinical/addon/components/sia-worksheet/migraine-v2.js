import { computed } from '@ember/object';
import DefaultWorksheet from 'clinical/components/sia-worksheet/default-v2';

export default DefaultWorksheet.extend({
    classNames: ['migraine-worksheet-details'],

    maxInputValue: 92,
    numericInputValues: computed('maxInputValue', function () {
        const maxInputValue = this.get('maxInputValue') || 0;
        const values = [];
        for (let i = 0; i <= maxInputValue; i += 1) {
            values.push({ value: i, label: `${i}` });
        }

        return values;
    }),

    actions: {
        responseEntered(question, response) {
            const value = parseInt(response, 10);
            if (isNaN(value)) {
                return;
            }
            question.set('rangeError', '');

            if (value < 0) {
                question.set('rangeError', '0-92 days only.');
                return;
            }
            if (value > 92) {
                question.set('rangeError', '92 days or less only.');
                return;
            }

            question.setInternalValue(value);
        }
    }
});
