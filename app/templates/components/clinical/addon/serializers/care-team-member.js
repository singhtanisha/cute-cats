import CareTeamSerializer from 'clinical/serializers/care-team';
/**
 * Serializes a single teamMember, but the response goes through the same serialization for a full care-team
 */
export default CareTeamSerializer.extend({
    serialize(snapshot) {
        return {
            providerProfileGuid: snapshot.record.get('id'),
            relationships: snapshot.record.get('relationships')
        };
    },
});
