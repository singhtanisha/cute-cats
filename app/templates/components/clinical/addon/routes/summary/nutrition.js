import { inject as service } from '@ember/service';
import AuthenticatedBaseRoute from 'boot/routes/authenticated-base';
import SummaryRoute from 'clinical/mixins/summary-route';

export default AuthenticatedBaseRoute.extend(SummaryRoute, {
    templateName: 'nutrition',
    tunnel: service(),
    model() {
        return {
            patientPracticeGuid: this.modelFor('patient').get('patientPracticeGuid'),
        };
    },
    setupController(controller, model) {
        this._super(controller, model);
        controller.get('load').perform();
        this.get('tunnel').send('update-editing-social-history', {
            isEditing: true,
            fieldKey: 'nutritionHistory'
        });
    },
    deactivate() {
        this.get('tunnel').send('update-editing-social-history', {
            isEditing: false
        });
    },
    actions: {
        close() {
            this.transitionTo(this.get('_defaultTransition'));
            this.controllerFor('patient/summary').send('closeDetailPane');
        },
    }
});
