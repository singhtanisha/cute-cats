import Controller from '@ember/controller';
import EncounterControllerMixin from 'clinical/mixins/encounter-controller';

export default Controller.extend(EncounterControllerMixin, {
    actions: {
        diagnosisDeleted(diagnosis) {
            this.send('removeHealthConcern', diagnosis.get('diagnosisGuid'));
        }
    }
});
