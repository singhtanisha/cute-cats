import config from 'boot/config';
import LegacyAdapter from 'common/adapters/legacy';

export default LegacyAdapter.extend({
    buildURL(modelName, id, snapshot, requestType, query) {
        return `${config.defaultHost}/${config.immunizationV2Namespace}/patients/${query.patientPracticeGuid}/query`;
    },
    queryRecord(store, type, query) {
        const queryId = `${query.registryName}|${moment.utc()}`;
        const isAdvanced = query.isAdvancedVisible;
        const url = this.buildURL(type.modelName, queryId, null, null, query);
        const data = {
            facilityGuid: query.facilityGuid,
            immunizationRegistryGuid: query.registryGuid,
            patientFilters: query.patientFilters.serialize(isAdvanced),
            registryName: query.registryName
        };
        return this.ajax(url, 'POST', { data }).then(response => {
            response.resultId = queryId;
            response.patientFilters.id = queryId;
            if (response.error) {
                const error = {
                    error: response.error,
                    errorMessage: response.errorMessage
                };
                throw error;
            }
            return response;
        });
    }
});
