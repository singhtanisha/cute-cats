import RESTSerializer from 'ember-data/serializers/rest';
import DS from 'ember-data';

export default RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
    isNewSerializerAPI: true,
    primaryKey: 'optionGuid', // TODO: Change this if contract changes to use guid instead of code
    attrs: {
        subOptions: { embedded: 'always' }
    },
    normalizeResponse(store, primaryModelClass, payload, id, requestType) {
        return this._super(store, primaryModelClass, { 'race-options': payload }, id, requestType);
    }
});
