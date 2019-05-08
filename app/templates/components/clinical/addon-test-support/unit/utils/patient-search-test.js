import { module, test } from 'qunit';
import patientSearchUtil from 'clinical/util/patient-search';

module('Unit - Core - Clinical | Utils - PatientSearch');

test('Single word is sent as firstOrLastName', assert => {
    const result = patientSearchUtil.formatNameParameters('test');
    assert.equal(result.firstOrLastName, 'test');
    assert.equal(Object.keys(result).length, 1);
});

test('Leading and trailing spaces are trimmed for single-word searches', assert => {
    const result = patientSearchUtil.formatNameParameters(' test  ');
    assert.equal(result.firstOrLastName, 'test');
    assert.equal(Object.keys(result).length, 1);
});

test('Two words separated by space are sent with first and last name', assert => {
    const result = patientSearchUtil.formatNameParameters('first last');
    assert.equal(result.firstName, 'first');
    assert.equal(result.lastName, 'last');
    assert.equal(Object.keys(result).length, 2);
});

test('Leading and trailing spaces are trimmed for multi-word searches', assert => {
    const result = patientSearchUtil.formatNameParameters(' first  last ');
    assert.equal(result.firstName, 'first');
    assert.equal(result.lastName, 'last');
    assert.equal(Object.keys(result).length, 2);
});

test('All remaining text after first space is sent as last name', assert => {
    const result = patientSearchUtil.formatNameParameters('first complex last that is long');
    assert.equal(result.firstName, 'first');
    assert.equal(result.lastName, 'complex last that is long');
    assert.equal(Object.keys(result).length, 2);
});

test('Searches containing comma are treated as lastName, firstName', assert => {
    const result = patientSearchUtil.formatNameParameters('last, first');
    assert.equal(result.firstName, 'first');
    assert.equal(result.lastName, 'last');
    assert.equal(Object.keys(result).length, 2);
});
