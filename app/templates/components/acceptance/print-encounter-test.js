import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import getText from 'boot/tests/helpers/get-text';
import de from 'boot/tests/helpers/data-element';
import getPrintText from 'boot/tests/helpers/get-text-in-print';
import findInPrint from 'boot/tests/helpers/find-in-print';
import Mirage from 'ember-cli-mirage';

const UNSIGNED_TRANSCRIPT_GUID = 'd2573d89-bb8b-494e-8a79-b94d02f282f2';
const UNSIGNED_TRANSCRIPT_STRUCTURED_FUNCOG_OBSERVATIONS_GUID = 'ab352z11-45z1-bv21-9fg9-c3246c9f5d14';
const PATIENT_PRACTICE_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const ENCOUNTER_URL = `/PF/charts/patients/${PATIENT_PRACTICE_GUID}/encounter/${UNSIGNED_TRANSCRIPT_GUID}`;
const ENCOUNTER_STRUCTURED_FUNCOG_OBSERVATIONS_URL = `/PF/charts/patients/${PATIENT_PRACTICE_GUID}/encounter/${UNSIGNED_TRANSCRIPT_STRUCTURED_FUNCOG_OBSERVATIONS_GUID}`;
const PRINT_CHART_MODAL = '.print-chart .content-modal';

function clickCheckBox(text) {
    return click(`.checkbox-row:contains('${text}') input`);
}
function assertPrintSection(assert, headerText, message) {
    assert.ok(findInPrint(`.chart-print-container .table h2:contains("${headerText}")`).length, message);
}

moduleForAcceptanceAuth('Acceptance - Core - Charting | Print encounter sections test', {});

