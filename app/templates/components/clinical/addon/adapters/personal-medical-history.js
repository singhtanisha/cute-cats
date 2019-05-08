import config from 'boot/config';
import LegacyAdapter from 'common/adapters/legacy';

export default LegacyAdapter.extend({
    namespace: config.clinicalNamespace_v2,
    host: config.defaultHost,
    pathForType(type) {
        return type.classify();
    }
});
