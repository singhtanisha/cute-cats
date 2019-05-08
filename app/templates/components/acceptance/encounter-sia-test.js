import { all } from 'rsvp';
import { run } from '@ember/runloop';
import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import Mirage from 'ember-cli-mirage';
import de from 'boot/tests/helpers/data-element';
import session from 'boot/models/session';
import sinon from 'sinon';

const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const TRANSCRIPT_GUID = '7022d94f-d70a-4722-a205-dac898cf9f69';
const SIA_SECTION = 'section #dFinalizeEvents';
const TRANSCRIPT_BASE_URL = '/PF/charts/patients/' + PATIENT_GUID + '/encounter';
const TRANSCRIPT_URL = `${TRANSCRIPT_BASE_URL}/${TRANSCRIPT_GUID}`;

const SIA_SECTION_HEADER = `${SIA_SECTION} header:contains('Screenings/ Interventions/ Assessments')`;
const SIA_ADD_ITEM = `${SIA_SECTION} a:contains('Add item')`;
const SIA_SELECT_FIELD = `${SIA_SECTION} .sia-search-single-select`;
const SIA_TEXT_SEARCH = `${SIA_SELECT_FIELD} input`;
const MIGRAINE_SEARCH_ITEM = `${SIA_SECTION} .sia-search-single-select .ember-select-result-item a:contains("MIDAS")`;
const MIDAS_EDITABLE_SELECT_INPUTS = '.days-selector .editable-select input.form-control';
const SCORE_15_GRADE_III_TEXT = '15 - Grade III, moderate disability';
const SCORE_30_GRADE_IV_TEXT = '30 - Grade IV, severe disability';
const LAST_RADIO_BUTTON = 'label[for="9b737802-5d8f-4a57-83e1-06ef41d61e3a-10"]';
const OPTIONAL_NUMBER_INPUT = `${de('worksheet-question-10')} .editable-select input`;
const REQUIRED_NUMBER_INPUT = `${de('worksheet-question-0')} .editable-select input`;
const REQUIRED_NUMBER_INPUT_CONTAINER = `${de('worksheet-question-0')} .editable-select`;
const REQUIRED_NUMBER_INPUT_DROPDOWN_TOGGLE = `${REQUIRED_NUMBER_INPUT_CONTAINER} .dropdown-toggle`;
const REQUIRED_INPUT_ZERO = `${REQUIRED_NUMBER_INPUT_CONTAINER} .dropdown-menu > li:first-child a`;

let toastrStub;
moduleForAcceptanceAuth('Acceptance - Core - Charting | Encounter screenings, interventions and assessments', {
    beforeEach() {
        server.post('ChartingEndpoint/api/v3/patients/:patientPracticeGuid/transcriptEvents', ({ db }, request) => {
            const data = JSON.parse(request.requestBody);
            data.transcriptEventGuid = 'TEST_GUID';
            return data;
        });
        toastrStub = sinon.stub(window.toastr, 'error');
    },
    afterEach() {
        window.toastr.error.restore();
    }
});

