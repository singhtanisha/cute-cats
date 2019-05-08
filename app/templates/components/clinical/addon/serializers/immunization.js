import RESTSerializer from 'ember-data/serializers/rest';
import DS from 'ember-data';

export default RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
    attrs: {
        vaccinations: { embedded: 'always' }
    },
    isNewSerializerAPI: true,
    primaryKey: 'immunizationGroupGuid',

    normalizeResponse(store, type, payload, id, requestType) {
        payload = {
            'immunizations': payload
        };
        return this._super(store, type, payload, id, requestType);
    }
});
