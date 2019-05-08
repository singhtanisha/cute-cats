import { alias } from '@ember/object/computed';
import PatientListData from 'clinical/mixins/patient-list-data';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend(PatientListData, {
    patientPracticeGuid: alias('id'),
    lastAccessDateTime: attr('string'),
    isActive: alias('patientIsActive')
});
