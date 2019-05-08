import { alias } from '@ember/object/computed';
import attr from 'ember-data/attr';
import Model from 'ember-data/model';
import { belongsTo } from 'ember-data/relationships';
import { computed, get } from '@ember/object';
import { isPresent } from '@ember/utils';

export default Model.extend({
    vaccinationGuid: alias('id'),

    administeredAmount: attr('number'),
    administeredByProviderGuid: attr('string'),
    administeredUnits: attr(),
    comment: attr(),
    createdByProfileGuid: attr(),
    createdDateTimeUtc: attr(),
    dosesFromInventory: attr('number'),
    facilityGuid: attr('string'),
    immunizationTransmissionHistorySummary: attr('object'),
    isPartiallyComplete: attr('boolean'),
    isDeleted: attr('boolean'),
    lastModifiedByProfileGuid: attr(),
    lastModifiedDateTimeUtc: attr(),
    ndc: attr('string'),
    orderingProviderGuid: attr('string'),
    patientPracticeGuid: attr(),
    practiceGuid: attr(),
    rejectionReasonExpirationDate: attr('string'),
    vaccinationAdverseReactionGuid: attr('string'),
    vaccinationDate: attr(),
    vaccinationOrderStatusName: attr(),
    vaccinationScheduleSpecialIndicationGuid: attr('string'),
    vaccinationTime: attr(),
    vaccineLotExpirationDate: attr(),
    vaccineLotNumber: attr(),
    visVersionDate: attr(),
    visConceptGuidList: attr('array'),

    immunizationFundingSource: belongsTo('immunization-funding-source', { async: false }),
    immunizationRegistryNotificationPreference: belongsTo('immunization-registry-notification-preference', { async: false }),
    manufacturer: belongsTo('vaccine-manufacturer', { async: false }),
    rejectionReason: belongsTo('vaccination-rejection', { async: false }),
    route: belongsTo('vaccination-route', { async: false }),
    site: belongsTo('vaccination-site', { async: false }),
    source: belongsTo('vaccination-source', { async: false }),
    vaccineInventory: belongsTo('vaccine-inventory', { async: false }),
    vaccineType: belongsTo('vaccine-type', { async: false }),
    vfcStatus: belongsTo('vfc-status', { async: false }),

    description: null,

    isVisConceptRequired: alias('vaccineType.isVisConceptRequired'),

    administeredByText: computed('description', 'source.vaccinationSourceName', function() {
        return get(this, 'description') || get(this, 'source.vaccinationSourceName');
    }),
    isVaccineLotExpired: computed('vaccineLotExpirationDate', function () {
        return moment().isAfter(this.get('vaccineLotExpirationDate'), 'day');
    }),

    lastTransmissionDate: computed('immunizationTransmissionHistorySummary', function() {
        const transmissionHistory = get(this, 'immunizationTransmissionHistorySummary');

        if (isPresent(transmissionHistory)) {
            return moment.utc(new Date(transmissionHistory.lastModifiedDateTimeUtc)).format('MM/DD/YY');
        } else {
            return 'Not transmitted';
        }
    }),

    manufacturerName: computed('manufacturer.name', 'vaccineInventory.customVaccineManufacturerName',
        'vaccineInventory.vaccineManufacturer.name', function () {

        const vaccineManufacturerName = get(this, 'manufacturer.name');
        const customVaccineManufacturerName = get(this, 'vaccineInventory.customVaccineManufacturerName');
        const inventoryManufacturerName = get(this, 'vaccineInventory.vaccineManufacturer.name');

        return vaccineManufacturerName || customVaccineManufacturerName || inventoryManufacturerName || 'Unknown';
    }),

    vaccinationDateValue: computed('vaccinationDate', function() {
        const vaccinationDate = get(this, 'vaccinationDate');

        return isPresent(vaccinationDate) ? moment(vaccinationDate).toDate() : null;
    }),

    vaccineExpirationDate: computed('vaccineLotExpirationDate', 'vaccineInventory.vaccineExpirationDate', 'source.isAdministered', function() {
        if (get(this, 'source.isAdministered')) {
            return get(this, 'vaccineInventory.vaccineExpirationDate') || get(this, 'vaccineLotExpirationDate');
        }

        return '';
    }),

    vaccineInventoryLotNumber: computed('vaccineLotNumber', 'vaccineInventory.vaccineLotNumber', 'source.isAdministered', function() {
        if (get(this, 'source.isAdministered')) {
            return get(this, 'vaccineInventory.vaccineLotNumber') || get(this, 'vaccineLotNumber');
        }

        return '';
    }),

    vaccineName: computed('vaccineType.name', 'vaccineType.isCustom', 'vaccineInventory.customVaccinationTypeName', function() {
        const vaccineType = get(this, 'vaccineType');

        if (vaccineType) {
            if (get(vaccineType, 'isCustom')) {
                return get(this, 'vaccineInventory.customVaccinationTypeName') || 'Unknown';
            }

            return get(vaccineType, 'name');
        }

        return '';
    })
});
