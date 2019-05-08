import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';
import getText from 'boot/tests/helpers/get-text';
import Mirage from 'ember-cli-mirage';
import sinon from 'sinon';

const ENCOUNTER_GUID = '7022d94f-d70a-4722-a205-dac898cf9f69';
const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const ACTIONS_MENU_ITEM = `${de('actions-menu-options')} a:contains('Delete encounter')`;
const ENCOUNTER_GUID_SIGNED = 'SIGNED_TRANSCRIPT_GUID';
const CONFIRM_BUTTON_ITEM = `${de('confirm-dialog-confirm')}:visible`;
const CANCEL_BUTTON_ITEM = `${de('confirm-dialog-cancel')}:visible`;
let toastrSuccessStub;
let toastrErrorStub;

moduleForAcceptanceAuth('Acceptance - Core - Charting | Delete encounter', {
    beforeEach() {
        toastrSuccessStub = sinon.stub(window.toastr, 'success');
        toastrErrorStub = sinon.stub(window.toastr, 'error');
    },
    afterEach() {
        window.toastr.success.restore();
        window.toastr.error.restore();
    }
});

test('Able to delete unsigned encounter', async assert => {
    assert.expect(6);
    let countDeleteCalled = 0;

    server.del('ChartingEndpoint/api/v2/ChartNote/:encounterGuid', ({ db }, request) => {
        assert.equal(request.params.encounterGuid, ENCOUNTER_GUID, 'Encounter was sucessfully deleted');
        countDeleteCalled++;
        return true;
    });

    await visit('/PF/charts/patients/' + PATIENT_GUID + '/encounter/' + ENCOUNTER_GUID);

    await click(de('actions-menu'));
    assert.ok(find(ACTIONS_MENU_ITEM).length > 0, 'Delete action is available in the actions menu');
    await click(ACTIONS_MENU_ITEM);
    assert.equal(getText(CONFIRM_BUTTON_ITEM), 'Delete', 'Proper confirm dialog is shown when attempting to delete');
    await click(CANCEL_BUTTON_ITEM);
    assert.equal(countDeleteCalled, 0, 'Cancelling does not delete the note');
    await click(de('actions-menu'));
    await click(ACTIONS_MENU_ITEM);
    await click(CONFIRM_BUTTON_ITEM);
    assert.equal(countDeleteCalled, 1, 'Confirming the delete deletes the encounter');
    assert.equal(toastrSuccessStub.args[0][0], 'Deleted encounter', 'The toast message displayed to confirm the deletion');
});

test('Cannot delete signed encounter', async assert => {
    assert.expect(1);

    server.del('ChartingEndpoint/api/v2/ChartNote/:encounterGuid', ({ db }, request) => {
        assert.equal(request.params.encounterGuid, ENCOUNTER_GUID, 'Encounter was sucessfully deleted');
        return true;
    });

    await visit('/PF/charts/patients/' + PATIENT_GUID + '/encounter/' + ENCOUNTER_GUID_SIGNED);
    await click(de('actions-menu'));
    assert.ok(find(ACTIONS_MENU_ITEM).length < 1, 'Delete action is not in the actions menu');
});

test('Attempting to delete encounter that has been attached to a lab order renders toast', async assert => {
    const labOrderErrorMessage = 'Transcript has associated lab order and cannot be deleted.';
    let countDeleteCalled = 0;
    server.del('ChartingEndpoint/api/v2/ChartNote/:encounterGuid', () => {
        countDeleteCalled++;
        // Service determines whether or not the encounter has a lab order associated - UI does not send anything to indicate that it is
        return new Mirage.Response(412, {}, {
            message: labOrderErrorMessage
        });
    });

    await visit('/PF/charts/patients/' + PATIENT_GUID + '/encounter/' + ENCOUNTER_GUID);
    await click(de('actions-menu'));
    await click(ACTIONS_MENU_ITEM);
    await click(CONFIRM_BUTTON_ITEM);
    assert.equal(countDeleteCalled, 1, 'Confirm that deleting the encounter was called.');
    assert.equal(toastrErrorStub.args[0][0], labOrderErrorMessage, 'The toast message displayed to inform user that encounter failed to delete since it was linked to a lab order.');
});
