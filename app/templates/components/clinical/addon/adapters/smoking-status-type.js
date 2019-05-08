import config from 'boot/config';
import LegacyAdapter from 'common/adapters/legacy';

export default LegacyAdapter.extend({
    buildURL() {
        return `${config.clinicalBaseURL_v3}smokingstatuses?version=3`;
    }
});
