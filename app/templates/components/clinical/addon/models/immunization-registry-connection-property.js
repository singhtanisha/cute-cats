import { alias } from '@ember/object/computed';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
    immunizationRegistryConnectionPropertyGuid: alias('id'),

    ironBridgePropertyId: attr('string'),
    ironBridgePropertyValue: attr('string')
});
