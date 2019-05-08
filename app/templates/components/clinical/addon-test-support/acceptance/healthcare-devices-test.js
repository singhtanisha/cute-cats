import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';
import getText from 'boot/tests/helpers/get-text';
import getTextInPrint from 'boot/tests/helpers/get-text-in-print';
import findInPrint from 'boot/tests/helpers/find-in-print';
import Mirage from 'ember-cli-mirage';
import sinon from 'sinon';

const PATIENT_PRACTICE_GUID = 'c5faffde-78e2-4924-acaf-2115bc686d5e';
const NEW_DEVICE = {
    deviceType: 'iHeartbeat',
    isActive: true,
    implantDate: '01/01/2017',
    notes: 'DRM is enabled - must contact support to restart after not beating for 45 seconds.',
    udi: 'testudi'
};
const EXISTING_UDI = '=/08717648200274=,000025=A99971312345600=>014032=}013032&,1000000000000XYZ123';
const INVALID_UDI = 'InvalidUDI';
const NEW_UDI = {
    uniqueDeviceIdentifier: 'ValidUDI',
    deviceIdentifier: 'IH-1234',
    uniqueDeviceIdentifierIssuingAgency: 'MyTest',
    deviceDescription: 'This is a test device',
    companyName: 'Acme Test Devices, Inc.',
    brandName: 'iHeartbeat',
    versionModelNumber: '1234',
    lotNumber: '56',
    deviceSerialNumber: 'A123456',
    expirationDate: '01/01/2030',
    manufacturingDate: '01/01/2010',
    gmdnPtName: 'PartName',
    gmdnPtDefinition: 'PartDefinition',
    mriSafetyStatusDescription: 'Yup, it is safe',
    customerContactPhoneNumber: '555-555-0001',
    customerContactPhoneNumberExtension: null,
    customerContactEmailAddress: 'me@you.com',
    isNaturalRubberLatexInformationOnLabel: 'yup',
    isDeviceLabeledNoNaturalRubberLatex: 'nope',
    snomed: []
};
const DELETE_DEVICE_GUID = 'b3239e39-9144-4293-bfa6-e5651f3703e6';
const EXPECTED_PRINT_SECTIONS = 4;
let toastrSuccessStub;
moduleForAcceptanceAuth('Acceptance - Core - Clinical | Healthcare devices - v2', {
    beforeEach() {
        toastrSuccessStub = sinon.stub(window.toastr, 'success');
    },
    afterEach() {
        window.toastr.success.restore();
    }
});

test('View and edit implantable devices on patient summary', async assert => {
    server.put('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/healthcaredevices/:heathcaredeviceguid', ({ db }, request) => {
        const device = JSON.parse(request.requestBody);
        assert.equal(device.userEnteredInfo.userEnteredNotes, NEW_DEVICE.notes, 'The edited information was saved');
        return device;
    });

    assert.expect(9);
    await visit(`/PF/charts/patients/${PATIENT_PRACTICE_GUID}/summary`);
    assert.throws(findWithAssert('.ember-view.devices'), 'Implantable devices section shows up on patient summary');
    await delayAsync(100);
    assert.equal(getText('.summary-devices-list-inactive-toggle').indexOf('Show inactive'), 0, 'Inactive toggle shows collapsed');
    await click('.summary-devices-list-inactive-toggle');
    assert.dom(de('inactive-devices-header')).exists('Inactive items display after toggle is clicked');
    await click('.ember-view.devices .active-device:first');
    assert.throws(findWithAssert('.device-detail'), 'The device detail pane appears when an item is clicked');
    assert.equal(getText(de('device-udi-display')), EXISTING_UDI, 'The device detail pane shows the correct information');
    assert.throws(findWithAssert('.device-detail-info'), 'The device UDI information is shown');
    // Make a change and save the device
    fillIn(de('device-notes'), NEW_DEVICE.notes);
    await click('.device-detail .detail-pane-footer .btn-primary');
    assert.equal(toastrSuccessStub.args[0][0], 'Implantable device saved', 'Confirmation toast displays after saving');
    assert.equal(find('.device-detail').length, 0, 'Device detail pane closed upon saving');
});

