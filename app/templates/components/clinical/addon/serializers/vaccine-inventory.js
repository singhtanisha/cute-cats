import RESTSerializer from 'ember-data/serializers/rest';
import DS from 'ember-data';

export default RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
    attrs: {
        immunizationFundingSource: { embedded: 'always' },
        vaccineManufacturer: { embedded: 'always' },
        vaccineType: { embedded: 'always' }
    },
    isNewSerializerAPI: true,
    primaryKey: 'vaccineInventoryGuid',

    normalizeResponse(store, type, payload, id, requestType) {
        payload = {
            'vaccine-inventories': payload
        };
        return this._super(store, type, payload, id, requestType);
    },

    normalize(type, vaccineInventory) {
        if (vaccineInventory.vaccineExpirationDate && moment(vaccineInventory.vaccineExpirationDate).isAfter('1800-01-01')) {

            // The vaccination search and vaccinations endpoints return different formats for this property.
            if (vaccineInventory.vaccineExpirationDate.endsWith('Z')) {
                vaccineInventory.vaccineExpirationDate = moment.utc(vaccineInventory.vaccineExpirationDate).format('MM/DD/YYYY');
            } else {
                vaccineInventory.vaccineExpirationDate = moment(vaccineInventory.vaccineExpirationDate).format('MM/DD/YYYY');
            }
        } else {
            vaccineInventory.vaccineExpirationDate = '';
        }

        return this._super(...arguments);
    },

    serialize(record, options) {
        var vaccineInventoryJSON = this._super(record, options);

        if (vaccineInventoryJSON.vaccineType && vaccineInventoryJSON.vaccineType.manufacturers) {
            vaccineInventoryJSON.vaccineType.manufacturers = null;
        }

        return vaccineInventoryJSON;
    }
});
