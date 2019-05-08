import { setProperties } from '@ember/object';
import RESTSerializer from 'ember-data/serializers/rest';

export default RESTSerializer.extend({
    primaryKey: 'patientSmokingStatusGuid',
    normalize(type, hash) {
        const smokingHash = hash;

        smokingHash.effectiveDate = moment.utc(hash.effectiveDate).format('MM/DD/YYYY');

        return this._super(type, smokingHash);
    },
    normalizeResponse(store, primaryModelClass, payload, id, requestType) {
        const normalizedPayload = {};
        if (payload.patientSmokingStatus) {
            normalizedPayload.smokingStatus = payload.patientSmokingStatus;
        } else {
            normalizedPayload.smokingStatuses = payload.patientSmokingStatuses;
        }
        return this._super(store, primaryModelClass, normalizedPayload, id, requestType);
    },
    serializeIntoHash(hash, type, snapshot, options) {
        setProperties(hash, this.serialize(snapshot, options));
        hash.effectiveDate = moment(snapshot.attr('effectiveDate')).format('MM/DD/YYYY');
    }
});