test('Add implantable device with validation', async assert => {
    server.post('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/healthcaredevices/populateUdiInfo', ({ db }, request) => {
        const udiRequest = JSON.parse(request.requestBody);
        if (udiRequest.uniqueDeviceIdentifier === INVALID_UDI) {
            return new Mirage.Response(400);
        }
        assert.equal(udiRequest.uniqueDeviceIdentifier, NEW_UDI.uniqueDeviceIdentifier, 'A valid UDI was requested');
        return NEW_UDI;
    });
    server.post('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/healthcaredevices/', ({ db }, request) => {
        const device = JSON.parse(request.requestBody);
        assert.equal(device.udiInfo.uniqueDeviceIdentifier, NEW_UDI.uniqueDeviceIdentifier, 'The device was saved with the correct UDI information');
        return device;
    });

    assert.expect(12);
    await visit(`/PF/charts/patients/${PATIENT_PRACTICE_GUID}/summary`);
    await click(`.ember-view.devices ${de('record-device')}`);
    assert.throws(findWithAssert('.device-detail'), 'The device detail pane appears to edit a device');
    fillIn(de('implant-date-txt'), 'invalid');
    fillIn(de('device-notes'), NEW_DEVICE.notes);
    click(`${de('device-active')} input`);
    assert.throws(findWithAssert('.device-detail .detail-pane-footer .btn-primary:disabled'), 'Save button is disabled until UDI is added');
    fillIn(de('device-udi'), INVALID_UDI);
    await click(de('get-udi-button'));
    // expect an error since an invalid UDI was entered
    assert.throws(findWithAssert(de('udi-failure-message')), 'Failure dialog for invalid UDI is shown');
    await click(`${de('udi-failure-action')} .btn-primary`);
    fillIn(de('device-udi'), NEW_UDI.uniqueDeviceIdentifier);
    await click(de('get-udi-button'));
    assert.dom('.content-modal header h4').hasText('Unique Device Identifier confirmation', 'Success dialog contains the correct title');
    assert.dom(de('udi-success-message')).exists('Success dialog for UDI is shown');
    assert.equal(find(`${de('udi-success-message')}:contains('${NEW_UDI.uniqueDeviceIdentifier}')`).length, 1, 'Success dialog displays correct UDI information');
    await click(`${de('udi-success-action')} .btn-primary`);
    // Validate that UDI information is shown as read-only
    assert.throws(findWithAssert(de('remove-udi-button')), 'UDI is shown read-only with remove button');
    assert.equal(getText(de('device-gmdn-pt-name-display')), NEW_UDI.gmdnPtName, 'Device GMDN-PT name displays correctly');
    await click('.device-detail .detail-pane-footer .btn-primary');
    // Validation should display for bad inputs
    assert.throws(findWithAssert(`.device-detail .tooltip-inner:contains('Please enter a valid date')`), 'Date validation displayed for invalid date');
    fillIn(de('implant-date-txt'), NEW_DEVICE.implantDate);
    await click('.device-detail .detail-pane-footer .btn-primary');
    assert.equal(toastrSuccessStub.args[0][0], 'Implantable device added', 'Confirmation toast displays after saving');
});

test('Delete implantable device', async assert => {
    server.del('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/healthcaredevices/:deviceGuid', ({ db }, request) => {
        const device = request.params.deviceGuid;
        assert.equal(device, DELETE_DEVICE_GUID, 'A delete call was made for the correct device');
    });

    assert.expect(4);
    await visit(`/PF/charts/patients/${PATIENT_PRACTICE_GUID}/summary`);
    await click('.ember-view.devices .active-device:first');
    assert.throws(findWithAssert('.device-detail'), 'The device detail pane appears to edit a device');
    await click(de('delete-device-button'));
    assert.throws(findWithAssert(de('delete-confirm')), 'Confirmation dialog appears to finalize delete');
    await click(`.content-modal .btn-primary:contains('Delete')`);
    assert.equal(toastrSuccessStub.args[0][0], 'Implantable device deleted', 'Confirmation toast displays after deleting');
});

test('Print preview implantable device list', async assert => {
    assert.expect(4);
    await visit(`/PF/charts/patients/${PATIENT_PRACTICE_GUID}/summary`);
    assert.throws(findWithAssert(`.ember-view.devices ${de('print-devices-button')}`), 'Print devices button is available');
    await click(`.ember-view.devices ${de('print-devices-button')}`);
    assert.ok(findInPrint('.print-device-section').length >= EXPECTED_PRINT_SECTIONS, 'Expected devices show up in the print modal');
    assert.equal(getTextInPrint(`.print-device-section:first ${de('print-device-isactive')}`), 'Active', 'Active devices show up first in the print modal');
    assert.equal(getTextInPrint(`.print-device-section:last ${de('print-device-isactive')}`), 'Inactive', 'Inactive devices show up last in the print modal');
    click('#print-modal-controls .close-link');
});
