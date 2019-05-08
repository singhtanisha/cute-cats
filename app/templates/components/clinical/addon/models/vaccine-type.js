import { sort } from '@ember/object/computed';
import attr from 'ember-data/attr';
import Model from 'ember-data/model';
import { hasMany } from 'ember-data/relationships';
import { computed, get } from '@ember/object';

export default Model.extend({
    vaccineTypeGuid: attr('string'),

    cvxCode: attr('string'),
    description: attr('string'),
    isActive: attr('boolean'),
    isCustom: attr('boolean'),
    name: attr('string'),
    providerGuid: attr('string'),
    isVisConceptRequired: attr('boolean'),

    immunizationDrugs: hasMany('immunization-drug', { async: false }),
    manufacturers: hasMany('vaccine-manufacturer', { async: false }),
    vaccineInventories: hasMany('vaccine-inventory', { async: false }),

    filteredVaccineInventories: computed('vaccineInventories', function () {
        const inventories = get(this, 'vaccineInventories') || [];
        const vaccineInventoryGuid = get(this, 'vaccineInventories.firstObject.vaccineInventoryGuid');

        // If not new inventory, filter only active inventories
        if (vaccineInventoryGuid && vaccineInventoryGuid !== '00000000-0000-0000-0000-000000000000') {
            return inventories.filterBy('isActive');
        }

        return inventories;
    }),
    filteredImmunizationDrugs: computed('immunizationDrugs', function () {
        return (get(this, 'immunizationDrugs') || []).rejectBy('nationalDrugCode', null);
    }),
    sortImmunizationDrugsProperties: computed(() => ['nationalDrugCode']),
    sortedImmunizationDrugs: sort('filteredImmunizationDrugs', 'sortImmunizationDrugsProperties'),
    sortProperties: computed(() => ['vaccineExpirationDateValue']),
    sortedVaccineInventories: sort('filteredVaccineInventories', 'sortProperties')
});
