import GoalRoute from 'clinical/routes/goal';
import SummaryRoute from 'clinical/mixins/summary-route';

export default GoalRoute.extend(SummaryRoute, {
    setupController(controller, model) {
        this._super(controller, model);
        this.send('refreshAd');
    }
});
