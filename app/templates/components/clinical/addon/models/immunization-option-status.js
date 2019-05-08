import attr from 'ember-data/attr';
import Model from 'ember-data/model';
import { computed, get } from '@ember/object';

export default Model.extend({
    immunizationRegistryPatientStatusDescription: attr('string'),
    immunizationRegistryPatientStatusHl7Code: attr('string'),
    isActive: attr('boolean'),

    immunizationRegistryPatientStatusId: computed('id', function () {
        return parseInt(get(this, 'id'));
    })
});
