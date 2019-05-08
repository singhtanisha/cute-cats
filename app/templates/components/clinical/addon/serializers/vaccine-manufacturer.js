import RESTSerializer from 'ember-data/serializers/rest';

export default RESTSerializer.extend({
    primaryKey: 'vaccineManufacturerGuid',
    isNewSerializerAPI: true,

    normalizeResponse(store, type, payload, id, requestType) {
        return this._super(store, type, { 'vaccine-manufacturers': payload.vaccineType.manufacturers }, id, requestType);
    }
});
