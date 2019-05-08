import RESTSerializer from 'ember-data/serializers/rest';

export default RESTSerializer.extend({
    isNewSerializerAPI: true,
    primaryKey: 'code',
    normalizeResponse(store, primaryModelClass, payload, id, requestType) {
        const components = payload.optional.concat(payload.required.map(item => {
            // change primaryKey to name once we remove is feature bit
            if (!item.code) {
                item.code = item.name;
            }
            item.isRequired = true;
            return item;
        }));
        return this._super(store, primaryModelClass, { ccdaTemplateComponents: components }, id, requestType);
    }

});
