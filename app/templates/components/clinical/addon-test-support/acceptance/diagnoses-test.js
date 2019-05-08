import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';

const PATIENT_PRACTICE_GUID = 'c5faffde-78e2-4924-acaf-2115bc686d5e';
const COMMENT = 'Some Dx Comment';
const START_DATE = '03/08/2016';
const ICD10_CODE = 'V95.43xS';
const ICD10_DESCRIPTION = 'Spacecraft collision injuring occupant, sequela';
const ICD9_CODE = 'E929.1';
const ICD9_DESCRIPTION = 'Late effects of other transport accident';

moduleForAcceptanceAuth('Acceptance - Core - Clinical | Diagnoses - v2');

test('Empty diagnoses section renders properly', async assert => {
    server.get('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/aggregate', () => ({'diagnoses':{'patientDiagnoses':[],'noKnownDiagnoses':false},
        'medications':{'patientMedications':null,'noKnownMedications':false}}));

    await visit('/PF/charts/patients/c5faffde-78e2-4924-acaf-2115bc686d5e/summary');
    assert.ok(find(de('no-active-diagnoses-label')).text().toLowerCase().indexOf('no active diagnoses') > -1, 'Empty diagnoses section renders properly');
});

test('Add a diagnosis', async assert => {
    server.post(`ClinicalEndpoint/api/v1/patients/${PATIENT_PRACTICE_GUID}/diagnoses`, ({ db }, request) => {
        const diagnosis = JSON.parse(request.requestBody);
        assert.equal(diagnosis.isAcute, true, 'The isAcute flag is correct on the diagnosis');
        assert.equal(diagnosis.name, ICD10_DESCRIPTION, 'The description is correct on the diagnosis');
        assert.equal(diagnosis.patientPracticeGuid, PATIENT_PRACTICE_GUID, 'The patientPracticeGuid is correct on the diagnosis');
        assert.equal(diagnosis.startDate, '2016-03-08T00:00:00.000Z', 'The startDate is correct on the diagnosis');

        assert.equal(diagnosis.diagnosisCodes.length, 2, 'The diagnosis has 2 codes');
        const icd9Code = diagnosis.diagnosisCodes.findBy('codeSystem', 'ICD9');
        const icd10Code = diagnosis.diagnosisCodes.findBy('codeSystem', 'ICD10');
        assert.ok(icd10Code, 'The ICD-10 code is present on the diagnosis');
        assert.equal(icd10Code.code, ICD10_CODE, 'The ICD-10 code is correct');
        assert.equal(icd10Code.description, ICD10_DESCRIPTION, 'The ICD-10 description is correct');
        assert.equal(icd10Code.attributes.length, 1, 'The ICD-10 code has 1 attribute');
        assert.equal(icd10Code.attributes[0].name, 'Encounter Type', 'The ICD-10 attribute has the correct name');
        assert.equal(icd10Code.attributes[0].value, 'Sequela', 'The ICD-10 attribute has the correct value');

        assert.ok(icd9Code, 'The ICD-9 code is present on the diagnosis');
        assert.equal(icd9Code.code, ICD9_CODE, 'The ICD-9 code is correct');
        assert.equal(icd9Code.description, ICD9_DESCRIPTION, 'The ICD-9 description is correct');
        assert.equal(icd9Code.attributes.length, 0, 'The ICD-9 code has 0 attributes');

        assert.equal(diagnosis.transcriptDiagnoses.length, 1, 'The diagnosis has 1 transcriptDiagnosis');
        assert.equal(diagnosis.transcriptDiagnoses[0].comment, COMMENT, 'The diagnosis has the correct comment');
        assert.ok(!diagnosis.transcriptDiagnoses[0].transcriptGuid, 'The diagnosis does not have a transcriptGuid');

        diagnosis.diagnosisGuid = 'DX_GUID_0';
        return diagnosis;
    });
    await visit(`/PF/charts/patients/${PATIENT_PRACTICE_GUID}/summary`);
    await click(`${de('diagnosis-display-select')} .composable-select__choice`);
    await click(de('diagnosis-display-select-option-0'));
    await click(de('add-diagnosis-button'));
    assert.throws(findWithAssert('.diagnosis-detail'), 'Diagnosis detail pane shown');
    const searchInput = `${de('diagnosis-result-search')} input`;
    click(searchInput);
    await fillIn(searchInput, 'spacecraft');
    await click(`${de('diagnosis-result-search-1')} > div`);
    fillIn(de('diagnosis-start-date-picker'), START_DATE);
    await click(de('dx-add-medication-link'));
    click(de('diagnosis-panel-medication-input'));
    await fillIn(de('diagnosis-panel-medication-input'), 's');
    await click(de('dx-show-comment-link'));
    fillIn('.diagnosis-detail--diagnosis-comment textarea', COMMENT);
    click(de('acute-label'));
    await click(de('save-diagnosis-button'));
    assert.equal(find(de('diagnosis-item-start-date')).text().trim(), '03/08/16', 'Start date appears under added dx');
    assert.dom(`${de('acute-dx-list-0')} ${de('diagnosis-item-text')}`).hasAnyText(ICD10_DESCRIPTION, 'The diagnosis was added to the summary');
});