test('Print encounter (unsigned) for quality of care, allergies, smoking status, and observations functions properly', async assert => {
    let printAuditCalled = false;
    server.post('ChartingEndpoint/api/v2/PrintAudit', () => {
        printAuditCalled = true;
        return null;
    });
    await visit(ENCOUNTER_URL);
    await click(de('print-encounter-button'));
    assert.equal(getText(`${PRINT_CHART_MODAL} .content-modal-title`), 'Print encounter for Some L Baby', 'The modal title contains the patient\'s name');
    click(de('print-modal-select-none'));
    clickCheckBox('Allergies');
    clickCheckBox('Quality of care');
    clickCheckBox('Social history');
    clickCheckBox('Observations');
    await click(`${PRINT_CHART_MODAL} footer .btn-primary`);
    assert.ok(printAuditCalled, 'The print audit endpoint was called after the print button was clicked');
    assert.equal(getPrintText('head title'), 'Encounter - Office Visit Date of service: 03/08/16 Patient: Some L Baby DOB: 02/01/2013 PRN: BS186029', 'The print preview has the correct header for unsigned encounter');
    assert.equal(getPrintText(de('print-header-patient-name')), 'Some L Baby', 'The patient name renders correctly on the print preview for unsigned encounter');
    assert.equal(getPrintText(de('print-header-facility-name')), 'this is a really long facility name', 'The facility name renders correctly on the print preview for unsigned encounter');
    assert.equal(getPrintText(de('print-header-seen-by-provider')), 'Provider Bob MD', 'The seen by provider name renders correctly on print preview for unsigned encounter');

    assertPrintSection(assert, 'Quality of care', 'The quality of care section is present in the print preview for encounter');
    assert.equal(getPrintText(de('print-encounter-quality-of-care') + ':eq(0)'), 'Medication Reconciliation', 'The quality of care value Medication Reconciliation renders correctly on print preview for encounter');
    assert.equal(getPrintText(de('print-encounter-quality-of-care') + ':eq(1)'), 'Documentation of current medications', 'The quality of care value Documentation of current medications renders correctly on print preview for encounter');

    // Allergy headers
    assertPrintSection(assert, 'Drug Allergies', 'The drug allergies section is present in the print preview for encounter');
    assertPrintSection(assert, 'Food Allergies', 'The food allergies section is present in the print preview for encounter');
    assertPrintSection(assert, 'Environmental Allergies', 'The environmental allergies section is present in the print preview for encounter');
    // Allergy names
    assert.equal(getPrintText(de('print-allergen-text') + ':eq(0)'), 'Accu-Chek Compact Plus Care Kit W/CARRYING CASE, W/CONTROL SOLUTION(S), W/LANCET(S), W/METER, W/TEST DRUM', 'The first allergen renders correctly on print preview for encounter');
    assert.equal(getPrintText(de('print-allergen-text') + ':eq(1)'), 'AA&C', 'The second allergen renders correctly on print preview for encounter');
    // Allergy severity
    assert.equal(getPrintText(de('print-allergen-severity') + ':eq(0)'), 'Moderate', 'The first allergen severity renders properly on print preview');
    assert.equal(getPrintText(de('print-allergen-severity') + ':eq(1)'), 'Mild', 'The second allergen severity renders properly on print preview');
    // Allergy reactions
    assert.ok(getPrintText(de('print-allergen-reaction') + ':eq(0)') === '', 'The first allergen reaction is empty on print preview for encounter');
    assert.equal(getPrintText(de('print-allergen-reaction') + ':eq(1)'), 'Anaphylaxis', 'The second allergen reaction renders correctly on print preview for encounter');
    //Allergy onset dates
    assert.equal(getPrintText(de('print-allergen-onset-date') + ':eq(0)'), 'Adulthood', 'The first allergen onset date renders correctly on print preview for encounter');
    assert.equal(getPrintText(de('print-allergen-onset-date') + ':eq(1)'), '-', 'The second allergen onset date is not set on print preview for encounter');

    assert.ok(findInPrint('.print-behavioral-health-section h2:contains("Social history")').length, 'The social history section is present in the print preview for encounter');
    assert.ok(findInPrint('.print-behavioral-health-section h4:contains("Never smoker")').length, 'The smoking history description renders correctly on print preview for encounter');
    assert.ok(findInPrint('.print-behavioral-health-section .col-xs-2:contains("12/01/2014")').length, 'The smoking history effective date renders correctly on print preview for encounter');

    assertPrintSection(assert, 'Observations', 'The observations section is present in the print preview for encounter');
    assert.equal(getPrintText(de('print-observation-text') + ':eq(0)'), 'Patient had some trouble walking.', 'The functional status description renders correctly on print preview for encounter');
    assert.equal(getPrintText(de('print-observation-no-impairment-text') + ':eq(0)'), 'No impairment.', 'The No impairment text renders correctly on print preview for encounter');

    click('#print-modal-controls .close-link');
});

test('Print encounter (unsigned) for structured functional and cognitive status functions properly', async assert => {
    let printAuditCalled = false;
    server.post('ChartingEndpoint/api/v2/PrintAudit', () =>  {
        printAuditCalled = true;
        return null;
    });
    await visit(ENCOUNTER_STRUCTURED_FUNCOG_OBSERVATIONS_URL);
    await click(de('print-encounter-button'));
    assert.equal(getText(`${PRINT_CHART_MODAL} .content-modal-title`), 'Print encounter for Some L Baby', 'The modal title contains the patient\'s name');
    click(de('print-modal-select-none'));
    clickCheckBox('Observations');
    await click(`${PRINT_CHART_MODAL} footer .btn-primary`);
    assert.ok(printAuditCalled, 'The print audit endpoint was called after the print button was clicked');
    assert.equal(getPrintText('head title'), 'Encounter - Office Visit Date of service: 03/08/16 Patient: Some L Baby DOB: 02/01/2013 PRN: BS186029', 'The print preview has the correct header for unsigned encounter');
    assert.equal(getPrintText(de('print-header-patient-name')), 'Some L Baby', 'The patient name renders correctly on the print preview for unsigned encounter');
    assert.equal(getPrintText(de('print-header-facility-name')), 'this is a really long facility name', 'The facility name renders correctly on the print preview for unsigned encounter');
    assert.equal(getPrintText(de('print-header-seen-by-provider')), 'Provider Bob MD', 'The seen by provider name renders correctly on print preview for unsigned encounter');

    assertPrintSection(assert, 'Observations', 'The observations section is present in the print preview for encounter');
    assert.equal(getPrintText(de('print-functional-status-text') + ':eq(0)'), 'Able to start and stop walking spontaneously', 'The structured functional status description renders correctly on print preview for encounter');
    assert.equal(getPrintText(de('print-functional-status-date') + ':eq(0)'), '08/02/2017', 'The structured functional status date renders correctly on print preview for encounter');
    assert.equal(getPrintText(de('print-cognitive-status-text') + ':eq(0)'), 'Difficulty in thinking independently', 'The structured cognitive status description renders correctly on print preview for encounter');
    assert.equal(getPrintText(de('print-cognitive-status-date') + ':eq(0)'), '08/21/2017', 'The structured cognitive status date renders correctly on print preview for encounter');

    click('#print-modal-controls .close-link');
});

