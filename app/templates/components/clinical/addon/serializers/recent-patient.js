import RESTSerializer from 'ember-data/serializers/rest';

export default RESTSerializer.extend({
    isNewSerializerAPI: true,
    primaryKey: 'patientPracticeGuid',
    normalizeResponse(store, primaryModelClass, payload, id, requestType) {
        return this._super(store, primaryModelClass, { recentPatients: payload }, id, requestType);
    }
});
