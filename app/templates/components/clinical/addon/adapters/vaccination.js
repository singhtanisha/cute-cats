import config from 'boot/config';
import LegacyAdapter from 'common/adapters/legacy';

export default LegacyAdapter.extend({
    buildURL(type, id) {
        return config.defaultHost + '/' + config.immunizationNamespace + '/vaccinations/' + id;
    },

    createRecord(store, type, record) {
        const data = store.serializerFor(type.modelName).serialize(record, { includeId: true });

        delete data.vaccineType.manufacturers;
        delete data.vaccineType.vaccineInventories;

        return this.ajax(this.buildURL(type.modelName, '00000000-0000-0000-0000-000000000000'), 'POST', { data });
    },

    deleteRecord(store, type, snapshot) {
        return this.ajax(this.buildURL(type, snapshot.id), 'DELETE')
            .then(() => {
                return;
            });
    },

    updateRecord(store, type, snapshot) {
        const data = store.serializerFor(type.modelName).serialize(snapshot, { includeId: true });
        const { id } = snapshot;

        if (snapshot.record.get('isDeleted') || snapshot.record.get('currentState.parentState.isDeleted')) {
            return this.deleteRecord(store, type, snapshot);
        }
        delete data.vaccineType.manufacturers;
        delete data.vaccineType.vaccineInventories;

        return this.ajax(this.buildURL(type.modelName, id), 'PUT', { data });
    }
});
