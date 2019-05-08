import { alias } from '@ember/object/computed';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
    code: alias('id'),

    description: attr(),
    isActive: attr('boolean'),
    name: attr()
});
