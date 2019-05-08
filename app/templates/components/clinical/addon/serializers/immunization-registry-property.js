import RESTSerializer from 'ember-data/serializers/rest';

export default RESTSerializer.extend({
    isNewSerializerAPI: true,
    primaryKey: 'ironBridgePropertyId',

    normalizeResponse(store, type, payload, id, requestType) {
        payload = {
            'immunization-registry-properties': payload
        };
        return this._super(store, type, payload, id, requestType);
    }
});
