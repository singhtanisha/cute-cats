import { alias } from '@ember/object/computed';
import { inject as controller } from '@ember/controller';
import Mixin from '@ember/object/mixin';
export default Mixin.create({
    encounter: controller(),
    patient: controller(),
    transcriptGuid: alias('encounter.transcriptGuid'),
    transcriptDate: alias('encounter.displayDate'),
    patientPracticeGuid: alias('patient.patientPracticeGuid'),
    isDirty: false,
    closing: false
});
