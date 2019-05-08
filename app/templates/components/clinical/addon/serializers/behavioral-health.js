import { isEmpty } from '@ember/utils';
import RESTSerializer from 'ember-data/serializers/rest';

export default RESTSerializer.extend({
    primaryKey: 'patientPracticeGuid',
    normalizeResponse(store, type, payload, id, requestType) {
        payload.nutritionHistory = {
            description: payload.nutritionHistory,
            id: 'nutritionHistory',
        };
        payload.nutritionHistory = {
            content: payload.nutritionHistory,
            worksheet: {
                sectionName: 'nutritionHistory'
            },
            isEmpty: isEmpty(payload.nutritionHistory.description)
        };
        payload.tobaccoUse = {
            content: payload.tobaccoUse,
            worksheet: {
                sectionName: 'tobaccoUse'
            },
            isEmpty: isEmpty(payload.tobaccoUse)
        };
        payload.alcoholUse.id = payload.alcoholUse.worksheetGuid;
        payload.alcoholUse = {
            content: payload.alcoholUse,
            worksheet: {
                worksheetGuid: payload.alcoholUse.worksheetGuid,
                worksheetName: 'alcoholUseWorksheet'
            },
            isEmpty: isEmpty(payload.alcoholUse.worksheetResponseGuid)
        };
        payload.physicalActivity.id = payload.physicalActivity.worksheetGuid;
        payload.physicalActivity = {
            content: payload.physicalActivity,
            worksheet: {
                worksheetGuid: payload.physicalActivity.worksheetGuid,
                worksheetName: 'physicalActivityWorksheet'
            },
            isEmpty: isEmpty(payload.physicalActivity.worksheetResponseGuid)
        };
        payload.stress.id = payload.stress.worksheetGuid;
        payload.stress = {
            content: payload.stress,
            worksheet: {
                worksheetGuid: payload.stress.worksheetGuid,
                worksheetName: 'stressWorksheet'
            },
            isEmpty: isEmpty(payload.stress.worksheetResponseGuid)
        };
        payload.socialIsolation.id = payload.socialIsolation.worksheetGuid;
        payload.socialIsolation = {
            content: payload.socialIsolation,
            worksheet: {
                worksheetGuid: payload.socialIsolation.worksheetGuid,
                worksheetName: 'socialIsolationWorksheet'
            },
            isEmpty: isEmpty(payload.socialIsolation.worksheetResponseGuid)
        };
        payload.exposureToViolence.id = payload.exposureToViolence.worksheetGuid;
        payload.exposureToViolence = {
            content: payload.exposureToViolence,
            worksheet: {
                worksheetGuid: payload.exposureToViolence.worksheetGuid,
                worksheetName: 'exposureToViolenceWorksheet'
            },
            isEmpty: isEmpty(payload.exposureToViolence.worksheetResponseGuid)
        };

        payload = {
            'behavioral-health': payload
        };
        return this._super(store, type, payload, id, requestType);
    },
});
