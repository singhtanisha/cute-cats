import { alias, sort } from '@ember/object/computed';
import attr from 'ember-data/attr';
import Model from 'ember-data/model';
import { belongsTo } from 'ember-data/relationships';
import Object, { computed, get } from '@ember/object';

const RegistryResult = Model.extend({
    resultId: alias('id'),

    forecastVaccines: attr('array'),
    historyVaccines: attr('array'),
    schedule: attr('string'),

    patientFilters: belongsTo('immunization-registry-filter', { async: false }),

    forecast: sort('forecastVaccines', 'forecastSortProperties'),
    forecastSortProperties: computed(() => ['dueDate']), 

    history: computed('historyVaccines', function () {
        const historyVaccines = get(this, 'historyVaccines') || [];
        const groups = historyVaccines.mapBy('vaccineGroup').uniq();

        return groups.map(group => {
            return Object.create({
                name: group,
                vaccines: historyVaccines.filterBy('vaccineGroup', group).sortBy('vaccineAdministered')
            });
        });
    })
});
export default RegistryResult;
