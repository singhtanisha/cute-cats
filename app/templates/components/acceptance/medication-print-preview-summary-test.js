import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';
import getPrintText from 'boot/tests/helpers/get-text-in-print';

const PATIENT_PRACTICE_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const SUMMARY_URL = '/PF/charts/patients/' + PATIENT_PRACTICE_GUID + '/summary';
const MEDICATION_PRINT_PREVIEW_BUTTON = 'button.print-icon-button';
const ALL_MEDICATIONS = de('print-medications-dropdown') + ' a:eq(0)';
const ACTIVE_MEDICATIONS = de('print-medications-dropdown') + ' a:eq(1)';
const HISTORICAL_MEDICATIONS = de('print-medications-dropdown') + ' a:eq(2)';
const ACTIVE_MED_HEADER = '.header-row h2:contains(Active Medications)';
const HISTORICAL_MED_HEADER = '.header-row h2:contains(Historical Medications)';
const CLOSE_BUTTON = '.close-link';

moduleForAcceptanceAuth('Acceptance - Core - Charting | Print Medication Print Preview within Summary - All, Active, or Historical - v2');

test('Medication Print Preview - Summary - all medications', async assert => {
    await visit(SUMMARY_URL);
    await click(MEDICATION_PRINT_PREVIEW_BUTTON);
    await click(ALL_MEDICATIONS);
    assert.equal(find(ACTIVE_MED_HEADER).length, 1, 'All: Active Medications header renders correctly.');
    assert.equal(find(HISTORICAL_MED_HEADER).length, 1, 'All: Historical Medications header renders correctly.');

    assert.equal(getPrintText('head title'), 'Medications - Patient: Some L Baby DOB: 02/01/2013 PRN: BS186029', 'The print preview has the correct header');
    assert.equal(getPrintText(de('print-header-patient-name')), 'Some L Baby', 'The patient name renders correctly on the print preview');
    assert.equal(getPrintText(de('print-header-facility-name')), 'Rosalise Ron Practice', 'The facility name renders correctly on the print preview');

    // Confirm headers for active/historical medications
    assert.equal(find(`${de('print-medications')} h2:contains('Active Medications')`).text(), 'Active Medications', 'There is an Active Medications header');
    assert.equal(find(`${de('print-medications')} h2:contains('Historical Medications')`).text(), 'Historical Medications', 'There is a Historical Medications header');

    // Confirm column headers under active and historical medications
    assert.equal(find('.row.header-row .col-xs-4:contains(\'Medication\')').length, 2, 'There are two medication rows under Active and Historical medications ');
    assert.equal(find(`.row.header-row:contains('Sig')`).length, 2, 'There is a sig column under active and historical medications');
    assert.equal(find(`.row.header-row:contains('Start/Stop')`).length, 2, 'There is a start/stop date column under active and historical medications');
    assert.equal(find(`.row.header-row:contains('Associated Dx')`).length, 2, 'There is an associated diagnosis column under active and historical medications');
    // Confirm active medications
    assert.equal(find(`${de('medication-item-text')}:eq(0)`).text().trim(), 'methylTESTOSTERone (Methitest) 10 mg oral tablet', 'There is a medication present with generic name, product strength, route and dose form for active medication.');
    assert.equal(find(`${de('medication-item-sig')}:eq(0)`).text().trim(), '4 times a day', 'There is a medication sig present for active medication.');
    assert.equal(find(`${de('medication-item-dates')}:eq(0)`).text().trim().replace('\n', ''), '02/10/15 -', 'Medication item dates start and have not stopped yet for active medication.');
    assert.equal(find(`${de('medication-item-diagnosis')}:eq(0)`).text().trim(), '-', 'There is no diagnosis for this medication present for active medication.');

    // Confirm historical medications
    assert.equal(find(`${de('medication-item-text')}:eq(1)`).text().trim(), 'Alprazolam (Xanax) 0.25 MG Oral Tablet', 'There is a medication present with generic name, product strength, route and dose form for historical medication.');
    assert.equal(find(`${de('medication-item-sig')}:eq(1)`).text().trim(), '4 times a day', 'There is a medication sig present for historical medication.');
    assert.equal(find(`${de('medication-item-dates')}:eq(1)`).text().trim().replace('\n', ''), '09/27/16 - 09/30/16', 'Medication item dates start / stop is present for historical medication.');
    assert.equal(find(`${de('medication-item-diagnosis')}:eq(1)`).text().trim(), 'Fracture of femur', 'There is a diagnosis for this medication present for historical medication.');

    click(CLOSE_BUTTON);
});

test('Medication Print Preview - Summary - active medications', async assert => {
    await visit(SUMMARY_URL);
    await click(MEDICATION_PRINT_PREVIEW_BUTTON);
    await click(ACTIVE_MEDICATIONS);
    assert.equal(find(ACTIVE_MED_HEADER).length, 1, 'Active Only: Active Medications header renders correctly.');
    assert.equal(find(HISTORICAL_MED_HEADER).length, 0, 'Active Only: Historical Medications header does not render.');
    click(CLOSE_BUTTON);
});

test('Medication Print Preview - Summary - historical medications', async assert => {
    await visit(SUMMARY_URL);
    await click(MEDICATION_PRINT_PREVIEW_BUTTON);
    await click(HISTORICAL_MEDICATIONS);
    assert.equal(find(ACTIVE_MED_HEADER).length, 0, 'Historical Only: Active Medications header does not render.');
    assert.equal(find(HISTORICAL_MED_HEADER).length, 1, 'Historical Only: Historical Medications header renders correctly.');
    click(CLOSE_BUTTON);
});
