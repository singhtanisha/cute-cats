import config from 'boot/config';
import LegacyAdapter from 'common/adapters/legacy';

export default LegacyAdapter.extend({
    buildURL(type, id) {
        return `${config.defaultHost}/${config.immunizationNamespace}/patients/${id}/immunizationHistory`;
    },

    query(store, type, query) {
        return this.ajax(this.buildURL(type.modelName, query.patientPracticeGuid), 'GET');
    }
});
