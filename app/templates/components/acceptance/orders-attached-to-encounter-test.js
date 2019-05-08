import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';

const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const TRANSCRIPT_GUID = '7022d94f-d70a-4722-a205-dac898cf9f69';
const ENCOUNTER_URL = '/PF/charts/patients/' + PATIENT_GUID + '/encounter/' + TRANSCRIPT_GUID;
const GOTO_BTN = `[data-toggle='dropdown']:contains('Go to')`;
const ORDERS_BTN = `a:contains('Orders')`;

moduleForAcceptanceAuth('Acceptance - Core - Charting | Encounter renders orders attached');

test('Orders attached to encounter renders properly', async assert => {
    server.get('LabsEndpoint/api/v1/orders/patients/:patientPracticeGuid/encounters/:transcriptGuid', ({ db }) => db.ordersAttachedToEncounters);
    await visit(ENCOUNTER_URL);
    await click(GOTO_BTN);
    await click(ORDERS_BTN);
    // Assert headers
    const ordersHeader = '.orders-attached-to-encounter h3';
    const labOrdersSubheader = '.orders-attached-to-encounter .header3b:eq(0)';
    const imagingOrdersSubheader = '.orders-attached-to-encounter .header3b:eq(1)';
    assert.equal(find(ordersHeader).text().trim(), 'Orders', 'Orders header renders properly on encounter.');
    assert.equal(find(labOrdersSubheader).text().trim(), 'Lab Orders', 'Lab Orders sub header renders properly on encounter.');
    assert.equal(find(imagingOrdersSubheader).text().trim(), 'Imaging Orders', 'Imaging Orders sub header renders properly on encounter.');

    // Status of the order renders properly
    const submittedOrder = '.orders-attached-to-encounter .submitted';
    const draftOrder = '.orders-attached-to-encounter .draft';
    assert.equal(find(submittedOrder).length, 1, 'There is one submitted order.');
    assert.equal(find(draftOrder).length, 2, 'There are two draft orders.');

    // Assert lab data
    const labOrder1 = de('show-order-link') + ':eq(0)';
    const labOrder2 = de('show-order-link') + ':eq(1)';
    const imagingOrder = de('show-order-link') + ':eq(2)';

    // Assert that the link associated with the lab name has the correct route
    assert.equal(find(labOrder1).attr('href'), '/PF/charts/patients/ecd212c3-5c99-499e-b3c6-b2645b8a4c98/orders/9d2f0b1c-2a22-4a8a-bac4-17f4a7d06eeb', 'First lab order contains appropriate link to open view/edit order tab.');
    assert.equal(find(labOrder2).attr('href'), '/PF/charts/patients/ecd212c3-5c99-499e-b3c6-b2645b8a4c98/orders/d1359972-883d-aaaa-a080-8a95820293a0', 'Second lab order contains appropriate link to open view/edit order tab.');
    assert.equal(find(imagingOrder).attr('href'), '/PF/charts/patients/ecd212c3-5c99-499e-b3c6-b2645b8a4c98/orders/d1359972-883d-4f76-a080-8a95820293a0', 'Imaging Order contains appropriate link to open view/edit order tab.');
    // Assert that the lab name renders the lab type and order number properly
    assert.equal(find(labOrder1).text().trim(), 'Vendor Order 1603REWV', 'First lab order lab type and order number renders properly.');
    assert.equal(find(labOrder2).text().trim(), 'Vendor Order 1603RF29', 'First lab order lab type and order number renders properly.');
    assert.equal(find(imagingOrder).text().trim(), 'Imaging Order 1603RF29', 'Imaging order lab type and order number renders properly.');

    // Assert lab type for one order; the rest should render if one renders properly
    assert.equal(find(de('lab-test-from-order') + ' li:eq(0)').text().trim(), '2356 - Glia(IgA/G)+IgA', 'Lab test for first vendor order renders properly on encounter.');

    // Assert that the add links for diagnostic and imaging render properly
    assert.equal(find(de('add-diagnostic-order-from-encounter')).attr('href'), '/PF/charts/patients/ecd212c3-5c99-499e-b3c6-b2645b8a4c98/orders/new/diagnostic?transcriptGuid=7022d94f-d70a-4722-a205-dac898cf9f69', 'Add diagnostic order from encounter route renders properly with transcriptGuid as the parameter.');
    assert.equal(find(de('add-imaging-order-from-encounter')).attr('href'), '/PF/charts/patients/ecd212c3-5c99-499e-b3c6-b2645b8a4c98/orders/new/imaging?transcriptGuid=7022d94f-d70a-4722-a205-dac898cf9f69', 'Add diagnostic order from encounter route renders properly with transcriptGuid as the parameter.');
});

test('Orders attached to encounter can be printed from encounter', async assert => {
    server.get('LabsEndpoint/api/v1/orders/patients/:patientPracticeGuid/encounters/:transcriptGuid', ({ db }) => db.ordersAttachedToEncounters);
    await visit(ENCOUNTER_URL);
    const PRINT_ORDERS_BTN = `.orders-attached-to-encounter a:Contains('Print')`;
    await click(PRINT_ORDERS_BTN);
    const labOrder1 = de('print-order-title') + ':eq(0)';
    const labOrder2 = de('print-order-title') + ':eq(1)';
    const imagingOrder = de('print-order-title') + ':eq(2)';

    assert.equal(find(labOrder1).text().trim(), 'Vendor Order 1603REWV', 'First vendor order title renders properly on print.');
    assert.equal(find(labOrder2).text().trim(), 'Vendor Order 1603RF29', 'Second vendor order title renders properly on print.');
    assert.equal(find(imagingOrder).text().trim(), 'Imaging Order 1603RF29', 'Imaging order title renders properly on print.');

    const labOrderVendorName1 = de('print-order-vendor-name') + ':eq(0)';
    const labOrderVendorName2 = de('print-order-vendor-name') + ':eq(1)';
    const imagingOrderVendorName = de('print-order-vendor-name') + ':eq(2)';
    assert.equal(find(labOrderVendorName1).text().trim(), 'NIST Lab Facility', 'First lab order vendor name renders properly on print.');
    assert.equal(find(labOrderVendorName2).text().trim(), 'This is a vendor name', 'Second lab order vendor name renders properly on print.');
    assert.equal(find(imagingOrderVendorName).text().trim(), 'This is a vendor name', 'Imaging order vendor name renders properly on print.');

    // We only have one lab order with an account number
    const labOrderVendorAccountNumber = de('print-order-vendor-account-number');
    assert.equal(find(labOrderVendorAccountNumber).text().trim(), 'NISTbetty', 'Lab order vendor account number renders properly on print.');

    // Lab test for one order
    const labOrder1Test = de('print-lab-test-from-order') + ':eq(0)';
    assert.equal(find(labOrder1Test).text().trim(), '2356 - Glia(IgA/G)+IgA', 'Lab order test name renders properly on print.');

    click('#print-modal-controls .close-link');
});
