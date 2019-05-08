import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';
import getText from 'boot/tests/helpers/get-text';

const ENCOUNTER_GUID = 'SIGNED_TRANSCRIPT_GUID';
const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const ADDENDUM_TEXT = 'This is a test addendum';

moduleForAcceptanceAuth('Acceptance - Core - Charting | Signed encounter');

test('Can only add addendum to signed encounter', async assert => {
    server.post(`ChartingEndpoint/api/v3/patients/${PATIENT_GUID}/encounters/${ENCOUNTER_GUID}/amendments`, ({ db }, request) => {
        const addendum = JSON.parse(request.requestBody);
        assert.equal(addendum.note, ADDENDUM_TEXT, 'The addendum was added with the correct text');
        addendum.id = 0;
        return addendum;
    });
    await visit('/PF/charts/patients/' + PATIENT_GUID + '/encounter/' + ENCOUNTER_GUID);
    // Confirm Add Addendum rather than sign or save buttons, and confirm certain sections disappear from signed encounter view
    assert.equal(find('.btn-save-encounter').length, 0, 'No save button');
    assert.equal(find('.btn-sign').length, 0, 'No sign button');
    assert.equal(find('.btn-sign-confirm').length, 0, 'No sign confirmation button');
    assert.equal(find('.btn-add-addendum').length, 1, 'Add addendum button visible');
    assert.equal(find('.patient-health-concerns-list').length, 0, 'No Health Concerns section');
    assert.equal(find('.encounter-diagnoses-list').length, 0, 'No Diagnoses section');
    assert.equal(find('.encounter-allergies-container').length, 0, 'No Allergies section');
    assert.equal(find('.medications').length, 0, 'No Medications section');
    assert.equal(find('#social-history').length, 0, 'No Social history section');
    assert.equal(find('#past-medical-history').length, 0, 'No Past medical history section');

    // Confirm that data cannot be changed
    assert.equal(find('#dFinalizeQOC input:enabled').length, 0, 'All QOC checkboxes disabled');

    // Confirm the encounter details snapshot data
    assert.equal(getText(`${de('encounter-details-seen-by')}:first`), 'William Clinton F.B.I.', 'The seen by provider is displayed with the correct snapshot');
    assert.ok(getText(de('encounter-details-signed-by')).indexOf('George Bush M.D., M.F.A.') !== -1, 'The signed by provider is displayed with the correct snapshot');
    assert.equal(getText(`${de('encounter-details-facility')}:first`), 'Above the SuperDuper', 'The facility is displayed with the correct snapshot');

    await click('.btn-add-addendum');
    // Confirm that addendum dialog shows up, and enter information
    assert.equal(find('.encounter-addendum:visible').length, 1, 'Addendum panel is visible');
    fillIn('.encounter-addendum textarea', ADDENDUM_TEXT);
    click('.encounter-addendum .btn-primary');
});

test('Can load and add a snapshotted addendum to encounter', async assert => {
    server.post(`ChartingEndpoint/api/v3/patients/${PATIENT_GUID}/encounters/${ENCOUNTER_GUID}/amendments`, () => ({
        'id':0,
        'note':'The. Greatest.',
        'source':'Doctor',
        'status':'Accepted',
        'providerGuid':'eaa90f53-9dfa-4c2a-93db-83f3b3243d5b',
        'providerSnapshotGuid': '0fb30e40-e50d-4c50-b72f-0936faee00f4',
        'lastModifiedDateTimeUtc':'2016-10-07T18:35:24.6367308Z'
    }));
    await visit('/PF/charts/patients/' + PATIENT_GUID + '/encounter/' + ENCOUNTER_GUID);
    // Test loading addendum uses snapshotted provider
    assert.equal(find('.btn-save-encounter').length, 0, 'No save button');
    assert.equal(find('.btn-sign').length, 0, 'No sign button');
    assert.equal(getText(de('encounter-addendum-note')), 'This is a snapshotted amendment.', 'The encounter has the proper snapshotted addendum note.');
    assert.equal(getText(de('encounter-addendum-status-name')), 'Accepted by George Bush M.D., M.F.A.', 'The encounter has the proper snapshotted addendum status and provider name.');

    // Test adding encounter renders snapshotted information
    await click('.btn-add-addendum');
    await fillIn('.encounter-addendum textarea', 'Adding an addenum should use snapshot.');
    await click('.right-module .btn-primary');
    assert.equal(getText(de('encounter-addendum-status-name') + ':eq(1)'), 'Accepted by William Clinton F.B.I.', 'Added addendum uses snapshotted name.');
});
