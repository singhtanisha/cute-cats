import config from 'boot/config';
import LegacyAdapter from 'common/adapters/legacy';

export default LegacyAdapter.extend({
    buildURL(type, id) {
        var url = config.chartingURL + 'Access';
        if (id) {
            url += '/Provider/' + id;
        }
        return url + '/Recent';
    },
    query(store, type, query) {
        var url = this.buildURL(type.modelName, query.providerGuid);
        delete query.providerGuid;
        return this.ajax(url, 'GET', { data: query });
    }
});
