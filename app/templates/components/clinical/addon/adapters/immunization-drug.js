import config from 'boot/config';
import LegacyAdapter from 'common/adapters/legacy';

export default LegacyAdapter.extend({
    buildURL(modelName, id) {
        return `${config.defaultHost}/${config.immunizationNamespace}/vaccines/search/details/vaccineType/${id}`;
    },
    query(store, type, query) {
        return this.ajax(this.buildURL(type.modelName, query.vaccineTypeGuid), 'GET');
    }
});
