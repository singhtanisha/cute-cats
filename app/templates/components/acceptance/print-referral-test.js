import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';
import getPrintText from 'boot/tests/helpers/get-text-in-print';

const SIGNED_ENCOUNTER_GUID = '82a597e5-b1b8-46e4-8a07-5c3a4f778e95';
const UNSIGNED_ENCOUNTER_GUID = 'UNSIGNED_TRANSCRIPT_GUID';
const PATIENT_PRACTICE_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const SIGNED_ENCOUNTER_URL = `/PF/charts/patients/${PATIENT_PRACTICE_GUID}/encounter/${SIGNED_ENCOUNTER_GUID}`;
const UNSIGNED_ENCOUNTER_URL = `/PF/charts/patients/${PATIENT_PRACTICE_GUID}/encounter/${UNSIGNED_ENCOUNTER_GUID}`;
const ADD_REFERRAL_ACTION_ITEM = `${de('actions-menu-options')} a:contains('Add referral')`;

moduleForAcceptanceAuth('Acceptance - Core - Charting | Encounter print referral preview');

test('Print referral preview test - Attached signed encounter (snapshots for seen and signed by)', async assert => {
    const currentDate = moment().format('MM/DD/YYYY');
    visit(SIGNED_ENCOUNTER_URL);
    click(de('actions-menu'));
    await click(ADD_REFERRAL_ACTION_ITEM);
    assert.ok(find('.referral-detail').length > 0, 'Referral details modal appears');
    assert.ok(find('.right-module-search-results').length > 0, 'Module search results appears');
    click('.selected-recipients');
    await click('.referral-list.contacts div:first');
    assert.equal(find('.pill.contact').text().trim(), 'Claire Grimmett', 'Selected referral to name renders properly in modal');
    await click('.selected-attachments');
    assert.ok(find('.attachments-tab').length > 0, 'Attachments list renders');
    await click('.referral-compliance-attachment-row:first');
    assert.equal(find('.pill.attachment').text().trim(), 'SOAP Note 09/14/2016', 'Signed encounter attachment was added to the referral');
    await click(`.btn:contains('Preview')`);
    // Confirm currently signed by provider for the referral, which should not be snapshotted.

    // Confirm patient information in the header
    assert.equal(getPrintText(de('patient-name')), 'Some Baby', 'Patient name renders properly on print referral preview.');
    assert.equal(getPrintText(de('patient-dob')), '07/07/1983', 'Patient date of birth renders properly on print referral preview.');
    assert.equal(getPrintText(de('patient-sex')), 'Male', 'Patient sex renders properly on print referral preview.');
    assert.equal(getPrintText(de('patient-homePhone')), '', 'Patient home phone renders properly on print referral preview.');
    assert.equal(getPrintText(de('patient-mobilePhone')), '415-555-1212', 'Patient mobile phone renders properly on print referral preview.');
    assert.equal(getPrintText(de('patient-officePhone')), '', 'Patient office phone renders properly on print referral preview.');
    assert.equal(getPrintText(de('patient-email')), '', 'Patient email renders properly on print referral preview.');
    assert.equal(getPrintText(de('patient-address')), '123 4th Street', 'Patient address(street) renders properly on print referral preview.');
    assert.equal(getPrintText(de('patient-city-state-zip')), 'San Rafael, CA 94901', 'Patient address (city + state + zipcode) renders properly on print referral preview.');

    // Confirm facility informtion in the header
    assert.equal(getPrintText(de('print-header-facility-name')), 'Rosalise Ron Practice', 'Facility name renders properly on print referral preview.');
    assert.equal(getPrintText(de('print-header-facility-phone')), '(555) 555-0000', 'Facility phone number renders properly on print referral preview.');
    assert.equal(getPrintText(de('print-header-facility-fax')), '', 'Facility fax number renders properly on print referral preview.');
    assert.equal(getPrintText(de('print-header-facility-address')), '123', 'Facility address (street) renders properly on print referral preview.');
    assert.equal(getPrintText(de('print-header-facility-city-state-zip')), 'Schenectady, NY 12345', 'Facility address (city + state + zipcode) renders properly on print referral preview.');

    // Confirm referral/response letter fields
    assert.equal(getPrintText(de('print-referral-recipient-name')), 'To: Claire Grimmett', 'Referral recipient name renders properly on print referral preview.');
    assert.equal(getPrintText(de('print-referral-sent-date')), 'Sent: ' + currentDate, 'Referral sent date renders properly on print referral preview.');
    assert.equal(getPrintText(de('print-referral-patient-name')), 'Regarding: Some Baby', 'Referral patient name renders properly on print referral preview.');

    // Confirm patient vitals fields
    assert.equal(getPrintText(de('patient-vital-height')), '36 in', 'Patient height renders properly on print referral preview.');
    assert.equal(getPrintText(de('patient-vital-weight')), '45 lb', 'Patient weight renders properly on print referral preview.');
    assert.equal(getPrintText(de('patient-vital-bmi')), '24.41', 'Patient BMI renders properly on print referral preview.');
    assert.equal(getPrintText(de('patient-vital-blood-pressure')), '120 / 33 mmHg', 'Patient blood pressure renders properly on print referral preview.');
    assert.equal(getPrintText(de('patient-vital-temp')), '', 'Patient temperature renders properly on print referral preview.'); //FIXME: possible bug: should temperature default to 'n/a' like all other vitals?
    assert.equal(getPrintText(de('patient-vital-pulse')), 'n/a', 'Patient pulse renders properly on print referral preview.');
    assert.equal(getPrintText(de('patient-vital-resp-rate')), 'n/a', 'Patient respiratory rate renders properly on print referral preview.');
    assert.equal(getPrintText(de('patient-vital-head-circ')), 'n/a', 'Patient head circumference renders properly on print referral preview.');

    // Confirm diagnosis fields
    assert.equal(getPrintText(de('diagnosis-type') + ':eq(0)'), 'ICD-9', 'Diagnosis type renders properly on print referral preview.');
    assert.equal(getPrintText(de('diagnosis-code') + ':eq(0)'), '784.0', 'Diagnosis code renders properly on print referral preview.');
    assert.equal(getPrintText(de('diagnosis-description') + ':eq(0)'), 'Headache','Diagnosis description renders properly on print referral preview.');
    assert.equal(getPrintText(de('diagnosis-start-stop-date') + ':eq(0)'), '-', 'Diagnosis start and stop date renders properly on print referral preview');

    // Confirm SOAP fields
    assert.equal(getPrintText(de('patient-subjective')), 'Some subjective', 'Subjective field renders properly on print referral preview.');
    assert.equal(getPrintText(de('patient-objective')), '', 'Objective field renders properly on print referral preview.');
    assert.equal(getPrintText(de('patient-assessment')), 'Some assessment', 'Assessment field renders properly on print referral preview.');
    assert.equal(getPrintText(de('patient-plan')), 'Some plan', 'Plan field renders properly on print referral preview.');

    // Confirm active medication information
    assert.equal(getPrintText(de('active-medication-name') + ':eq(0)'), 'Trandate 200 MG Oral Tablet - Labetalol HCl Oral Tablet 200 MG', 'Medication information renders properly on print referral preview.');
    assert.equal(getPrintText(de('active-medication-sig') + ':eq(0)'), 'take every 4 to 6 hours', 'Sig renders properly on print referral preview.');
    assert.equal(getPrintText(de('active-medication-start-stop-date') + ':eq(0)'), 'n/a - n/a', 'Start and stop date renders properly on print referral preview.');
    assert.equal(getPrintText(de('active-medication-associated-dx') + ':eq(0)'), '', 'Associated dx renders properly on print referral preview.'); //FIXME: possible bug: looks like 'associated dx' doesn't have a component to render into

    // Confirm headers for encounter seen by provider
    assert.equal(getPrintText(de('print-referral-seen-by-header')), 'SEEN BY', 'Encounter seen by header renders properly on print referral preview.');
    assert.equal(getPrintText(de('print-referral-seen-on-header')), 'SEEN ON', 'Encounter seen on header renders properly on print referral preview.');

    // Confirm content for encounter seen by.
    assert.equal(getPrintText(de('print-referral-seen-by-provider-name')), 'William Clinton F.B.I.', 'Print referral encounter seen by provider name (snapshot) renders properly.');
    assert.equal(getPrintText(de('print-referral-seen-by-provider-date')), '01/05/2016', 'Print referral encounter seen by provider date (snapshot) renders properly.');

    // Confirm headers for encounter signed by
    assert.equal(getPrintText(de('print-referral-signed-by-header')), 'Signed By', 'Encounter signed by header renders properly on print referral preview.');
    assert.equal(getPrintText(de('print-referral-signed-on-header')), 'Signed On', 'Encounter signed on header renders properly on print referral preview.');

    // Confirm content for encounter signed by provider.
    assert.equal(getPrintText(de('print-referral-signed-by-provider-name')), 'George Bush M.D., M.F.A.', 'Print referral encounter signed by provider name (snapshot) renders properly.');
    assert.equal(getPrintText(de('print-referral-signed-by-provider-date')), '01/06/2016', 'Print referral encounter signed by provider date (snapshot) renders properly.');

    // Confirm encounter addendum headers
    assert.equal(getPrintText(de('print-referral-addendum-header')), 'Addendum', 'Encounter addendum header renders properly on print referral preview.');
    assert.equal(getPrintText(de('print-referral-addendum-provider-name-header')), 'Provider Name', 'Encounter addendum name header renders properly on print referral preview.');
    assert.equal(getPrintText(de('print-referral-addendum-modified-on-header')), 'Modified On', 'Encounter addendum modified on header renders properly on print referral preview.');

    // Confirm encounter addendum content
    assert.equal(getPrintText(de('print-referral-addenda-note')), 'This is a snapshotted amendment.', 'Print referral encounter addendum note (snapshot) renders properly.');
    assert.equal(getPrintText(de('print-referral-addenda-provider-name')), 'George Bush M.D., M.F.A.', 'Print referral encounter addendum provider name (snapshot) renders properly.');
    assert.equal(getPrintText(de('print-referral-addenda-modified-on-date')), moment('2016-09-27T00:00:00Z').format('MM/DD/YYYY'), 'Print referral encounter addendum provider modified date (snapshot) renders properly.');

    click('#print-modal-controls .close-link');
    click('.order-referral-pane .close-box');
});

