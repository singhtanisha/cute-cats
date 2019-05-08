import { alias } from '@ember/object/computed';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
    patientPracticeGuid: alias('id'),
    education: attr(),
    financialResourceStatus: attr(),
    genderIdentity: attr(),
    sexualOrientation: attr(),
    riskScore: attr()
});
