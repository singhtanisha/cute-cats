import RESTSerializer from 'ember-data/serializers/rest';

export default RESTSerializer.extend({
    primaryKey: 'transcriptEventGuid',
    patientPracticeGuid: null,

    normalizeResponse(store, primaryModelClass, payload, id, requestType) {
        const data = payload.transcriptEvents;
        this.set('patientPracticeGuid', payload.query.patientPracticeGuid);
        delete payload.transcriptEvents;
        payload['patient-summary-sias'] = data;
        return this._super(store, primaryModelClass, payload, id, requestType);
    },
    normalize(model, hash, prop) {
        hash.patientPracticeGuid = this.get('patientPracticeGuid');
        return this._super(model, hash, prop);
    },
});
