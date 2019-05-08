import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
    patientGoalGuid: alias('id'),
    patientPracticeGuid: attr('string'),
    isActive: attr('boolean'),
    effectiveDate: attr('formatted-date'),
    description: attr('string'),
    sortableDate: computed('effectiveDate', function() {
        return new Date(this.get('effectiveDate'));
    })
});
