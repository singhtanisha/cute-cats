import DetailPaneRoute from 'clinical/routes/detail-pane';
import SummaryRoute from 'clinical/mixins/summary-route';

export default DetailPaneRoute.extend(SummaryRoute, {
    templateName: 'family-health-history-details',
    model() {
        const patientPracticeGuid = this.modelFor('patient').get('patientPracticeGuid');
        return this.get('store').findRecord('personal-medical-history', patientPracticeGuid);
    },
    setupController(controller, model) {
        this._super(controller, model);
        this.send('refreshAd');
    }
});