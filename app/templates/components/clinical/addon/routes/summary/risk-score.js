import { inject as service } from '@ember/service';
import RiskScoreRoute from 'clinical/routes/risk-score';
import SummaryRoute from 'clinical/mixins/summary-route';

export default RiskScoreRoute.extend(SummaryRoute, {
    tunnel: service(),

    deactivate() {
        this._super.apply(this, arguments);
        this.controllerFor('patient/summary').send('closeDetailPane');
        this.get('tunnel').send('patient-risk-score');
    }
});