test('Encounter SIA - Can add, edit and delete SIA (adult depression sceening assessment)', async assert => {
    server.put('ChartingEndpoint/api/v3/patients/:patientPracticeGuid/transcriptEvents/:transcriptEventGuid', () => new Mirage.Response(204, {}, null));

    const dateFormat = 'MM/D/YYYY';
    const startDate = moment(new Date()).format(dateFormat);
    const endDate = moment(new Date()).add(5, 'days').format(dateFormat);

    assert.expect(16);

    await visit(TRANSCRIPT_URL);
    assert.ok(find(`${SIA_SECTION} header:contains('Screenings/ Interventions/ Assessments')`).length > 0, 'Screenings/ Interventions/ Assessments is visible in encounter');

    await click(`${SIA_SECTION} a:contains('Add item')`);
    fillIn(`${SIA_SECTION} input`, 'Depression');
    // Opening up the SIA right module
    await keyEvent(`${SIA_SECTION} .sia-search-single-select`, 'keydown', 13);
    await wait();
    await click(`${SIA_SECTION} .sia-search-single-select .ember-select-result-item a:contains("Adult depression")`);

    // Confirm headers for the right module is correct
    assert.equal(find('.right-module .right-module-top h15').text().trim(), 'Screenings, interventions, and assessments > Record', 'SIA Right module heading renders properly');
    assert.equal(find('.right-module .detail-pane-body-wrapper .title').text(), 'Adult depression screening assessment', 'SIA Right module title renders properly');

    // Update result to positive measurement finding
    await click('.right-module .ember-select-container:eq(1)');
    await keyEvent('.right-module .ember-select-container:eq(1)', 'keydown', 13);
    await click('.right-module li.ember-select-result-item:eq(1)');

    fillIn('.datetimepicker input:first', startDate);
    fillIn('textarea', 'Test comment');

    await click('.right-module .btn-primary');
    assert.equal(find(`${SIA_SECTION} li .event-heading .event-name`).text(), 'Adult depression screening assessment', 'Confirm SIA was added successfully on encounter');
    assert.equal(find(`${SIA_SECTION} li .event-heading .event-status`).text(), 'Performed', 'Confirm added SIA status renders on encounter');

    // Edit the SIA
    await click(`${SIA_SECTION} li .event-heading .event-name`);
    // Confirm that the SIA fields are populated with the earlier options selected
    assert.equal(find(`.right-module .ember-select-container:first span a`).text(), 'Performed', 'The added SIA status appears properly after opening SIA edit form');
    assert.equal(find(`.right-module .ember-select-container:eq(1) span a`).text(), 'Depression Screening Positive', 'The added SIA result appears properly after opening SIA edit form');
    assert.equal(moment(find(`.right-module .datetimepicker input:first`).val()).format(dateFormat), startDate, 'The added SIA start date appears properly after opening SIA edit form');
    assert.equal(find(`.right-module textarea`).val(), 'Test comment', 'The added SIA comment appears properly after opening SIA edit form');

    // Choose 'Not Performed' as status
    await click('.right-module .ember-select-container:first');
    await keyEvent('.right-module .ember-select-container:first', 'keydown', 13);
    await click('.right-module li.ember-select-result-item:eq(1)');

    // Update reason for not performing SIA
    await click('.right-module .ember-select-container:eq(1)');
    await keyEvent('.right-module .ember-select-container:eq(1)', 'keydown', 13);
    await click('.right-module li.ember-select-result-item:first');

    // Fill in end date as new date
    fillIn('.datetimepicker input:eq(1)', endDate);
    fillIn('textarea', 'Updated comment');

    // Update the SIA
    await click('.right-module .btn-primary');
    // When the status is not performed, the status doesn't show up on the encounter for this SIA
    assert.equal(find(`${SIA_SECTION} li .event-heading .event-name`).text(), 'Adult depression screening assessment', 'Confirm SIA was updated on encounter');
    assert.equal(find(`${SIA_SECTION} li .event-heading .event-status`).text(), '', 'Confirm status for Not Performed SIA does not show up on encounter');

    // Open up the SIA, confirm the updated fields and then delete it
    await click(`${SIA_SECTION} li .event-heading .event-name`);
    assert.equal(find(`.right-module .ember-select-container:first span a`).text(), 'Not Performed', 'The updated SIA status appears properly after opening SIA edit form');
    assert.equal(find(`.right-module .ember-select-container:eq(1) span a`).text(), 'Refusal of treatment by patient', 'The updated SIA reason appears properly after opening SIA edit form');
    assert.equal(moment(find(`.right-module .datetimepicker input:eq(1)`).val()).format(dateFormat), endDate, 'The updated SIA end date appears properly after opening SIA edit form');
    assert.equal(find(`.right-module textarea`).val(), 'Updated comment', 'The updated SIA comment appears properly after opening SIA edit form');

    // Delete the SIA
    await click('.right-module .detail-pane-footer .btn:first');
    assert.ok(find(`${SIA_SECTION} li`).length < 1, 'Confirm deleted SIA no longer exists on encounter');
});

test('Encounter SIA - Can add SIA (diabetic foot exam - regime/therapy', async assert => {
    await visit(TRANSCRIPT_URL);
    await click(`${SIA_SECTION} a:contains('Add item')`);
    fillIn(`${SIA_SECTION} input`, 'Diabetic foot exam');
    // Opening up the SIA right module
    await keyEvent(`${SIA_SECTION} .sia-search-single-select`, 'keydown', 13);
    await wait();
    await click(`${SIA_SECTION} .sia-search-single-select .ember-select-result-item a:contains("Diabetic foot exam")`);

    // Confirm headers for the right module is correct
    assert.equal(find('.right-module .right-module-top h15').text().trim(), 'Screenings, interventions, and assessments > Record', 'SIA Right module heading renders properly for diabetic foot exam test');
    assert.equal(find('.right-module .detail-pane-body-wrapper .title').text(), 'Diabetic foot examination (regime/therapy)', 'SIA Right module title renders properly for diabetic foot exam test');

    // Unncessary to assert the fields since it uses the same component as the first SIA test.  Only assert that it was added to the SIA list properly.
    await click('.right-module .ember-select-container:eq(1)');
    await keyEvent('.right-module .ember-select-container:eq(1)', 'keydown', 13);
    await click('.right-module li.ember-select-result-item:eq(1)');
    await click('.right-module .btn-primary');
    assert.equal(find(`${SIA_SECTION} li .event-heading .event-name`).text(), 'Diabetic foot examination (regime/therapy)', 'Confirm SIA was added successfully on encounter for diabetic foot exam test');
    assert.equal(find(`${SIA_SECTION} li .event-heading .event-status`).text(), 'Performed', 'Confirm added SIA status renders on encounter for diabetic foot exam test');
});

