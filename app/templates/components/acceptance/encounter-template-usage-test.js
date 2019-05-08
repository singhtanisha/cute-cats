import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';

const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const TRANSCRIPT_GUID = '7022d94f-d70a-4722-a205-dac898cf9f69';
const ENCOUNTER_URL = '/PF/charts/patients/' + PATIENT_GUID + '/encounter/' + TRANSCRIPT_GUID;
const FIRST_TEMPLATE_TEXT = 'Patient name: Some L Baby \nDate of birth: 02/01/2013 \nAddress: 123 Who cares, No way, AL, 95835 \nAge: 3 yrs \nEmail: No email recorded ';
const SECOND_TEMPLATE_TEXT = 'Phone Number: (555) 555-5554 .';
const EXAMPLE_TEMPLATE = '.template-item-text.template-name:first';
const TEXT_EDITOR = de('rich-text-editor');

moduleForAcceptanceAuth('Acceptance - Core - Charting | Encounter using template tests');

test('Encounter Template - User can record a note with an existing template', async assert => {
    server.get('/PatientEndpoint/api/:v/patients/:id/contacts', ({ db }, request) => {
        const patientPracticeGuid = request.params.id;
        const patientContact = db.patientContacts.find(patientPracticeGuid);
        delete patientContact.patient.emailAddress;
        return patientContact;
    });
    server.get('/PatientEndpoint/api/v3/patients/:id', ({ db }, request) => {
        const patientPracticeGuid = request.params.id;
        const patientContact = db.patientV3S.find(patientPracticeGuid);
        delete patientContact.patient.emailAddress;
        return patientContact;
    });
    let templateText;
    let templates;
    await visit(ENCOUNTER_URL);
    await click(de('edit-note-subjective') + ':first');
    await click(de('toolbox-tab-my-templates'));
    await click(EXAMPLE_TEMPLATE);
    // Assert you're using the right template
    assert.equal(find('.template-title').text(), 'Example Template', 'Template title renders properly.');
    await click('.flex-template-item-container:first');
    // Confirm adding one will render the proper text - separators are not added yet
    const templateItems = find(TEXT_EDITOR).text().trim().split(' \n');
    assert.equal(templateItems[0], 'Patient name: Some L Baby', 'Selecting first template successfully renders patient name.');
    assert.equal(templateItems[1], 'Date of birth: 02/01/2013', 'Selecting first template successfully renders patient dob.');
    assert.equal(templateItems[2], 'Address: 123 Who cares, No way, AL, 95835', 'Selecting first template successfully renders patient address.');
    assert.equal(templateItems[3], 'Age: 3 yrs', 'Selecting first template successfully renders patient age.');
    // The last portion of the template will have the period separator which is expected
    assert.equal(templateItems[4], 'Email: No email recorded .', 'Selecting first template successfully renders default text for empty item (email).');
    await click('.flex-template-item-container:eq(1)');
    templateText = find(TEXT_EDITOR).text().trim();
    templates = templateText.split('. ');
    assert.equal(templates[0], FIRST_TEMPLATE_TEXT, 'First template renders properly and is separated by period as specified in provider preference.');
    assert.equal(templates[1], SECOND_TEMPLATE_TEXT, 'Second template renders properly and is separated by period as specified in provider preference.');
    // Test back to templates works properly
    await click(de('back-to-templates'));
    assert.ok(find(de('charting-template-list')).length > 0, 'Template list renders properly after user goes back to choose template view.');
    // Clear existing text before adding all
    find(TEXT_EDITOR).text('');
    await click(EXAMPLE_TEMPLATE);
    // Add all
    await click(de('add-all-template-items'));
    templateText = find(TEXT_EDITOR).text().trim();
    templates = templateText.split('. ');
    assert.equal(templates[0], FIRST_TEMPLATE_TEXT, 'First template renders properly after add all and is separated by period as specified in provider preference.');
    assert.equal(templates[1], SECOND_TEMPLATE_TEXT, 'Second template renders properly after add all and is separated by period as specified in provider preference.');
    // two icon checkmarks are visible to indicate the templates are being used
    assert.equal(find('.icon.icon-checkmark').length, 2, 'There are two checkmarks to indicate that two templates are being used.');

    // Empty out previous template text and add patient demographics from text area component
    find(TEXT_EDITOR).text('');
    await click(de('patient-demographic-dropdown'));
    await click(`.dropdown-menu span:contains('Address')`);
    assert.equal(find(TEXT_EDITOR).text().trim(), '123 Who cares, No way, AL, 95835', 'Patient address renders after being chosen from in the text area');
});
