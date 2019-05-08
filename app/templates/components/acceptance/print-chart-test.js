import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import getText from 'boot/tests/helpers/get-text';
import de from 'boot/tests/helpers/data-element';
import getPrintText from 'boot/tests/helpers/get-text-in-print';
import findInPrint from 'boot/tests/helpers/find-in-print';

const SIGNED_ENCOUNTER_GUID = '82a597e5-b1b8-46e4-8a07-5c3a4f778e95';
const PATIENT_PRACTICE_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const SUMMARY_URL = `/PF/charts/patients/${PATIENT_PRACTICE_GUID}/summary`;
const ENCOUNTER_URL = `/PF/charts/patients/${PATIENT_PRACTICE_GUID}/encounter/${SIGNED_ENCOUNTER_GUID}`;
const PRINT_CHART_BUTTON = de('btn-print-chart-control-bar');
const NOTES_DROPDOWN = de('print-chart-notes-dropdown');
const PRINT_CHART_MODAL = '.print-chart .content-modal';
const CHECKBOXES = `${PRINT_CHART_MODAL} input[type="checkbox"]`;
const CHECKED_CHECKBOXES = `${CHECKBOXES}:checked`;
const UNCHECKED_CHECKBOXES = `${CHECKBOXES}:not(:checked):not(:disabled)`;

function clickCheckBox(text) {
    return click(`.checkbox-row:contains('${text}') input`);
}

function assertPrintSection(assert, headerText, message) {
    assert.ok(findInPrint(`.chart-print-container .table h2:contains("${headerText}")`).length, message);
}

moduleForAcceptanceAuth('Acceptance - Core - Charting | Print chart and encounter - v2');

test('Print chart functions properly', async assert => {
    let printAuditCalled = false;
    server.post('ChartingEndpoint/api/v2/PrintAudit', ({ db }, request) => {
        printAuditCalled = true;
        const data = JSON.parse(request.requestBody);
        assert.equal(data.patientPracticeGuid, PATIENT_PRACTICE_GUID, 'The patient practice guid is correct on the print audit call');
        assert.equal(data.printEvent, 'EntireChart', 'The print event is correct on the print audit call');
        return null;
    });

    await visit(SUMMARY_URL);
    await click(PRINT_CHART_BUTTON);
    assert.throws(findWithAssert(PRINT_CHART_MODAL), 'The print chart modal appears when clicking the print button');
    assert.equal(getText('.content-modal-title'), 'Print patient chart for Some L Baby', 'The modal title contains the patient\'s name');
    await click(`${PRINT_CHART_MODAL} footer .btn-secondary`);
    assert.notOk(find(PRINT_CHART_MODAL).length, 'The print chart modal closes when the cancel button is clicked');
    click(PRINT_CHART_BUTTON);
    await click(`${NOTES_DROPDOWN} .dropdown-toggle`);
    assert.ok(find('.checkbox-dropdown-grouping.dropdown-menu li label:contains("01/19/16 (SOAP Note)")').length, 'The notes dropdown contains valid notes');
    assert.ok(find('.checkbox-dropdown-grouping.dropdown-menu li label:contains("01/05/16 (SOAP Note)")').length, 'The notes dropdown contains valid notes');
    await click(de('print-modal-select-all'));
    assert.throws(findWithAssert(CHECKED_CHECKBOXES), 'There are checked checkboxes after clicking select all');
    assert.notOk(find(UNCHECKED_CHECKBOXES).length, 'There are no unchecked checkboxes after clicking select all');
    await click(de('print-modal-select-none'));
    assert.throws(findWithAssert(UNCHECKED_CHECKBOXES), 'There are unchecked checkboxes after clicking select none');
    assert.notOk(find(CHECKED_CHECKBOXES).length, 'There are no checked checkboxes after clicking select none');
    clickCheckBox('Patient demographics');
    clickCheckBox('Diagnoses');
    clickCheckBox('Allergies');
    clickCheckBox('Medications');
    clickCheckBox('Health concerns');
    clickCheckBox('Social history');
    clickCheckBox('Screenings/ Interventions/ Assessments');
    await click(`${de('print-health-concerns-options')} .dropdown-print-select button`);
    await click('.ember-tether .input-dropdown-list .input-dropdown-list-item:contains("Active health concerns")');
    await click(`${PRINT_CHART_MODAL} footer .btn-primary`);
    assert.ok(printAuditCalled, 'The print audit endpoint was called after the print button was clicked');
    assert.equal(getPrintText('head title'), 'Patient chart - Patient: Some L Baby DOB: 02/01/2013 PRN: BS186029', 'The print preview has the correct header');
    assert.equal(getPrintText(de('print-header-patient-name')), 'Some L Baby', 'The patient name renders correctly on the print preview');
    assert.equal(getPrintText(de('print-header-facility-name')), 'Rosalise Ron Practice', 'The facility name renders correctly on the print preview');
    assertPrintSection(assert, 'Patient identifying details and demographics', 'The demographics section is present in the print');
    assertPrintSection(assert, 'Diagnoses', 'The diagnoses section is present in the print');
    assertPrintSection(assert, 'Drug Allergies', 'The allergies section is present in the print');
    assertPrintSection(assert, 'Active Medications', 'The medications section is present in the print');
    assertPrintSection(assert, 'Active health concerns', 'The health concerns section is present in the print');
    assertPrintSection(assert, 'Social history', 'The social history section is present in the print');
    assertPrintSection(assert, 'Screenings/ Interventions/ Assessments', 'The sia section is present in the print');
    assert.ok(findInPrint(`${de('print-diagnoses')} ${de('diagnosis-item-text')}:contains('(S72.90) Unspecified fracture of unspecified femur')`).length, 'There is a diagnosis present in the print preview');
    assert.ok(findInPrint(`${de('print-medications')} ${de('medication-item-text')}:contains('methylTESTOSTERone (Methitest) 10 mg oral tablet')`).length, 'There is a medication present in the print preview');
    click('#print-modal-controls .close-link');
});

