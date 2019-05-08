import RESTSerializer from 'ember-data/serializers/rest';

export default RESTSerializer.extend({
    isNewSerializerAPI: true,
    primaryKey: 'vaccinationGuid',
    normalizeResponse(store, primaryModelClass, payload, id, requestType) {
        return this._super(store, primaryModelClass, { vaccine_lot_usages: payload }, id, requestType);
    },
    normalize(typeClass, hash, prop) {
        if (hash.vaccinationDate) {
            hash.vaccinationDate = moment.utc(hash.vaccinationDate).format('MM/DD/YYYY');
        }

        return this._super(typeClass, hash, prop);
    }
});
