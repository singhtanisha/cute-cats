import PatientActivitySegment from 'clinical/models/patient/activity-segment';

import Transform from 'ember-data/transform';

export default Transform.extend({
    deserialize(serialized) {
        if (!serialized || !serialized.map) {
            return [];
        }
        return serialized.map(function(object) {
            return PatientActivitySegment.create(object);
        });
    },
    serialize(deserialized) {
        return deserialized;
    }
});