async function checkEncounter(label) {
    const selector = `label:contains("${label}")`;
    if (find('.open.ember-tether .checkbox-dropdown-grouping.dropdown-menu').length) {
        return click(selector);
    }
    await click(`${NOTES_DROPDOWN} .dropdown-toggle`);
    return click(selector);
}

test('Print chart functions properly for encounter snapshot and unsigned encounter', async assert => {
    server.post('ChartingEndpoint/api/v2/PrintAudit', ({ db }, request) => {
        const data = JSON.parse(request.requestBody);
        assert.equal(data.patientPracticeGuid, PATIENT_PRACTICE_GUID, 'The patient practice guid is correct on the print audit call');
        assert.equal(data.printEvent, 'EntireChart', 'The print event is correct on the print audit call');
        return null;
    });

    await visit(SUMMARY_URL);
    await click(PRINT_CHART_BUTTON);
    assert.throws(findWithAssert(PRINT_CHART_MODAL), 'The print chart modal appears when clicking the print button');
    assert.equal(getText('.content-modal-title'), 'Print patient chart for Some L Baby', 'The modal title contains the patient\'s name');
    await click(`${PRINT_CHART_MODAL} footer .btn-secondary`);
    assert.notOk(find(PRINT_CHART_MODAL).length, 'The print chart modal closes when the cancel button is clicked');
    await click(PRINT_CHART_BUTTON);
    await click(de('print-modal-select-none'));
    // 01/19 is unsigned and 01/05 is signed and has snapshots
    await checkEncounter('01/19/16 (SOAP Note)');
    await checkEncounter('01/05/16 (SOAP Note)');
    await click(`${PRINT_CHART_MODAL} footer .btn-primary`);
    const unsignedEncounter = '.chart-print-container .container-fluid:eq(0) ';
    const signedEncounterSnapshot = '.chart-print-container .container-fluid:eq(1) ';
    assert.equal(getPrintText('head title'), 'Patient chart - Patient: Some L Baby DOB: 02/01/2013 PRN: BS186029', 'The print preview has the correct header');

    // Unsigned Encounter assertions
    assert.equal(getPrintText(unsignedEncounter + de('print-header-patient-name')), 'Some L Baby', 'The patient name renders correctly on the print preview for unsigned encounter');
    assert.equal(getPrintText(unsignedEncounter + de('print-header-facility-name')), 'this is a really long facility name', 'The facility name renders correctly on the print preview for unsigned encounter');
    assert.equal(getPrintText(unsignedEncounter + de('print-header-seen-by-provider')), 'Provider Bob MD', 'The seen by provider name renders correctly on print preview for unsigned encounter');

    // Signed encounter (snapshot) assertions
    assert.equal(getPrintText(signedEncounterSnapshot + de('print-header-patient-name')), 'Finn Jakey', 'The patient name renders correctly on the print preview for patient snapshot');
    assert.equal(getPrintText(signedEncounterSnapshot + de('print-header-facility-name')), 'Snapshot Building', 'The facility name renders correctly on the print preview for facility snapshot');
    assert.equal(getPrintText(signedEncounterSnapshot + de('print-header-seen-by-provider')), 'George Bush M.D.', 'The seen by provider name renders correctly on print preview for snapshot');
    assert.equal(getPrintText(signedEncounterSnapshot + de('print-header-signed-by-provider')), 'Electronically signed by George Bush M.D. at ' + moment.utc('2016-01-06T21:02:23.677Z').local().format('MM/DD/YYYY hh:mm a'), 'The signed by provider renders correctly on print prview for snapshot');
    assert.equal(getPrintText(signedEncounterSnapshot + de('print-encounter-section-am-note')), 'This is a snapshotted amendment.', 'The snapshot addendum print prview addendum note renders properly');
    assert.equal(getPrintText(signedEncounterSnapshot + de('print-encounter-section-am-status-name')), 'Accepted by George Bush M.D., M.F.A.', 'The snapshot addendum print prview addendum status and provider name renders properly');

    // Get the second unsigned encounter and confirm it renders current data
    click('#print-modal-controls .close-link');
});

