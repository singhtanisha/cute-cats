import { alias } from '@ember/object/computed';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
    conceptCode: alias('id'),

    codeSystem: attr(),
    conceptName: attr(),
    isActive: attr('boolean'),
    preferredConceptName: attr()
});
