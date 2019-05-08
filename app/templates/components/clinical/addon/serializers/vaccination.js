import RESTSerializer from 'ember-data/serializers/rest';
import DS from 'ember-data';

export default RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
    attrs: {
        immunizationFundingSource: { embedded: 'always' },
        immunizationRegistryNotificationPreference: { embedded: 'always' },
        manufacturer: { embedded: 'always' },
        rejectionReason: { embedded: 'always' },
        route: { embedded: 'always' },
        site: { embedded: 'always' },
        source: { embedded: 'always' },
        vaccineInventory: { embedded: 'always' },
        vaccineType: { embedded: 'always' },
        vfcStatus: { embedded: 'always' }
    },
    isNewSerializerAPI: true,
    isLookupByParentType: true,
    primaryKey: 'vaccinationGuid',

    normalize(type, payload) {
        if (payload.vaccinationGuid) {
            payload.visVersionDate = this.normalizeVaccinationDate(payload.visVersionDate);
            payload.vaccinationDate = this.normalizeVaccinationDate(payload.vaccinationDate);
            payload.vaccineLotExpirationDate = this.normalizeVaccinationDate(payload.vaccineLotExpirationDate);
            payload.rejectionReasonExpirationDate = this.normalizeVaccinationDate(payload.rejectionReasonExpirationDate);
        }

        return this._super(...arguments);
    },

    normalizeSingleResponse(store, primaryModelClass, payload, id, requestType) {
        const vaccinationPayload = {
            vaccination: payload
        };

        return this._super(store, primaryModelClass, vaccinationPayload, id, requestType);
    },

    normalizeVaccinationDate(dateValue) {
        if (dateValue && dateValue !== 'Invalid Date') {
            return moment.utc(dateValue).format('MM/DD/YYYY');
        } else {
            return '';
        }
    },

    serialize(record, options) {
        var vaccinationJSON = this._super(record, options);

        if (vaccinationJSON.vaccineInventory && vaccinationJSON.vaccineInventory.vaccineType) {
            vaccinationJSON.vaccineInventory.vaccineType = null;
        }

        if (vaccinationJSON.vaccineInventory && !vaccinationJSON.vaccineInventory.vaccineLotNumber) {
            vaccinationJSON.vaccineInventory.vaccineLotNumber = vaccinationJSON.vaccineLotNumber;
        }

        return vaccinationJSON;
    }
});