test('Print encounter (unsigned) - allergies functions properly', async assert => {
    let printAuditCalled = false;
    server.post('ChartingEndpoint/api/v2/PrintAudit', () => {
        printAuditCalled = true;
        return null;
    });
    await visit(ENCOUNTER_URL);
    await click(`.encounter-allergies-container .btn:contains('Print')`);
    assert.ok(printAuditCalled, 'The print audit endpoint was called after the print button was clicked');

    // Allergy headers
    assertPrintSection(assert, 'Drug Allergies', 'The drug allergies section is present in the print preview for encounter');
    assertPrintSection(assert, 'Food Allergies', 'The food allergies section is present in the print preview for encounter');
    assertPrintSection(assert, 'Environmental Allergies', 'The environmental allergies section is present in the print preview for encounter');
    // Allergy names
    assert.equal(getPrintText(de('print-allergen-text') + ':eq(0)'), 'Accu-Chek Compact Plus Care Kit W/CARRYING CASE, W/CONTROL SOLUTION(S), W/LANCET(S), W/METER, W/TEST DRUM', 'The first allergen renders correctly on print preview for encounter');
    assert.equal(getPrintText(de('print-allergen-text') + ':eq(1)'), 'AA&C', 'The second allergen renders correctly on print preview for encounter');
    // Allergy severity
    assert.equal(getPrintText(de('print-allergen-severity') + ':eq(0)'), 'Moderate', 'The first allergen severity renders properly on print preview');
    assert.equal(getPrintText(de('print-allergen-severity') + ':eq(1)'), 'Mild', 'The second allergen severity renders properly on print preview');
    // Allergy reactions
    assert.ok(getPrintText(de('print-allergen-reaction') + ':eq(0)') === '', 'The first allergen reaction is empty on print preview for encounter');
    assert.equal(getPrintText(de('print-allergen-reaction') + ':eq(1)'), 'Anaphylaxis', 'The second allergen reaction renders correctly on print preview for encounter');
    // Allergy onset dates
    assert.equal(getPrintText(de('print-allergen-onset-date') + ':eq(0)'), 'Adulthood', 'The first allergen onset date renders correctly on print preview for encounter');
    assert.equal(getPrintText(de('print-allergen-onset-date') + ':eq(1)'), '-', 'The second allergen onset date is not set on print preview for encounter');

    click('#print-modal-controls .close-link');
});

