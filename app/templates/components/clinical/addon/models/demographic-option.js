import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
    optionGuid: alias('id'),
    description: attr('string'),
    displayOrder: attr('number'),
    isActive: attr('boolean'),
    optionElement: computed('optionGuid', function () {
        return `option-${this.get('optionGuid')}`;
    })
});
