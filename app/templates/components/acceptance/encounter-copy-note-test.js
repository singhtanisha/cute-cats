import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';
import getText from 'boot/tests/helpers/get-text';

const ENCOUNTER_GUID = '7022d94f-d70a-4722-a205-dac898cf9f69';
const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const ACTIONS_MENU_ITEM = `${de('actions-menu-options')} a:contains('Copy note to clipboard')`;
const ENCOUNTER_GUID_SIGNED = 'SIGNED_TRANSCRIPT_GUID';
const ADDENDUM_TEXT = 'This is a test addendum';
const COPY_MODAL = '.copy-note-modal';
const EXPECTED_TITLE = '03/08/16';
const EXPECTED_TITLE_SIGNED = '01/05/16';
const RICH_TEXT_CONTAINER = '.auto-saving-section .rich-text-editor';
const RICH_TEXT_SAVE = '.auto-saving-section .right-module-bottom .save';
const SOAP_UPDATES = {
    subjective: 'this is a test subjective',
    objective: 'this is a test objective',
    assessment: 'this is a test assesment',
    plan: 'this is the plan'
};

const getExpectedText = (values, fieldName) => `${fieldName} ${values[fieldName.toLowerCase()]}`;

moduleForAcceptanceAuth('Acceptance - Core - Charting | Encounter copy note');

test('Copy unsigned chart note displays correctly', async assert => {
    assert.expect(15);
    let copyText = '';

    server.put(`ChartingEndpoint/api/v3/patients/${PATIENT_GUID}/encounters/${ENCOUNTER_GUID}/autosave`, ({ db }, request) => {
        const saved = JSON.parse(request.requestBody);
        assert.ok(saved.fieldValue.indexOf(SOAP_UPDATES[saved.fieldType]) > -1, `Autosave correctly saved the ${saved.fieldType}`);
        return saved;
    });

    server.post('ChartingEndpoint/api/v2/PrintAudit', ({ db }, request) => {
        const audit = JSON.parse(request.requestBody);
        assert.equal(audit.patientPracticeGuid, PATIENT_GUID, 'Print audit event fired for correct patient');
        assert.equal(audit.transcriptGuid, ENCOUNTER_GUID, 'Print audit event fired for correct encounter');
        assert.equal(audit.printEvent, 'PatientChartNoteCopy', 'Print audit event fired with the correct event');
        return {};
    });

    await visit('/PF/charts/patients/' + PATIENT_GUID + '/encounter/' + ENCOUNTER_GUID);
    // Update all the SOAP fields
    await click(de('edit-note-subjective'));
    await fillInRichText(RICH_TEXT_CONTAINER, SOAP_UPDATES.subjective);
    await click(RICH_TEXT_SAVE);
    await fillInRichText(RICH_TEXT_CONTAINER, SOAP_UPDATES.objective);
    await click(RICH_TEXT_SAVE);
    await fillInRichText(RICH_TEXT_CONTAINER, SOAP_UPDATES.assessment);
    await click(RICH_TEXT_SAVE);
    await fillInRichText(RICH_TEXT_CONTAINER, SOAP_UPDATES.plan);
    await click(RICH_TEXT_SAVE);
    await click(de('actions-menu'));
    assert.ok(find(ACTIONS_MENU_ITEM).length > 0, 'Copy action is available in the actions menu');
    await click(ACTIONS_MENU_ITEM);
    assert.ok(find(`${COPY_MODAL}:visible`).length > 0, 'Copy note modal appears');
    assert.ok(find(`${COPY_MODAL} .copy-modal div:contains('${EXPECTED_TITLE}')`).length > 0, 'Copy note modal has correct title');

    copyText = getText(`${COPY_MODAL} .copy-modal-content .text-area`);
    assert.ok(copyText.indexOf(getExpectedText(SOAP_UPDATES, 'Subjective')) > -1, 'Copy note contains correct Subjective text');
    assert.ok(copyText.indexOf(getExpectedText(SOAP_UPDATES, 'Objective')) > -1, 'Copy note contains correct Objective text');
    assert.ok(copyText.indexOf(getExpectedText(SOAP_UPDATES, 'Assessment')) > -1, 'Copy note contains correct Assessment text');
    assert.ok(copyText.indexOf(getExpectedText(SOAP_UPDATES, 'Plan')) > -1, 'Copy note contains correct Plan text');

    await click(`${COPY_MODAL} .btn-warning`);
    assert.ok(find(`${COPY_MODAL}:visible`).length < 1, 'Copy note modal closed properly');
});

test('Copy signed chart note displays correctly with amendments', async assert => {
    assert.expect(13);
    const soapValues = {
        subjective: '',
        objective: '',
        assessment: '',
        plan: ''
    };
    let copyText = '';

    server.post(`ChartingEndpoint/api/v3/patients/${PATIENT_GUID}/encounters/${ENCOUNTER_GUID_SIGNED}/amendments`, ({ db }, request) => {
        const addendum = JSON.parse(request.requestBody);
        assert.equal(addendum.note, ADDENDUM_TEXT, 'The addendum was added with the correct text');
        addendum.id = 0;
        return addendum;
    });

    server.post('ChartingEndpoint/api/v2/PrintAudit', ({ db }, request) => {
        const audit = JSON.parse(request.requestBody);
        assert.equal(audit.patientPracticeGuid, PATIENT_GUID, 'Print audit event fired for correct patient');
        assert.equal(audit.transcriptGuid, ENCOUNTER_GUID_SIGNED, 'Print audit event fired for correct encounter');
        assert.equal(audit.printEvent, 'PatientChartNoteCopy', 'Print audit event fired with the correct event');
        return {};
    });

    await visit('/PF/charts/patients/' + PATIENT_GUID + '/encounter/' + ENCOUNTER_GUID_SIGNED);
    // Get SOAP values
    soapValues.subjective = getText('.note-subjective .display-text');
    soapValues.objective = getText('.note-objective .display-text');
    soapValues.assessment = getText('.note-assessment .display-text');
    soapValues.plan = getText('.note-plan .display-text');

    // Add addendum
    await click('.btn-add-addendum');
    fillIn('.encounter-addendum textarea', ADDENDUM_TEXT);
    await click('.encounter-addendum .btn-primary');
    await click(de('actions-menu'));
    assert.ok(find(ACTIONS_MENU_ITEM).length > 0, 'Copy action is available in the actions menu');
    await click(ACTIONS_MENU_ITEM);
    assert.ok(find(`${COPY_MODAL}:visible`).length > 0, 'Copy note modal appears');
    assert.ok(find(`${COPY_MODAL} .copy-modal div:contains('${EXPECTED_TITLE_SIGNED}')`).length > 0, 'Copy note modal has correct title');

    copyText = getText(`${COPY_MODAL} .copy-modal-content .text-area`);
    assert.ok(copyText.indexOf(getExpectedText(soapValues, 'Subjective')) > -1, 'Copy note contains correct Subjective text');
    assert.ok(copyText.indexOf(getExpectedText(soapValues, 'Objective')) > -1, 'Copy note contains correct Objective text');
    assert.ok(copyText.indexOf(getExpectedText(soapValues, 'Assessment')) > -1, 'Copy note contains correct Assessment text');
    assert.ok(copyText.indexOf(getExpectedText(soapValues, 'Plan')) > -1, 'Copy note contains correct Plan text');
    assert.ok(copyText.indexOf(ADDENDUM_TEXT) > -1, 'Copy note contains the added addendum');

    await click(`${COPY_MODAL} .btn-warning`);
    assert.ok(find(`${COPY_MODAL}:visible`).length < 1, 'Copy note modal closed properly');
});
