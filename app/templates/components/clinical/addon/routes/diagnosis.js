import { merge } from '@ember/polyfills';
import { inject as service } from '@ember/service';
import Referrer from 'common/mixins/referrer';
import DetailPaneRoute from 'clinical/routes/detail-pane';

export default DetailPaneRoute.extend(Referrer, {
    adBanner: service(),
    templateName: 'diagnosis',
    model(params, transition, queryParams) {
        const model = params.queryParams || transition.queryParams || queryParams || {};
        let { diagnosisGuid } = params;

        if (diagnosisGuid === 'new') {
            diagnosisGuid = null;
        }

        return merge(model, {
            diagnosisGuid
        });
    },
    setupController(controller, model) {
        this._super(controller, model);
        const patientPracticeGuid = this.controllerFor('patient').get('patientPracticeGuid');
        this.get('adBanner').updateAdUrl({
            currentPatientGuid: patientPracticeGuid,
            zone: 'charts',
            subzone: 'diagnosis'
        });
    },
    deactivate() {
        this._super.apply(this, arguments);
        if (this.get('didTransitionToMedication')) {
            this.set('didTransitionToMedication', false);
        }
        this.send('refreshAd', { reloadAdContext: true });
    },
    actions: {
        recordMedication() {
            const controller = this.controllerFor(this.get('delegatingController'));
            const args = [].splice.call(arguments,0);
            this.setReferrer();
            this.set('didTransitionToMedication', true);
            controller.send.apply(controller, ['recordMedicationFromDiagnosis'].concat(args));
        },
        editMedication() {
            const controller = this.controllerFor(this.get('delegatingController'));
            const args = [].splice.call(arguments,0);
            this.setReferrer();
            controller.send.apply(controller, ['editMedicationFromDiagnosis'].concat(args));
        },
        close() {
            var attemptedAction = this.get('attemptedAction'),
                attemptedTransition = this.get('attemptedTransition');

            if (attemptedAction) {
                this.set('attemptedAction', undefined);
                this.send.apply(this, attemptedAction);
            } else if (!this.get('didTransitionToMedication') && this.get('isRecordedFromAssessment')) {
                // Tell encounter to show the assessment section when leaving.
                this.transitionTo('encounter.note', { section: 'assessment' });
            } else if (attemptedTransition) {
                this.set('attemptedTransition', undefined);
                attemptedTransition.retry();
            } else {
                this.transitionTo(...this.getDefaultTransitionArgs());
            }
        }
    },
    _defaultTransition: () => {}
});
