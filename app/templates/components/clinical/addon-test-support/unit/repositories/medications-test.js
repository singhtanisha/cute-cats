import { resolve } from 'rsvp';
import { module, test } from 'qunit';
import sinon from 'sinon';
import repository from 'clinical/repositories/medications';
import PFServer from 'boot/util/pf-server';

const medication = {
    doseForm: 'Solution',
    drugCode: '55513071001',
    drugName: 'Prolia 60 MG/ML Subcutaneous Solution',
    frequency: 8,
    genericName: 'Denosumab',
    id: 'a8a3a5b7-1aa8-4b82-8184-2d3fb83025a6',
    isGeneric: false,
    isMedicalSupply: false,
    medicationDiscontinuedReason: null,
    ndc: '55513071001',
    patientPracticeGuid: '0ead6c1d-181d-4449-8227-9cf0bbac4c41',
    productStrength: '60 MG/ML',
    providerGuid: 'eaa90f53-9dfa-4c2a-93db-83f3b3243d5b',
    route: 'Subcutaneous',
    rxNormCui: '993458',
    brandedRxNormCui: '993456',
    sig: {}
};
let pfServerStub;
module('Unit - Core - Clinical | Repository - medications', {
    beforeEach() {
        pfServerStub = sinon.stub(PFServer, 'promise');
        pfServerStub.onFirstCall().returns(resolve({}));
        pfServerStub.onSecondCall().returns(resolve([]));
    },
    afterEach() {
        PFServer.promise.restore();
    }
});


test('brandedRxNormCui is sent in medication save', assert => {
    const done = assert.async();
    repository.saveMedication(medication).then(() => {
        assert.equal(pfServerStub.firstCall.args[2].brandedRxNormCui, '993456');
        done();
    });
});
