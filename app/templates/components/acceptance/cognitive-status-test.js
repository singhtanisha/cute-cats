import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import blurTextArea from 'boot/tests/helpers/blur-auto-saving-text-area';

const TRANSCRIPT_GUID = 'd3bfaa39-52ca-4069-bb27-6655a9a92ebd';
const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const COGNITIVE_STATUS_TEXT = 'I think therefore I am. (' + Date() + ')';
const FUNCTIONAL_STATUS_TEXT = 'We\'re fine, uh we\'re all fine here now. Situation normal. How are you? (' + Date() + ')';
const OBSERVATIONS = '#dFinalizeObservations';
const RECORD_BUTTON = `${OBSERVATIONS} .btn.heading-action`;
const FIRST_BUTTON = `${RECORD_BUTTON}:first`;
const OBSERVATIONS_COMPONENT = `${OBSERVATIONS} .auto-saving-text-area`;
const TEXT_AREA = `${OBSERVATIONS} textarea`;
const CHECKBOX = `${OBSERVATIONS} .pf-input--checkbox:first`;
const ENCOUNTER_URL = `/PF/charts/patients/${PATIENT_GUID}/encounter/${TRANSCRIPT_GUID}`;

moduleForAcceptanceAuth('Acceptance - Core - Charting | Cognitive and Functional Status');

test('Can update and remove cognitive and functional status', async assert => {
    let callCount = 0;
    assert.expect(6);
    server.put(`ChartingEndpoint/api/v3/patients/${PATIENT_GUID}/transcriptEvents/:transcriptEvent`, ({ db }, request) => {
        const event = JSON.parse(request.requestBody);
        callCount++;

        switch (callCount) {
            case 1:
                assert.equal(event.comments, FUNCTIONAL_STATUS_TEXT, 'The functional status was saved with the correct text');
                break;
            case 2:
                assert.equal(event.comments, COGNITIVE_STATUS_TEXT, 'The cognitive status was saved with the correct text');
                break;
            case 3:
                assert.ok(event.resultCode, 'The cognitive status was saved due to "No Impairment"');
                assert.equal(event.resultCode.codeValue, '66557003', 'The "No Impairment" result SNOMED code is 66557003');
                break;
            case 4:
                assert.notOk(event.resultCode, 'The "No Impairment" result code was removed');
                break;
        }

        return event;
    });

    await visit(ENCOUNTER_URL);
    await toggleEncounterSections(['Observations'], true);
    assert.equal(find(RECORD_BUTTON).length, 2, 'There are 2 observational status entries');
    await click(FIRST_BUTTON);
    // Confirm that functional status controls show up, and enter information
    fillIn(TEXT_AREA, FUNCTIONAL_STATUS_TEXT);
    blurTextArea(`${OBSERVATIONS_COMPONENT}:first`);
    await click(`${RECORD_BUTTON}:last`);
    // Confirm that cognitive status controls show up, and enter information
    fillIn(TEXT_AREA, COGNITIVE_STATUS_TEXT);
    blurTextArea(`${OBSERVATIONS_COMPONENT}:last`);
    await click(FIRST_BUTTON);
    // Test that clicking on the No Impairment checkbox saves properly
    await click(CHECKBOX);
    await blurTextArea(`${OBSERVATIONS_COMPONENT}:first`);
    await click(FIRST_BUTTON);
    await click(CHECKBOX);
    blurTextArea(`${OBSERVATIONS_COMPONENT}:first`);
});