test('Encounter SIA - SIA Search indicates 100+ search results available', async assert => {
    await visit(TRANSCRIPT_URL);
    await click(`${SIA_SECTION} a:contains('Add item')`);
    fillIn(`${SIA_SECTION} input`, 'morethanonehundred');
    // test 100+ case
    await keyEvent(`${SIA_SECTION} .sia-search-single-select`, 'keydown', 13);
    await wait();

    const canRefineSearchElement = find('.search-can-be-refined-message span');
    const searchRefineText = canRefineSearchElement.text().trim();
    const expectedText = '100+ results returned, only displaying first 100 results.';

    assert.equal(canRefineSearchElement.length, 1, 'There is one extra component to the dropdown with that search refinement is possible.');
    assert.equal(searchRefineText, expectedText, 'The proper text is displayed in the refine search box.');
});

test('Encounter SIA - Can add SIA (Falls Risk)', async assert => {
    await visit(TRANSCRIPT_URL);
    await click(`${SIA_SECTION} a:contains('Add item')`);
    fillIn(`${SIA_SECTION} input`, 'Falls risk');
    // Opening up the SIA right module
    await keyEvent(`${SIA_SECTION} .sia-search-single-select`, 'keydown', 13);
    await wait();
    await click(`${SIA_SECTION} .sia-search-single-select .ember-select-result-item a:contains("Falls risk")`);
    // Confirm headers for the right module is correct
    assert.equal(find('.right-module .right-module-top h15').text().trim(), 'Screenings, interventions, and assessments > Record', 'SIA Right module heading renders properly for falls risk assessment test');
    assert.equal(find('.right-module .detail-pane-body-wrapper .title').text(), 'Falls risk assessment', 'SIA Right module title renders properly for falls risk assessment test');

    // Unncessary to assert the fields since it uses the same component as the first SIA test.  Only assert that it was added to the SIA list properly.
    await click('.right-module .ember-select-container:eq(1)');
    await keyEvent('.right-module .ember-select-container:eq(1)', 'keydown', 13);
    await click('.right-module li.ember-select-result-item:eq(1)');
    await click('.right-module .btn-primary');
    assert.equal(find(`${SIA_SECTION} li .event-heading .event-name`).text(), 'Falls risk assessment', 'Confirm SIA was added successfully on encounter for falls risk assessment test');
    assert.equal(find(`${SIA_SECTION} li .event-heading .event-status`).text(), 'Performed', 'Confirm added SIA status renders on encounter for falls risk assessment test');
});

test('Encounter SIA - SIA with child events default reason code', async assert => {
    await visit(TRANSCRIPT_URL);
    await click(`${SIA_SECTION} a:contains('Add item')`);
    await fillIn(`${SIA_SECTION} input`, 'Pain care plan');
    await keyEvent(`${SIA_SECTION} .sia-search-single-select`, 'keydown', 13);
    await wait();
    await click(`${SIA_SECTION} .sia-search-single-select .ember-select-result-item a:contains("Pain care plan")`);
    assert.equal(find(de('encounter-event-reason-code')).text().trim(), 'Pain (finding)', 'Reason code is defaulted when selecting a parent SIA.');
});

