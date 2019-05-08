import { merge } from '@ember/polyfills';
import { inject as service } from '@ember/service';
import ReferrerSupport from 'common/mixins/referrer';
import DetailPaneRoute from 'clinical/routes/detail-pane';

export default DetailPaneRoute.extend(ReferrerSupport, {
    adBanner: service(),
    clearReferrerHash: false,

    // to be overridden by subclasses
    isRecordedFromPlan: false,
    templateName: 'medication',
    routing: service('pf-routing'),

    // hooks
    model(params, transition, queryParams) {
        const model = params.queryParams || transition.queryParams || queryParams || {};
        const isRecordedFromPlan = model.actionType === 'plan';
        const isRecoredFromDiagnosis = model.actionType === 'diagnosis';
        let { medicationGuid } = params;

        if (params.medicationGuid === 'new') {
            medicationGuid = null;
        }

        this.set('isRecordedFromPlan', isRecordedFromPlan);

        return merge(model, {
            medicationGuid,
            isRecordedFromPlan,
            isRecoredFromDiagnosis
        });
    },

    setupController(controller, model) {
        this.controllerFor(this.get('delegatingController')).set('selectedItem', model.medicationGuid);
        this._super(controller, model);

        // Only refresh the ad if we are adding a medication. The component will refresh it with the ndc of the
        // current medication if we are editing or once one is selected.
        if (!model.medicationGuid) {
            this.refreshAd(null);
        }
    },
    deactivate() {
        this._super.apply(this, arguments);
        this.controllerFor(this.get('delegatingController')).set('selectedItem', undefined);
        if (this.get('didTransitionToOrder')) {
            this.set('didTransitionToOrder', false);
            this.controller.set('isOrdering', false);
            this.controller.set('controlledSubstanceScheduleChanged', false);
        } else {
            this.send('refreshAd', { reloadAdContext: true });
        }
    },

    refreshAd(ndc) {
        const patientPracticeGuid = this.controllerFor('patient').get('patientPracticeGuid');
        this.get('adBanner').updateAdUrl({
            currentPatientGuid: patientPracticeGuid,
            zone: ndc ? 'main' : 'charts',
            subzone: 'medication',
            currentMedication: ndc
        });
    },

    actions: {
        goToPrescriptionDetails(prescription) {
            const patientPracticeGuid = this.controllerFor('patient').get('patientPracticeGuid');
            const prescriptionGuid = prescription.prescriptionGuid;
            this.setReferrer();
            if ((prescription.prescriptionStatus || '').toLowerCase().split(' ').join('') === 'changerequested') {
                this.transitionTo('patient.erx.change', patientPracticeGuid, prescriptionGuid);
            } else if ((prescription.status || 'refill requested').toLowerCase() === '') {
                this.transitionTo('refill.request', patientPracticeGuid, prescriptionGuid);
            } else {
                this.transitionTo('patient.erx.summary', patientPracticeGuid, prescriptionGuid);
            }
        },
        refreshMedicationAd(ndc) {
            this.refreshAd(ndc);
        },
        close(medication, goToDrugAllergy) {
            const attemptedAction = this.get('attemptedAction');
            const attemptedTransition = this.get('attemptedTransition');
            const referrerHash = this.get('referrerService.referrer.hash');
            const patientPracticeGuid = this.controllerFor('patient').get('patientPracticeGuid');

            this.set('clearReferrerHash', true);

            if (attemptedAction) {
                this.set('attemptedAction', undefined);
                this.send.apply(this, attemptedAction);
            } else if (attemptedTransition) {
                this.set('attemptedTransition', undefined);
                attemptedTransition.retry();
            } else if (!this.get('didTransitionToOrder') && this.get('isRecordedFromPlan')) {
                // Tell encounter to show the plan section when leaving.
                this.transitionTo('encounter.note', { section: 'plan' });
            } else if (!this.get('didTransitionToOrder') && this.controller.get('isRecoredFromDiagnosis')) {
                const queryParams = {};
                if (this.controllerFor(this.get('_diagnosisRouteName')).get('isRecordedFromAssessment')) {
                    queryParams.actionType = 'assessment';
                }
                this.transitionTo(this.get('_diagnosisRouteName'), this.controller.get('diagnosisGuid'), { queryParams });
            } else if (goToDrugAllergy) {
                const medicationPaneParent = this.get('routing.currentRouteSegments')[this.get('routing.currentRouteSegments.length') - 2];
                this.transitionTo(`${medicationPaneParent}.allergy`, 'new', { queryParams: { allergenQuery: medication.get('genericName') } });
            } else if (referrerHash && referrerHash.indexOf('summary/medication') < 0 && referrerHash.indexOf('encounter/medication') < 0 && referrerHash.indexOf(patientPracticeGuid) > 0) {
                this.get('referrerService').returnToReferrer();
            } else {
                this.transitionTo(...this.getDefaultTransitionArgs());
            }
        },
        showAssessment(info) {
            this.send('showAssessmentModal', info);
        },
        controlledSubstanceScheduleChanged() {
            this.controller.set('isOrdering', false);
            this.controller.set('controlledSubstanceScheduleChanged', true);
        }
    },
    _defaultTransition: () => {},
    _diagnosisRouteName: () => {}
});
