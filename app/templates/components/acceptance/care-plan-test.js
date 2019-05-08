import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import blurTextArea from 'boot/tests/helpers/blur-auto-saving-text-area';

const ENCOUNTER_GUID = '7022d94f-d70a-4722-a205-dac898cf9f69';
const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const CARE_PLAN_TEXT = 'I love it when a plan comes together.';
const CARE_PLAN_NULL_DISPLAY = 'No Care plan recorded.';
const CARE_PLAN = '#dFinalizeCarePlan';
const TEXT_AREA = `${CARE_PLAN} textarea`;
const CARE_PLAN_COMPONENT = `${CARE_PLAN} .auto-saving-text-area`;
const READ_ONLY_TEXT = `${CARE_PLAN} .comment-event-area > p:first`;
const RECORD_BUTTON = `${CARE_PLAN} .btn.heading-action:first`;

moduleForAcceptanceAuth('Acceptance - Core - Charting | Encounter care plan');

test('Can update and remove care plan', async assert => {
    let callCount = 0;
    assert.expect(7);
    server.post(`ChartingEndpoint/api/v3/patients/${PATIENT_GUID}/transcriptEvents/`, ({ db }, request) => {
        callCount++;
        const event = JSON.parse(request.requestBody);
        if (callCount === 1) {
            assert.equal(event.comments, CARE_PLAN_TEXT, 'The care plan was saved with the correct text');
        } else {
            assert.equal(event.comments, '', 'The care plan was saved with empty text');
        }
        return event;
    });
    await visit(`/PF/charts/patients/${PATIENT_GUID}/encounter/${ENCOUNTER_GUID}`);
    // ensure care plan section is not hidden
    await toggleEncounterSections(['Care plan'], true);
    assert.equal(find(`${CARE_PLAN} .comment-event-area`).length, 1, 'The care plan is rendered on the page');
    await click(RECORD_BUTTON);
    // Confirm that care plan controls show up, and enter information
    assert.equal(find('#dFinalizeCarePlan .font-size-button:visible').length, 2, 'Care plan font controls appear in edit mode');
    assert.ok(find(`${TEXT_AREA}:visible`).length, 'Care plan text area control appears in edit mode');
    fillIn(TEXT_AREA, CARE_PLAN_TEXT);
    await blurTextArea(CARE_PLAN_COMPONENT);
    assert.equal(find(READ_ONLY_TEXT).text(), CARE_PLAN_TEXT, 'Care plan updated text is displayed when done editing');

    // Remove info, confirm that changes persist
    await click(RECORD_BUTTON);
    fillIn(TEXT_AREA, '');
    await blurTextArea(CARE_PLAN_COMPONENT);
    assert.equal(find(READ_ONLY_TEXT).text(), CARE_PLAN_NULL_DISPLAY, 'Care plan is displayed properly when text is removed');
});
