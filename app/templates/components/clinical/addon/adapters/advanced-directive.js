import { capitalize, camelize } from '@ember/string';
import config from 'boot/config';
import LegacyAdapter from 'common/adapters/legacy';

export default LegacyAdapter.extend({
    host: config.defaultHost,
    namespace: config.chartingNamespace_v2,
    pathForType(type) {
        return capitalize(camelize(type));
    },
    query(store, type, query) {
        return this.ajax(this.buildURL(type.modelName, query.patientPracticeGuid), 'GET');
    }
});