test('Print referral preview test - Attached unsigned encounter without snapshots (seen by)', async assert => {
    visit(UNSIGNED_ENCOUNTER_URL);
    click(de('actions-menu'));
    await click(ADD_REFERRAL_ACTION_ITEM);
    assert.ok(find('.referral-detail').length > 0, 'Referral details modal appears');
    assert.ok(find('.right-module-search-results').length > 0, 'Module search results appears');
    click('.selected-recipients');
    click('.referral-list.contacts div:first');
    await click('.selected-attachments');
    assert.ok(find('.attachments-tab').length > 0, 'Attachments list renders');
    await click('.referral-compliance-attachment-row:eq(1)');
    assert.equal(find('.pill.attachment').text().trim(), 'SOAP Note 09/13/2016', 'Unsigned encounter attachment was added to the referral');
    await click(`.btn:contains('Preview')`);
    // Confirm headers for encounter seen by provider
    assert.equal(getPrintText(de('print-referral-seen-by-header')), 'SEEN BY', 'Encounter seen by header renders properly on print referral preview.');
    assert.equal(getPrintText(de('print-referral-seen-on-header')), 'SEEN ON', 'Encounter seen on header renders properly on print referral preview.');

    // Confirm content for encounter seen by.
    assert.equal(getPrintText(de('print-referral-seen-by-provider-name')), 'Provider Bob MD', 'Print referral encounter seen by provider name (no snapshot) renders properly for attached unsigned encounter.');
    assert.equal(getPrintText(de('print-referral-seen-by-provider-date')), '03/08/2016', 'Print referral encounter seen by provider date (no snapshot) renders properly for attached unsigned encounter.');

    // Confirm headers for encounter signed by
    assert.equal(getPrintText(de('print-referral-signed-by-header')), 'Signed By', 'Encounter signed by header renders properly on print referral preview for unsigned encounter.');
    assert.equal(getPrintText(de('print-referral-signed-on-header')), 'Signed On', 'Encounter signed on header renders properly on print referral preview for unsigned encounter.');

    // Confirm content for encounter signed by provider.
    assert.equal(getPrintText(de('print-referral-signed-by-provider-name')), '', 'Print referral encounter signed by provider name is empty for unsigned encounter.');
    assert.equal(getPrintText(de('print-referral-signed-by-provider-date')), 'n/a', 'Print referral encounter seen by provider date is n/a for unsigned encounter.');
    click('#print-modal-controls .close-link');
    click('.order-referral-pane .close-box');
});

