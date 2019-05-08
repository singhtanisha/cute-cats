import { isPresent } from '@ember/utils';
import { get } from '@ember/object';
import RESTSerializer from 'ember-data/serializers/rest';
import DS from 'ember-data';

export default RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
    attrs: {
        education: { embedded: 'always' },
        financialResourceStatus: { embedded: 'always' },
        genderIdentity: { embedded: 'always' },
        sexualOrientation: { embedded: 'always' },
        socialHistory: { embedded: 'always' }
    },

    normalize(type, hash) {
        const socialHealthFieldNames = get(type, 'relationshipNames').belongsTo;
        const socialHealthFields = socialHealthFieldNames.map((fieldName) => {
            let fieldHash;

            switch (fieldName) {
                case 'socialHistory':
                    fieldHash = {
                        description: hash[fieldName] || ''
                    };
                    break;
                case 'education':
                case 'financialResourceStatus':
                    fieldHash = hash[fieldName] || {};
                    fieldHash.supportsEffectiveDate = true;
                    break;
                default:
                    fieldHash = hash[fieldName] || {};
                    break;
            }

            fieldHash.id = `${hash.id}-${fieldName}`;

            return fieldHash;
        });
        const socialHealthHash = _.object(socialHealthFieldNames, socialHealthFields);

        socialHealthHash.id = hash.id;

        return this._super(type, socialHealthHash);
    },

    normalizeResponse(store, type, payload, id, requestType) {
        const socialHealthPayload = {
            'social-health': payload
        };

        return this._super(store, type, socialHealthPayload, id, requestType);
    },

    serialize(snapshot) {
        const json = {
            id: snapshot.id
        };

        snapshot.eachRelationship((fieldName) => {
            if (isPresent(snapshot.record.get(`${fieldName}.content`))) {
                json[fieldName] = snapshot.belongsTo(fieldName).serialize();

                if (fieldName === 'socialHistory') {
                    json.socialHistory = json.socialHistory.description;
                }
            }
        });

        return json;
    }
});
