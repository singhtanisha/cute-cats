import DiagnosesArray from 'clinical/models/diagnoses-array';
import Diagnosis from 'clinical/models/diagnosis';
import withFacetsFixture from 'boot/tests/fixtures/clinical/diagnoses-with-facets';
import { module, test } from 'qunit';

module('Unit - Core - Clinical | Model - diagnoses array tests');

test('unique dedups diagnoses based on all the codes matching', function(assert) {
    let baseDiagnosisCodes = [
        {code: '1', codeSystem: 'ICD9'},
        {code: '2', codeSystem: 'ICD9'},
        {code: 'x', codeSystem: 'ICD10'}
    ];
    let identical = [
        {code: '1', codeSystem: 'ICD9'},
        {code: '2', codeSystem: 'ICD9'},
        {code: 'x', codeSystem: 'ICD10'}
    ];
    let identical2 = [
        {code: '1', codeSystem: 'ICD9'},
        {code: '2', codeSystem: 'ICD9'},
        {code: 'x', codeSystem: 'ICD10'}
    ];
    let missingI9 = [
        {code: '1', codeSystem: 'ICD9'},
        {code: 'x', codeSystem: 'ICD10'}
    ];
    let missingI10 = [
        {code: '1', codeSystem: 'ICD9'},
        {code: '2', codeSystem: 'ICD9'}
    ];
    let same9sDifferent10 = [
        {code: '1', codeSystem: 'ICD9'},
        {code: '2', codeSystem: 'ICD9'},
        {code: 'y', codeSystem: 'ICD10'}
    ];
    let different9Different10 = [
        {code: '1', codeSystem: 'ICD9'},
        {code: '3', codeSystem: 'ICD9'},
        {code: 'x', codeSystem: 'ICD10'}
    ];
    let sameCodesDifferentSystem = [
        {code: '1', codeSystem: 'ICD10'},
        {code: '2', codeSystem: 'ICD9'},
        {code: 'x', codeSystem: 'ICD10'}
    ];
    let allCodes = [baseDiagnosisCodes, identical, identical2, missingI9, missingI10, same9sDifferent10, different9Different10, sameCodesDifferentSystem];
    let diagnoses = Diagnosis.wrap(allCodes.map(function (diagnosisCodes) {
        return {diagnosisCodes:diagnosisCodes};
    }));
    assert.deepEqual(diagnoses.get('unique').mapBy('diagnosisCodes'), [
        baseDiagnosisCodes, missingI9, missingI10, same9sDifferent10, different9Different10, sameCodesDifferentSystem
    ]);
});

test('unique fallsback to diagnosis.code if no diagnosisCodes are present', function(assert) {
    let diagnoses = Diagnosis.wrap([
        { diagnosisCodes: [{code: '1', codeSystem: 'ICD9'}] },
        { code: '1' },
        { code: '1' }
    ]);
    assert.equal(diagnoses.get('unique.length'), 2);
});

test('unique returns a DiagnosesArray so we can chain filters', function(assert) {
    let diagnoses = Diagnosis.wrap([]);
    assert.ok(diagnoses.get('unique') instanceof DiagnosesArray, 'The dianoses is not an array');
});

test('facets are calculated from each diagnosis attributes based on attribute.name', function(assert) {
    let diagnoses = Diagnosis.wrap(withFacetsFixture);
    assert.equal(diagnoses.get('facets.length'), 1);
});
test('facets include a group based on the diagnosis.attribute.name', function(assert) {
    let diagnoses = Diagnosis.wrap(withFacetsFixture);
    assert.equal(diagnoses.get('facets.0.id'), 'Laterality Type');
    assert.equal(diagnoses.get('facets.0.name'), 'Laterality Type');
});
test('each facet has constraints', function(assert) {
    let diagnoses = Diagnosis.wrap(withFacetsFixture);
    assert.equal(diagnoses.get('facets.0.constraints.length'), 3);
});
test('each constraint has a name', function(assert) {
    let diagnoses = Diagnosis.wrap(withFacetsFixture);
    assert.equal(diagnoses.get('facets.0.constraints.0.id'), 'Laterality Type-Right');
    assert.equal(diagnoses.get('facets.0.constraints.0.name'), 'Right');
    assert.equal(diagnoses.get('facets.0.constraints.1.name'), 'Left');
    assert.equal(diagnoses.get('facets.0.constraints.2.name'), 'Unspecified');
});
test('each constraint has a diagnoses-array', function(assert) {
    let diagnoses = Diagnosis.wrap(withFacetsFixture);
    assert.equal(diagnoses.get('facets.0.constraints.0.diagnoses').constructor, DiagnosesArray);
    assert.equal(diagnoses.get('facets.0.constraints.1.diagnoses').constructor, DiagnosesArray);
    assert.equal(diagnoses.get('facets.0.constraints.2.diagnoses').constructor, DiagnosesArray);

    assert.equal(diagnoses.get('facets.0.constraints.0.diagnoses.length'), 1);
    assert.equal(diagnoses.get('facets.0.constraints.1.diagnoses.length'), 1);
    assert.equal(diagnoses.get('facets.0.constraints.2.diagnoses.length'), 1);
});
