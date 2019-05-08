import { setProperties } from '@ember/object';
import RESTSerializer from 'ember-data/serializers/rest';

export default RESTSerializer.extend({
    primaryKey: 'patientPracticeGuid',
    isNewSerializerAPI: true,
    normalizeResponse(store, primaryModelClass, payload, id, requestType) {
        return this._super(store, primaryModelClass, { personal_medical_history: payload }, id, requestType);
    },
    serializeIntoHash(hash, type, record, options) {
        const newOptions = options || {};
        newOptions.includeId = true;
        setProperties(hash, this.serialize(record, newOptions));
    }
});
