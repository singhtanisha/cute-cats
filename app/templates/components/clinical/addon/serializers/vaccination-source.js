import RESTSerializer from 'ember-data/serializers/rest';

export default RESTSerializer.extend({
    primaryKey: 'vaccinationSourceName',
    isNewSerializerAPI: true
});
