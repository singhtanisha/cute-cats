import { equal, or } from '@ember/object/computed';
import { isPresent, isNone, isEmpty } from '@ember/utils';
import { computed, get } from '@ember/object';
import ObjectProxy from '@ember/object/proxy';
const SOCIAL_HISTORY_WORKSHEETS = {
    '9c18e2bf-85a3-4935-813c-547d47fcff53': {
        inputMax: '7',
    },
    '2f15f071-4015-4af4-8550-ce4a80b09864': {
        inputMax: '1440',
    }
};

export default ObjectProxy.extend({
    conditionalQuestionValue: null,
    isEnabled: computed('conditionalQuestionValue', 'isConditionalComponent', 'conditionalComponentActionOption', function() {
        if (this.get('isConditionalComponent') && this.get('conditionalComponentActionOption') === 'enable') {
            return this.get('conditionalQuestionValue') > 0;
        }
        return true;
    }),
    isVisible: computed('conditionalQuestionValue', 'isConditionalComponent', 'conditionalComponentActionOption', function() {
        if (this.get('isConditionalComponent') && this.get('conditionalComponentActionOption') !== 'enable') {
            return this.get('conditionalQuestionValue') > 0;
        }
        return true;
    }),
    selectedOptionValue: null,
    isDirty: computed('value', 'imageValue', 'selectedOptionValue', 'imageSelection', function() {
        return this.get('value') !== this.get('imageValue') || this.get('selectedOptionValue') !== this.get('imageSelection');
    }),
    isDisabled: computed('isEnabled', 'isDisabledByDecline', function() {
        return !this.get('isEnabled') || this.get('isDisabledByDecline');
    }),
    rangeError: null,
    inputMax: computed('componentGuid', function() {
        return isPresent(SOCIAL_HISTORY_WORKSHEETS[this.get('componentGuid')]) ? SOCIAL_HISTORY_WORKSHEETS[this.get('componentGuid')]['inputMax'] : null;
    }),
    inputMin: computed('componentGuid', function() {
        return isPresent(SOCIAL_HISTORY_WORKSHEETS[this.get('componentGuid')]) ? SOCIAL_HISTORY_WORKSHEETS[this.get('componentGuid')]['inputMin'] : '0';
    }),
    isHorizontalRadioType: equal('componentType', 'horizontalradio'),
    isRadioQuestion: or('isRadioType', 'isHorizontalRadioType'),
    isCheckboxQuestion: equal('componentType', 'checkbox'),
    isRadioType: equal('componentType', 'radio'),
    isNumericType: equal('componentType', 'numeric'),
    isSeparator: equal('componentType', 'separator'),
    isTextSeparator: computed('isSeparator', 'label', function() {
        return this.get('isSeparator') && isPresent(this.get('label'));
    }),
    isShowing: or('isVisible', 'isEnabled'),
    isDisabledByDecline: false,
    isResetByDecline: false,
    isAnswered: computed('value', 'rangeError', function() {
        const value = this.get('value');
        return !isNone(value) && isPresent((value + '').trim()) && isEmpty(this.get('rangeError'));
    }),
    isComplete: computed('value', 'isRequired', 'options.[]', 'rangeError', function () {
        return isEmpty(this.get('rangeError')) && (isPresent(this.get('value')) || !this.get('isRequired') || isEmpty(this.get('options')));
    }),
    shouldBeExcludedInScoring: equal('label', 'Patient declined to specify on all questions'),
    showUndo: computed('imageSelection', 'selectedOptionValue', 'isResetByDecline', function () {
        if (isEmpty(this.get('imageSelection')) && isEmpty(this.get('selectedOptionValue'))) {
            return false;
        }
        return (this.get('imageSelection') !== this.get('selectedOptionValue')) && !this.get('isResetByDecline');
    }),
    showUpdatedDate: computed('value', 'responseText', function() {
        return isPresent(this.get('value')) || computed(this.get('responseText'));
    }),
    options: computed('content.options', 'componentGuid', function () {
        const options = this.get('content.options') || [];
        const componentGuid = this.get('componentGuid');

        return options.map(function(option, index) {
            return {
                label: option.label,
                value: option.value + '-' + index,
                displayValue: option.value,
                showValue: isEmpty(option.showValue) || option.showValue,
                id: componentGuid + '-' + index
            };
        });
    }),

    response: computed('componentGuid', 'value', 'enteredAt', function () {
        const response = this.getProperties(['componentGuid', 'value', 'enteredAt']);
        const selectedOptionValue = this.get('selectedOptionValue');

        if (selectedOptionValue && this.get('isRadioQuestion')) {
            response.value = selectedOptionValue;
        }
        return response;
    }),

    responseText: computed('response', 'options', function() {
        const responseValue = this.get('response.value');
        const selectedOption = this.get('options').findBy('value', responseValue);
        if (isPresent(selectedOption)) {
            if (selectedOption.showValue) {
                return `${selectedOption.label} (${selectedOption.displayValue})`;
            } else {
                return `${selectedOption.label}`;
            }
        }
        return '';
    }),
    textFieldValue: computed('value', {
        get() {
            const value = this.get('value');
            return isPresent(value) ? value : '';
        },
        set(key, value) {
            this.set('value', value);
            return value;
        }
    }),

    setInternalValue(value) {
        this.setProperties({
            value,
            enteredAt: moment().toISOString()
        });
    },

    init() {
        this._super();
        this.setProperties({
            'imageSelection': this.get('selectedOptionValue'),
            'imageValue': this.get('value')
        });
    },

    undo() {
        this.set('selectedOptionValue', isPresent(this.get('imageSelection')) ? this.get('imageSelection') : undefined);
        this.set('value', isPresent(this.get('imageValue')) ? this.get('imageValue') : undefined);
    },

    handleOptionChecked(option) {
        const optionPrefix = (get(option, 'value') || '').split('-');
        const value = optionPrefix[0] ? optionPrefix[0] : 0;
        this.setInternalValue(parseInt(value, 10));
    },

    handleDeclinedToSpecifyChecked() {
        const value = !get(this, 'value');
        this.setInternalValue(value + false);
    }
});
