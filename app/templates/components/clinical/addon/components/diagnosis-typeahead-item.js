import { alias } from '@ember/object/computed';
import SingleSelectOptionComponent from 'tyrion/components/single-select-option';

export default SingleSelectOptionComponent.extend({
    layoutName: 'components/diagnosis-typeahead-item',
    showCodes: alias('parentDataContext.showCodes')
});
