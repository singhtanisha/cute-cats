import RESTSerializer from 'ember-data/serializers/rest';

export default RESTSerializer.extend({
    isNewSerializerAPI: true,
    primaryKey: 'documentGuid',
    normalizeResponse(store, primaryModelClass, payload, id, requestType) {
        return this._super(store, primaryModelClass, { clinicalDocuments: payload.ccdSummaries }, id, requestType);
    }
});
