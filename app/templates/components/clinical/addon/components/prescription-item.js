import { isPresent, isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import Component from '@ember/component';
export default Component.extend({
    erxProviders: null,
    prescription: null,

    providerName: computed('prescription.prescribingProviderGuid', 'erxProviders.[]', function() {
        let erxProviders = this.get('erxProviders') || [],
            providerGuid = this.get('prescription.prescribingProviderGuid'),
            provider;

        if (isPresent(providerGuid)) {

            // Try to match with an erx provider to obtain vetted degree
            provider = erxProviders.findBy('providerGuid', providerGuid);

            // Default to unvetted degree
            if (isEmpty(provider)) {
                provider = this.store.peekRecord('provider', providerGuid);

                if (isPresent(provider)) {
                    return provider.get('providerName');
                }
            } else {
                return provider.get('providerNameWithDegree');
            }
        }

        return null;
    }),
    prescriptionStatusDisplay: computed('prescription.prescriptionStatus', function () {
        const status = (this.get('prescription.prescriptionStatus')|| '').toLowerCase();
        if (isEmpty(status)) {
            return '';
        }
        switch(status) {
            case 'change requested':
            return ' (awaiting response)';
            case 'refillrequested':
            return ' (refill request)';
            default:
            return ` (${status})`;
        }
    })
});
