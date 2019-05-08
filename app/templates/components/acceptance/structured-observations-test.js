import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';
import Mirage from 'ember-cli-mirage';

const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const OLD_TRANSCRIPT_GUID = '82a597e5-b1b8-46e4-8a07-5c3a4f778e95';
const NEW_TRANSCRIPT_GUID = '9ccee99e-1396-474b-8fc7-bbaf84bec7c9';
const OLD_ENCOUNTER_URL = `/PF/charts/patients/${PATIENT_GUID}/encounter/${OLD_TRANSCRIPT_GUID}`;
const NEW_ENCOUNTER_URL = `/PF/charts/patients/${PATIENT_GUID}/encounter/${NEW_TRANSCRIPT_GUID}`;

moduleForAcceptanceAuth('Acceptance - Core - Charting | Structured Functional and Cognitive Observations');

async function addObservation(searchTerm) {
    const searchField = '.observation-select';

    fillIn(`${searchField} input`, searchTerm);
    await keyEvent(searchField, 'keydown', 13);
    await wait();
    const firstResult = '.observation-select .ember-select-result-item:first';
    return click(firstResult);
}

test('Users with old data will be shown the old observations UI', async assert => {
    await visit(OLD_ENCOUNTER_URL);
    const observationFreeTextFields = '#observations .auto-saving-text-area';
    assert.ok(find(observationFreeTextFields).length, 2, 'Old UI (free text fields) are shown when encounters have old observation data');
});

test('Users with no old observation data will be shown the new observations UI', async assert => {
    await visit(NEW_ENCOUNTER_URL);
    const record = '#observations .heading:eq(0) a:contains(Record)';
    const close = '.observation-detail .close-box';

    await click(record);
    assert.throws(findWithAssert('.observation-detail'), 'New UI (observation detail pane) is shown when an encounter has no old observation data');
    click(close);
});

test('Save and add another observation', async assert => {
    let postCalled = false;

    server.get('ChartingEndpoint/api/v2/EncounterEventType/', ({ db }) => {
        return db.structuredFunctionalObservations[0];
    });
    server.post('ChartingEndpoint/api/v3/patients/:patientPracticeGuid/transcriptEvents/', function ({ db }) {
        postCalled = true;
        return db.structuredFunctionalObservationResponses[0];
    });

    await visit(NEW_ENCOUNTER_URL);
    const record = '#observations .heading:eq(0) a:contains(Record)';
    await click(record);
    await addObservation('Jump');
    const edit = '.observation-detail a';

    // Assert search bar appears when clicking edit
    await click(edit);
    await addObservation('Able to sit');
    const observationName = de('observation-name');
    const code = de('observation-code');
    const date = '.observation-date input';
    const saveAndAddAnother = de('btn-save-add-another');
    const save = de('btn-save');

    assert.equal(find(observationName).text().trim(), 'Able to sit with support, unable to sit unsupported', 'Observation title renders correctly');
    assert.equal(find(code).text().trim(), 'SNOMED-CT - 423788005', 'SNOMED code renders correctly');
    assert.equal(find(date)[0].value, '8/23/2016', 'Date field is prepopulated with encounter date of service');

    await click(saveAndAddAnother);
    const observationDescription = de('observation-description') + ':eq(0)';
    const observationDate = de('observation-date') + ':eq(0)';
    const searchField = '.observation-select';

    // Assert encounter section is updated and POST call to save was made
    assert.ok(postCalled, 'POST call was made to save observation');
    assert.equal(find(observationDescription).text().trim(), 'Able to sit with support, unable to sit unsupported', 'Observation description was rendered on the encounter');
    assert.equal(find(observationDate).text().trim(), '08/14/2017', 'Observation date was rendered on the encounter');

    // Assert detail pane was reset
    assert.throws(findWithAssert(searchField), 'Search field appears when trying to add another observation');
    assert.notOk(find(save).length, 'Save button disappears when adding another observation');
    assert.notOk(find(saveAndAddAnother).length, 'Save & add another button disappears when adding another observation');
    assert.notOk(find(observationName).length, 'Observation name disappears when adding another observation');
    assert.notOk(find(code).length, 'Code field disappears when adding another observation');
    assert.notOk(find(date).length, 'Date field disappears when adding another observation');
});

test('Edit and delete an observation', async assert => {
    let putCalled = false;
    let deleteCalled = false;

    server.get('ChartingEndpoint/api/v2/EncounterEventType/', ({ db }) => db.structuredFunctionalObservations[0]);

    server.put('ChartingEndpoint/api/v3/patients/:patientPracticeGuid/transcriptEvents/:transcriptGuid', () => {
        putCalled = true;
        return new Mirage.Response(204, {}, null);
    });
    server.delete('ChartingEndpoint/api/v3/patients/:patientPracticeGuid/transcriptEvents/:transcriptGuid', () => {
        deleteCalled = true;
        return new Mirage.Response(204, {}, null);
    });

    await visit(NEW_ENCOUNTER_URL);
    const observationDescription = de('observation-description');
    let observationDate = de('observation-date');
    await click(observationDescription);
    fillIn('.observation-date input', '01/01/2017');
    await keyEvent('.observation-date', 'keydown', 13);
    const saveButton = de('btn-save');
    await click(saveButton);
    observationDate = de('observation-date');

    // Assert PUT call to update observation was made and new date was rendered on UI
    assert.ok(putCalled, 'PUT call was made to update observation');
    assert.equal(find(observationDate).text().trim(), '01/01/2017', 'Edited observation date was rendered on the encounter');
    await click(observationDescription);
    const deleteButton = de('btn-delete');
    await click(deleteButton);
    const observationSection = de('observation-section') + ':eq(1)';

    // Assert DELETE call to delete observation was made and removed from UI
    assert.ok(deleteCalled, 'DELETE call was made to delete observation');
    assert.equal(find(observationSection).text().trim(), 'No cognitive status recorded.', 'Observation was deleted and removed from the observation section');
});
