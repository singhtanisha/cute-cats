import { isArray } from '@ember/array';
import { scheduleOnce } from '@ember/runloop';
import { isPresent } from '@ember/utils';
import EmberObject, { computed } from '@ember/object';
import { notEmpty } from '@ember/object/computed';
import config from 'boot/config';
import ImmunizationSearch from 'clinical/models/immunization-search';
import SingleSelect from 'tyrion/components/single-select';
import { administered, historical } from 'clinical/models/immunization-search';

export default SingleSelect.extend({
    classNameBindings: ['hasCustomResults::no-custom-results'],

    customItems: null,
    clearSearchOnSelect: false,
    includeSearchIcon: true,
    isAddingNewVaccination: false,
    isAllowingInventory: true,
    itemModelClass: ImmunizationSearch,
    minChars: 2,
    optionLabelPath: 'displayName',
    placeholder: 'Search all vaccines',
    selectType: 'typeahead',
    sortLabels: false,
    sourceType: null,

    hasCustomResults: notEmpty('customItems'),

    remoteDataUrl: computed(function() {
        return `${config.defaultHost}/${config.immunizationNamespace}/vaccines/advancedSearch`;
    }),

    didInsertElement() {
        if (this.get('isAddingNewVaccination')) {
            this.$('.ember-text-field').focus();
        }

        if (isPresent(this.get('query'))) {
            scheduleOnce('afterRender', this, () => {
                this.set('showDropdown', true);
                this.updateContent();
            });
        }
    },

    buildUrl() {
        const sourceType = this.get('sourceType');
        let query = this.get('query');
        let searchType = historical;

        if (isPresent(query)) {
            if (query.lastIndexOf('.') === query.length - 1) {
                query = query.substring(0, query.length - 1);
            }

            if (query.indexOf('/') > -1) {
                query = query.substring(0, query.indexOf('/'));
            }
        }

        if (sourceType && sourceType.toLowerCase() === administered) {
            searchType = administered;
        }

        return `${this.get('remoteDataUrl')}/${searchType}/${encodeURIComponent(query.trim())}`;
    },

    performQuery () {
        if (this.get('query') !== this.get('selection.displayName')) {
            this.set('customItems', null);
            this._super();
        }
    },

    processResults(data) {
        const additionalGroup = EmberObject.create({
            isGroupOption: true,
            name: 'Additional search results'
        });
        const additionalItems = [];
        const inventoryGroup = EmberObject.create({
            isGroupOption: true,
            name: 'From your inventory'
        });
        const inventoryItems = [];
        const itemModelClass = this.get('itemModelClass');
        const results = [];
        const customItems = [];

        if (data) {
            if (this.get('sourceType') !== 'Historical') {
                data = data.filterBy('isActive');
            }

            data.forEach((item) => {
                var itemModel = itemModelClass.create(item);

                if (itemModel.get('isCustomOrFromInventory')) {
                    inventoryItems.pushObject(itemModel);
                } else if (itemModel.get('isDynamic')) {
                    customItems.pushObject(itemModel);
                } else {
                    additionalItems.pushObject(itemModel);
                }
            });

            if (this.get('isAllowingInventory') && inventoryItems.length) {
                results.pushObject(inventoryGroup);
                results.pushObjects(inventoryItems);
            }

            if (isPresent(additionalItems)) {
                if (this.get('isAllowingInventory') && isPresent(inventoryItems)) {
                    results.pushObject(additionalGroup);
                }

                results.pushObjects(additionalItems);
            }
        }

        this.set('customItems', customItems);

        return results;
    },

    actions: {
        addCustomItem() {
            const customItemText = this.get('query');
            const customItems = this.get('customItems');
            const customItemMatch = isArray(customItems) ? customItems.findBy('name', customItemText) : null;

            if (this.get('addItem') && isPresent(customItemMatch)) {
                this.set('showDropdown', false);
                this.sendAction('addItem', customItemMatch);
            }
        }
    }
});
