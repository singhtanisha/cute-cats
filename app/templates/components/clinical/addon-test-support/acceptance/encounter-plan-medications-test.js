import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';
import getText from 'boot/tests/helpers/get-text';

const TRANSCRIPT_GUID = '7022d94f-d70a-4722-a205-dac898cf9f69';
const PATIENT_PRACTICE_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const ENCOUNTER_URL = `/PF/charts/patients/${PATIENT_PRACTICE_GUID}/encounter/${TRANSCRIPT_GUID}`;
const PLAN_URL = `${ENCOUNTER_URL}/note/plan`;
const FREQUENT_MED_NAME = 'Vicks Air Purifier/HEPA (Device) Miscellaneous';
const FREQUENT_MED_NDC = '28785099130';
const FREQUENT_MED_GUID = 'FREQUENT_MED_GUID';
const MEDICATION_LIST = '.medications-plan-list';
const PREVIOUS_MED_GUID = '2c02a498-dccd-4cf2-8091-bff6cf6e23c1';
const PREVIOUS_MED_NAME = 'Xanax 0.25 MG Oral Tablet';
const PREVIOUS_MED_FULL_NAME = 'Alprazolam (Xanax) 0.25 MG Oral Tablet Start: 09/27/16 Stop: 09/30/16 Sig: 4 times a day';
const NOW = moment(new Date()).toISOString();
const SEARCH_INPUT = `${de('medications-search')} input`;
const NEW_MED_GUID = 'NEW_MED_GUID';

function dg(guid) {
    return `[data-guid="${guid}"]`;
}

moduleForAcceptanceAuth('Acceptance - Core - Clinical | Encounter plan medications');

