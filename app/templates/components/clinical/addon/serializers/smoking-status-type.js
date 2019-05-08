import RESTSerializer from 'ember-data/serializers/rest';

export default RESTSerializer.extend({
    isNewSerializerAPI: true,
    primaryKey: 'smokingStatusGuid',
    normalizeResponse(store, primaryModelClass, payload, id, requestType) {
        const smokingStatusTypes = payload.smokingStatuses;
        return this._super(store, primaryModelClass, { smokingStatusTypes }, id, requestType);
    }
});