test('Print referral preview test - Attached signed encounter without snapshots (seen by/signed by)', async assert => {
    server.get('ChartingEndpoint/api/v3/patients/:id/encounters/:chartid', ({ db }, request) => {
        const transcriptGuid = request.params.chartid;
        const encounter = db.encounters.where({ transcriptGuid })[0];
        delete encounter.seenByProviderSnapshotGuid;
        delete encounter.signedByProviderSnapshotGuid;
        return encounter;
    });
    visit(`/PF/charts/patients/${PATIENT_PRACTICE_GUID}`);
    visit(SIGNED_ENCOUNTER_URL);
    click(de('actions-menu'));
    await click(ADD_REFERRAL_ACTION_ITEM);
    assert.ok(find('.referral-detail').length > 0, 'Referral details modal appears');
    assert.ok(find('.right-module-search-results').length > 0, 'Module search results appears');
    click('.selected-recipients');
    click('.referral-list.contacts div:first');
    await click('.selected-attachments');
    assert.ok(find('.attachments-tab').length > 0, 'Attachments list renders');
    await click('.referral-compliance-attachment-row:eq(0)');
    assert.equal(find('.pill.attachment').text().trim(), 'SOAP Note 09/14/2016', 'Signed encounter (no snapshots) attachment was added to the referral');
    await click(`.btn:contains('Preview')`);
    // Confirm headers for encounter seen by provider
    assert.equal(getPrintText(de('print-referral-seen-by-header')), 'SEEN BY', 'Encounter seen by header renders properly on print referral preview.');
    assert.equal(getPrintText(de('print-referral-seen-on-header')), 'SEEN ON', 'Encounter seen on header renders properly on print referral preview.');

    // Confirm content for encounter seen by.
    assert.equal(getPrintText(de('print-referral-seen-by-provider-name')), 'Provider Bob MD', 'Print referral encounter seen by provider name (no snapshot) renders properly for attached signed encounter.');
    assert.equal(getPrintText(de('print-referral-seen-by-provider-date')), '01/05/2016', 'Print referral encounter seen by provider date (no snapshot) renders properly for attached unsigned encounter.');

    // Confirm headers for encounter signed by
    assert.equal(getPrintText(de('print-referral-signed-by-header')), 'Signed By', 'Encounter signed by header renders properly on print referral preview for signed encounter.');
    assert.equal(getPrintText(de('print-referral-signed-on-header')), 'Signed On', 'Encounter signed on header renders properly on print referral preview for signed encounter.');

    // Confirm content for encounter signed by provider.
    assert.equal(getPrintText(de('print-referral-signed-by-provider-name')), 'Provider Bob MD', 'Print referral encounter signed by provider name (no snapshot) renders for signed encounter.');
    assert.equal(getPrintText(de('print-referral-signed-by-provider-date')), '01/06/2016', 'Print referral encounter signed by provider date (no snapshot) renders for signed encounter.');
    click('#print-modal-controls .close-link');
    click('.order-referral-pane .close-box');
});

