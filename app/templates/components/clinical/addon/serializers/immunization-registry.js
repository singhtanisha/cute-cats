import RESTSerializer from 'ember-data/serializers/rest';

export default RESTSerializer.extend({
    isNewSerializerAPI: true,
    primaryKey: 'immunizationRegistryGuid',

    normalizeResponse(store, type, payload, id, requestType) {
        payload = {
            'immunization-registries': payload
        };
        return this._super(store, type, payload, id, requestType);
    }
});
