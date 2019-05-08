import RadioButton from 'tyrion/components/d-radio-button';

export default RadioButton.extend({
    onChecked: null,
    checkedValue: '',

    _updateElementValue() {
        if (!this.get('checked')) {
            return;
        }
        
        if (this.get('onChecked')) {
            this.sendAction('onChecked', this.get('value'), this.get('checkedValue'));
        }

        this.set('selectedValue', this.get('value'));
    }
});
