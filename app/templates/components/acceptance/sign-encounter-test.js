import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import session from 'boot/models/session';
import de from 'boot/tests/helpers/data-element';
import blurTextArea from 'boot/tests/helpers/blur-auto-saving-text-area';

const ENCOUNTER_GUID = '7022d94f-d70a-4722-a205-dac898cf9f69';
const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const CARE_PLAN = '#dFinalizeCarePlan';

moduleForAcceptanceAuth('Acceptance - Core - Charting | Sign encounter');

test('Sign requires confirmation and permissions before calling service', async function (assert) {
    let callCount = 0;
    server.post(`ChartingEndpoint/api/v3/patients/${PATIENT_GUID}/encounters/${ENCOUNTER_GUID}/sign`, () => {
        callCount++;
    });

    await visit('/PF/charts/patients/' + PATIENT_GUID + '/encounter/' + ENCOUNTER_GUID);
    // Load stubs that need the model to be ready

    await click('.btn-sign');
    // Confirm that confirm dialog pops up
    assert.equal(find('.btn-sign-confirm').length, 1, 'Confirm button is visible');

    // Attempt to sign with permissions
    const controller = this.application.__container__.lookup('controller:encounter');
    assert.notOk(controller.get('notAllowedToSign'), 'User has permissions to sign');
    await click('.btn-sign-confirm');
    assert.equal(callCount, 1, 'Sign has been called correctly');

    // Attempt to sign without permissions
    session.set('userEditLevel', 1);
    assert.ok(controller.get('notAllowedToSign'), 'User does not have permissions to sign');
    await click('.btn-sign-confirm');
    assert.equal(callCount, 1, 'Sign was not called for user without permissions');
});

test('Sign forces user to review hidden sections before proceeding', async assert => {
    // Load stubs that need the model to be ready
    let callCount = 0;
    server.post(`ChartingEndpoint/api/v3/patients/${PATIENT_GUID}/encounters/${ENCOUNTER_GUID}/sign`, () => {
        callCount++;
    });
    server.post(`ChartingEndpoint/api/v3/patients/${PATIENT_GUID}/transcriptEvents/`, ({ db }, request) => JSON.parse(request.requestBody));

    await visit('/PF/charts/patients/' + PATIENT_GUID + '/encounter/' + ENCOUNTER_GUID);
    // Enter some data and hide sections
    await toggleEncounterSections(['Care plan'], true);
    // Confirm that sections are hidden in encounter
    assert.equal(find(`${CARE_PLAN}:visible`).length, 1, 'Care Plan begins visible');
    // add a care plan
    await click(`${CARE_PLAN} .btn.heading-action:first`);
    fillIn(`${CARE_PLAN} textarea`, 'Test care Plan');
    await blurTextArea(`${CARE_PLAN} .auto-saving-text-area`);

    // Hide these sections in the encounter
    await toggleEncounterSections(['Care plan'], false);

    // Confirm that sections are hidden in encounter
    assert.equal(find(`${CARE_PLAN}:visible`).length, 0, 'Care Plan is hidden');

    // Attempt to sign with hidden sections
    await click('.btn-sign');
    // Confirm dialog pops up with hidden section messages
    assert.ok(find(`.popover-confirm-warning:visible .popover-title:contains('Sign encounter')`).length > 0, 'Confirm pop-up is shown');
    assert.ok(find(de('hidden-sections-warning')).length > 0, 'Confirm pop-up shows the warning about hidden sections');
    assert.equal(find(`${de('hidden-sections-list')} li`).length, 1, '1 hidden sections are shown on the warning');

    // Confirm that sections are visible in encounter
    assert.equal(find(`${CARE_PLAN}:visible`).length, 1, 'Care Plan is visible while confirming');

    // Cancel sign
    await click(de('cancel-sign-encounter'));
    assert.equal(callCount, 0, 'Sign has been cancelled');
    // Confirm that sections are re-hidden in encounter
    // assert.equal(find(`${OBSERVATIONS}:visible`).length, 0, 'Observations are hidden after cancelling');
    assert.equal(find(`${CARE_PLAN}:visible`).length, 0, 'Care Plan is hidden after cancelling');

    // Review Hidden Sections
    await click('.btn-sign');
    await click(de('review-hidden-sections'));
    assert.equal(callCount, 0, 'Sign has been delayed while reviewing hidden sections');
    // confirm that sections are visible in encounter
    assert.equal(find(`${CARE_PLAN}:visible`).length, 1, 'Care Plan remains visible after review is selected');

    // Sign the encounter
    await click('.btn-sign');
    await click('.btn-sign-confirm');
    assert.equal(callCount, 1, 'Sign was called successfully');

    // restore hidden sections
    toggleEncounterSections(['Care plan'], true);
});
