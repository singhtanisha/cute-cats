import { alias } from '@ember/object/computed';
import EmberObject, { computed } from '@ember/object';
import Order from 'labs/models/order';

export default EmberObject.extend({
    labDisplayName: null,
    orderGuid: null,
    orderNumber: null,
    preview: null,
    requestingProviderName: null,
    tests: computed(() => []),
    history: computed(() => []),

    currentStatus: alias('history.0.statusDisplayText'),

    isDiagnostic: computed('preview.filterType', function() {
        var filterType = this.get('preview.filterType');

        return filterType && filterType.toLowerCase() === 'laborder';
    }),

    labDescription: computed('isDiagnostic', function() {
        return this.get('isDiagnostic') ? 'Laboratory' : 'Imaging Center';
    }),

    serviceDescription: computed('isDiagnostic', function() {
        return this.get('isDiagnostic') ? 'Tests' : 'Studies';
    }),

    load() {
        return Order.getOrderHistory(this.get('orderGuid'))
            .then(function(history) {
                this.set('history', history);
                return this;
            }.bind(this));
    }
});