test('Print referral preview test - Attached signed encounter (snapshots for seen and signed by)', async assert => {
    visit(SIGNED_ENCOUNTER_URL);
    click(de('actions-menu'));
    await click(ADD_REFERRAL_ACTION_ITEM);
    assert.ok(find('.referral-detail').length > 0, 'Referral details modal appears');
    assert.ok(find('.right-module-search-results').length > 0, 'Module search results appears');
    click('.selected-recipients');
    await click('.referral-list.contacts div:first');
    assert.equal(find('.pill.contact').text().trim(), 'Claire Grimmett', 'Selected referral to name renders properly in modal');
    await click('.selected-attachments');
    assert.ok(find('.attachments-tab').length > 0, 'Attachments list renders');
    await click('.referral-compliance-attachment-row:first');
    assert.equal(find('.pill.attachment').text().trim(), 'SOAP Note 09/14/2016', 'Signed encounter attachment was added to the referral');
    await click(`.btn:contains('Preview')`);
    // Confirm currently signed by provider for the referral, which should not be snapshotted.
    assert.equal(getPrintText(de('print-referral-signed-by-current-provider')), 'Electronically signed by Rosalise Ron', 'Print referral signed by current provider name renders properly.');

    // Confirm headers for encounter seen by provider
    assert.equal(getPrintText(de('print-referral-seen-by-header')), 'SEEN BY', 'Encounter seen by header renders properly on print referral preview.');
    assert.equal(getPrintText(de('print-referral-seen-on-header')), 'SEEN ON', 'Encounter seen on header renders properly on print referral preview.');

    // Confirm content for encounter seen by.
    assert.equal(getPrintText(de('print-referral-seen-by-provider-name')), 'William Clinton F.B.I.', 'Print referral encounter seen by provider name (snapshot) renders properly.');
    assert.equal(getPrintText(de('print-referral-seen-by-provider-date')), '01/05/2016', 'Print referral encounter seen by provider date (snapshot) renders properly.');

    // Confirm headers for encounter signed by
    assert.equal(getPrintText(de('print-referral-signed-by-header')), 'Signed By', 'Encounter signed by header renders properly on print referral preview.');
    assert.equal(getPrintText(de('print-referral-signed-on-header')), 'Signed On', 'Encounter signed on header renders properly on print referral preview.');

    // Confirm content for encounter signed by provider.
    assert.equal(getPrintText(de('print-referral-signed-by-provider-name')), 'George Bush M.D., M.F.A.', 'Print referral encounter signed by provider name (snapshot) renders properly.');
    assert.equal(getPrintText(de('print-referral-signed-by-provider-date')), '01/06/2016', 'Print referral encounter signed by provider date (snapshot) renders properly.');

    // Confirm encounter addendum headers
    assert.equal(getPrintText(de('print-referral-addendum-header')), 'Addendum', 'Encounter addendum header renders properly on print referral preview.');
    assert.equal(getPrintText(de('print-referral-addendum-provider-name-header')), 'Provider Name', 'Encounter addendum name header renders properly on print referral preview.');
    assert.equal(getPrintText(de('print-referral-addendum-modified-on-header')), 'Modified On', 'Encounter addendum modified on header renders properly on print referral preview.');

    // Confirm encounter addendum content
    assert.equal(getPrintText(de('print-referral-addenda-note')), 'This is a snapshotted amendment.', 'Print referral encounter addendum note (snapshot) renders properly.');
    assert.equal(getPrintText(de('print-referral-addenda-provider-name')), 'George Bush M.D., M.F.A.', 'Print referral encounter addendum provider name (snapshot) renders properly.');
    assert.equal(getPrintText(de('print-referral-addenda-modified-on-date')), moment('2016-09-27T00:00:00Z').format('MM/DD/YYYY'), 'Print referral encounter addendum provider modified date (snapshot) renders properly.');

    click('#print-modal-controls .close-link');
    click('.order-referral-pane .close-box');
});
