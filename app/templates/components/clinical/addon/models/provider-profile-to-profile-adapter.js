/**
 * Takes a provider-profile model instace and adapts it to a common interface with 'directory-contact'
 * between providers and contacts
 */
import { isEmpty } from '@ember/utils';

import { alias } from '@ember/object/computed';
import EmberObject, { computed } from '@ember/object';
export default EmberObject.extend({
    providerProfile: null,
    specialties: null,
    isProviderProfile: true,

    // Aliases
    id: alias('providerProfile.profileGuid'),
    // NOTE: intentionally didn't use computed.alias to make the props immutable
    firstName: computed('providerProfile.firstName', function () {
        return this.get('providerProfile.firstName');
    }),
    lastName: computed('providerProfile.lastName', function () {
        return this.get('providerProfile.lastName');
    }),
    fullProviderName: computed('providerProfile.fullProviderName', function () {
        return this.get('providerProfile.fullProviderName');
    }),
    specialty: computed('providerProfile.primarySpecialization', 'specialties', function () {
        const specialtyId = this.get('providerProfile.primarySpecialization');
        if (isEmpty(specialtyId)) {
            return null;
        }
        return this.get('specialties').findBy('id', specialtyId.toString());
    }),
    specialtyId: computed('specialty', function () {
        return this.get('specialty.id');
    }),
    specialtyName: computed('specialty', function () {
        return this.get('specialty.specializationName');
    }),
    officePhone: computed('providerProfile.officePhone', function () {
        return this.get('providerProfile.officePhone');
    }),
    fax: '',
    email: computed('providerProfile.email', function () {
        return this.get('providerProfile.email');
    })
});
