import { alias } from '@ember/object/computed';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
    ironBridgePropertyId: alias('id'),

    description: attr('string'),
    ironBridgeFacilityRegistryPropertyId: attr('number'),
    ironBridgeRegistryId: attr('number'),
    isRequired: attr('boolean'),
    name: attr('string'),
    type: attr('string'),
    value: attr('string')
});
