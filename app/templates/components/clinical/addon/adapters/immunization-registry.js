import config from 'boot/config';
import StaticAdapter from 'common/adapters/static';

export default StaticAdapter.extend({
    host: config.defaultHost,
    namespace: config.immunizationNamespace
});
