import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';

const UNSIGNED_TRANSCRIPT_GUID = 'd2573d89-bb8b-494e-8a79-b94d02f282f2';
const PATIENT_PRACTICE_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const ENCOUNTER_URL = `/PF/charts/patients/${PATIENT_PRACTICE_GUID}/encounter/${UNSIGNED_TRANSCRIPT_GUID}`;
const MEDICATION_PRINT_PREVIEW_BUTTON = '.print-menu-group button';
const ALL_MEDICATIONS = de('medication-print-preview-dropdown') + ' a:eq(0)';
const ACTIVE_MEDICATIONS = de('medication-print-preview-dropdown') + ' a:eq(1)';
const HISTORICAL_MEDICATIONS = de('medication-print-preview-dropdown') + ' a:eq(2)';
const ACTIVE_MED_HEADER = '.header-row h2:contains(Active Medications)';
const HISTORICAL_MED_HEADER = '.header-row h2:contains(Historical Medications)';
const CLOSE_BUTTON = '.close-link';

moduleForAcceptanceAuth('Acceptance - Core - Charting | Print Medication Print Preview within an Encounter - All, Active, or Historical');

test('Medication Print Preview - Encounter - all medications', async assert => {
    await visit(ENCOUNTER_URL);
    await click(MEDICATION_PRINT_PREVIEW_BUTTON);
    await click(ALL_MEDICATIONS);
    assert.equal(find(ACTIVE_MED_HEADER).length, 1, 'All: Active Medications header renders correctly.');
    assert.equal(find(HISTORICAL_MED_HEADER).length, 1, 'All: Historical Medications header renders correctly.');
    click(CLOSE_BUTTON);
});

test('Medication Print Preview - Encounter - active medications', async assert => {
    await visit(ENCOUNTER_URL);
    await click(MEDICATION_PRINT_PREVIEW_BUTTON);
    await click(ACTIVE_MEDICATIONS);
    assert.equal(find(ACTIVE_MED_HEADER).length, 1, 'Active Only: Active Medications header renders correctly.');
    assert.equal(find(HISTORICAL_MED_HEADER).length, 0, 'Active Only: Historical Medications header does not render.');
    click(CLOSE_BUTTON);
});

test('Medication Print Preview - Encounter - historical medications', async assert => {
    await visit(ENCOUNTER_URL);
    await click(MEDICATION_PRINT_PREVIEW_BUTTON);
    await click(HISTORICAL_MEDICATIONS);
    assert.equal(find(ACTIVE_MED_HEADER).length, 0, 'Historical Only: Active Medications header does not render.');
    assert.equal(find(HISTORICAL_MED_HEADER).length, 1, 'Historical Only: Historical Medications header renders correctly.');
    click(CLOSE_BUTTON);
});
