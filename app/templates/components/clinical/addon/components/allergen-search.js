import { computed } from '@ember/object';
import { compare } from '@ember/utils';
import SingleSelect from 'tyrion/components/single-select';
import AllergenV3 from 'clinical/models/allergen';

export default SingleSelect.extend({
    classNames: ['allergen-search'],
    clearSearchOnSelect: false,
    groupSortFunction: compare,
    includeSearchIcon: true,
    isRequired: true,
    isShorter: true,
    itemModelClass: AllergenV3,
    minChars: 3,
    openIfQueryPrepopulated: true,
    openOnFocus: true,
    optionGroupLabelPath: 'group.display',
    optionGroupPath: 'group.sort',
    optionLabelPath: 'name',
    optionValuePath: 'id',
    prompt: 'Enter allergen',
    remoteDataUrl: computed('config.clinicalBaseURL', function () {
        return `${this.get('config.clinicalBaseURL_v3')}allergens/search?searchTerm=`;
    }),
    selectType: 'typeahead',
    buildUrl() {
        const query = this.get('query') || '';
        const url = [this.get('remoteDataUrl'), query.trim()].join('');
        return `${url}&ver=3`;
    },
    queryRemoteContent() {
        return this._super().then(data => data.allergens);
    }
});
