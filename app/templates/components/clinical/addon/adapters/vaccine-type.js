import config from 'boot/config';
import LegacyAdapter from 'common/adapters/legacy';

export default LegacyAdapter.extend({
    buildURL(type, id, searchTypeCode) {
        return `${config.defaultHost}/${config.immunizationNamespace}/vaccines/search/details/${searchTypeCode}/${id}`;
    },

    query(store, type, query) {
        return this.ajax(this.buildURL(type.modelName, query.searchGuid, query.searchTypeCode), 'GET').then(response => {
            // Ember data id conflict in 2 different queries caused data issues. This prevents id collision
            if (query.obfuscateId) {
                response.vaccineType.modifiedVaccineTypeGuid = `obfuscated-${response.vaccineType.vaccineTypeGuid}`;
            }
            return response;
        });
    },

    queryRecord(store, type, query) {
        return this.ajax(this.buildURL(type.modelName, query.searchGuid, query.searchTypeCode), 'GET');
    }
});
