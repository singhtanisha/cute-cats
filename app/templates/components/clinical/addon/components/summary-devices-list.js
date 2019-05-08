import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import WithDevices from 'clinical/mixins/with-devices';

export default Component.extend(WithDevices, {
    classNames: ['devices'],
    showInactiveDevices: false,

    patient: null,
    patientGuid: alias('patient.patientPracticeGuid')
});
