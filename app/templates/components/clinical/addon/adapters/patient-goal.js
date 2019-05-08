import config from 'boot/config';
import PatientPracticeGuidAdapter from 'clinical/adapters/patient-practice-guid';

export default PatientPracticeGuidAdapter.extend({
    buildURL(modelName, id, snapshot, requestType, query) {
        const patientPracticeGuid = requestType === 'query' ? query.patientPracticeGuid : snapshot.attr('patientPracticeGuid');
        const baseUrl = `${config.patientHeaderURL}${patientPracticeGuid}/patientGoals`;
        if (id) {
            return `${baseUrl}/${id}`;
        }
        return baseUrl;
    }
});
