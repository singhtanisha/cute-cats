import HealthConcernRoute from 'clinical/routes/health-concern';
import SummaryRoute from 'clinical/mixins/summary-route';

export default HealthConcernRoute.extend(SummaryRoute, {
    setupController(controller, model) {
        this._super(controller, model);
        this.send('refreshAd');
    }
});
