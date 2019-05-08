import { setProperties } from '@ember/object';
import RESTSerializer from 'ember-data/serializers/rest';

export default RESTSerializer.extend({
    primaryKey: 'patientHealthConcernGuid',
    isNewSerializerAPI: true,
    serializeIntoHash(hash, type, record, options) {
        const data = this.serialize(record, options);
        if (data.healthConcernType === 'Note') {
            delete data.healthConcernReferenceGuid;
            delete data.effectiveDate;
            delete data.isActive;
        } else {
            delete data.healthConcernNote;
        }
        if (record.id) {
            data.patientHealthConcernGuid = record.id;
        }
        setProperties(hash, data);
    }
});
