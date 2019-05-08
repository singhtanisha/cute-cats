import { readOnly } from '@ember/object/computed';
import { computed } from '@ember/object';
import Model from 'ember-data/model';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
    // id: maps to patientPracticeGuid
    members: hasMany('care-team-member', { async: false }),
    preferredProvider: computed('members.@each.relationships', function () {
        return this.get('members').find(function (member) {
            return member.get('relationships').isAny('careTeamMemberType', 'PreferredProvider');
        });
    }),
    primaryProvider: computed('members.@each.relationships', function () {
        return this.get('members').find(function (member) {
            return member.get('relationships').isAny('careTeamMemberType', 'PrimaryCareProvider');
        });
    }),
    preferredProviderGuid: readOnly('preferredProvider.profile.providerProfile.providerGuid')
});
