import { copy } from '@ember/object/internals';
import Mirage from 'ember-cli-mirage';
import { module, test } from 'qunit';
import setupStore from 'boot/tests/helpers/store';
import PatientHealthConcern from 'clinical/models/patient-health-concern';
import PatientHealthConcernAdapter from 'clinical/adapters/patient-health-concern';
import PatientHealthConcernSerializer from 'clinical/serializers/patient-health-concern';
import { startMirage } from 'boot/initializers/ember-cli-mirage';

const PATIENT_PRACTICE_GUID = 'c5faffde-78e2-4924-acaf-2115bc686d5e';
const ALLERGY_GUID = '9b3a4fa4-5970-4bcc-a3be-96e8b45710e3';
const ALLERGY_CONCERN_GUID = 'b6fe8d6f-5cf1-4db3-ab4f-7ab8d7b1d131';
const DIAGNOSIS_GUID = '9b3a4fa4-5970-4bcc-a3be-96e8b45710e4';
const DIAGNOSIS_CONCERN_GUID = 'b6fe8d6f-5cf1-4db3-ab4f-7ab8d7b1d132';
const HEALTH_CONCERN_NOTE = 'Yo, I gots concerns';
const NOTE_CONCERN_GUID = 'b6fe8d6f-5cf1-4db3-ab4f-7ab8d7b1d133';
const EFFECTIVE_DATE_UTC = '2017-06-12T00:00:00.000Z';
const EFFECTIVE_DATE = '06/12/2017';
const HEALTH_CONCERNS_RESPONSE = {
    patientHealthConcerns: [{
        patientHealthConcernGuid: ALLERGY_CONCERN_GUID,
        patientPracticeGuid: PATIENT_PRACTICE_GUID,
        effectiveDate: EFFECTIVE_DATE_UTC,
        healthConcernType: 'Allergy',
        healthConcernReferenceGuid: ALLERGY_GUID,
        isActive: true
    }, {
        patientHealthConcernGuid: DIAGNOSIS_CONCERN_GUID,
        patientPracticeGuid: PATIENT_PRACTICE_GUID,
        effectiveDate: EFFECTIVE_DATE_UTC,
        healthConcernType: 'Diagnosis',
        healthConcernReferenceGuid: DIAGNOSIS_GUID,
        isActive: false
    }, {
        patientHealthConcernGuid: NOTE_CONCERN_GUID,
        patientPracticeGuid: PATIENT_PRACTICE_GUID,
        healthConcernNote: HEALTH_CONCERN_NOTE,
        healthConcernType: 'Note'
    }]
};
let store;

module('Unit - Core - Clinical | Model - Patient Health Concern', {
    beforeEach() {
        const env = setupStore({
            adapters: {
                'patient-health-concern': PatientHealthConcernAdapter
            },
            serializers: {
                'patient-health-concern': PatientHealthConcernSerializer
            },
            models: {
                'patient-health-concern': PatientHealthConcern
            }
        });
        store = env.store;
        this.server = startMirage();
    },
    afterEach() {
        this.server.shutdown();
        store = null;
    }
});

test('Patient health concerns are serialized correctly', assert => {
    const done = assert.async();
    let healthConcernsEndpointCalled = false;

    server.get('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/patientHealthConcerns', ({ db }, request) => {
        healthConcernsEndpointCalled = true;
        assert.equal(request.params.patientPracticeGuid, PATIENT_PRACTICE_GUID, 'The patientPracticeGuid was correct in the GET request');
        return HEALTH_CONCERNS_RESPONSE;
    });

    store.query('patient-health-concern', { patientPracticeGuid: PATIENT_PRACTICE_GUID }).then(healthConcerns => {
        const allergyConcern = healthConcerns.findBy('healthConcernType', 'Allergy');
        const diagnosisConcern = healthConcerns.findBy('healthConcernType', 'Diagnosis');
        const noteConcern = healthConcerns.findBy('healthConcernType', 'Note');

        assert.ok(healthConcernsEndpointCalled, 'The patient health concerns endpoint was called');
        assert.equal(healthConcerns.get('length'), 3, 'The health concerns were serialized into models');
        assert.ok(allergyConcern, 'The allergy health concern was serialized into a model');
        assert.equal(allergyConcern.get('id'), ALLERGY_CONCERN_GUID, 'The allergy health concern guid was serialized correctly');
        assert.equal(allergyConcern.get('effectiveDate'), EFFECTIVE_DATE, 'The allergy health concern effective date was serialized correctly');
        assert.equal(allergyConcern.get('healthConcernReferenceGuid'), ALLERGY_GUID, 'The allergy guid was serialized correctly');
        assert.ok(allergyConcern.get('isActive'), 'The allergy health concern isActive field was serialized correctly');


        assert.ok(diagnosisConcern, 'The diagnosis health concern was serialized into a model');
        assert.equal(diagnosisConcern.get('id'), DIAGNOSIS_CONCERN_GUID, 'The diagnosis health concern guid was serialized correctly');
        assert.equal(diagnosisConcern.get('effectiveDate'), EFFECTIVE_DATE, 'The diagnosis health concern effective date was serialized correctly');
        assert.equal(diagnosisConcern.get('healthConcernReferenceGuid'), DIAGNOSIS_GUID, 'The diagnosis guid was serialized correctly');
        assert.notOk(diagnosisConcern.get('isActive'), 'The diagnosis health concern isActive field was serialized correctly');

        assert.ok(noteConcern, 'The note health concern was serialized into a model');
        assert.equal(noteConcern.get('id'), NOTE_CONCERN_GUID, 'The note health concern guid was serialized correctly');
        assert.equal(noteConcern.get('healthConcernNote'), HEALTH_CONCERN_NOTE, 'The health concern note was serialized correctly');
        done();
    });
});

