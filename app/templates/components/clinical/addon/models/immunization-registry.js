import { alias } from '@ember/object/computed';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
    immunizationRegistryGuid: alias('id'),

    displayName: attr('string'),
    isActive: attr('boolean'),
    isIronBridgeEnabled: attr('boolean'),
    location: attr(),
    name: attr(),
    region: attr('string'),
    systemAcronym: attr('string')
});
