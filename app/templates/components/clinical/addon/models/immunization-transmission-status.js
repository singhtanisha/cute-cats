import { alias, notEmpty, not } from '@ember/object/computed';
import attr from 'ember-data/attr';
import Model from 'ember-data/model';
import { computed, get } from '@ember/object';

export default Model.extend({
    immunizationTransmissionHistoryGuid: alias('id'),

    immunizationRegistryConnectionGuid: attr('string'),
    transmissionStatusCode: attr('string'),
    transmissionErrorList: attr('array'),
    transmissionVaccinationGuidList: attr('array'),
    transmissionDateTimeUtc: attr('string'),

    hasErrors: notEmpty('transmissionErrorList'),
    hasNoErrors: not('hasErrors')
});