test('Encounter SIA - Add SIA with child event', async assert => {
    const doneBtn = '.right-module .btn-primary';

    server.put('ChartingEndpoint/api/v3/patients/:patientPracticeGuid/transcriptEvents/:transcriptEventGuid', () => new Mirage.Response(204, {}, null));

    server.delete('ChartingEndpoint/api/v3/patients/:patientPracticeGuid/transcriptEvents/:transcriptEventGuid', () => new Mirage.Response(204, {}, null));

    await visit(TRANSCRIPT_URL);
    await click(`${SIA_SECTION} a:contains('Add item')`);
    await fillIn(`${SIA_SECTION} input`, 'Pain care plan');
    await keyEvent(`${SIA_SECTION} .sia-search-single-select`, 'keydown', 13);
    await wait();
    await click(`${SIA_SECTION} .sia-search-single-select .ember-select-result-item a:contains("Pain care plan")`);
    assert.equal(find(de('sia-follow-up-header')).text().trim(), 'Add follow-up items to your care plan', 'Follow up header renders properly if event is a parent event.');

    const siaFollowUp = de('sia-follow-up');
    await click(siaFollowUp + ' .ember-select-search');
    await click(siaFollowUp + ' .ember-select-result-item:eq(0)');
    await click(doneBtn);
    const siaItems = '.event-info.event-name';
    assert.equal(find(siaItems + ':eq(0)').text().trim(), 'Pain care plan documented', 'Parent SIA renders properly on SIA section.');
    assert.equal(find(siaItems + ':eq(1)').text().trim(), 'Adjuvant pharmacotherapy (e.g. topical agents, antispasmodics)', 'Child SIA renders properly on SIA section.');
    await click(doneBtn);
    // Edit the parent and child SIA
    await click(siaItems + ':eq(0)');
    // Confirm that you can remove the child SIA
    const siaChildItem = de('sia-follow-up-list') + ' a';
    assert.equal(find(siaChildItem).attr('href'), '/PF/charts/patients/ecd212c3-5c99-499e-b3c6-b2645b8a4c98/encounter/7022d94f-d70a-4722-a205-dac898cf9f69/event/TEST_GUID', 'Link to child SIA renders properly.');
    assert.equal(find(siaChildItem).text().trim(), 'Adjuvant pharmacotherapy (e.g. topical agents, antispasmodics)', 'Child SIA title renders properly.');

    // Delete child SIA
    await click(de('sia-follow-up-list') + ' .icon-go-away.pull-right');
    assert.equal(find(siaItems).length, 1, 'Parent SIA item still renders on SIA section when child is removed.');
});

test('Encounter SIA - validate start/end dates', async assert => {
    await visit(TRANSCRIPT_URL);
    await click(`${SIA_SECTION} a:contains('Add item')`);
    fillIn(`${SIA_SECTION} input`, 'Depression');
    await keyEvent(`${SIA_SECTION} .sia-search-single-select`, 'keydown', 13);
    await wait();
    await click(`${SIA_SECTION} .sia-search-single-select .ember-select-result-item a:contains("Adult depression")`);
    fillIn('.datetimepicker input:eq(0)', '');
    fillIn('.datetimepicker input:eq(1)', '4/2/2018');
    await delayAsync(100);
    assert.equal(find('.tooltip-inner').text(), 'All SIA data elements must have a start date', 'Start date error rendered correctly when only end date is added');
    fillIn('.datetimepicker input:eq(0)', '4/4/2018');
    await delayAsync(100);
    assert.equal(find('.tooltip-inner:first').text(), 'Start date should be before or equal to the end date', 'End date error rendered correctly when start date is before end date');
    await fillIn('.datetimepicker input:eq(1)', '4/6/2018');
    await wait();
    await delayAsync(100);
    assert.notOk(find('.tooltip-inner').length, 'Tooltip errors disappear when both start and end dates are correct');
});

test('Encounter SIA - validate no start date validation', async assert => {
    await visit(`${TRANSCRIPT_BASE_URL}/5a3145c7-a2d2-4a52-92b9-ba7ec2323154`);
    await click('.event-name:contains(Depression screening)');
    const startDatePicker = '.event-details .datetimepicker input:first';
    assert.dom('.tooltip-inner').hasText('All SIA data elements must have a start date', 'Start date error rendered correctly when existing SIA is not saved with a start date');
    assert.dom(find(startDatePicker)[0]).hasClass('error');
    await fillIn(startDatePicker, '01/01/2001');
    assert.dom(find(startDatePicker)[0]).doesNotHaveClass('error', 'Error class is removed after adding a date');
});

