import Controller from '@ember/controller';
import SummaryControllerMixin from 'clinical/mixins/summary-controller';

export default Controller.extend(SummaryControllerMixin, {
    actions: {
        diagnosisDeleted(diagnosis) {
            this.send('removeHealthConcern', diagnosis.get('diagnosisGuid'));
        }
    }
});
