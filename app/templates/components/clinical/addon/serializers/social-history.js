import { setProperties } from '@ember/object';
import RESTSerializer from 'ember-data/serializers/rest';
import DS from 'ember-data';

export default RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
    isNewSerializerAPI: true,
    primaryKey: 'patientPracticeGuid',
    normalizeResponse(store, type, payload, id, requestType) {
        if (payload.riskScore && payload.riskScore.dateAssigned) {
            payload.riskScore.dateAssigned = moment.utc(payload.riskScore.dateAssigned).format('MM/DD/YYYY');
        }
        payload = {
            'social-history': [payload]
        };
        return this._super(store, type, payload, id, requestType);
    },
    serializeIntoHash(hash, type, record, options) {
        setProperties(hash, this.serialize(record, options));
    }
});
