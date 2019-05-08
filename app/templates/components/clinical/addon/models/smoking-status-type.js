import { resolve } from 'rsvp';
import { isPresent } from '@ember/utils';
import { alias } from '@ember/object/computed';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

const SmokingStatusType = Model.extend({
    smokingStatusGuid: alias('id'),
    description: attr('string'),
    isActive: attr('boolean'),
    version: attr('number')
});

SmokingStatusType.reopenClass({
    getTypes(store) {
        const types = store.peekAll('smoking_status_type');
        // Return the loaded smoking status types if they have already
        // been cached using ember data.
        if (isPresent(types)) {
            return resolve(types);
        }
        return store.findAll('smoking_status_type');
    }
});

export default SmokingStatusType;
