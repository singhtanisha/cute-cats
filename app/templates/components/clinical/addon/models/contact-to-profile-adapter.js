/**
 * Takes an directory-contact model instace and adapts it to a common interface with 'provider-profile'
 * between providers and contacts
 */
import { alias } from '@ember/object/computed';

import EmberObject, { computed, get } from '@ember/object';
export default EmberObject.extend({
    directoryContact: null,
    isDirectoryContact: true,

    // Aliases
    id: alias('directoryContact.id'),
    firstName: alias('directoryContact.profile.firstName'),
    lastName: alias('directoryContact.profile.lastName'),
    fullProviderName: alias('directoryContact.fullProviderName'),
    specialtyName: alias('directoryContact.profile.specialization.classification'),
    specialtyId: alias('directoryContact.profile.specialization.specializationId'),

    specialty: computed('directoryContact.profile.specialization', {
        get() {
            return !this.get('specialtyId') ? null : {
                    id: this.get('specialtyId'),
                    specializationName: this.get('specialtyName')
                };
        },
        set(key, value) {
            value = value || {};
            this.set('directoryContact.profile.specialization', {
                specializationId: get(value, 'id'),
                classification: get(value, 'specializationName')
            });
            return value;
        }
    }),

    officePhone: alias('directoryContact.profile.frontOfficePhone'),
    fax: alias('directoryContact.profile.officeFax'),
    email: alias('directoryContact.profile.emailAddress'),
});
