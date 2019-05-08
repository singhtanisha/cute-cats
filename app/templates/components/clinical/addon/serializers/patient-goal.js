import { setProperties } from '@ember/object';
import RESTSerializer from 'ember-data/serializers/rest';

export default RESTSerializer.extend({
    primaryKey: 'patientGoalGuid',
    isNewSerializerAPI: true,
    serializeIntoHash(hash, type, record, options) {
        const data = this.serialize(record, options);
        if (record.id) {
            data.patientGoalGuid = record.id;
        }
        setProperties(hash, data);
    }
});
