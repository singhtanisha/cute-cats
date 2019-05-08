import { isPresent } from '@ember/utils';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import DetailPaneRoute from 'clinical/routes/detail-pane';
import SummaryRoute from 'clinical/mixins/summary-route';

export default DetailPaneRoute.extend(SummaryRoute, {
    templateName: 'social-health',
    tunnel: service(),
    model(params) {
        return {
            patientPracticeGuid: this.modelFor('patient').get('patientPracticeGuid'),
            socialHealthFieldKey: params.fieldKey
        };
    },
    setupController(controller, model) {
        this._super(controller, model);
        controller.get('load').perform();
        this.send('refreshAd');
        this.get('tunnel').send('update-editing-social-history', {
            isEditing: true,
            fieldKey: get(model, 'socialHealthFieldKey')
        });
    },
    deactivate() {
        const socialHealth = this.get('controller.socialHealth');

        if (isPresent(socialHealth)) {
            socialHealth.undoChanges();
        }

        this.get('tunnel').send('update-editing-social-history', {
            isEditing: false
        });
    },
    actions: {
        resetSelectedItem() {
            this.controllerFor('patient/summary').send('closeDetailPane');
        }
    }
});
