import config from 'boot/config';
import InfrequentAdapter from 'common/adapters/infrequent';

export default InfrequentAdapter.extend({
    buildURL() {
        return `${config.patientBaseURLV3}/patients/demographicOptionLists?list=so&list=gi&list=risk`;
    }
});
