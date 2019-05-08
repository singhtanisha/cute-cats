import config from 'boot/config';
import LegacyAdapter from 'common/adapters/legacy';

export default LegacyAdapter.extend({
    buildURL(type, id) {
        if (id) {
            return config.defaultHost + '/' + config.immunizationNamespace + '/vaccineInventories/' + id;
        } else {
            return config.defaultHost + '/' + config.immunizationNamespace + '/practiceVaccineInventories';
        }
    },

    createRecord(store, type, snapshot) {
        const data = store.serializerFor(type.modelName).serialize(snapshot, { includeId: true });

        return this.ajax(this.buildURL(type.modelName, '00000000-0000-0000-0000-000000000000'), 'POST', { data });
    },

    updateRecord(store, type, snapshot) {
        const data = store.serializerFor(type.modelName).serialize(snapshot, { includeId: true });
        const { id } = snapshot;

        return this.ajax(this.buildURL(type.modelName, id), 'PUT', { data: data });
    }
});
