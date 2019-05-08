import { alias } from '@ember/object/computed';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
    scheduleSpecialIndicationGuid: alias('id'),

    conceptCode: attr('string'),
    hl7Code: attr('string'),
    isActive: attr('boolean'),
    loincCode: attr('string'),
    scheduleSpecialIndicationDefinition: attr('string'),
    scheduleSpecialIndicationName: attr('string')
});
