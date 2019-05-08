import { alias } from '@ember/object/computed';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
    title: alias('id'),
    groupTitle: attr('string'),
    isCustom: attr('boolean'),
    isActive: attr('boolean')
});
