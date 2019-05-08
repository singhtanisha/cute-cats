import { inject as service } from '@ember/service';
import AllergyRoute from 'clinical/routes/allergy';
import SummaryRoute from 'clinical/mixins/summary-route';

export default AllergyRoute.extend(SummaryRoute, {
    tunnel: service(),

    setupController(controller, model) {
        const delegatingController = this.controllerFor(this.get('delegatingController'));

        delegatingController.set('selectedItem', model);
        this._super(controller, model);
    },
    deactivate() {
        const delegatingController = this.controllerFor(this.get('delegatingController'));
        delegatingController.set('selectedItem', null);
        this.get('tunnel').send('allergies-list', { reloadFromCache: true });
        this._super();
    }
});
