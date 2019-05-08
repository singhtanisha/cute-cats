import { computed } from '@ember/object';import RESTAdapter from 'ember-data/adapters/rest';

export default RESTAdapter.extend({
    cachedPatients: computed(function () {
        return {};
    }),
    query(store, type, query) {
        const { patientPracticeGuid } = query;
        const cacheKey = `cachedPatients.${patientPracticeGuid}`;
        const url = this.buildURL(type.modelName, null, null, 'query', query);
        this.set(cacheKey, false);
        return this.ajax(url, 'GET').then(data => {
            this.set(cacheKey, true);
            if (query.forceReload) {
                this.getCachedData(store, type, query).forEach(record => store.unloadRecord(record));
            }
            return data;
        });
    },
    getCachedData(store, type, query) {
        return store.peekAll(type.modelName).filterBy('patientPracticeGuid', query.patientPracticeGuid);
    },
    needsRefresh(store, type, query) {
        if (query) {
            return query.forceReload || !this.get(`cachedPatients.${query.patientPracticeGuid}`);
        }
        return true;
    }
});
