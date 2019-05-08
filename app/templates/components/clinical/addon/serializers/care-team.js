import { assert } from '@ember/debug';
import ContactToProfileAdapter from 'clinical/models/contact-to-profile-adapter';
import ProviderProfileToProfileAdapter from 'clinical/models/provider-profile-to-profile-adapter';

const relationshipTypeMap = {
    PreferredProvider: 'Preferred provider in practice',
    BackupProvider: 'Backup provider in practice',
    PrimaryCareProvider: 'Primary care provider (PCP)',
    ReferringProvider: 'Referring provider',
    Other: 'Other provider'
};
function relationshipDisplayName(type, description) {
    let display = relationshipTypeMap[type];
    if (type === 'Other' && description) {
        display += ` (${description})`;
    }
    return display;
}

import RESTSerializer from 'ember-data/serializers/rest';

export default RESTSerializer.extend({
    isNewSerializerAPI: true,
    /**
     * Converts a payload from careteam/members into a structure that maps to models/care-team-members
     * expects a payload with practiceProviders, contacts and a careTeamMember object for each "patientRelationship"
     * [
     *   {
     *     "patientPracticeGuid": "e5c0f82f-ae70-4bc6-b889-ad26d22a2aa2",
     *     "providerUserProfileGuid": "d7784e0c-2fb1-4e01-af3b-cd11070babc7",
     *     "careTeamMemberType": "PrimaryCareProvider",
     *     "description": null
     *   },
     *   {
     *     "patientPracticeGuid": "e5c0f82f-ae70-4bc6-b889-ad26d22a2aa2",
     *     "providerUserProfileGuid": "d7784e0c-2fb1-4e01-af3b-cd11070babc7",
     *     "careTeamMemberType": "PreferredProvider",
     *     "description": "foobar"
     *   },
     *   {
     *     "patientPracticeGuid": "e5c0f82f-ae70-4bc6-b889-ad26d22a2aa2",
     *     "providerUserProfileGuid": "d7784e0c-2fb1-4e01-af3b-cd11070babc7",
     *     "careTeamMemberType": "Other",
     *     "description": "barfoo"
     *   }
     * ]
     */
    normalizeResponse(store, primaryModelClass, payload, id, requestType) {
        const { patientPracticeGuid } = payload;
        const uniqProfileGuids = payload.members.mapBy('providerUserProfileGuid').uniq();
        const careTeamProfiles = uniqProfileGuids.map(profileGuid => {
            const practiceProvider = payload.practiceProviders.findBy('profileGuid', profileGuid);
            if (practiceProvider) {
                return ProviderProfileToProfileAdapter.create({ providerProfile: practiceProvider, specialties: payload.specialties });
            }
            // It's not a practiceProvider, try to match a contact and adapt it to use a common interface
            const contact = payload.contacts.findBy('id', profileGuid);
            assert(`${profileGuid} didn't match a provider or contact`, contact);
            return contact ? ContactToProfileAdapter.create({ directoryContact: contact }) : null;
        }).compact();
        const careTeamMembers = careTeamProfiles.map(profile => {
            const profileGuid = profile.get('id');
            const relationships = payload.members.filterBy('providerUserProfileGuid', profileGuid).map(relationship => {
                return {
                    careTeamMemberType: relationship.careTeamMemberType,
                    description: relationship.description,
                    display: relationshipDisplayName(relationship.careTeamMemberType, relationship.description)
                };
            });
            return {
                // This is needed by ember-data and not provided by the backend
                id: profileGuid,
                patientPracticeGuid,
                profile,
                relationships
            };
        });

        const normalizedPayload = {
            careTeam: {
                id: patientPracticeGuid,
                members: careTeamMembers.mapBy('id')
            },
            careTeamMembers
        };
        return this._super(store, primaryModelClass, normalizedPayload, id, requestType);
    }
});
