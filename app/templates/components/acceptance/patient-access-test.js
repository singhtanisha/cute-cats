import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';
import getText from 'boot/tests/helpers/get-text';
import getPrintText from 'boot/tests/helpers/get-text-in-print';
import findPrint from 'boot/tests/helpers/find-in-print';

const ENCOUNTER_GUID = '7022d94f-d70a-4722-a205-dac898cf9f69';
const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const ACTIONS_MENU_ITEM = `${de('actions-menu-options')} a:contains('View access history')`;
const MODAL_ELEMENT = '.modal.info.access-history';
const PRINT_BUTTON = `${MODAL_ELEMENT} .btn:contains('Print')`;
const EXPECTED_FIRST_ITEM = {
    providerName: 'Eric Marantette',
    practiceName: 'Ryan\'s Practice',
    date: '08/17/16'
};
const EXPECTED_ITEMS = 3;

moduleForAcceptanceAuth('Acceptance - Core - Charting | Patient access');

test('Patient access displays properly in encounter', async assert => {
    assert.expect(14);
    let expectedPatientName = '';

    await visit('/PF/charts/patients/' + PATIENT_GUID + '/encounter/' + ENCOUNTER_GUID);

    await click(de('actions-menu'));
    assert.ok(find(ACTIONS_MENU_ITEM).length > 0, 'View access history action is available in the actions menu');
    await click(ACTIONS_MENU_ITEM);
    await wait();
    expectedPatientName = getText('.patient-name');
    assert.ok(find(`${MODAL_ELEMENT}:visible`).length > 0, 'Access history modal appears');
    assert.ok(find(`${MODAL_ELEMENT} .header1:contains('Access history for ${expectedPatientName}')`).length > 0, 'Access history modal has correct title');
    assert.equal(find(`${MODAL_ELEMENT} .access-history-content .ember-view.row`).length, EXPECTED_ITEMS, 'Access history shows correct number of rows');
    assert.equal(getText(`${MODAL_ELEMENT} .access-history-content .ember-view.row:first > div:first`), EXPECTED_FIRST_ITEM.date, 'Access history shows correct dates');
    assert.equal(getText(`${MODAL_ELEMENT} .access-history-content .ember-view.row:first > div:last`), EXPECTED_FIRST_ITEM.practiceName, 'Access history shows correct practice names');
    assert.equal(getText(`${MODAL_ELEMENT} .access-history-content .ember-view.row:first > div:nth(1)`), EXPECTED_FIRST_ITEM.providerName, 'Access history shows correct provider names');


    await click(PRINT_BUTTON);
    assert.ok(find('#print-modal:visible').length > 0, 'Print modal displays properly');
    // Validate print modal display information
    assert.equal(getPrintText(de('print-header-patient-name')), expectedPatientName, 'Print modal has correct patient name');
    assert.equal(findPrint('.table-content .row').length, EXPECTED_ITEMS + 2, 'Print modal shows correct number of rows');
    assert.equal(getPrintText('.table-content .row.even-stripe:first > div > time'), EXPECTED_FIRST_ITEM.date, 'Print modal displays correct first item date');
    assert.equal(getPrintText('.table-content .row.even-stripe:first > div:last'), EXPECTED_FIRST_ITEM.practiceName, 'Print modal displays correct first item practice name');
    assert.equal(getPrintText('.table-content .row.even-stripe:first > div:nth(1)'), EXPECTED_FIRST_ITEM.providerName, 'Print modal displays correct first item provider name');

    await click('#print-modal-controls .close-link');
    await click(`${MODAL_ELEMENT} .btn-warning`);
    assert.ok(find(`${MODAL_ELEMENT}:visible`).length < 1, 'Access history modal closed properly');
});
