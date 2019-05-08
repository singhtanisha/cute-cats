import { setProperties } from '@ember/object';
import RESTSerializer from 'ember-data/serializers/rest';

export default RESTSerializer.extend({
    isNewSerializerAPI: true,
    normalizeResponse(store, primaryModelClass, payload, id, requestType) {
        return this._super(store, primaryModelClass, { advanced_directives: payload }, id, requestType);
    },
    serializeIntoHash(hash, type, record, options) {
        setProperties(hash, this.serialize(record, options));
    }
});
