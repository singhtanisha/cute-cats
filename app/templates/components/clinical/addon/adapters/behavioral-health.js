import config from 'boot/config';
import RESTAdapter from 'ember-data/adapters/rest';

export default RESTAdapter.extend({
    host: config.defaultHost,

    buildURL(modelName, patientPracticeGuid) {
        return `${config.clinicalBaseURL_v3}patients/${patientPracticeGuid}/behavioralhealth`;
    },
    findRecord(store, type, id) {
        return this.ajax(this.buildURL(type.modelName, id), 'GET');
    }
});
