import { alias, and, equal } from '@ember/object/computed';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
    vaccinationSourceName: alias('id'),

    description: attr(),
    isActive: attr('boolean'),
    nipCode: attr('string'),
    nipCodeSystem: attr('string'),
    nipName: attr('string'),
    sourceType: attr(),

    isAdministered: equal('sourceType', 'Administered'),
    isAdministeredActive: and('isAdministered', 'isActive'),
    isHistorical: equal('sourceType', 'Historical'),
    isHistoricalActive: and('isHistorical', 'isActive'),
    isRefused: equal('sourceType', 'Refused'),
    isRefusedActive: and('isRefused', 'isActive'),
});
