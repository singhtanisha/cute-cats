import { setProperties } from '@ember/object';
import RESTSerializer from 'ember-data/serializers/rest';
import DS from 'ember-data';

export default RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
    attrs: {
        genderIdentityOptions: { embedded: 'always' },
        sexualOrientationOptions: { embedded: 'always' },
        riskScoreOptions: { embedded: 'always' }
    },
    isNewSerializerAPI: true,

    normalizeResponse(store, type, payload, id, requestType) {
        if (payload) {
            payload.id = 1;
        }
        payload = {
            'social-history-option': [payload]
        };
        return this._super(store, type, payload, id, requestType);
    },
    serializeIntoHash(hash, type, record, options) {
        setProperties(hash, this.serialize(record, options));
    }
});