test('Add medications from the encounter plan section', async assert => {
    const frequentMed = `${de('frequent-medications')} ${dg('a9682900-ecc1-4c3b-ba9f-aa3bd2b216c7')}`;
    const frequentMedInList = `${MEDICATION_LIST} ${dg(FREQUENT_MED_GUID)}`;
    const previousMed = `${de('encounter-medication-item')}${dg(PREVIOUS_MED_GUID)}`;
    const previousMedInList = `${MEDICATION_LIST} ${dg(PREVIOUS_MED_GUID)}`;
    const previousMedCheckmark = `${previousMed} .icon-checkmark`;
    const newMedInList = `${MEDICATION_LIST} ${dg(NEW_MED_GUID)}`;
    let postTranscriptMedCount = 0;
    let postMedicationCount = 0;
    let deletedTranscriptMedCount = 0;

    server.post('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/medications', ({ db }, request) => {
        postMedicationCount++;
        const medication = JSON.parse(request.requestBody);
        const transcriptMed = medication.transcriptMedications[0];

        if (postMedicationCount === 1) {
            assert.equal(medication.drugName, FREQUENT_MED_NAME, 'The drug name is correct on the POSTed medication');
            assert.equal(medication.ndc, FREQUENT_MED_NDC, 'The drug ndc is correct on the POSTed medication');
            assert.equal(transcriptMed.transcriptGuid, TRANSCRIPT_GUID, 'The transcriptGuid is correct on the POSTed medication');
            medication.medicationGuid = FREQUENT_MED_GUID;
        } else {
            medication.medicationGuid = NEW_MED_GUID;
        }
        assert.equal(medication.patientPracticeGuid, PATIENT_PRACTICE_GUID, 'The patient guid is correct on the POSTed medication');

        transcriptMed.lastModifiedDateTimeUtc = NOW;
        return medication;
    });

    server.post('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/medications/:medicationGuid/transcriptMedications', ({ db }, request) => {
        postTranscriptMedCount++;
        const transcriptMed = JSON.parse(request.requestBody);
        assert.equal(request.params.patientPracticeGuid, PATIENT_PRACTICE_GUID, 'The patientPracticeGuid is correct on the POSTed transcript medication');
        if (postTranscriptMedCount === 1) {
            assert.equal(request.params.medicationGuid, PREVIOUS_MED_GUID, 'The medicationGuid is correct on the POSTed transcript medication');
        }
        assert.equal(transcriptMed.transcriptGuid, TRANSCRIPT_GUID, 'The transcriptGuid is correct on the POSTed transcript medication');
        transcriptMed.lastModifiedDateTimeUtc = NOW;
        return transcriptMed;
    });

    server.delete('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/medications/:medicationGuid/transcriptMedications/:transcriptGuid', ({ db }, request) => {
        deletedTranscriptMedCount++;
        const expectedMedGuid = deletedTranscriptMedCount === 1 ? PREVIOUS_MED_GUID : NEW_MED_GUID;
        assert.equal(request.params.patientPracticeGuid, PATIENT_PRACTICE_GUID, 'The patientPracticeGuid is correct on the deleted transcript medication');
        assert.equal(request.params.transcriptGuid, TRANSCRIPT_GUID, 'The transcriptGuid is correct on the deleted transcript medication');
        assert.equal(request.params.medicationGuid, expectedMedGuid, 'The medicationGuid is correct on the deleted transcript medication');
    });

    await visit(ENCOUNTER_URL);
    click(de('edit-note-plan'));
    click(de('toolbox-tab-medications'));
    await click(de('medications-tab-frequent'));
    assert.equal(find(frequentMed).text(), FREQUENT_MED_NAME, 'The frequent medication is in the frequent meds list');
    await click(frequentMed);
    assert.equal(getText(frequentMedInList), FREQUENT_MED_NAME, 'The frequent medication appeared in the plan after clicking it');
    await click(de('medications-tab-previous'));
    assert.equal(getText(previousMed), PREVIOUS_MED_NAME, 'The previous medication is in the previous meds list');
    await click(previousMed);
    assert.equal(getText(`${previousMedInList} .medication-display`), PREVIOUS_MED_FULL_NAME, 'The previous medication appeared in the plan after clicking it');
    assert.throws(findWithAssert(previousMedCheckmark), 'A checkmark is displayed on the previous medication after clicking it');
    await click(previousMed);
    assert.notOk(find(previousMedCheckmark).length, 'The checkmark disappears after clicking the previous medication again');
    assert.notOk(find(previousMedInList).length, 'The previous medication disappears from the plan after clicking it again');
    await click(de('add-all-active-meds'));
    assert.equal(find('.previous-medications-results-list .icon-checkmark').length, 2, 'All the active medications get checkmarks after clicking add all active');
    assert.equal(find(`${MEDICATION_LIST} .medication-list-item`).length, 2, 'All the active medications are added to the plan after clicking add all active');
    await click(de('medications-tab-record'));
    assert.throws(findWithAssert('.medication-detail'), 'The add medication details pane was opened when clicking the record button');
    click(SEARCH_INPUT);
    await fillIn(SEARCH_INPUT, 'vicodin');
    await wait();
    click(de('medications-search-0'));
    await click('.detail-pane-footer .btn-primary');
    assert.equal(currentURL(), PLAN_URL, 'The plan details pane is opened again after adding the medication');
    assert.equal(getText(`${newMedInList} .medication-display`), 'Hydrocodone-Acetaminophen (Vicodin) 5-300 MG Oral Tablet', 'The new medication appeared in the plan');
    await click(`${newMedInList} .close-box-small`);
    assert.notOk(find(newMedInList).length, 'The medication was removed from the plan after clicking the x');
    await click(`${frequentMedInList} a`);
    assert.equal(currentURL(), `${ENCOUNTER_URL}/medication/${FREQUENT_MED_GUID}`, 'The medication details pane was opened after clicking the medication name');
    await click(`.detail-pane-footer ${de('cancel-btn')}`);
    assert.equal(currentURL(), PLAN_URL, 'The plan details pane is opened again after clicking cancel');
});
