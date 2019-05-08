import { alias } from '@ember/object/computed';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import Model from 'ember-data/model';
import { computed } from '@ember/object';

export default Model.extend({
    immunizationDrugGuid: alias('id'),

    activeIngredients: attr('array'),
    doseForm: attr('string'),
    drugDose: attr('string'),
    isActive: attr('boolean'),
    isPublished: attr('boolean'),
    nationalDrugCode: attr('string'),
    packagedDrugName: attr('string'),
    route: attr('string'),
    routedDrugName: attr('string'),
    vaccineManufacturerGuid: attr('string'),
    vaccineTypeGuid: attr('string'),

    vaccinationSites: hasMany('vaccination-site', { async: false })
});
