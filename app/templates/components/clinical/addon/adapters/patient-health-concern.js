import ArrayProxy from '@ember/array/proxy';
import { computed } from '@ember/object';
import PFServer from 'boot/util/pf-server';
import config from 'boot/config';
import PatientPracticeGuidAdapter from 'clinical/adapters/patient-practice-guid';

export default PatientPracticeGuidAdapter.extend({
    noKnownCache: computed(function () {
        return {};
    }),
    buildURL(modelName, id, snapshot, requestType, query) {
        const patientPracticeGuid = requestType === 'query' ? query.patientPracticeGuid : snapshot.attr('patientPracticeGuid');
        const baseUrl = `${config.patientHeaderURL}${patientPracticeGuid}/patientHealthConcerns`;
        if (id) {
            return `${baseUrl}/${id}`;
        }
        return baseUrl;
    },
    query(store, type, query) {
        return this._super(store, type, query).then(data => {
            this.set(`noKnownCache.${query.patientPracticeGuid}`, data.meta && data.meta.noKnownHealthConcerns);
            return data;
        });
    },
    getCachedData(store, type, query) {
        const data = this._super(store, type, query);
        const result = ArrayProxy.create({
            content: data
        });
        result.set('meta', {
            noKnownHealthConcerns: this.get(`noKnownCache.${query.patientPracticeGuid}`)
        });
        return result;
    },
    removeHealthConcernByReferenceGuid(store, healthConcernReferenceGuid, healthConcerns) {
        const healthConcern = store.peekAll('patient-health-concern').findBy('healthConcernReferenceGuid', healthConcernReferenceGuid);
        if (healthConcern) {
            store.unloadRecord(healthConcern);
            if (healthConcerns) {
                healthConcerns.removeObject(healthConcern);
            }
        }
    },
    saveNoKnownValue(patientPracticeGuid, value) {
        const url = `${config.clinicalBaseURL}PatientConditions/${patientPracticeGuid}/NoKnownHealthConcerns`;
        const methodType = value ? 'POST' : 'DELETE';
        return PFServer.promise(url, methodType).then(() => this.set(`noKnownCache.${patientPracticeGuid}`, value));
    },
    clearNoKnownValue(patientPracticeGuid) {
        this.set(`noKnownCache.${patientPracticeGuid}`, false);
    }
});
