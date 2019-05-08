import { isPresent } from '@ember/utils';
import { get } from '@ember/object';
import RESTSerializer from 'ember-data/serializers/rest';

export default RESTSerializer.extend({
    normalize(type, hash) {
        const fieldHash = {
            id: hash.id,
            description: get(hash, 'description') || '',
            effectiveDate: get(hash, 'lastModifiedDateTimeUtc') || '',
            notes: get(hash, 'notes') || '',
            optionGuid: get(hash, 'optionGuid') || '',
            supportsEffectiveDate: get(hash, 'supportsEffectiveDate') || false
        };

        return this._super(type, fieldHash);
    },

    serialize(snapshot) {
        const json = snapshot.record.toJSON();

        if (isPresent(json.effectiveDate)) {
            json.lastModifiedDateTimeUtc = json.effectiveDate;
        }

        delete json.effectiveDate;
        delete json.supportsEffectiveDate;

        return json;
    }
});
