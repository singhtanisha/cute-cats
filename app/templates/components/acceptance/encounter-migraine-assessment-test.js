import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';

const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const TRANSCRIPT_GUID = '7022d94f-d70a-4722-a205-dac898cf9f69';
const SIA_SECTION = 'section #dFinalizeEvents';
const SIA_SECTION_HEADER = `${SIA_SECTION} header:contains('Screenings/ Interventions/ Assessments')`;
const SIA_ADD_ITEM = `${SIA_SECTION} a:contains('Add item')`;
const SIA_SELECT_FIELD = `${SIA_SECTION} .sia-search-single-select`;
const SIA_TEXT_SEARCH = `${SIA_SELECT_FIELD} input`;
const MIGRAINE_SEARCH_ITEM = `${SIA_SECTION} .sia-search-single-select .ember-select-result-item a:contains("MIDAS")`;
const MIDAS_EDITABLE_SELECT_INPUTS = '.days-selector .editable-select input.form-control';
const SCORE_15_GRADE_III_TEXT = '15 - Grade III, moderate disability';
const SCORE_30_GRADE_IV_TEXT = '30 - Grade IV, severe disability';

moduleForAcceptanceAuth('Acceptance - Core - Charting | Encounter MIDAS assesment worksheet');

test('Can add, edit and migraine assessment worksheet', async assert => {
    assert.expect(10);

    server.post('ChartingEndpoint/api/v3/patients/:patientGuid/transcriptEvents', ({ db }) => db.midasTranscriptEvents[0]);

    server.post('ChartingEndpoint/api/v2/WorksheetResponses', ({ db }, request) => {
        const requestBody = JSON.parse(request.requestBody);
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
    assert.ok(find('.right-module .right-module-top h15').text().trim() === 'Screenings/ Interventions/ Assessments > Record', 'Module heading renders properly');
    assert.dom(de('worksheet-display-name')).hasText('Migraine disability assessment test', 'Module title render properly');
    assert.equal(find(MIDAS_EDITABLE_SELECT_INPUTS).toArray().length, 6, 'There are 6 editable inputs');
    assert.dom(de('worksheet-score')).hasText('No score', 'The proper score is render when worksheet is displayed');
    assert.dom(de('btn-worksheet-save')).isDisabled('Save button is disabled if there is no score');
    click(`${de('worksheet-question-0')} button`);
    click(`${de('worksheet-question-0')} .editable-select ul.dropdown-menu li:eq(3) a`);
    click(`${de('worksheet-question-2')} .editable-select ul.dropdown-menu li:eq(3) a`);
    click(`${de('worksheet-question-4')} .editable-select ul.dropdown-menu li:eq(3) a`);
    click(`${de('worksheet-question-6')} .editable-select ul.dropdown-menu li:eq(3) a`);
    await click(`${de('worksheet-question-8')} .editable-select ul.dropdown-menu li:eq(3) a`);
    assert.dom(`${de('worksheet-score')}`).hasText(SCORE_15_GRADE_III_TEXT, 'The proper score and summary text is render based on the response values');
    await click(`${de('worksheet-question-10')} .editable-select ul.dropdown-menu li:eq(7) a`);
    assert.dom(`${de('worksheet-score')}`).hasText(SCORE_15_GRADE_III_TEXT, 'Changing a non required numeric input field does not affect worksheet scoring.');
    await click(`${de('worksheet-question-0')} .editable-select ul.dropdown-menu li:eq(18) a`);
    assert.dom(`${de('worksheet-score')}`).hasText(SCORE_30_GRADE_IV_TEXT, 'Changing a required field affects worksheet scoring. And updates the summary text.');
    click(`${de('btn-worksheet-save')}`);
});
