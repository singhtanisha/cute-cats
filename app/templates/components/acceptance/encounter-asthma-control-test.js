import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';

const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const TRANSCRIPT_GUID = '7022d94f-d70a-4722-a205-dac898cf9f69';
const SIA_SECTION = 'section #dFinalizeEvents';

moduleForAcceptanceAuth('Acceptance - Core - Charting | Encounter asthma control worksheet');

test('Can add, edit and delete adult asthma control worksheet', async assert => {
    server.post('ChartingEndpoint/api/v3/patients/:patientGuid/transcriptEvents', ({ db }) => db.asthmaTranscriptEvents[0]);

    await visit('/PF/charts/patients/' + PATIENT_GUID + '/encounter/' + TRANSCRIPT_GUID);
    assert.ok(find(`${SIA_SECTION} header:contains('Screenings/ Interventions/ Assessments')`).length > 0, 'Screenings/ Interventions/ Assessments is visible in encounter');
    await click(`${SIA_SECTION} a:contains('Add item')`);
    await fillIn(`${SIA_SECTION} input`, 'Asthma');
    // Opening up the asthma control right module
    await keyEvent(`${SIA_SECTION} .sia-search-single-select`, 'keydown', 13);
    await wait();
    await click(`${SIA_SECTION} .sia-search-single-select .ember-select-result-item > a:contains("Adult Asthma")`);
    // Confirm headers for the right module is correct
    assert.ok(find('.right-module .right-module-top h15').text().trim() === 'Screenings/ Interventions/ Assessments > Record', 'Adult Asthma Control Right module heading renders properly');
    assert.dom('.worksheet-details-v2 h4').hasText('Asthma Control Test™', 'Adult Asthma Control Right module title renders properly');

    // Confirm Asthma Control Status
    assert.equal(find('.right-module .field-label:first').text(), 'Status', 'Adult Asthma control status header renders properly');
    assert.equal(find('.right-module .composable-select__selection').text().trim(), 'Performed', 'Adult Asthma control status for performed renders properly');

    // Ensure all the Asthma Control questions render properly
    assert.equal(find(de('worksheet-question-label-0')).text(), 'In the past 4 weeks, how much of the time did your asthma keep you from getting as much done at work, school or at home?', 'First Adult Asthma Control question renders properly.');
    assert.equal(find(de('worksheet-question-label-1')).text(), 'During the past 4 weeks, how often have you had shortness of breath?', 'Second Adult Asthma Control question renders properly.');
    assert.equal(find(de('worksheet-question-label-2')).text(), 'During the past 4 weeks, how often did your asthma symptoms (wheezing, coughing, shortness of breath, chest tightness or pain) wake you up at night or earlier than usual in the morning?', 'Third Adult Asthma Control question renders properly.');
    assert.equal(find(de('worksheet-question-label-3')).text(), 'During the past 4 weeks, how often have you used your rescue inhaler or nebulizer medication (such as albuterol)?', 'Fourth Adult Asthma Control question renders properly.');
    assert.equal(find(de('worksheet-question-label-4')).text(), 'How would you rate your asthma control during the past 4 weeks?', 'Fifth Adult Asthma Control question renders properly.');

    // Select an answer for each asthma control question
    await click('.right-module ol li:first .pf-input--radio-label:eq(2)');
    await click('.right-module ol li:eq(1) .pf-input--radio-label:eq(2)');
    await click('.right-module ol li:eq(2) .pf-input--radio-label:eq(2)');
    await click('.right-module ol li:eq(3) .pf-input--radio-label:eq(2)');
    await click('.right-module ol li:eq(4) .pf-input--radio-label:eq(2)');
    assert.dom(de('worksheet-score')).hasText('15', 'Confirm Adult Asthma Control scoring renders properly with the right number of points accumulated.');
    assert.ok(find(`.right-module:contains('If your score is 19 or less, your asthma may not be as well controlled as it could be.')`).length > 0, 'Adult Asthma Control informational text on resulting score renders properly.');
    assert.dom(de('worksheet-copyright')).hasText('Copyright 2002, by QualityMetric Incorporated. Asthma Control Test is a trademark of QualityMetric Incorporated.', 'Adult Asthma Control copyright text renders properly.');

    await click(de('btn-worksheet-save'));
    assert.ok(find(`${SIA_SECTION} li .event-heading .event-name`).text() === 'Adult Asthma Control Test (ages 12 and up)', 'Confirm Adult Asthma Control was updated on encounter');
    // Confirm Total Score
    assert.ok(find(SIA_SECTION + ' li .event-heading .event-info:eq(1)').text() === 'Total score:', 'Confirm Total Score text renders properly for adult asthma control assessment.');
    assert.ok(find(SIA_SECTION + ' li .event-heading .event-info:eq(2)').text() === '15', 'Confirm score renders properly for adult asthma control assessment.');
    // Confirm Result
    assert.ok(find(SIA_SECTION + ' li .event-heading .event-info:eq(3)').text() === 'Result:', 'Confirm Result text renders properly for adult asthma control assessment.');
    assert.ok(find(SIA_SECTION + ' li .event-heading .event-info:eq(4)').text() === 'If your score is 19 or less, your asthma may not be as well controlled as it could be.', 'Confirm Result renders properly for adult asthma control assessment.');
    // Edit the asthma control worksheet
    await click(`${SIA_SECTION} li .event-heading .event-name`);
    await click('.right-module ol li:first .pf-input--radio-label:eq(3)');
    // Change one of th answers and confirm the result
    assert.dom(de('worksheet-score')).hasText('16', 'Confirm updating Adult Asthma Control scoring renders properly with the right number of points accumulated.');
    await click(de('btn-worksheet-save'));
    // Delete the asthma control worksheet
    await click(`${SIA_SECTION} li .event-heading .event-name`);
    await click(de('btn-worksheet-delete'));
    assert.ok(find(`${SIA_SECTION} li .event-heading .event-name`).length < 1, 'Confirm Adult Asthma Control was deleted on encounter.');
});
