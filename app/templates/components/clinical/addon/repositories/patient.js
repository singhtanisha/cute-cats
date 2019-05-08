import config from 'boot/config';
import PFServer from 'boot/util/pf-server';

export default {
    updatePatientEmail(data, patientPracticeGuid) {
        const url = this._buildURL(patientPracticeGuid);
        return PFServer.promise(url, 'PUT', data);
    },

    _buildURL(id) {
        let url = `${config.patientRibbonURL}/email`;
        if (id) {
            // Should this move to a PatientSummaryAdapter?
            if (url.match(/:patientPracticeGUID/)) {
                url = url.replace(/:patientPracticeGUID/, id);
            } else {
                url += id;
            }
        }
        return url;
    }
};
