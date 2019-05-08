import { alias, not } from '@ember/object/computed';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
    code: alias('id'),
    isActive: attr('boolean'),
    name: attr('string'),
    isRequired: attr('boolean'),
    isOptional: not('isRequired')
});
