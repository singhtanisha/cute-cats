import { alias } from '@ember/object/computed';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
    title: alias('id'),
    reactionGroupTitle: attr('string'),
    displaySequence: attr('number'),
    isActive: attr('boolean')
});
