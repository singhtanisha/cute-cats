import RESTSerializer from 'ember-data/serializers/rest';
import DS from 'ember-data';

export default RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
    isNewSerializerAPI: true,
    primaryKey: 'optionGuid',
    attrs: {
        subOptions: { embedded: 'always' }
    },
    normalizeResponse(store, primaryModelClass, payload, id, requestType) {
        return this._super(store, primaryModelClass, { 'ethnicity-options': payload }, id, requestType);
    }
});
