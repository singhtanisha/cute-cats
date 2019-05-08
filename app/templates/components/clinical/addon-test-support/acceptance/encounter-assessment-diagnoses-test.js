import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';
import getText from 'boot/tests/helpers/get-text';

const TRANSCRIPT_GUID = '7022d94f-d70a-4722-a205-dac898cf9f69';
const PATIENT_PRACTICE_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const ENCOUNTER_URL = `/PF/charts/patients/${PATIENT_PRACTICE_GUID}/encounter/${TRANSCRIPT_GUID}`;
const ASSESSMENT_URL = `${ENCOUNTER_URL}/note/assessment`;
const MY_DX_NAME = 'Acute delta-(super) infection of hepatitis B carrier';
const MY_DX_GUID = 'MY_DX_GUID';
const NEW_DX_GUID = 'NEW_DX_GUID';
const NOW = moment(new Date()).toISOString();
const PREVIOUS_DX_GUID = '76799831-f630-4f71-bb7e-4ae0f801dcc4';
const DX_LIST = '.diagnoses-assessment-list';
const PREVIOUS_DX_FULL_NAME = 'Unspecified fracture of unspecified femur Acute Start: 11/03/16';
const SEARCH_INPUT = de('diagnosis-search-input');

function dg(guid) {
    return `[data-guid="${guid}"]`;
}

moduleForAcceptanceAuth('Acceptance - Core - Clinical | Encounter assessment diagnoses');

test('Add diagnoses from the encounter assessment section', async assert => {
    let postDiagnosisCount = 0;
    let postTranscriptDxCount = 0;

    server.post('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/diagnoses', ({ db }, request) => {
        postDiagnosisCount++;
        const diagnosis = JSON.parse(request.requestBody);
        const transcriptDx = diagnosis.transcriptDiagnoses[0];
        const icd10Code = diagnosis.diagnosisCodes.findBy('codeSystem', 'ICD10');

        if (postDiagnosisCount === 1) {
            assert.equal(diagnosis.name, MY_DX_NAME, 'The name is correct on the POSTed diagnosis');
            assert.ok(icd10Code);
            assert.equal(icd10Code.code, 'B17.0', 'The icd10 code is correct on the POSTed diagnosis');
            assert.equal(transcriptDx.transcriptGuid, TRANSCRIPT_GUID, 'The transcriptGuid is correct on the POSTed diagnosis');
            diagnosis.diagnosisGuid = MY_DX_GUID;
        } else {
            diagnosis.diagnosisGuid = NEW_DX_GUID;
        }
        assert.equal(diagnosis.patientPracticeGuid, PATIENT_PRACTICE_GUID, 'The patient guid is correct on the POSTed diagnosis');

        transcriptDx.lastModifiedAt = NOW;
        transcriptDx.sortOrder = postDiagnosisCount + postTranscriptDxCount - 1;
        diagnosis.acuity = 'Unspecified';
        return diagnosis;
    });

    server.post('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/diagnoses/:diagnosisGuid/transcriptDiagnoses', ({ db }, request) => {
        postTranscriptDxCount++;
        const transcriptDx = JSON.parse(request.requestBody);
        if (postTranscriptDxCount === 1) {
            assert.equal(request.params.diagnosisGuid, PREVIOUS_DX_GUID, 'The diagnosisGuid is correct on the POSTed transcript diagnosis');
        }
        assert.equal(transcriptDx.transcriptGuid, TRANSCRIPT_GUID, 'The transcriptGuid is correct on the POSTed transcript diagnosis');
        transcriptDx.lastModifiedAt = NOW;
        transcriptDx.sortOrder = postDiagnosisCount + postTranscriptDxCount - 1;
        return transcriptDx;
    });

    server.delete('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/diagnoses/:diagnosisGuid/transcriptDiagnoses/:transcriptGuid', ({ db }, request) => {
        assert.equal(request.params.transcriptGuid, TRANSCRIPT_GUID, 'The transcriptGuid is correct on the deleted transcript diagnosis');
        assert.equal(request.params.diagnosisGuid, PREVIOUS_DX_GUID, 'The diagnosisGuid is correct on the deleted transcript diagnosis');
    });

    server.delete('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/diagnoses/:diagnosisGuid', ({ db }, request) => {
        assert.equal(request.queryParams.transcriptGuid, TRANSCRIPT_GUID, 'The transcriptGuid is correct on the deleted diagnosis');
        assert.equal(request.params.diagnosisGuid, NEW_DX_GUID, 'The diagnosisGuid is correct on the deleted diagnosis');
    });

    await visit(ENCOUNTER_URL);
    click(de('edit-note-assessment'));
    click(de('toolbox-tab-diagnoses'));
    click(de('diagnoses-tab-my-dx'));
    await click('.favorite-diagnoses--item:first');
    const myDxInList = `${DX_LIST} ${dg(MY_DX_GUID)}`;
    const previousDx = `${de('previous-diagnosis-item')}${dg(PREVIOUS_DX_GUID)}`;
    assert.equal(getText(myDxInList), MY_DX_NAME, 'The my dx appeared in the assessment after clicking it');
    click(de('diagnoses-tab-previous'));
    await click(previousDx);
    const previousDxInList = `${DX_LIST} ${dg(PREVIOUS_DX_GUID)}`;
    const previousDxCheckmark = `${previousDx} .icon-checkmark`;
    assert.equal(getText(`${previousDxInList} .medication-display`), PREVIOUS_DX_FULL_NAME, 'The previous diagnosis appeared in the assessment after clicking it');
    assert.throws(findWithAssert(previousDxCheckmark), 'A checkmark is displayed on the previous diagnosis after clicking it');
    await click(previousDx);
    assert.notOk(find(previousDxCheckmark).length, 'The checkmark disappears after clicking the previous diagnosis again');
    assert.notOk(find(previousDxInList).length, 'The previous diagnosis disappears from the assessment after clicking it again');
    await click(de('add-all-active-dx'));
    assert.equal(find('.previous-diagnoses-results-list .icon-checkmark').length, 2, 'All the active diagnoses get checkmarks after clicking add all active');
    assert.equal(find(`${DX_LIST} .medication-list-item`).length, 2, 'All the active diagnoses are added to the assessment after clicking add all active');
    await click(de('diagnoses-tab-record'));
    assert.throws(findWithAssert('.diagnosis-detail'), 'The add diagnosis details pane was opened when clicking the record button');
    click(SEARCH_INPUT);
    fillIn(SEARCH_INPUT, 'spacecraft');
    await click(`${de('diagnosis-result-search-1')} > div`);
    await click(de('save-diagnosis-button'));
    const newDxInList = `${DX_LIST} ${dg(NEW_DX_GUID)}`;
    assert.equal(currentURL(), ASSESSMENT_URL, 'The assessment details pane is opened again after adding the diagnosis');
    assert.equal(getText(`${newDxInList} .medication-display`), 'Spacecraft collision injuring occupant, sequela', 'The new diagnosis appeared in the assessment');
    await click(`${newDxInList} .close-box-small`);
    assert.notOk(find(newDxInList).length, 'The diagnosis was removed from the assessment after clicking the x');
    await click(`${myDxInList} .medication-display a`);
    assert.equal(currentURL(), `${ENCOUNTER_URL}/diagnosis/${MY_DX_GUID}`, 'The diagnosis details pane was opened after clicking the diagnosis name');
    await click(de('cancel-diagnosis-button'));
    assert.equal(currentURL(), ASSESSMENT_URL, 'The assessment details pane is opened again after clicking cancel');
});
