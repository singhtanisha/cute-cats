import { isPresent } from '@ember/utils';
import config from 'boot/config';
import RESTAdapter from 'ember-data/adapters/rest';

export default RESTAdapter.extend({
    host: config.defaultHost,
    namespace: config.chartingNamespace_v3,

    buildURL(modelName, query) {
        const patientPracticeGuid = query.patientPracticeGuid;
        const pageNumber = query.pageNumber;
        let url = `${config.defaultHost}/ChartingEndpoint/api/v3/patients/${patientPracticeGuid}/screeningsinterventionsandassessments/`;
        if (isPresent(pageNumber)) {
            url += `?pageNumber=${pageNumber}&pageSize=7`;
        }
        return url;
    },
    query(store, type, query) {
        return this.ajax(this.buildURL(type.modelName, query), 'GET').then(response => {
            response.query = query;
            return response;
        });
    }
});