test('Patient health concerns can be created', assert => {
    const done = assert.async();
    let healthConcernsPostCalled = false;

    server.post('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/patientHealthConcerns', ({ db }, request) => {
        healthConcernsPostCalled = true;
        const data = JSON.parse(request.requestBody);
        const response = copy(data);

        assert.notOk(data.patientHealthConcernGuid, 'The patientHealthConcernGuid is not included on POST');
        assert.equal(data.patientPracticeGuid, PATIENT_PRACTICE_GUID, 'The patient practice guid is correct in POST body');
        assert.equal(request.params.patientPracticeGuid, PATIENT_PRACTICE_GUID, 'The patient practice guid is correct in POST url');
        assert.equal(data.effectiveDate, EFFECTIVE_DATE_UTC, 'The effective date is correct on POST');
        assert.equal(data.healthConcernReferenceGuid, ALLERGY_GUID, 'The health concern guid is correct on POST');
        assert.ok(data.isActive, 'The isActive flag is correct on POST');
        assert.equal(data.healthConcernType, 'Allergy', 'The health concern type is correct on POST');

        response.patientHealthConcernGuid = ALLERGY_CONCERN_GUID;
        return {
            patientHealthConcern: response
        };
    });

    store.createRecord('patient-health-concern', {
        patientPracticeGuid: PATIENT_PRACTICE_GUID,
        effectiveDate: EFFECTIVE_DATE,
        healthConcernType: 'Allergy',
        isActive: true,
        healthConcernReferenceGuid: ALLERGY_GUID
    }).save().then(healthConcern => {
        assert.ok(healthConcernsPostCalled, 'The health concerns endpoint was POSTed to');
        assert.ok(healthConcern, 'The health concern was serialized after save');
        assert.equal(healthConcern.get('id'), ALLERGY_CONCERN_GUID, 'The patientHealthConcernGuid was serialized correctly on save');
        assert.equal(healthConcern.get('effectiveDate'), EFFECTIVE_DATE, 'The effective date was serialized correctly');
        assert.equal(healthConcern.get('healthConcernReferenceGuid'), ALLERGY_GUID, 'The healthConcernReferenceGuid was serialized correctly');
        assert.ok(healthConcern.get('isActive'), 'The isActive field was serialized correctly');
        done();
    });
});

test('Existing health concerns can be saved', assert => {
    const done = assert.async();
    const newHealthConcernNote = 'Such edit. So different';
    let healthConcernsPutCalled = false;

    server.get('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/patientHealthConcerns', () => HEALTH_CONCERNS_RESPONSE);
    server.put('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/patientHealthConcerns/:patientHealthConcernGuid', ({ db }, request) => {
        healthConcernsPutCalled = true;
        const data = JSON.parse(request.requestBody);

        assert.equal(request.params.patientHealthConcernGuid, NOTE_CONCERN_GUID, 'The patientHealthConcernGuid is correct in PUT url');
        assert.equal(data.patientHealthConcernGuid, NOTE_CONCERN_GUID, 'The patientHealthConcernGuid is correct in PUT body');
        assert.equal(data.patientPracticeGuid, PATIENT_PRACTICE_GUID, 'The patient practice guid is correct in PUT body');
        assert.equal(request.params.patientPracticeGuid, PATIENT_PRACTICE_GUID, 'The patient practice guid is correct in PUT url');
        assert.equal(data.healthConcernType, 'Note', 'The health concern type is correct on PUT');
        assert.equal(data.healthConcernNote, newHealthConcernNote, 'The health concern note is correct on PUT');

        return {
            patientHealthConcern: data
        };
    });

    store.query('patient-health-concern', { patientPracticeGuid: PATIENT_PRACTICE_GUID }).then(healthConcerns => {
        const noteConcern = healthConcerns.findBy('healthConcernType', 'Note');
        noteConcern.set('healthConcernNote', newHealthConcernNote);
        noteConcern.save().then(healthConcern => {
            assert.ok(healthConcernsPutCalled, 'The health concerns PUT endpoint was called');
            assert.ok(healthConcern, 'The health concern was serialized after save');
            assert.equal(healthConcern.get('healthConcernNote'), newHealthConcernNote, 'The health concern note was updated on save');
            done();
        });
    });
});

test('Existing health concerns can be deleted', assert => {
    const done = assert.async();
    let healthConcernDeleteCalled = false;
    server.get('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/patientHealthConcerns', () => HEALTH_CONCERNS_RESPONSE);
    server.delete('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/patientHealthConcerns/:patientHealthConcernGuid', ({ db }, request) => {
        healthConcernDeleteCalled = true;
        assert.equal(request.params.patientHealthConcernGuid, NOTE_CONCERN_GUID, 'The patientHealthConcernGuid is correct in DELETE url');
        return new Mirage.Response(204, {}, null);
    });

    store.query('patient-health-concern', { patientPracticeGuid: PATIENT_PRACTICE_GUID }).then(healthConcerns => {
        let noteConcern = healthConcerns.findBy('healthConcernType', 'Note');
        noteConcern.destroyRecord().then(() => {
            assert.ok(healthConcernDeleteCalled, 'The health concerns DELETE endpoint was called');
            noteConcern = store.peekRecord('patient-health-concern', NOTE_CONCERN_GUID);
            assert.ok(!noteConcern || noteConcern.get('isDeleted'), 'The health concern is no longer present in the store after delete');
            done();
        });
    });
});
