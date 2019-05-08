import { alias } from '@ember/object/computed';
import { inject as controller } from '@ember/controller';
import Mixin from '@ember/object/mixin';
export default Mixin.create({
    patient: controller(),
    patientPracticeGuid: alias('patient.patientPracticeGuid'),
    transcriptGuid: null,
    isDirty: false,
    closing: false
});
