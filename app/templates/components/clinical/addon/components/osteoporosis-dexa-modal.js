
import { inject as service } from '@ember/service';
import Component from '@ember/component';
export default Component.extend({
    routing: service('pf-routing'),
    analytics: service(),
    isVisible: false,
    isOrderVisible: true,
    _track(details) {
        this.get('analytics').track(details);
    },
    actions: {
        goToAddImagingOrder() {
            this._track('Order DXA Clicked');
            this.get('routing').transitionToRoute('orders.new', 'imaging');
            this.set('isVisible', false);
        },
        goToAddImagingResult() {
            this._track('Enter DXA Result Clicked');
            // Disabling the task given it wasn't included in the MLR
            this.get('routing').transitionToRoute('results.new', 'imaging', { queryParams: { showOsteoporosisDexaTask: false } });
            this.set('isVisible', false);
        },
        closeOsteoporosisModal() {
            this.set('isVisible', false);
        }
    }
});
