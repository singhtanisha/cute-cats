import { resolve } from 'rsvp';
import DiagnosesRepository from 'clinical/repositories/diagnoses';
import { module } from 'qunit';
import sinonTest from 'ember-sinon-qunit/test-support/test';
import PFServer from 'boot/util/pf-server';

module('Unit - Core - Clinical | Repository - diagnoses tests');

sinonTest('searchForFamilyHistory calls v3 diagnosis/typeSearch with the filter and familyHealthHistorySearch flag', function(assert) {
    let promiseStub = this.stub(PFServer, 'promise').returns(new resolve([]));
    DiagnosesRepository.searchForFamilyHistory('Diabetes');

    let url = promiseStub.getCall(0).args[0];
    assert.ok(url.match(/diagnosis\/typeSearch\/\?searchTerm=Diabetes&familyHealthHistorySearch=true/));
});

sinonTest('searchForFamilyHistory sets diagnosisType for "Other diagnosis" and "Family diagnosis"', function(assert) {
    let relativesList = [
        {relative: { observations: [{diagnosis: {id: 1, snomedCode: 1}}, {diagnosis: {id: 2, snomedCode: 2}}]} },
        {relative: { observations: [{diagnosis: {id: 3, snomedCode: 3}}]} }
    ];
    this.stub(PFServer, 'promise').returns(new resolve([{id: 4}]));
    return DiagnosesRepository.searchForFamilyHistory('Diabetes', relativesList).then(results=>{
        assert.equal(results.length, 4);
        assert.equal(results.findBy('id', 1).diagnosisType, 'Family diagnosis');
        assert.equal(results.findBy('id', 2).diagnosisType, 'Family diagnosis');
        assert.equal(results.findBy('id', 3).diagnosisType, 'Family diagnosis');
        assert.equal(results.findBy('id', 4).diagnosisType, 'Other diagnosis');
    });
});

sinonTest('searchForFamilyHistory returns Family diagnosis first and then Other diagnosis', function(assert) {
    let relativesList = [
        {relative: { observations: [{diagnosis: {}}]} }
    ];
    this.stub(PFServer, 'promise').returns(new resolve([{}]));
    return DiagnosesRepository.searchForFamilyHistory('Diabetes', relativesList).then(results=>{
        assert.equal(results.length, 2);
        assert.equal(results[0].diagnosisType, 'Family diagnosis');
        assert.equal(results[1].diagnosisType, 'Other diagnosis');
    });
});

sinonTest('searchForFamilyHistory de-dupes all Family Diagnosis by snomed', function(assert) {
    let relativesList = [
        {relative: { observations: [{diagnosis: {snomedCode: 1}}, {diagnosis: {snomedCode: 2}}]} },
        {relative: { observations: [{diagnosis: {snomedCode: 1}}]} }
    ];
    this.stub(PFServer, 'promise').returns(new resolve([]));
    return DiagnosesRepository.searchForFamilyHistory('Diabetes', relativesList).then(results=>{
        assert.equal(results.length, 2);
    });
});