test('Print encounter functions properly', async assert => {
    let printAuditCalled = false;
    server.post('ChartingEndpoint/api/v2/PrintAudit', ({ db }, request) => {
        printAuditCalled = true;
        const data = JSON.parse(request.requestBody);
        assert.equal(data.patientPracticeGuid, PATIENT_PRACTICE_GUID, 'The patient practice guid is correct on the print audit call');
        assert.equal(data.printEvent, 'ChartNote', 'The print event is correct on the print audit call');
        assert.equal(data.transcriptGuid, SIGNED_ENCOUNTER_GUID, 'The transcript guid is correct on the print audit call');
        return null;
    });
    await visit(ENCOUNTER_URL);
    await click(de('print-encounter-button'));
    assert.equal(getText(`${PRINT_CHART_MODAL} .content-modal-title`), 'Print encounter for Some L Baby', 'The modal title contains the patient\'s name');
    click(de('print-modal-select-none'));
    clickCheckBox('Vitals for this encounter');
    clickCheckBox('Subjective');
    clickCheckBox('Objective');
    clickCheckBox('Assessment');
    clickCheckBox('Plan');
    clickCheckBox('Screening');
    clickCheckBox('Care plan');
    await click(`${PRINT_CHART_MODAL} footer .btn-primary`);
    assert.ok(printAuditCalled, 'The print audit endpoint was called after the print button was clicked');
    assert.equal(getPrintText('head title'), 'Encounter - Office Visit Date of service: 01/05/16 Patient: Finn Jakey DOB: 02/01/2013 PRN: BS186029', 'The print preview has the correct header');
    assert.equal(getPrintText(de('print-header-patient-name')), 'Finn Jakey', 'The snapshotted patient name renders correctly on the print preview');
    assert.equal(getPrintText(de('print-header-facility-name')), 'Snapshot Building', 'The snapshotted facility name renders correctly on the print preview');
    assertPrintSection(assert, 'Vitals for this encounter', 'The vitals section is present in the print');
    assertPrintSection(assert, 'Subjective', 'The subjective section is present in the print');
    assertPrintSection(assert, 'Objective', 'The objective section is present in the print');
    assertPrintSection(assert, 'Assessment', 'The assessment section is present in the print');
    assertPrintSection(assert, 'Plan', 'The plan section is present in the print');
    assertPrintSection(assert, 'Screenings/ Interventions/ Assessments', 'The SIA section is present in the print');
    assertPrintSection(assert, 'Care plan', 'The care plan section is present in the print');
    assert.ok(findInPrint('.flowsheet.table-content .stacked-cell:contains("36 in")').length, 'The height value is present in the vitals print');
    assert.ok(findInPrint('.flowsheet.table-content .stacked-cell:contains("45 lb")').length, 'The weight value is present in the vitals print');
    assert.ok(findInPrint('.formatted-text:contains("Some subjective")').length, 'The subjective value is present in the print preview');
    assert.ok(findInPrint('.formatted-text:contains("No care plan recorded")').length, 'The care plan value is present in the print preview');
    click('#print-modal-controls .close-link');
});

