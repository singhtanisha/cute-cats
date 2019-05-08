import config from 'boot/config';
import LegacyAdapter from 'common/adapters/legacy';

export default LegacyAdapter.extend({
    buildURL(type, id) {
        return `${config.clinicalDocumentBaseURL}/ccda/patient/${id}/list?pageIndex=0&pageSize=100`;
    },
    query(store, type, query) {
        var url = this.buildURL(type.modelName, query.patientPracticeGuid);
        return this.ajax(url, 'GET');
    }
});
