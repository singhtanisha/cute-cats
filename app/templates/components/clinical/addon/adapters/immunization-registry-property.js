import config from 'boot/config';
import LegacyAdapter from 'common/adapters/legacy';

export default LegacyAdapter.extend({
    query(store, type, query) {
        const id = query.immunizationRegistryGuid;
        const url = `${config.defaultHost}/${config.immunizationNamespace}/immunizationRegistry/${id}/properties`;

        return this.ajax(url, 'GET');
    }
});
