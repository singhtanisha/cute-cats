import RESTSerializer from 'ember-data/serializers/rest';
import DS from 'ember-data';

export default RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
    attrs: {
        immunizationFundingSources: { embedded: 'always' },
        notificationPreferences: { embedded: 'always' },
        rejectionReasons: { embedded: 'always' },
        routes: { embedded: 'always' },
        sites: { embedded: 'always' },
        sources: { embedded: 'always' },
        vaccinationAdverseReactions: { embedded: 'always' },
        vaccinationScheduleSpecialIndications: { embedded: 'always' },
        vaccinationUnits: { embedded: 'always' },
        vfcStatuses: { embedded: 'always' },
        visConcepts: { embedded: 'always' }
    },

    normalizeResponse(store, type, payload) {
        let relationships;

        payload.id = 1;

        payload = {
            'vaccine-lookup-datum': [payload]
        };

        payload = this._super(...arguments);

        relationships = _.groupBy(payload.included, (relationship) => relationship.type);

        payload.data = {
            id: 1,
            type: type.modelName,
            attributes: {
                id: 1
            },
            relationships: {
                immunizationFundingSources: {
                    data: this.getRelationshipDataForType('immunization-funding-source', relationships)
                },
                notificationPreferences: {
                    data: this.getRelationshipDataForType('immunization-registry-notification-preference', relationships)
                },
                rejectionReasons: {
                    data: this.getRelationshipDataForType('vaccination-rejection', relationships)
                },
                routes: {
                    data: this.getRelationshipDataForType('vaccination-route', relationships)
                },
                sites: {
                    data: this.getRelationshipDataForType('vaccination-site', relationships)
                },
                sources: {
                    data: this.getRelationshipDataForType('vaccination-source', relationships)
                },
                vaccinationAdverseReactions: {
                    data: this.getRelationshipDataForType('vaccination-reaction', relationships)
                },
                vaccinationScheduleSpecialIndications: {
                    data: this.getRelationshipDataForType('vaccination-indication', relationships)
                },
                vaccinationUnits: {
                    data: this.getRelationshipDataForType('vaccination-unit', relationships)
                },
                vfcStatuses: {
                    data: this.getRelationshipDataForType('vfc-status', relationships)
                },
                visConcepts: {
                    data: this.getRelationshipDataForType('vis-concept', relationships)
                }
            }
        };

        return payload;
    },

    modelNameFromPayloadKey(key) {
        switch (key) {
            case 'immunizationFundingSources':
                return 'immunization-funding-source';
            case 'notificationPreferences':
                return 'immunization-registry-notification-preference';
            case 'rejectionReasons':
                return 'vaccination-rejection';
            case 'routes':
                return 'vaccination-route';
            case 'sites':
                return 'vaccination-site';
            case 'sources':
                return 'vaccination-source';
            case 'vaccinationAdverseReactions':
                return 'vaccination-reaction';
            case 'vaccinationScheduleSpecialIndications':
                return 'vaccination-indication';
            case 'vaccinationUnits':
                return 'vaccination-unit';
            case 'vfcStatuses':
                return 'vfc-status';
            case 'visConcepts':
                return 'vis-concept';
            case 'id':
                return 'vaccine-lookup-datum';
            default:
                return this._super(...arguments);
        }
    },

    getRelationshipDataForType(modelName, relationships) {
        return (relationships[modelName] || []).map((relationship) => {
            return { id: relationship.id, type: modelName };
        });
    }
});
