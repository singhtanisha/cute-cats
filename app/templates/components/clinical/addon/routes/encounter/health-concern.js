import HealthConcernRoute from 'clinical/routes/health-concern';
import EncounterRoute from 'clinical/mixins/encounter-route';

export default HealthConcernRoute.extend(EncounterRoute, {
    setupController(controller, model) {
        this._super(controller, model);
        this.controllerFor(this.get('delegatingController')).set('currentDetailsPaneProperty', 'isEditingHealthConcern');
    },
    deactivate() {
        this._super();
        const controller = this.controllerFor(this.get('delegatingController'));
        if (controller.get('currentDetailsPaneProperty') === 'isEditingHealthConcern') {
            controller.set('currentDetailsPaneProperty', null);
        }
    }
});
