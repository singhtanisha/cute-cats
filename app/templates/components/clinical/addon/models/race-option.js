import { alias } from '@ember/object/computed';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
    optionGuid: alias('id'),
    description: attr('string'),
    isDefault: attr('boolean'),
    isExclusive: attr('boolean'),
    subOptions: hasMany('subDemographicOption', { async: false })
});