test('Encounter SIA - add/edit/delete SIA with edit level NP/PA', async assert => {
    let postCallMade = false;
    let putCallMade = false;
    let deleteCallMade = false;

    server.get('ChartingEndpoint/api/v3/patients/:patientGuid/encounters/:chartid', ({ db }, request) => {
        const transcriptGuid = request.params.chartid;
        return db.encounters.where({ transcriptGuid })[0];
    });
    server.delete('ChartingEndpoint/api/v3/patients/:patientGuid/transcriptEvents/:chartid', () => {
        deleteCallMade = true;
    });
    server.put('ChartingEndpoint/api/v3/patients/:patientGuid/transcriptEvents/:chartid', ({ db }, request) => {
        putCallMade = true;
        return JSON.parse(request.requestBody);
    });
    server.post('ChartingEndpoint/api/v3/patients/:patientPracticeGuid/transcriptEvents', ({ db }, request) => {
        postCallMade = true;
        return JSON.parse(request.requestBody);
    });

    await visit(`${TRANSCRIPT_BASE_URL}/5a3145c7-a2d2-4a52-92b9-ba7ec2323154`);
    session.set('userEditLevel', 1);
    await delayAsync(100);
    assert.notOk(find(`${SIA_SECTION} a:contains('Add item')`).length, 'Edit level Nurse and below do not have edit access for SIA section');
    session.set('userEditLevel', 2);
    await delayAsync(100);
    // Adding a SIA
    await click(`${SIA_SECTION} a:contains('Add item')`);
    fillIn(`${SIA_SECTION} input`, 'Depression');
    await keyEvent(`${SIA_SECTION} .sia-search-single-select`, 'keydown', 13);
    await wait();
    await click(`${SIA_SECTION} .sia-search-single-select .ember-select-result-item a:contains("Adult depression")`);
    // Assert start date is prepopulated with encounter date of service for a new SIA
    assert.equal(find('.event-details .datetimepicker input:first')[0].value, '2/14/2018 12:00 AM', 'Start date is prepopulated with encounter date of service for a new SIA');
    await click('.right-module .btn-primary');
    assert.ok(postCallMade, 'POST call made to add SIA (edit level 3)');
    assert.ok(find('.event-name:contains(Adult depression)').length, 'New SIA is added to the SIA section (edit level 3)');
    // Editing an existing SIA
    await click('.event-name:contains(Depression screening)');
    fillIn('.event-details .datetimepicker input:first', '01/01/2001');
    fillIn('.event-details textarea', 'Test comment');
    await click('.right-module .btn-primary');
    assert.ok(putCallMade, 'PUT call made to update SIA (edit level 3)');
    await click('.event-name:contains(Depression screening)');
    assert.equal(find('.event-details .datetimepicker input:first')[0].value, '1/1/2001 12:00 AM', 'SIA date change persisted on save (user edit level 3)');
    assert.equal(find('.event-details textarea')[0].value, 'Test comment', 'SIA comment change persisted on save (user edit level 3)');
    // Assert error on trying to save SIA without a start date
    fillIn('.event-details .datetimepicker input:first', '');
    await delayAsync(100);
    assert.equal(find('.tooltip-inner').text(), 'All SIA data elements must have a start date', 'Start date error rendered correctly when trying to save SIA without a start date');
    // Deleting a SIA
    await click('.btn:contains(Delete)');
    assert.ok(deleteCallMade, 'DELETE call made to delete SIA (edit level 3)');
    assert.notOk(find('.event-name:contains(Depression screening)').length, 'Deleted SIA removed from SIA section (edit level 3)');
});

test('Encounter SIA - validate start/end dates on signing an encounter', async assert => {
    server.post(`ChartingEndpoint/api/v3/patients/${PATIENT_GUID}/encounters/${TRANSCRIPT_GUID}/sign`, () => {
        const SIA_DATE_VALIDATION_FAILED = { message: 'Start date is missing or incorrect for one or more items in Screenings/ Interventions/ Assessments(SIA). Go to the SIA section to correct this before signing this chart.',
            subcode: 'InvalidSiaStartDate' };
        return new Mirage.Response(400, {}, SIA_DATE_VALIDATION_FAILED );
    });

    await visit(TRANSCRIPT_URL);
    await click('.btn-sign');
    await click('.btn-sign-confirm');
    assert.equal(toastrStub.args[0][0], 'Start date is missing or incorrect for one or more items in Screenings/ Interventions/ Assessments(SIA). Go to the SIA section to correct this before signing this chart.', 'Error toaster renders correctly when sia date validation fails');
});

