import RESTSerializer from 'ember-data/serializers/rest';

export default RESTSerializer.extend({
    isNewSerializerAPI: true,
    primaryKey: 'optionGuid'
});
