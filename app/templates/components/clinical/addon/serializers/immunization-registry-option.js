import { setProperties } from '@ember/object';
import RESTSerializer from 'ember-data/serializers/rest';
import EmbeddedRecordsMixin from 'ember-data/serializers/embedded-records-mixin';

export default RESTSerializer.extend(EmbeddedRecordsMixin, {
    attrs: {
        immunizationRegistryNotificationOptions: { embedded: 'always' },
        immunizationRegistryStatusOptions: { embedded: 'always' },
        immunizationRegistryProtectionOptions: { embedded: 'always' }
    },
    normalizeResponse(store, type, payload, id, requestType) {
        if (payload) {
            payload.id = 1;
        }
        return this._super(store, type, { 'immunization-registry-option': [payload] }, id, requestType);
    },
    serializeIntoHash(hash, type, record, options) {
        setProperties(hash, this.serialize(record, options));
    }
});
