import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, get, observer, set } from '@ember/object';
import { isPresent } from '@ember/utils';

export default Component.extend({
    facilities: computed(() => []),
    isElectronicTransmission: computed(() => false),
    model: computed(() => null),
    rejectionReasons: null,

    rejectionReason: alias('model.rejectionReason'),

    knownFacilities: computed('facilities', function () {
        return (get(this, 'facilities') || []).rejectBy('name', 'Unknown');
    }),
    showEndDate: computed('rejectionReason.isExpirable', 'model.rejectionReasonExpirationDate', 'isAddingImmunization', function () {
        const isExpirable = get(this, 'rejectionReason.isExpirable');
        if (get(this, 'isAddingImmunization')) {
            return isExpirable;
        }
        return isExpirable || isPresent(get(this, 'model.rejectionReasonExpirationDate'));
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