test('Print encounter functions properly with snapshot', async assert => {
    let printAuditCalled = false;
    server.post('ChartingEndpoint/api/v2/PrintAudit', ({ db }, request) => {
        printAuditCalled = true;
        const data = JSON.parse(request.requestBody);
        assert.equal(data.patientPracticeGuid, PATIENT_PRACTICE_GUID, 'The patient practice guid is correct on the print audit call');
        assert.equal(data.printEvent, 'ChartNote', 'The print event is correct on the print audit call');
        assert.equal(data.transcriptGuid, SIGNED_ENCOUNTER_GUID, 'The transcript guid is correct on the print audit call');
        return null;
    });
    await visit(ENCOUNTER_URL);
    await click(de('print-encounter-button'));
    assert.equal(getText(`${PRINT_CHART_MODAL} .content-modal-title`), 'Print encounter for Some L Baby', 'The modal title contains the patient\'s name');
    click(de('print-modal-select-none'));
    clickCheckBox('Addenda');
    await click(`${PRINT_CHART_MODAL} footer .btn-primary`);
    assert.ok(printAuditCalled, 'The print audit endpoint was called after the print button was clicked');
    assert.equal(getPrintText('head title'), 'Encounter - Office Visit Date of service: 01/05/16 Patient: Finn Jakey DOB: 02/01/2013 PRN: BS186029', 'The print preview has the correct header');
    assert.equal(getPrintText(de('print-header-patient-name')), 'Finn Jakey', 'The patient name renders correctly on the print preview for patient snapshot');
    assert.equal(getPrintText(de('print-header-facility-name')), 'Snapshot Building', 'The facility name renders correctly on the print preview for facility snapshot');
    assert.equal(getPrintText(de('print-patient-am-note')), 'This is a snapshotted amendment.', 'The snapshot addendum print prview note renders properly');
    assert.equal(getPrintText(de('print-patient-am-status-name')), 'Accepted by George Bush M.D., M.F.A.', 'The snapshot addendum print prview status and provider name renders properly');
    click('#print-modal-controls .close-link');
});

test('Print chart allows filtering of active medications', async assert => {
    await visit(SUMMARY_URL);
    await click(PRINT_CHART_BUTTON);
    assert.throws(findWithAssert(PRINT_CHART_MODAL), 'The print chart modal appears when clicking the print button');
    await delayAsync(100);
    assert.throws(findWithAssert(`${de('print-medications-options')} .dropdown-print-select`), 'The medications print checkbox includes a dropdown for options');
    fillInCheckbox(`${de('print-medications-options')} .check-box__input`, false);
    await click(`${de('print-medications-options')} .dropdown-print-select button`);
    assert.equal(find(`.ember-tether .input-dropdown-list .input-dropdown-list-item`).length, 3, 'There are 3 medications print options');
    await click(`.ember-tether .input-dropdown-list .input-dropdown-list-item:contains('Active medications')`);
    assert.throws(findWithAssert(`${de('print-medications-options')} input.check-box__input:checked`), 'The medications option is checked when a selection is made');
    await click(`${PRINT_CHART_MODAL} footer .btn-primary`);
    assert.ok(findInPrint(`${de('print-medications')} h2:contains('Active Medications')`).length, 'Active medications display on print preview');
    assert.notOk(findInPrint(`${de('print-medications')} h2:contains('Historical Medications')`).length, 'Historical medications are hidden on print preview');
    click('#print-modal-controls .close-link');
});

test('Print chart allows filtering of historical medications', async assert => {
    await visit(SUMMARY_URL);
    await click(PRINT_CHART_BUTTON);
    assert.throws(findWithAssert(PRINT_CHART_MODAL), 'The print chart modal appears when clicking the print button');
    await delayAsync(100);
    assert.throws(findWithAssert(`${de('print-medications-options')} .dropdown-print-select`), 'The medications print checkbox includes a dropdown for options');
    await click(`${de('print-medications-options')} .dropdown-print-select button`);
    assert.equal(find(`.ember-tether .input-dropdown-list .input-dropdown-list-item`).length, 3, 'There are 3 medications print options');
    await click(`.ember-tether .input-dropdown-list .input-dropdown-list-item:contains('Historical medications')`);
    await click(`${PRINT_CHART_MODAL} footer .btn-primary`);
    assert.ok(findInPrint(`${de('print-medications')} h2:contains('Historical Medications')`).length, 'Historical medications display on print preview');
    assert.notOk(findInPrint(`${de('print-medications')} h2:contains('Active Medications')`).length, 'Active medications are hidden on print preview');
    click('#print-modal-controls .close-link');
});

