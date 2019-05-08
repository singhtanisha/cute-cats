import config from 'boot/config';
import StaticAdapter from 'common/adapters/static';

export default StaticAdapter.extend({
    hasPerformedFindAll: false,

    buildURL(type, id) {
        let url = `${config.defaultHost}/${config.immunizationNamespace}/immunizationRegistryConnection`;

        if (id) {
            url += `/${id}`;
        }

        return url;
    },

    findAll() {
        this.set('hasPerformedFindAll', true);

        return this._super(...arguments)
            .catch(() => {
                this.set('hasPerformedFindAll', false);
            });
    },

    createRecord(store, type, record) {
        const data = store.serializerFor(type.modelName).serialize(record);

        return this.ajax(this.buildURL(type.modelName), 'POST', { data });
    },

    updateRecord(store, type, snapshot) {
        const data = store.serializerFor(type.modelName).serialize(snapshot, { includeId: true });
        const url = this.buildURL(type.modelName, snapshot.id) + '/draft';

        return this.ajax(url, 'PUT', { data });
    },

    shouldReloadAll(store, snapshotRecordArray) {
        return !snapshotRecordArray.length && !this.get('hasPerformedFindAll');
    }
});
