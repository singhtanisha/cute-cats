import RESTSerializer from 'ember-data/serializers/rest';

export default RESTSerializer.extend({
    primaryKey: 'immunizationTransmissionHistoryGuid',

    normalizeResponse(store, type, payload, id, requestType) {
        const transmissions = payload ? payload.transmissions || [] : [];
        return this._super(store, type, { 'immunization-transmission-status': transmissions }, id, requestType);
    }
});
