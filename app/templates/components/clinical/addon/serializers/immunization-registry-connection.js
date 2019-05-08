import { isEmpty } from '@ember/utils';
import RESTSerializer from 'ember-data/serializers/rest';
import DS from 'ember-data';

export default RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
    attrs: {
        properties: { embedded: 'always' }
    },
    isNewSerializerAPI: true,
    primaryKey: 'immunizationRegistryConnectionGuid',

    normalizeArrayResponse(store, type, payload, id, requestType) {
        payload = {
            'immunization-registry-connections': payload
        };

        return this._super(store, type, payload, id, requestType);
    },

    normalizeCreateRecordResponse(store, type, payload, id, requestType) {
        store.peekAll('immunization-registry-connection-property').forEach((connectionProperty) => {
            if (isEmpty(connectionProperty.get('id'))) {
                store.unloadRecord(connectionProperty);
            }
        });

        payload = {
            'immunization-registry-connection': payload
        };

        return this._super(store, type, payload, id, requestType);
    },

    normalizeDeleteRecordResponse(store, type, payload, id, requestType) {
        payload = {
            'immunization-registry-connection': null
        };

        return this._super(store, type, payload, id, requestType);
    },

    normalizeUpdateRecordResponse(store, type, payload, id, requestType) {
        payload = {
            'immunization-registry-connection': payload
        };

        return this._super(store, type, payload, id, requestType);
    }
});
