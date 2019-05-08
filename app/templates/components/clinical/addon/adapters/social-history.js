import { get } from '@ember/object';
import { merge } from '@ember/polyfills';
import config from 'boot/config';
import LegacyAdapter from 'common/adapters/legacy';
import pfServer from 'boot/util/pf-server';

export default LegacyAdapter.extend({
    pathForType(type) {
        return type.classify();
    },
    buildURL(modelName, patientPracticeGuid) {
        return `${config.defaultHost}/${config.patientNamespaceV3}/patients/patientDemographic/${patientPracticeGuid}`;
    },
    buildDemographicURL(patientPracticeGuid, demographicName) {
        return `${config.defaultHost}/${config.patientNamespaceV3}/patients/${demographicName}/${patientPracticeGuid}`;
    },
    findRecord(store, type, id) {
        return this.ajax(this.buildURL(type.modelName, id), 'GET').then(payload => merge(payload, { patientPracticeGuid: id }));
    },
    updateRecord(store, type, snapshot) {
        let data = store.serializerFor(type.modelName).serialize(snapshot, { includeId: true });
        const patientPracticeGuid = snapshot.id;
        const fieldName = get(snapshot, 'adapterOptions.fieldName');
        
        if (fieldName) {
            data = { 
                [fieldName]: data[fieldName], 
                'patientPracticeGuid': data['patientPracticeGuid'] 
            };
        }
        
        return this.ajax(this.buildURL(type.modelName, patientPracticeGuid), 'PUT', { data }).then(payload => merge(payload, { patientPracticeGuid }));
    },
    createRecord(store, type, snapshot) {
        const data = store.serializerFor(type.modelName).serialize(snapshot, { includeId: false });
        const patientPracticeGuid = snapshot.id;

        return this.ajax(this.buildURL(type.modelName, patientPracticeGuid), 'POST', { data }).then(payload => merge(payload, { patientPracticeGuid }));
    },
    deleteDemographic(record, demographicToDelete) {
        const patientPracticeGuid = record.get('patientPracticeGuid');
        // This needs to use pfServer for now since the API is crap and returns 200 with no content (should be 204). The .ajax call blows up in that scenario :(
        return pfServer.promise(this.buildDemographicURL(patientPracticeGuid, demographicToDelete), 'DELETE');
    }
});
