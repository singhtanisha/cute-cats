import config from 'boot/config';
import LegacyAdapter from 'common/adapters/legacy';

export default LegacyAdapter.extend({
    query(store, type, query) {
        const url = this.buildURL(type.modelName, query.id);
        return this.ajax(url, 'GET');
    },
    buildURL(type, id) {
        return `${config.clinicalBaseURL}FamilyHealthHistory/${id}/relationships`;
    }
});