test('Print chart allows filtering of all medications', async assert => {
    await visit(SUMMARY_URL);
    await click(PRINT_CHART_BUTTON);
    assert.throws(findWithAssert(PRINT_CHART_MODAL), 'The print chart modal appears when clicking the print button');
    await delayAsync(100);
    assert.throws(findWithAssert(`${de('print-medications-options')} .dropdown-print-select`), 'The medications print checkbox includes a dropdown for options');
    await click(`${de('print-medications-options')} .dropdown-print-select button`);
    assert.equal(find(`.ember-tether .input-dropdown-list .input-dropdown-list-item`).length, 3, 'There are 3 medications print options');
    await click(`.ember-tether .input-dropdown-list .input-dropdown-list-item:contains('All medications')`);
    await click(`${PRINT_CHART_MODAL} footer .btn-primary`);
    assert.ok(findInPrint(`${de('print-medications')} h2:contains('Historical Medications')`).length, 'Historical medications display on print preview');
    assert.ok(findInPrint(`${de('print-medications')} h2:contains('Active Medications')`).length, 'Active medications display on print preview');
    click('#print-modal-controls .close-link');
});

test('Print chart modal - Encounter - all medications', async assert => {
    await visit(ENCOUNTER_URL);
    await click(de('print-encounter-button'));
    await clickCheckBox('Medications');
    await click(`${PRINT_CHART_MODAL} footer .btn-primary`);
    assertPrintSection(assert, 'Historical Medications', 'The medications section is present in the print');
    assertPrintSection(assert, 'Active Medications', 'The medications section is present in the print');
    click('#print-modal-controls .close-link');
});

test('Print chart modal - Encounter - active medications', async assert => {
    await visit(ENCOUNTER_URL);
    await click(de('print-encounter-button'));
    await clickCheckBox('Medications');
    await click(`${de('print-medications-options')} .dropdown-print-select button`);
    await click(`.ember-tether .input-dropdown-list .input-dropdown-list-item:contains('Active medications')`);
    await click(`${PRINT_CHART_MODAL} footer .btn-primary`);
    assertPrintSection(assert, 'Active Medications', 'The medications section is present in the print');
    click('#print-modal-controls .close-link');
});

test('Print chart modal - Encounter - historical medications', async assert => {
    await visit(ENCOUNTER_URL);
    await click(de('print-encounter-button'));
    await clickCheckBox('Medications');
    await click(`${de('print-medications-options')} .dropdown-print-select button`);
    await click(`.ember-tether .input-dropdown-list .input-dropdown-list-item:contains('Historical medications')`);
    await click(`${PRINT_CHART_MODAL} footer .btn-primary`);
    assertPrintSection(assert, 'Historical Medications', 'The medications section is present in the print');
    click('#print-modal-controls .close-link');
});

test('Print chart all insurance plans', async assert => {
    await visit(SUMMARY_URL);
    await click(PRINT_CHART_BUTTON);
    await delayAsync(100);
    assert.dom(`${de('print-insurance-options')} .input-dropdown-button`).hasText('All', 'The default option is to print all insurance plans');
    await click(`${de('print-insurance-options')} .dropdown-print-select button`);
    assert.equal(find(`.ember-tether .input-dropdown-list .input-dropdown-list-item`).length, 3, 'There are 3 insurance print options');
    await click(`${PRINT_CHART_MODAL} footer .btn-primary`);
    // active insurance plans
    assert.dom(`${de('print-active-insurance')} h2`).hasText('Active insurance', 'Active insurance has its own section');
    assert.dom(`${de('print-active-insurance')} ${de('print-active-insurance-sequence-0')}`).hasText('Primary Payer');
    assert.dom(`${de('print-active-insurance')} ${de('print-active-insurance-sequence-1')}`).hasText('Secondary Payer');
    assert.dom(`${de('print-active-insurance')} ${de('print-active-insurance-sequence-2')}`).hasText('Tertiary Payer');
    assert.dom(`${de('print-active-insurance')} ${de('print-active-insurance-sequence-3')}`).hasText('Unknown or None Payer');
    assert.dom(`${de('print-active-insurance')} ${de('print-active-insurance-info-0')} ${de('print-patient-row-status')} .formatted-text`).hasText('Active');
    assert.dom(`${de('print-active-insurance')} ${de('print-active-insurance-info-1')} ${de('print-patient-row-status')} .formatted-text`).hasText('Active');
    assert.dom(`${de('print-active-insurance')} ${de('print-active-insurance-info-2')} ${de('print-patient-row-status')} .formatted-text`).hasText('Active');
    assert.dom(`${de('print-active-insurance')} ${de('print-active-insurance-info-3')} ${de('print-patient-row-status')} .formatted-text`).hasText('Active');
    // inactive insurance plans
    assert.dom(`${de('print-inactive-insurance')} h2`).hasText('Inactive insurance', 'Inactive insurance has its own section');
    assert.dom(`${de('print-inactive-insurance')} ${de('print-inactive-insurance-sequence-0')}`).hasText('Secondary Payer');
    assert.dom(`${de('print-inactive-insurance')} ${de('print-inactive-insurance-info-0')} ${de('print-patient-row-status')} .formatted-text`).hasText('Inactive');
    // payment Information
    assert.dom(`${de('print-payment-information')}`).exists('Payment information exists');

    click('#print-modal-controls .close-link');
});