test('Encounter SIA - Can add, edit and delete SIA (Assessment using PHQ-2 questionnaire)', async assert => {
    const startDate = moment(new Date());
    const endDate = moment(new Date()).add(5, 'days');

    server.put('ChartingEndpoint/api/v3/patients/:patientPracticeGuid/transcriptEvents/:transcriptEventGuid', () => new Mirage.Response(204, {}, null));

    server.post('ChartingEndpoint/api/v2/WorksheetResponses', ({ db }, request) => db.worksheetResponses.where({
        worksheetGuid: JSON.parse(request.requestBody).worksheetGuid
    })[0]);

    await visit(TRANSCRIPT_URL);
    await click(`${SIA_SECTION} a:contains('Add item')`);
    fillIn(`${SIA_SECTION} input`, 'PHQ-2');

    // Opening up the SIA right module
    await keyEvent(`${SIA_SECTION} .sia-search-single-select`, 'keydown', 13);
    await wait();
    await click(`${SIA_SECTION} .sia-search-single-select .ember-select-result-item a:contains("Assessment using PHQ-2 questionnaire")`);
    // Confirm headers for the right module is correct
    assert.dom('.right-module .right-module-top h15').hasText('Screenings/ Interventions/ Assessments > Record', 'SIA Right module heading renders properly');
    assert.dom(de('worksheet-header')).hasText('Assessment using PHQ-2 questionnaire', 'SIA Right module title renders properly');

    click(`${de('select-status')} .composable-select__choice`);
    click(de('select-status-option-2'));

    fillIn(de('transcript-event-start'), startDate.format('MM/D/YYYY hh:mm A'));
    fillIn(de('transcript-event-end'), endDate.format('MM/D/YYYY hh:mm A'));
    fillIn(de('transcript-event-comment'), 'heyyooo');
    click(`${de('question-1')} ${de('option-label-1')}`);
    await click(`${de('question-2')} ${de('option-label-1')}`);
    await click(de('btn-worksheet-save'));
    assert.dom(`${SIA_SECTION} li .event-heading .event-name`).hasText('Assessment using PHQ-2 questionnaire', 'Confirm SIA was added successfully on encounter');

    // Edit the SIA
    await click(`${SIA_SECTION} li .event-heading .event-name`);
    // Confirm that the SIA fields are populated with the earlier options selected
    assert.dom(`${de('select-status')} .composable-select__selection`).hasText('Performed', 'The added SIA status appears properly after opening SIA edit form');
    assert.dom(de('transcript-event-start')).hasValue(startDate.format('M/D/YYYY h:mm A'), 'The start date has the correct text');
    assert.dom(de('transcript-event-end')).hasValue(endDate.format('M/D/YYYY h:mm A'), 'The end date has the correct text');
    assert.dom(de('transcript-event-comment')).hasValue('heyyooo', 'The comment field has the correct text');
    assert.dom(`${de('question-1')} ${de('option-radio-1')}`).isChecked('Correct option is checked for first question');
    assert.dom(`${de('question-2')} ${de('option-radio-1')}`).isChecked('Correct option is checked for second question');
});

function focusOut(selector) {
    const $input = find(selector);
    if (window._phantom || $input.is(':focus')) {
        run($input, 'trigger', $.Event('focusout'));
    } else {
        $input.blur();
    }
}

