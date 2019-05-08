import RESTSerializer from 'ember-data/serializers/rest';

export default RESTSerializer.extend({
    primaryKey: 'title',
    normalizeResponse(store, primaryModelClass, payload, id, requestType) {
        return this._super(store, primaryModelClass, { 'allergy-reactions': payload.allergyReactions }, id, requestType);
    }
});
