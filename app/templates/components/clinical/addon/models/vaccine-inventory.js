import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
    vaccineInventoryGuid: alias('id'),

    customVaccinationTypeName: attr(),
    customVaccineManufacturerName: attr(),
    isActive: attr('boolean'),
    isDeleted: attr('boolean'),
    isHidden: attr('boolean'),
    practiceId: attr('number'),
    practiceGuid: attr(),
    remainingDoseCount: attr('number'),
    totalDoseCount: attr('number'),
    vaccinationTypeId: attr('number'),
    vaccineExpirationDate: attr(),
    vaccineLotNumber: attr(),
    ndc: attr('string'),

    immunizationFundingSource: belongsTo('immunization-funding-source', { async: false }),
    vaccineManufacturer: belongsTo('vaccine-manufacturer', { async: false }),
    vaccineType: belongsTo('vaccine-type', { async: false }),

    displayName: computed('vaccineType.isCustom', 'vaccineType.name', 'customVaccinationTypeName', function () {
        return this.get('vaccineType.isCustom') ? this.get('customVaccinationTypeName') : this.get('vaccineType.name');
    }),

    displayValue: computed('vaccineLotNumber', 'vaccineExpirationDate', function () {
        var lotNum = this.get('vaccineLotNumber');

        return ('' + lotNum + ' - ' + this.get('vaccineExpirationDate'));
    }),

    isExpired: computed('vaccineExpirationDate', function () {
        return moment().isAfter(this.get('vaccineExpirationDate'), 'day');
    }),

    vaccineExpirationDateValue: computed('vaccineExpirationDate', function() {
        return moment(this.get('vaccineExpirationDate')).toDate();
    })
});