test('Can add, edit and delete adult asthma control worksheet', async assert => {
    const startDate = moment(new Date());
    const endDate = moment(new Date()).add(5, 'days');

    server.put('ChartingEndpoint/api/v3/patients/:patientPracticeGuid/transcriptEvents/:transcriptEventGuid', () => new Mirage.Response(204, {}, null));

    server.post('ChartingEndpoint/api/v2/WorksheetResponses', ({ db }, request) => db.worksheetResponses.where({
        worksheetGuid: JSON.parse(request.requestBody).worksheetGuid
    })[0]);

    await visit('/PF/charts/patients/' + PATIENT_GUID + '/encounter/' + TRANSCRIPT_GUID);
    assert.ok(find(SIA_SECTION_HEADER).length > 0, 'Screenings/ Interventions / Assessments is visible in encounter');
    await click(SIA_ADD_ITEM);
    await fillIn(SIA_TEXT_SEARCH, 'Asthma');
    // Opening up the asthma control right module
    await keyEvent(`${SIA_SECTION} .sia-search-single-select`, 'keydown', 13);
    await wait();
    await click(`${SIA_SECTION} .sia-search-single-select .ember-select-result-item > a:contains("Adult Asthma")`);
    // Confirm headers for the right module is correct
    assert.dom('.right-module .right-module-top h15').hasText('Screenings/ Interventions/ Assessments > Record', 'Adult Asthma Control Right module heading renders properly');
    assert.dom(de('worksheet-display-name')).hasText('Asthma Control Test™', 'Adult Asthma Control Right module title renders properly');

    // Confirm footer for the detail pane
    assert.dom(de('btn-worksheet-delete')).isNotVisible('New worksheet does not have delete button');
    assert.dom(de('btn-worksheet-save')).isDisabled('Save button is disabled when the worksheet is not complete');

    // Confirm Asthma Control Status
    assert.dom(de('worksheet-status-label')).hasText('Status', 'Adult Asthma control status header renders properly');
    assert.dom(de('worksheet-status-selection')).hasText('Performed', 'Adult Asthma control status for performed renders properly');

    // Confirm transcript event fields
    assert.dom(de('transcript-event-start')).exists('Transcript event start date exists');
    assert.dom(de('transcript-event-end')).exists('Transcript event end exists');
    assert.dom(de('transcript-event-comment')).exists('Transcript event comment exists');

    // Ensure all the Asthma Control questions render properly
    assert.dom(de('worksheet-question-label-0')).hasText('In the past 4 weeks, how much of the time did your asthma keep you from getting as much done at work, school or at home?', 'First Adult Asthma Control question renders properly.');
    assert.dom(de('worksheet-question-label-1')).hasText('During the past 4 weeks, how often have you had shortness of breath?', 'Second Adult Asthma Control question renders properly.');
    assert.dom(de('worksheet-question-label-2')).hasText('During the past 4 weeks, how often did your asthma symptoms (wheezing, coughing, shortness of breath, chest tightness or pain) wake you up at night or earlier than usual in the morning?', 'Third Adult Asthma Control question renders properly.');
    assert.dom(de('worksheet-question-label-3')).hasText('During the past 4 weeks, how often have you used your rescue inhaler or nebulizer medication (such as albuterol)?', 'Fourth Adult Asthma Control question renders properly.');
    assert.dom(de('worksheet-question-label-4')).hasText('How would you rate your asthma control during the past 4 weeks?', 'Fifth Adult Asthma Control question renders properly.');

    // Fill in transcript event fields
    fillIn(de('transcript-event-start'), startDate.format('MM/D/YYYY hh:mm A'));
    fillIn(de('transcript-event-end'), endDate.format('MM/D/YYYY hh:mm A'));
    fillIn(de('transcript-event-comment'), 'heyyooo');

    // Select an answer for each asthma control question
    await click(`${de('worksheet-question-0')} ${de('option-2')} label`);
    await click(`${de('worksheet-question-1')} ${de('option-2')} label`);
    await click(`${de('worksheet-question-2')} ${de('option-2')} label`);
    await click(`${de('worksheet-question-3')} ${de('option-2')} label`);
    await click(`${de('worksheet-question-4')} ${de('option-2')} label`);
    assert.dom(de('worksheet-score')).hasText('15', 'Confirm Adult Asthma Control scoring renders properly with the right number of points accumulated.');
    assert.dom(de('worksheet-summary')).hasText('If your score is 19 or less, your asthma may not be as well controlled as it could be.', 'Adult Asthma Control informational text on resulting score renders properly.');
    assert.dom(de('worksheet-copyright')).hasText('Copyright 2002, by QualityMetric Incorporated. Asthma Control Test is a trademark of QualityMetric Incorporated.', 'Adult Asthma Control copyright text renders properly.');

    await click(de('btn-worksheet-save'));
    assert.dom(`${SIA_SECTION} li .event-heading .event-name`).hasText('Adult Asthma Control Test (ages 12 and up)', 'Confirm Adult Asthma Control was updated on encounter');
    // Confirm Total Score
    assert.equal(find(SIA_SECTION + ' li .event-heading .event-info:eq(1)').text(), 'Total score:', 'Confirm Total Score text renders properly for adult asthma control assessment.');
    assert.equal(find(SIA_SECTION + ' li .event-heading .event-info:eq(2)').text(), '15', 'Confirm score renders properly for adult asthma control assessment.');
    // Confirm Result
    assert.equal(find(SIA_SECTION + ' li .event-heading .event-info:eq(3)').text(), 'Result:', 'Confirm Result text renders properly for adult asthma control assessment.');
    assert.equal(find(SIA_SECTION + ' li .event-heading .event-info:eq(4)').text(), 'If your score is 19 or less, your asthma may not be as well controlled as it could be.', 'Confirm Result renders properly for adult asthma control assessment.');

    // Edit the asthma control worksheet
    await click(`${SIA_SECTION} li .event-heading .event-name`);
    // Verify transcript event data
    assert.dom(de('transcript-event-start')).hasValue(startDate.format('M/D/YYYY h:mm A'), 'The start date has the correct text');
    assert.dom(de('transcript-event-end')).hasValue(endDate.format('M/D/YYYY h:mm A'), 'The start date has the correct text');
    assert.dom(de('transcript-event-comment')).hasValue('heyyooo', 'The comment field has the correct text');

    assert.dom(de('btn-worksheet-delete')).isVisible('Delete button exists');

    await click(`${de('worksheet-question-0')} ${de('option-3')} label`);
    // Change one of th answers and confirm the result
    assert.dom(de('worksheet-score')).hasText('16', 'Confirm updating Adult Asthma Control scoring renders properly with the right number of points accumulated.');
    await click(de('btn-worksheet-save'));
    // Delete the asthma control worksheet
    await click(`${SIA_SECTION} li .event-heading .event-name`);
    await click(de('btn-worksheet-delete'));
    assert.dom(`${SIA_SECTION} li .event-heading .event-name`).doesNotExist('Confirm Adult Asthma Control was deleted on encounter.');
});

