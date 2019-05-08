import { A } from '@ember/array';
import NavigationRoute from 'common/routes/navigation';

export default NavigationRoute.extend({
    templateName: 'patients',
    menuItems: null,
    currentPatientGuid: null,
    init() {
        this._super();
        this.set('menuItems', []);
    },

    actions: {
        openTab() {
            // Bubble out of here to the next one/
            return true;
        },

        closeTab(tab) {
            if (tab.route === 'patient' && this.getHandlerForTab(tab)) {
                this.set('closingActiveTab', true);
            }
            return true;
        },
        willTransition() {
            // We only want to include the current tab in the transition history. This avoids the issue where
            // a tab has been removed but is still in the transition history.
            if (!this.get('closingActiveTab')) {
                this.set('transitionHistory', [ this.getChildHandler() ]);
            } else {
                this.set('transitionHistory', A());
                this.set('closingActiveTab', false);
            }
            return true;
        }
    },
    getHandlerForTab(tab) {
        // Instead of searching by route name (which will always be 'patient' for all tabs),
        // we will search based on the patient guid instead.
        return this.router._routerMicrolib.currentHandlerInfos.findBy('params.patient_guid', tab.arg1);
    }
});
