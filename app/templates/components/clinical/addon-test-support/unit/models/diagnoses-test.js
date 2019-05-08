import Diagnosis from 'clinical/models/diagnosis';
import { module, test } from 'qunit';

module('Unit - Core - Clinical | Model - diagnoses tests');

test('description displays ICD10Description if we have ICD10', function(assert) {
    var diagnosis = Diagnosis.wrap({
            diagnosisCodes: [{
                code: '250.00',
                description: 'Diabetes mellitus without mention of complication, type II or unspecified type, not stated as uncontrolled',
                codeSystem: 'Icd9'
            }, {
                code: '73211009',
                description: 'Diabetes mellitus',
                codeSystem: 'Snomed'
            }, {
                code: 'E11.9',
                codeSystem: 'Icd10',
                description: 'Type 2 diabetes mellitus without complications'
            }]
        });
    assert.equal(diagnosis.get('description'), 'Type 2 diabetes mellitus without complications');
});
test('description displays (I9Code) ICD9Description if we only have ICD9', function(assert) {
    var diagnosis = Diagnosis.wrap({
            diagnosisCodes: [{
                code: '250.00',
                description: 'Diabetes mellitus without mention of complication, type II or unspecified type, not stated as uncontrolled',
                codeSystem: 'Icd9'
            }]
        });
    assert.equal(diagnosis.get('description'), '(250.00) Diabetes mellitus without mention of complication, type II or unspecified type, not stated as uncontrolled');
});
test('description displays (I9Code) SnomedDescription: ICD9Description if we have ICD9 and Snomed, but not ICD10', function(assert) {
    var diagnosis = Diagnosis.wrap({
            diagnosisCodes: [{
                code: '250.00',
                description: 'Diabetes mellitus without mention of complication, type II or unspecified type, not stated as uncontrolled',
                codeSystem: 'Icd9'
            }, {
                code: '73211009',
                description: 'Diabetes mellitus',
                codeSystem: 'Snomed'
            }]
        });
    assert.equal(diagnosis.get('description'), '(250.00) Diabetes mellitus: Diabetes mellitus without mention of complication, type II or unspecified type, not stated as uncontrolled');
});
test('description displays (CustomCode) CustomDescription if we only have Custom', function(assert) {
    var diagnosis = Diagnosis.wrap({
            diagnosisCodes: [{
                code: 'customCode',
                description: 'Custom description',
                codeSystem: 'Custom'
            }]
        });
    assert.equal(diagnosis.get('description'), '(customCode) Custom description');
});
test('description displays (No associated code) CustomDescription if we only have CustomDescription but don\'t have a customCode', function(assert) {
    var diagnosis = Diagnosis.wrap({
            diagnosisCodes: [{
                code: '',
                description: 'Custom description',
                codeSystem: 'Custom'
            }]
        });
    assert.equal(diagnosis.get('description'), '(No associated code) Custom description');
});

test('attributes return a list of attributes based on diagnosisCodes', function(assert) {
    var attributes1, attributes2, expectedAttributes, diagnosis;
    attributes1 = [{
            name: 'Laterality Type',
            value: 'Left'
        }, {
            name: 'Encounter Type',
            value: 'Initial',
        }, {
            name: 'Fracture Type',
            value: 'Closed',
        }];
    attributes2 = [{
            name: 'Gender',
            value: 'Female'
        }];
    expectedAttributes = [{
            name: 'Laterality Type',
            value: 'Left'
        }, {
            name: 'Encounter Type',
            value: 'Initial',
        }, {
            name: 'Fracture Type',
            value: 'Closed',
        },
        {
            name: 'Gender',
            value: 'Female'
        }];
    diagnosis = Diagnosis.wrap({
        diagnosisCodes: [{attributes: attributes1}, {attributes: attributes2}]
    });
    assert.deepEqual(diagnosis.get('attributes'), expectedAttributes);
});