test('Print encounter (unsigned) - smoking status functions properly', async assert => {
    let printAuditCalled = false;
    server.post('ChartingEndpoint/api/v2/PrintAudit', () => {
        printAuditCalled = true;
        return null;
    });
    await visit(ENCOUNTER_URL);
    await click(`#social-history .btn:contains('Print')`);
    assert.ok(printAuditCalled, 'The print audit endpoint was called after the print button was clicked');

    assertPrintSection(assert, 'Smoking History', 'The smoking history section is present in the print preview for encounter');
    assert.equal(getPrintText(de('print-smoking-history-description') + ':eq(0)'), 'Never smoker', 'The smoking history description renders correctly on print preview for encounter');
    assert.equal(getPrintText(de('print-smoking-history-effective-date') + ':eq(0)'), '12/01/2014', 'The smoking history effective date renders correctly on print preview for encounter');

    click('#print-modal-controls .close-link');
});

test('Print parent and child SIA added on encounter', async assert => {
    const doneBtn = '.right-module .btn-primary';
    const siaTranscriptGuid = '7022d94f-d70a-4722-a205-dac898cf9f69';
    const siaSection = 'section #dFinalizeEvents';
    const transcriptUrl = '/PF/charts/patients/' + PATIENT_PRACTICE_GUID + '/encounter/' + siaTranscriptGuid;

    server.post('ChartingEndpoint/api/v3/patients/:patientPracticeGuid/transcriptEvents', ({ db }, request) => {
        const data = JSON.parse(request.requestBody);
        data.transcriptEventGuid = 'TEST_GUID';
        return data;
    });

    server.put('ChartingEndpoint/api/v3/patients/:patientPracticeGuid/transcriptEvents/:transcriptEventGuid', () => new Mirage.Response(204, {}, null));

    // Create SIA with child SIA
    await visit(transcriptUrl);
    await click(`${siaSection} a:contains('Add item')`);
    await fillIn(`${siaSection} input`, 'Pain care plan');
    await keyEvent(`${siaSection} .sia-search-single-select`, 'keydown', 13);
    await wait();
    await click(`${siaSection} .sia-search-single-select .ember-select-result-item a:contains("Pain care plan")`);
    const siaFollowUp = de('sia-follow-up');
    await click(siaFollowUp + ' .ember-select-search');
    await click(siaFollowUp + ' .ember-select-result-item:eq(0)');
    await click(doneBtn);
    // Print SIAs with child SIA
    await click(de('print-encounter-button'));
    await click(de('print-modal-select-none'));
    await clickCheckBox('Screenings/ Interventions/ Assessments');
    await click(`${PRINT_CHART_MODAL} footer .btn-primary`);
    assert.equal(getPrintText(de('print-sia-header')), 'Screenings/ Interventions/ Assessments', 'Print SIA header renders properly.');
    assert.equal(getPrintText(de('print-sia-display-name')), 'Pain care plan documented', 'Print SIA parent item renders properly.');
    assert.equal(getPrintText(de('print-sia-child-item')), 'Adjuvant pharmacotherapy (e.g. topical agents, antispasmodics)', 'Print SIA child item renders properly.');
    click('#print-modal-controls .close-link');
});

test('Print encounter demographics renders properly', async assert => {
    server.get('/PatientEndpoint/api/v3/patients/:id', ({ db }, request) => {
        const patientPracticeGuid = request.params.id;
        return db.patientV3S.find(patientPracticeGuid);
    });
    server.get('/PatientEndpoint/api/v1/patients/:id/patientRibbonInfo', ({ db }, request) => {
        const patientPracticeGuid = request.params.id;
        const patient = db.patientRibbonInfos.where({ patientPracticeGuid })[0];
        patient.gender = '2';
        patient.genderString = 'Unknown';
        delete patient.raceOptions;
        return patient;
    });
    await visit(ENCOUNTER_URL);
    await click(de('print-encounter-button'));
    await click(de('print-modal-select-none'));
    await clickCheckBox('Patient demographics');
    await click(`${PRINT_CHART_MODAL} footer .btn-primary`);
    assert.equal(getPrintText(de('print-header-patient-gender')), 'Unknown', 'Unknown renders properly on the print patient header.');
    click('#print-modal-controls .close-link');
});
