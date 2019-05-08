import { inject as service } from '@ember/service';
import AuthenticatedBaseRoute from 'boot/routes/authenticated-base';
import SummaryRoute from 'clinical/mixins/summary-route';

export default AuthenticatedBaseRoute.extend(SummaryRoute, {
    templateName: 'summary-pmh',
    tunnel: service(),

    model(param) {
        return {
            patientPracticeGuid: this.modelFor('patient').get('patientPracticeGuid'),
            section: param.fieldKey
        };
    },
    setupController(controller, model) {
        this._super(controller, model);
        controller.get('loadPMH').perform(model.patientPracticeGuid);
        controller.get('loadDisplaySetting').perform();
        this.send('refreshAd');
        this.get('tunnel').send('update-editing-past-medical-history', {
            isEditing: true,
            fieldKey: model.section
        });
    },
    deactivate() {
        this.get('tunnel').send('update-editing-past-medical-history', {
            isEditing: false
        });
    },
    actions: {
        resetSelectedItem() {
            this.controllerFor('patient/summary').send('closeDetailPane');
        }
    }
});
