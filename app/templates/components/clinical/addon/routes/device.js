import { set } from '@ember/object';
import { merge } from '@ember/polyfills';
import { inject as service } from '@ember/service';
import Referrer from 'common/mixins/referrer';
import DetailPaneRoute from 'clinical/routes/detail-pane';

export default DetailPaneRoute.extend(Referrer, {
    templateName: 'device',
    routing: service('pf-routing'),

    // hooks
    model(params, transition, queryParams) {
        queryParams = params.queryParams || transition.queryParams || queryParams || {};
        let deviceGuid = params.deviceGuid;

        if (params.deviceGuid === 'new') {
            deviceGuid = null;
        }

        return merge(queryParams, { deviceGuid: deviceGuid });
    },

    setupController(controller, model) {
        const patientPracticeGuid = this.controllerFor('patient').get('patientPracticeGuid');

        set(model, 'patientGuid', patientPracticeGuid);
        this._super(controller, model);
    },
    deactivate() {
        this._super.apply(this, arguments);
        this.controllerFor(this.get('delegatingController')).set('selectedDeviceGuid', undefined);
    },

    actions: {
        close() {
            const attemptedAction = this.get('attemptedAction');
            const attemptedTransition = this.get('attemptedTransition');

            this.set('clearReferrerHash', true);

            if (attemptedAction) {
                this.set('attemptedAction', undefined);
                this.send.apply(this, attemptedAction);
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