test('Can add, edit and migraine assessment worksheet', async assert => {
    const startDate = moment(new Date());
    const endDate = moment(new Date()).add(5, 'days');

    assert.expect(14);

    server.post('ChartingEndpoint/api/v3/patients/:patientPracticeGuid/transcriptEvents', ({ db }) => db.midasTranscriptEvents[0]);

    server.post('ChartingEndpoint/api/v2/WorksheetResponses', ({ db }, request) => {
        const requestBody = JSON.parse(request.requestBody);
        const { startDateTimeUtc, endDateTimeUtc, comments } = requestBody.transcriptEncounterEvents[0];
        assert.equal(moment(startDateTimeUtc).format('M/D/YYYY h:mm A'), startDate.format('M/D/YYYY h:mm A'), 'Start date is correct');
        assert.equal(moment(endDateTimeUtc).format('M/D/YYYY h:mm A'), endDate.format('M/D/YYYY h:mm A'), 'End date is correct');
        assert.equal(comments, 'heyyooo', 'Comments is correct');

        const { responses } = requestBody;
        assert.equal(responses.length, 12, 'The proper number of responses are present in the response.');
        return {};
    });

    await visit('/PF/charts/patients/' + PATIENT_GUID + '/encounter/' + TRANSCRIPT_GUID);
    assert.ok(find(SIA_SECTION_HEADER).length > 0, 'Sia header section exists.');
    await click(SIA_ADD_ITEM);
    await fillIn(SIA_TEXT_SEARCH, 'Migraine');
    await keyEvent(`${SIA_SECTION} .sia-search-single-select`, 'keydown', 13);
    await wait();
    await click(MIGRAINE_SEARCH_ITEM);
    // Confirm transcript event fields
    assert.dom(de('transcript-event-start')).exists('Transcript event start date exists');
    assert.dom(de('transcript-event-end')).exists('Transcript event end exists');
    assert.dom(de('transcript-event-comment')).exists('Transcript event comment exists');
    // Fill in transcript event fields
    fillIn(de('transcript-event-start'), startDate.format('MM/D/YYYY hh:mm A'));
    fillIn(de('transcript-event-end'), endDate.format('MM/D/YYYY hh:mm A'));
    fillIn(de('transcript-event-comment'), 'heyyooo');

    const inputs = find(MIDAS_EDITABLE_SELECT_INPUTS).toArray();
    await all(inputs.map(input => fillIn(input, '3')));
    assert.dom(de('worksheet-score')).hasText(SCORE_15_GRADE_III_TEXT, 'The proper score and summary text is render based on the response values');

    await fillIn(OPTIONAL_NUMBER_INPUT, '7');
    assert.dom(de('worksheet-score')).hasText(SCORE_15_GRADE_III_TEXT, 'Changing a non required numeric input field does not affect worksheet scoring.');
    await fillIn(REQUIRED_NUMBER_INPUT, '18');
    assert.dom(de('worksheet-score')).hasText(SCORE_30_GRADE_IV_TEXT, 'Changing a required field affects worksheet scoring. And updates the summary text.');
    await click(LAST_RADIO_BUTTON);
    assert.dom(de('worksheet-score')).hasText(SCORE_30_GRADE_IV_TEXT, 'Changing a non required radio button does not affect worksheet scoring.');
    await fillIn(REQUIRED_NUMBER_INPUT, '96');
    focusOut(REQUIRED_NUMBER_INPUT);
    await click(REQUIRED_NUMBER_INPUT_DROPDOWN_TOGGLE);
    assert.dom(de('btn-worksheet-save')).isDisabled('The Done button is disabled when invalid range is present.');
    assert.dom(REQUIRED_NUMBER_INPUT_CONTAINER).hasClass('error', 'The error class is present on the number input component.');
    await click(REQUIRED_INPUT_ZERO);
    click(de('btn-worksheet-save'));
});
