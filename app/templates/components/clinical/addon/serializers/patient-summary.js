import { isEmpty } from '@ember/utils';
const fieldsToEmpty = ['emailAddress', 'homePhone', 'mobilePhone', 'workPhone', 'primaryInsurancePlan'];
import RESTSerializer from 'ember-data/serializers/rest';

export default RESTSerializer.extend({
    primaryKey: 'patientPracticeGuid',

    normalize(typeClass, hash) {
        // Rollback will only revert fields that were received from services.
        // patientRibbonInfo doesn't include empty fields, so we'll set them to null here.
        fieldsToEmpty.forEach(function(key) {
            if (!hash.hasOwnProperty(key)) {
                hash[key] = null;
            }
        });
        const relationships = {
            genderOption: {
                data: { type: 'gender-option', id: hash.gender }
            }
        };
        const normalizedHash = {
            data: {
                id: hash.patientPracticeGuid,
                type: typeClass.modelName,
                attributes: hash,
                relationships
            }
        };
        if (hash.pinnedPatientNote) {
            relationships.pinnedPatientNote = {
                data: { type: 'patient-note', id: hash.patientPracticeGuid }
            };
            normalizedHash.included = [{
                type: 'patient-note',
                id: hash.patientPracticeGuid,
                attributes: hash.pinnedPatientNote
            }];
            delete hash.pinnedPatientNote;
        }

        return normalizedHash;
    },
    normalizeResponse(store, type, payload, id, requestType) {
        const record = store.peekRecord('patient-note', id);

        if (record && isEmpty(payload.pinnedPatientNote)) {
            store.unloadRecord(record);
        }
        payload = {
            'patient-summary': payload
        };

        return this._super(store, type, payload, id, requestType);
    }
});
