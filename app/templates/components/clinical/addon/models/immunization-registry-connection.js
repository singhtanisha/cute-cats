import { alias } from '@ember/object/computed';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
    immunizationRegistryConnectionGuid: alias('id'),

    facilityGuid: attr('string'),
    immunizationRegistryGuid: attr('string'),
    immunizationRegistryConnectionStatus: attr('string'),
    isLive: attr('boolean'),
    lastUpdatedByUserGuid: attr('string'),
    lastModifiedDateTimeUtc: attr('string'),
    practiceGuid: attr('string'),
    providerGuid: attr('string'),

    properties: hasMany('immunization-registry-connection-property', { async: false })
});
