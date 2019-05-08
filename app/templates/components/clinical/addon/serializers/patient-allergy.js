import { setProperties } from '@ember/object';
import RESTSerializer from 'ember-data/serializers/rest';

export default RESTSerializer.extend({
    primaryKey: 'patientAllergyGuid',
    serializeIntoHash(hash, type, record, options) {
        const data = this.serialize(record, options);
        if (record.id) {
            data.patientAllergyGuid = record.id;
        }
        setProperties(hash, data);
    },
    normalizeQueryResponse(store, primaryModelClass, payload, id, requestType) {
        return this._super(store, primaryModelClass, {
            patientAllergies: payload.patientAllergies,
            meta: {
                noKnownAllergies: payload.noKnownAllergies
            }
        }, id, requestType);
    }
});
