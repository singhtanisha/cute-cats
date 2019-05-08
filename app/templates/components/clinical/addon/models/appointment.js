import { alias } from '@ember/object/computed';
import PatientListData from 'clinical/mixins/patient-list-data';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend(PatientListData, {
    patientPracticeGuid: attr('string'),
    lastSeenDate: attr('string'),
    appointmentDateAndTime: attr('string'),
    visitType: attr('string'),
    chiefComplaint: attr('string'),
    appointmentStatus: attr('string'),
    isActive: alias('patientIsActive')
});
