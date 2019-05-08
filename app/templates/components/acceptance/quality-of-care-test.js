import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';

const ENCOUNTER_GUID = '7022d94f-d70a-4722-a205-dac898cf9f69';
const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const SELECTED_EVENT_TYPE_GUID = '4568b574-3bcc-4117-ba5a-ffe408c82ec2';
const TEST_EVENT_GUID = '12345';

function validateCheckbox(assert, selector, startsChecked) {
    const checkbox = find(selector);
    if (startsChecked) {
        assert.notOk(checkbox.prop('checked'), 'QOC checkbox renders as unchecked');
    } else {
        assert.ok(checkbox.prop('checked'), 'QOC checkbox renders as checked');
    }
    return !startsChecked;
}

moduleForAcceptanceAuth('Acceptance - Core - Charting | Encounter quality of care', {});

test('Can change Quality of Care settings', async assert => {
    server.post('ChartingEndpoint/api/v3/patients/:patientPracticeGuid/transcriptEvents/', ({ db }, request) => {
        const data = JSON.parse(request.requestBody);
        assert.equal(data.eventType.eventTypeGuid, SELECTED_EVENT_TYPE_GUID, 'The correct item is saved when checkbox is checked');
        data.transcriptEventGuid = TEST_EVENT_GUID;
        return data;
    });
    server.del('ChartingEndpoint/api/v3/patients/:patientPracticeGuid/transcriptEvents/:eventTypeGuid', ({ db }, request) => {
        assert.equal(request.params.eventTypeGuid, TEST_EVENT_GUID, 'The correct item is deleted when checkbox is unchecked');
    });

    await visit('/PF/charts/patients/' + PATIENT_GUID + '/encounter/' + ENCOUNTER_GUID);
    // Confirm QOC present
    assert.ok(find('#dFinalizeQOC input').length > 1, 'QOC checkboxes present');

    // check the first QOC and confirm that it is added
    const selector = '#dFinalizeQOC input:first';
    let startsChecked = find(selector).prop('checked') || false;

    await click(selector);
    startsChecked = validateCheckbox(assert, selector, startsChecked);
    await click(selector);
    startsChecked = validateCheckbox(assert, selector, startsChecked);
});
