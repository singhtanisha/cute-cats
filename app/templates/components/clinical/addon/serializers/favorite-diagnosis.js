import RESTSerializer from 'ember-data/serializers/rest';

export default RESTSerializer.extend({
    isNewSerializerAPI: true,
    normalizeResponse(store, primaryModelClass, payload, id, requestType) {
        let normalizePayload;
        if (payload.favoriteDiagnoses) {
            normalizePayload = payload;
        } else {
            normalizePayload = { favoriteDiagnoses: [] };
        }
        return this._super(store, primaryModelClass, normalizePayload, id, requestType);
    }
});
