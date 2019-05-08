import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';
import getText from 'boot/tests/helpers/get-text';

const MODAL_SELECTOR = '.modal.recent-activity';
const ACTIONS_MENU_ITEM = `${de('actions-menu-options')} a:contains('View recent activity')`;
const PATIENT_PRACTICE_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const SUMMARY_URL = `/PF/charts/patients/${PATIENT_PRACTICE_GUID}/summary`;
const ENCOUNTER_URL = `/PF/charts/patients/${PATIENT_PRACTICE_GUID}/encounter/UNSIGNED_TRANSCRIPT_GUID`;

function auditItem(guid) {
    return `${MODAL_SELECTOR} [data-guid="${guid}"] ${de('audit-item-description')}`;
}
function auditItemText(guid) {
    return getText(auditItem(guid));
}

moduleForAcceptanceAuth('Acceptance - Core - Clinical | Recent patient activity - v2');

test('Click encounter link from recent patient activity modal', async assert => {
    visit(SUMMARY_URL);
    click(de('actions-menu'));
    await click(ACTIONS_MENU_ITEM);
    await wait();
    assert.throws(findWithAssert(MODAL_SELECTOR), 'The recent activity modal is displayed.');
    assert.equal(auditItemText('33bb0de7-3ec6-44d9-baae-67e07206d926'), 'Some Dude, MD created a referral summary document', 'The first audit item description renders correctly');
    assert.equal(auditItemText('0113179b-abc1-4ca1-99a0-7a8b89fdb380'), 'Some Dude, MD shown 1 Clinical Decision Support alerts on SOAP Note chart note with date of service = 3/8/2016', 'CDS item renders correctly');
    await click(`${auditItem('0113179b-abc1-4ca1-99a0-7a8b89fdb380')} a`);
    assert.notOk(find(MODAL_SELECTOR).length, 'The recent activity modal is no longer visible');
    assert.equal(currentURL(), ENCOUNTER_URL, 'The encounter was opened');
});

test('Refresh and close patient activity modal', async assert => {
    let getCallCount = 0;
    server.get('AuditEndpoint/api/v1/auditEvent/patient/:patientPracticeGuid', ({ db }, request) => {
        getCallCount++;
        return db.auditEvents.where({ patientPracticeGuid: request.params.patientPracticeGuid })[0];
    });
    visit(SUMMARY_URL);
    click(de('actions-menu'));
    await click(ACTIONS_MENU_ITEM);
    await click(de('recent-activity-refresh'));
    assert.equal(getCallCount, 2, 'The data was refreshed when the refresh button was clicked');
    await click(de('recent-activity-done'));
    assert.notOk(find(MODAL_SELECTOR).length, 'The recent activity modal is no longer visible');
});
