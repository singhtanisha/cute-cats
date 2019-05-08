import config from 'boot/config';
import LegacyAdapter from 'common/adapters/legacy';

export default LegacyAdapter.extend({
    buildURL(modelName, id) {
        return `${config.defaultHost}/${config.immunizationV2Namespace}/patients/${id}/transmissionstatus`;
    },
    query(store, type, query) {
        return this.ajax(this.buildURL(type.modelName, query.patientPracticeGuid), 'GET');
    }
});
