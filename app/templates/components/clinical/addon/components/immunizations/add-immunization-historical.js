import Component from '@ember/component';
import { computed, get, observer, set } from '@ember/object';

export default Component.extend({
    errors: computed(() => null),
    facilities: computed(() => []),
    isElectronicTransmission: computed(() => false),
    model: computed(() => null),
    historicalSources: computed(() => null),

    knownFacilities: computed('facilities', function () {
        return (get(this, 'facilities') || []).rejectBy('name', 'Unknown');
    }),
    vaccinationSources: computed('reference.vaccinationSources', function () {
        return (get(this, 'reference.vaccinationSources') || []).filterBy('isHistoricalActive');
    }),

    facilityGuidChanged: observer('model.facilityGuid', function () {
        const facilities = get(this, 'knownFacilities') || [];
        set(this, 'selectedFacility', facilities.findBy('facilityGuid', get(this, 'model.facilityGuid')));
    }),

    init() {
        this._super();
        this.facilityGuidChanged();
    },

    actions: {
        selectFacility(facility) {
            set(this, 'model.facilityGuid', get(facility, 'facilityGuid'));
        }
    }
});
