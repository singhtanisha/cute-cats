import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';

const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const ACTIONS_MENU_ITEM = `${de('actions-menu-options')} a:contains('Copy link to patient')`;
const MODAL_ELEMENT = '.modal.info.copy-modal';
const EXPECTED_LINK = '/PF/charts/patients/ecd212c3-5c99-499e-b3c6-b2645b8a4c98/summary';

moduleForAcceptanceAuth('Acceptance - Core - Charting | Copy link to patient - v2');

test('Copy link to patient displays properly in summary', async assert => {
    assert.expect(5);
    await visit('/PF/charts/patients/' + PATIENT_GUID + '/summary/');
    await click(de('actions-menu'));
    await click(ACTIONS_MENU_ITEM);
    assert.ok(find(`${MODAL_ELEMENT}:visible`).length > 0, 'Copy link to patient modal appears');
    assert.ok(find(`${MODAL_ELEMENT} header:contains('Copy a link to this patient')`).length > 0, 'Copy link to patient modal has correct title');
    assert.ok(find(`${MODAL_ELEMENT} .copy-modal-content:contains('Copy the link below to access this patient directly in the future')`).length > 0, 'Copy link to patient modal shows correct instructions');
    assert.ok(find(`${MODAL_ELEMENT} .copy-modal-content textarea`).val().indexOf(EXPECTED_LINK) !== -1, 'Copy link to patient modal contains correct link in text area');

    await click(`${MODAL_ELEMENT} .btn-primary`);
    assert.ok(find(`${MODAL_ELEMENT}:visible`).length < 1, 'Copy link to patient modal closed properly');
});
