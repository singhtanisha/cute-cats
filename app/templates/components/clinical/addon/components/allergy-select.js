import { isPresent } from '@ember/utils';
import { computed } from '@ember/object';
import SingleSelect from 'tyrion/components/single-select';

export default SingleSelect.extend({
    classNames: ['allergen-search'],
    classNameBindings: ['selectionMatchesOption:no-custom-results'],
    prompt: 'Enter allergen',
    optionLabelPath: 'title',
    optionValuePath: 'title',
    selectType: 'typeahead',
    clearSearchOnSelect: false,
    includeInactiveSearchIcon: true,
    openOnFocus: true,
    isRequired: true,
    addCustomItemTemplateText: 'Add custom allergy: %@',
    placeholder: 'Search by allergen',

    selectionMatchesOption: computed('query', 'content', function () {
        const content = this.get('content');
        const query = this.get('query');
        return content.find((option) => {
            return option.get('title').toLowerCase() === query.toLowerCase();
        });
    }),

    actions: {
        addCustomItem() {
            const customItemText = this.get('query');
            const filteredContent = this.get('filteredContent');
            const customItemMatchesResultItem = isPresent(filteredContent[0]) && filteredContent[0].get('title') === customItemText;
            if (customItemMatchesResultItem) {
                // If the user attempts to add a custom item for a result that is exactly matching the string, do not allow them to do so.
                return;
            }
            this.set('showDropdown', false);
            this.sendAction('addItem', customItemText);
        }
    }
});
