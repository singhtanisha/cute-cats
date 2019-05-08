import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
    description: attr(),
    conceptCode: attr(),
    conceptName: attr(),
    displaySequence: attr('number'),
    selectionSequence: attr('number')
});
