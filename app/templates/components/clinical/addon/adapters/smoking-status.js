import config from 'boot/config';
import LegacyAdapter from 'common/adapters/legacy';

export default LegacyAdapter.extend({
    buildURL(modelName, id, snapshot, requestType, query) {
        const patientPracticeGuid = snapshot ? snapshot.attr('patientPracticeGuid') : query.patientPracticeGuid;
        let url = `${config.clinicalBaseURL_v2}patients/${patientPracticeGuid}/smokingstatuses`;
        if (id) {
            url = `${url}/${id}`;
        }
        // version is userd in createRecord, updateRecord, deleteRecord
        if (snapshot && snapshot.adapterOptions && snapshot.adapterOptions.version) {
            url = `${url}?version=${snapshot.adapterOptions.version}`;
        }
        return url;
    },
    query(store, type, query) {
        return this.ajax(this.buildURL(type.modelName, null, null, 'query', query), 'GET');
    }
});
