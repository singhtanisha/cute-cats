import { isPresent } from '@ember/utils';
import { equal, or, not } from '@ember/object/computed';
import EmberObject, { computed } from '@ember/object';
export const administered = 'administered';
export const historical = 'historical';

export default EmberObject.extend({
    id: null,
    isActive: null,
    matchedAlternateName: null,
    name: null,
    searchGuid: null,
    searchTypeCode: null,
    sourceType: null,
    vaccineSearchType: null,

    isAdministered: equal('sourceType', 'Administered'),
    isCustomOrFromInventory: or('isCustom','isFromInventory'),
    isDynamic: equal('searchTypeCode', 'DynamicVaccine'),
    isInactive: not('isActive'),

    displayName: computed('name', 'isActive', 'matchedAlternateName', function() {
        var displayName = '',
            matchedAlternateName = this.get('matchedAlternateName');

        if (isPresent(matchedAlternateName)) {
            displayName += matchedAlternateName + ' / ';
        }

        if (this.get('isActive')) {
            displayName += this.get('name');
        } else {
            displayName += this.get('name') + ' (discontinued)';
        }

        return displayName;
    }),

    isCustom: computed('vaccineSearchType', 'searchTypeCode', function() {
        var searchTypeCode = this.get('searchTypeCode');

        return this.get('vaccineSearchType') === 3 || searchTypeCode === 'CustomVaccine';
    }),

    isFromInventory: computed('vaccineSearchType', 'searchTypeCode', function() {
        return this.get('vaccineSearchType') === 5 || this.get('searchTypeCode') === 'VaccineInventory';
    }),

    isGroup: computed('vaccineSearchType', 'searchTypeCode', function() {
        return this.get('vaccineSearchType') === 1 || this.get('searchTypeCode') === 'ImmunizationGroup';
    })
});
