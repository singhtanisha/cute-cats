import EmberObject from '@ember/object';
import flowsheetDataRepository from 'flowsheets/repositories/flowsheet-data';
import AuthenticatedBaseRoute from 'boot/routes/authenticated-base';

export default AuthenticatedBaseRoute.extend({
    setupController(controller) {
        this._super(controller, EmberObject.create());
        const patientController = this.controllerFor('patient');
        const patientPracticeGuid = patientController.get('patientPracticeGuid');

        flowsheetDataRepository.loadIsMetric().then(isMetric => controller.set('isMetric', isMetric));

        controller.set('isLoading', true);

        this.store.query('growth-chart', { patientPracticeGuid }).then(observations => {
            controller.set('model.vitalHistory', observations.sortBy('eventDateTimeUtc'));
            controller.set('isLoading', false);
        });

        patientController.send('openTab', EmberObject.create({
            label: 'Vitals and growth',
            route: 'patient.growth.charts',
            dismissible: true,
            noIcon: true
        }));
    }
});
