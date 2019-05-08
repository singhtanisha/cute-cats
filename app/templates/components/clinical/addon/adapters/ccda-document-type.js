import config from 'boot/config';
import StaticAdapter from 'common/adapters/static';

export default StaticAdapter.extend({
    buildURL() {
        const baseUrl = config.defaultHost + config.clinicalDocumentBaseURL_v2;

        return `${baseUrl}/ccda/documentTypes/`;
    }
});
