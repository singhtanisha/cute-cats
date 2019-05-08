import RESTSerializer from 'ember-data/serializers/rest';

export default RESTSerializer.extend({
    primaryKey: 'scheduledEventGuid',
    isNewSerializerAPI: true,
    normalizeResponse(store, primaryModelClass, payload, id, requestType) {
        return this._super(store, primaryModelClass, { appointment: payload }, id, requestType);
    }
});
