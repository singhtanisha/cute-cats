import { alias } from '@ember/object/computed';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
    adverseReactionGuid: alias('id'),

    adverseReactionDefinition: attr('string'),
    conceptCode: attr('string'),
    conceptName: attr('string'),
    hl7Code: attr('string'),
    isActive: attr('boolean'),
    loincCode: attr('string')
});
