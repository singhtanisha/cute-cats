import config from 'boot/config';
import LegacyAdapter from 'common/adapters/legacy';

export default LegacyAdapter.extend({
    buildURL(type, id) {
        return `${config.patientInfoURL}${id}/patientRibbonInfo`;
    }
});
