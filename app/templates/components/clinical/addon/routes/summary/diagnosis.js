import DiagnosisRoute from 'clinical/routes/diagnosis';
import SummaryRoute from 'clinical/mixins/summary-route';

export default DiagnosisRoute.extend(SummaryRoute, {
    deactivate() {
        this._super.apply(this, arguments);
        
        this.controllerFor('patient/summary').send('closeDetailPane');
    }
});