test('Print chart allows filtering of active insurance plans', async assert => {
    await visit(SUMMARY_URL);
    await click(PRINT_CHART_BUTTON);
    await delayAsync(100);
    await click(`${de('print-insurance-options')} .dropdown-print-select button`);
    await click(`.ember-tether .input-dropdown-list .input-dropdown-list-item:contains('Active insurance')`);
    await click(`${PRINT_CHART_MODAL} footer .btn-primary`);
    // active insurance plans
    assert.dom(`${de('print-active-insurance')} h2`).hasText('Active insurance', 'Active insurance has its own section');
    assert.dom(`${de('print-active-insurance')} ${de('print-active-insurance-sequence-0')}`).hasText('Primary Payer');
    assert.dom(`${de('print-active-insurance')} ${de('print-active-insurance-sequence-1')}`).hasText('Secondary Payer');
    assert.dom(`${de('print-active-insurance')} ${de('print-active-insurance-sequence-2')}`).hasText('Tertiary Payer');
    assert.dom(`${de('print-active-insurance')} ${de('print-active-insurance-sequence-3')}`).hasText('Unknown or None Payer');
    assert.dom(`${de('print-active-insurance')} ${de('print-active-insurance-info-0')} ${de('print-patient-row-status')} .formatted-text`).hasText('Active');
    assert.dom(`${de('print-active-insurance')} ${de('print-active-insurance-info-1')} ${de('print-patient-row-status')} .formatted-text`).hasText('Active');
    assert.dom(`${de('print-active-insurance')} ${de('print-active-insurance-info-2')} ${de('print-patient-row-status')} .formatted-text`).hasText('Active');
    assert.dom(`${de('print-active-insurance')} ${de('print-active-insurance-info-3')} ${de('print-patient-row-status')} .formatted-text`).hasText('Active');
    // inactive insurance plans
    assert.dom(`${de('print-inactive-insurance')}`).doesNotExist('Inactive insurance plans is not in print view');
    // payment Information
    assert.dom(`${de('print-payment-information')}`).exists('Payment information exists');

    click('#print-modal-controls .close-link');
});

test('Print chart allows filtering of inactive insurance plans', async assert => {
    await visit(SUMMARY_URL);
    await click(PRINT_CHART_BUTTON);
    await delayAsync(100);
    assert.dom(`${de('print-insurance-options')} .input-dropdown-button`).hasText('All', 'The default option is to print all insurance plans');
    await click(`${de('print-insurance-options')} .dropdown-print-select button`);
    assert.equal(find(`.ember-tether .input-dropdown-list .input-dropdown-list-item`).length, 3, 'There are 3 insurance print options');
    await click(`.ember-tether .input-dropdown-list .input-dropdown-list-item:contains('Inactive insurance')`);
    await click(`${PRINT_CHART_MODAL} footer .btn-primary`);
    // active insurance plans
    assert.dom(`${de('print-active-insurance')}`).doesNotExist('Active insurance plans is not in print view');
    // inactive insurance plans
    assert.dom(`${de('print-inactive-insurance')} h2`).hasText('Inactive insurance', 'Inactive insurance has its own section');
    assert.dom(`${de('print-inactive-insurance')} ${de('print-inactive-insurance-sequence-0')}`).hasText('Secondary Payer');
    assert.dom(`${de('print-inactive-insurance')} ${de('print-inactive-insurance-info-0')} ${de('print-patient-row-status')} .formatted-text`).hasText('Inactive');
    // payment Information
    assert.dom(`${de('print-payment-information')}`).exists('Payment information exists');

    click('#print-modal-controls .close-link');
});
