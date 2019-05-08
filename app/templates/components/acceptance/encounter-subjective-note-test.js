import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';

const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const TRANSCRIPT_GUID = '7022d94f-d70a-4722-a205-dac898cf9f69';
const TRANSCRIPT_URL = '/PF/charts/patients/' + PATIENT_GUID + '/encounter/' + TRANSCRIPT_GUID;
const RECORD_SUBJECTIVE = de('edit-note-subjective');
const PMH_TAB = de('toolbox-tab-previous');
const PREVIOUS_ENCOUNTER_TAB = de('previous-encounters-tab');
const TEXT_EDITOR = de('rich-text-editor');
const CHECKMARKS = '.results-list .icon-checkmark';

moduleForAcceptanceAuth('Acceptance - Visual - Core - Charting | Encounter subjective note tests');

test('Encounter Subjective Note - Can add past medication history to subjective and no previous encounters test', async assert => {
    server.get('ClinicalEndpoint/api/v2/PersonalMedicalHistory/:id', ({ db }, request) => ({
        'patientPracticeGuid': request.params.id,
        'events':'Broken bone',
        'allergies':null,
        'allergiesPmhGuid':'ad30d844-0338-42d0-9151-5d45428d83ab',
        'ongoingMedicalProblems':'Chronic fatigue',
        'familyHealthHistory': null,
        'preventativeCare':'Eat protein based foods to avoid limits in diet',
        'socialHistory':'Likes to go out',
        'nutritionHistory':'Started on a vegan diet at age 10',
        'developmentalHistory':'Walking and talking normally'
    }));
    // To assert empty previous visits state
    server.get('ChartingEndpoint/api/v2/PreviousVisits/:id', () => []);

    await visit(TRANSCRIPT_URL);
    await click(RECORD_SUBJECTIVE);
    percySnapshot(assert);
    await click(PMH_TAB);
    const historyItem = '.template-item';
    assert.equal(find(historyItem + ':eq(0)').text().trim(), 'Developmental history: Walking and talking normally', 'Developmental history renders properly on past medical history from subjective note.');
    assert.equal(find(historyItem + ':eq(1)').text().trim(), 'Family health history: Not recorded', 'No Family health history recorded renders properly on past medical history from subjective note.');
    assert.equal(find(historyItem + ':eq(2)').text().trim(), 'Major events: Broken bone', 'Major events renders properly on past medical history from subjective note.');
    assert.equal(find(historyItem + ':eq(3)').text().trim(), 'Nutrition history: Started on a vegan diet at age 10', 'Nutrition history renders properly on past medical history from subjective note.');
    assert.equal(find(historyItem + ':eq(4)').text().trim(), 'Ongoing medical problems: Chronic fatigue', 'Ongoing medical problems renders properly on past medical history from subjective note.');
    assert.equal(find(historyItem + ':eq(5)').text().trim(), 'Preventive care: Eat protein based foods to avoid limits in diet', 'Preventative care renders properly on past medical history from subjective note.');
    assert.equal(find(historyItem + ':eq(6)').text().trim(), 'Social history: Likes to go out', 'Social history renders properly on past medical history from subjective note.');

    await click(historyItem + ':eq(0)');
    assert.equal(find(TEXT_EDITOR).text().trim(), 'Developmental history: Walking and talking normally.', 'Choosing developmental history renders properly on note.');
    assert.equal(find(CHECKMARKS).length, 1, 'There is one checkbox rendered for developmental history after being selected for the subjective note.');
    find(TEXT_EDITOR).text('');
    await click(de('add-all-pmh-link'));
    assert.equal(find(CHECKMARKS).length, 7, 'All the pmh is selected and checkboxes render after clicking add all for subjective note.');

    // Split text by separator and you should get each item - 7 total
    const textAdded = find(TEXT_EDITOR).text().trim().split('. ');
    assert.equal(textAdded.length, 7, 'All the pmh is added to the text editor for the subjective note.');

    // Assert empty state for previous encounter
    await click(PREVIOUS_ENCOUNTER_TAB);
    assert.equal(find('.results-list .results-error').text().trim(), 'No previous encounters', 'There are no previous encounters to add to subjective note.');
});

test('Encounter Subjective Note - Can add previous encounter to subjective', async assert => {
    server.get('ChartingEndpoint/api/v2/PreviousVisits/:id', ({ db }, request) => {
        const params = request.queryParams;
        assert.equal(params.xMostRecent, 200, 'Query param for most recent previous visits is correct.');
        return [{
            'subjective':'<div class=\"pf-rich-text\"><p>Developmental history: Not recorded. Family health history: Obesity.. Major events: Broken bone.. Nutrition history: Not recorded. Ongoing medical problems: Chronic fatigue.. Preventive care: Not recorded. Social history: Likes to drink . <br></p></div>',
            'dateOfService':'2016-12-08T00:00:00Z',
            'patientPracticeGuid':'ecd212c3-5c99-499e-b3c6-b2645b8a4c98',
            'transcriptGuid':'562d5f03-61e5-46cc-a72c-32902c474be0'
        }];
    });
    await visit(TRANSCRIPT_URL);
    await click(RECORD_SUBJECTIVE);
    click(de('toolbox-tab-previous'));
    await click(PREVIOUS_ENCOUNTER_TAB);
    assert.equal(find('.encounter-title:eq(0)').text().trim(), '12/08/16: Office Visit, SOAP Note', 'Title renders properly for previous encounter.');
    await click('.encounter-title');
    // click one template item
    await click('.template-item:eq(0)');
    assert.equal(find(TEXT_EDITOR).text().trim(), 'Developmental history: Not recorded.', 'Choosing developmental history from previous encounter renders properly on note.');
    assert.equal(find(CHECKMARKS).length, 1, 'There is one checkbox rendered for developmental history after being selected for the subjective note from previous encounter.');
    find(TEXT_EDITOR).text('');
    await click(de('add-all-previous-encounters'));
    // Add all pmh from previous encounter
    assert.equal(find(CHECKMARKS).length, 7, 'All the pmh from previous encounter is selected and checkboxes render after clicking add all for subjective note.');

    // Split text by separator and you should get each item - 7 total
    const textAdded = find(TEXT_EDITOR).text().trim().split('. ');
    assert.equal(textAdded.length, 7, 'All the pmh from previous encounter is added to the text editor for the subjective note.');

    // Go back and assert that the encounter title renders
    await click(de('previous-enconter-tab-go-back'));
    assert.equal(find('.encounter-title:eq(0)').text().trim(), '12/08/16: Office Visit, SOAP Note', 'Title renders properly for previous encounter after going back to previous encounter view.');
});
