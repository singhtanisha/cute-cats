import { alias } from '@ember/object/computed';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
    code: alias('id'),
    name: attr('string'),
    isActive: attr('boolean')
});
