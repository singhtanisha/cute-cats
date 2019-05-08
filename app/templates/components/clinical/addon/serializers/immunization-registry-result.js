import RESTSerializer from 'ember-data/serializers/rest';
import EmbeddedRecordsMixin from 'ember-data/serializers/embedded-records-mixin';

export default RESTSerializer.extend(EmbeddedRecordsMixin, {
    attrs: {
        patientFilters: { embedded: 'always' }
    },
    isNewSerializerAPI: true,
    primaryKey: 'resultId',

    normalizeResponse(store, type, payload, id, requestType) {
        return this._super(store, type, { 'immunization-registry-result': payload }, id, requestType);
    }
});
