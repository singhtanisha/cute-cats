import config from 'boot/config';
import LegacyAdapter from 'common/adapters/legacy';

export default LegacyAdapter.extend({
    query(store, type, query) {
        var url = config.defaultHost + '/' + config.immunizationNamespace + '/vaccineInventoryLotUsage/' + query.vaccineInventoryGuid;

        return this.ajax(url, 'GET');
    }
});
