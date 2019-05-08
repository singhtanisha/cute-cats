import { isEmpty } from '@ember/utils';
import MedicationRoute from 'clinical/routes/medication';
import SummaryRoute from 'clinical/mixins/summary-route';

export default MedicationRoute.extend(SummaryRoute, {
    // overridden properties
    erxDenyNewToFollowRefillRequestGuid: null,
    clearReferrerHash: false,

    // hooks
    model(params, transition, queryParams) {
        queryParams = params.queryParams || transition.queryParams || queryParams || {};
        var model = this._super.apply(this, arguments);
        // set the guid for the referring refill request passed in via the queryParams
        this.set('erxDenyNewToFollowRefillRequestGuid', queryParams.erxDenyNewToFollowRefillRequestGuid);
        return model;
    },

    setupController(controller, model) {
        this._super(controller, model);
        // if this model contains a reference to a refill request that was DNTF,
        // clear reference to the referrer route because we don't want to navigate back to it
        if (!isEmpty(this.get('erxDenyNewToFollowRefillRequestGuid'))) {
            this.clearReferrer();
        }
    },

    deactivate() {
        this._super.apply(this, arguments);

        this.controllerFor('patient/summary').send('closeDetailPane');
    },

    _diagnosisRouteName: 'summary.diagnosis',

    actions: {
        createOrder(medicationGuid, quantity, unit, daysSupply) {
            const queryParams = {
                medicationGuid,
                erxDenyNewToFollowRefillRequestGuid: this.get('erxDenyNewToFollowRefillRequestGuid')
            };
            if (quantity) {
                queryParams.quantity = quantity;
            }
            if (unit) {
                queryParams.unit = unit;
            }
            if (daysSupply) {
                queryParams.daysSupply = daysSupply;
            }

            this.set('didTransitionToOrder', true);
            this.transitionTo('summary.erx.order', 'new', {
                queryParams
            });
        }
    }
});
