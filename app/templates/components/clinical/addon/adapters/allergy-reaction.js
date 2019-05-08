import config from 'boot/config';
import StaticAdapter from 'common/adapters/static';

export default StaticAdapter.extend({
    buildURL() {
        return `${config.clinicalBaseURL_v3}allergyreactions`;
    }
});
