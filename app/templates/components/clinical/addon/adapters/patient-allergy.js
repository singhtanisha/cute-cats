import ArrayProxy from '@ember/array/proxy';
import { computed } from '@ember/object';
import PFServer from 'boot/util/pf-server';
import config from 'boot/config';
import PatientPracticeGuidAdapter from 'clinical/adapters/patient-practice-guid';

export default PatientPracticeGuidAdapter.extend({
    noKnownCache: computed(() => ({})),
    buildURL(modelName, id, snapshot, requestType, query) {
        const patientPracticeGuid = requestType === 'query' ? query.patientPracticeGuid : snapshot.attr('patientPracticeGuid');
        const baseUrl = `${config.clinicalBaseURL_v3}patients/${patientPracticeGuid}/allergies`;
        if (id) {
            return `${baseUrl}/${id}`;
        }
        return baseUrl;
    },
    query(store, type, query) {
        return this._super(store, type, query).then(data => {
            this.set(`noKnownCache.${query.patientPracticeGuid}`, data.noKnownAllergies);
            return data;
        });
    },
    getCachedData(store, type, query) {
        const data = this._super(store, type, query);
        const result = ArrayProxy.create({
            content: data
        });
        result.set('meta', {
            noKnownAllergies: this.get(`noKnownCache.${query.patientPracticeGuid}`)
        });
        return result;
    },
    saveNoKnownValue(patientPracticeGuid, value) {
        const url = `${config.clinicalBaseURL}PatientConditions/${patientPracticeGuid}/NoKnownAllergies`;
        const methodType = value ? 'POST' : 'DELETE';
        return PFServer.promise(url, methodType).then(() => this.set(`noKnownCache.${patientPracticeGuid}`, value));
    },
    clearNoKnownValue(patientPracticeGuid) {
        this.set(`noKnownCache.${patientPracticeGuid}`, false);
    }
});
