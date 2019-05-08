import AuthenticatedBaseRoute from 'boot/routes/authenticated-base';
import { inject as service } from '@ember/service';
import EmberObject from '@ember/object';

export default AuthenticatedBaseRoute.extend({
    adBanner: service(),
    setupController(controller, model) {
        this._super(controller, model);
        const patientController = this.controllerFor('patient');
        const patientPracticeGuid = patientController.get('patientPracticeGuid');

        controller.get('load').perform(patientPracticeGuid);
        patientController.set('tabActionItems', [
            { separatorText: 'For family health' },
            { text: 'Print Family Health History', action: 'printFamilyHealthHistory' }
        ]);

        patientController.send('openTab', EmberObject.create({
            label: 'Family history',
            route: 'patient.familyhistory',
            arg1: patientPracticeGuid,
            dismissible: true,
            noIcon: true
        }));

        this.get('adBanner').updateAdUrl({
            currentPatientGuid: patientController.get('patientPracticeGuid'),
            zone: 'charts',
            subzone: null
        });
    },
    actions: {
        printFamilyHealthHistory() {
            // Load the patient info first to ensure that it gets rendered on the print preview
            this.get('store').findRecord('patient', this.modelFor('patient').get('id')).then(() => {
                this.send('printAudit', 'FamilyHealthHistory');
                this.set('controller.isPrintVisible', true);
            });
        }
    }
});
