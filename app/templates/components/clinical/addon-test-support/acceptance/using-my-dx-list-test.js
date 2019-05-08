import { test } from 'qunit';
import de from 'boot/tests/helpers/data-element';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import sinon from 'sinon';

const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const DX_SEARCH = de('diagnosis-result-search');
const DX_SEARCH_INPUT = `${DX_SEARCH} input`;
const MY_DX_DIAGNOSIS = `${DX_SEARCH} .ember-select-results .single-option`;
const ADD_DIAGNOSIS_BTN = '.brand-sky:eq(0)';
const DIAGNOSIS_STRING = 'Acute delta-(super) infection of hepatitis B carrier';

let toastrErrorStub;
moduleForAcceptanceAuth('Acceptance - Core - Clinical | Using my dx list - v2', {
    beforeEach() {
        toastrErrorStub = sinon.stub(window.toastr, 'error');
    },
    afterEach() {
        window.toastr.error.restore();
    }
});

function setProviderPreferences(db, request) {
    const key = request.queryParams.keys;
    if (key === 'Charting.FavoriteDiagnosesDisplaySystem') {
        return { 'preferences': { 'charting.FavoriteDiagnosesDisplaySystem': 'icd9' } };
    }
    if (key === 'Charting.FavoriteDiagnosesSortOrder') {
        return { 'preferences': { 'charting.FavoriteDiagnosesSortOrder': 'alpha:asc' } };
    }
    return db.providerPreferences[0];
}

test('My Dx List - no favorite diagnoses empty state', async assert => {
    server.get('PracticeEndpoint/api/v1/PreferenceDoc/User/:userGuid/favoriteDiagnoses', () => []);
    await visit('/PF/charts/patients/' + PATIENT_GUID + '/summary');
    click(de('add-diagnosis-button'));
    await click(DX_SEARCH_INPUT);
    assert.equal(find(`${DX_SEARCH} .ember-select-hint`).text().trim(), 'Create personalized Dx favorites list in Settings to quickly select diagnoses that you use most often', 'Render the correct instructions when there are no items in dx list.');
    assert.throws(findWithAssert(`${DX_SEARCH} .ember-select-custom-tab-link`), 'Render the correct link to settings when dx list is empty.');
});

test('My Dx List can be used from the patient summary', async assert => {
    let addDiagnosisCallCount = 0;
    server.get('PracticeEndpoint/api/v1/preferences/provider', ({ db }, request) => setProviderPreferences(db, request));
    server.post('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/diagnoses', ({ db }, request) => {
        const requestJSON = JSON.parse(request.requestBody);
        addDiagnosisCallCount++;
        assert.equal(requestJSON.diagnosisCodes.length, 3, 'Correct number of diagnosis codes sent to endpoint');
        assert.equal(requestJSON.name, DIAGNOSIS_STRING, 'Correct diagnosis name sent to endpoint');
        return db.diagnoses[0];
    });
    await visit('/PF/charts/patients/' + PATIENT_GUID + '/summary');
    click(de('add-diagnosis-button'));
    await click(DX_SEARCH_INPUT);
    assert.ok(find(MY_DX_DIAGNOSIS).length > 0, 'Favorite diagnoses exist');
    assert.throws(findWithAssert(`${DX_SEARCH} .ember-select-custom-tab-link`), 'My Dx list settings link renders in the drop-down');
    await click(`${MY_DX_DIAGNOSIS}:first > div`);
    assert.throws(findWithAssert(`.diagnosis-description-icd10 > h4:contains('${DIAGNOSIS_STRING}')`), 'Selected diagnosis properly chosen');
    // Test showing and hiding codes on my dx list in summary
    await click(de('hide-codes-toggle'));
    assert.ok(find(de('my-dx-list-row-item-code').length === 0), 'Hiding codes no longer renders codes on my dx list in summary.');
    await click(de('show-codes-toggle'));
    assert.ok(find(de('my-dx-list-row-item-code').length > 0), 'Showing codes renders codes on my dx list in summary.');

    // Confirm that if you attempt to add it to my diagnoses, then you get a toast saying it's already added
    await click('.brand-sky:eq(1)');
    await click(`a:contains('Add to My Dx list')`);
    assert.equal(toastrErrorStub.args[0][0], 'Item already on the list', 'Attempting to add an existing diagnosis on my dx list renders a toast.');
    // Now add the diagnosis and only assert the service call since we already test for adding diagnoses after call is made
    await click(ADD_DIAGNOSIS_BTN);
    assert.equal(addDiagnosisCallCount, 1, 'Request to add diagnosis from my Dx list succeeds from summary.');
});

test('My Dx List can be used from the patient encounter', async assert => {
    let addDiagnosisCallCount = 0;
    server.get('PracticeEndpoint/api/v1/preferences/provider', ({ db }, request) => setProviderPreferences(db, request));
    server.post('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/diagnoses', ({ db }, request) => {
        const requestJSON = JSON.parse(request.requestBody);
        addDiagnosisCallCount++;
        assert.equal(requestJSON.diagnosisCodes.length, 3, 'Correct number of diagnosis codes sent to endpoint');
        assert.equal(requestJSON.name, DIAGNOSIS_STRING, 'Correct diagnosis name sent to endpoint');
        return db.diagnoses[0];
    });
    await visit('/PF/charts/patients/' + PATIENT_GUID + '/encounter/7022d94f-d70a-4722-a205-dac898cf9f69')
    click(de('encounter-record-diagnoses-btn'));
    await click(DX_SEARCH_INPUT);
    assert.ok(find(MY_DX_DIAGNOSIS).length > 0 , 'Favorite diagnoses exist');
    await click(`${MY_DX_DIAGNOSIS}:first > div`);
    assert.throws(findWithAssert(`.diagnosis-description-icd10 > h4:contains('${DIAGNOSIS_STRING}')`), 'Selected diagnosis properly chosen');
    // Now add the diagnosis and only assert the service call since we already test for adding diagnoses after call is made
    await click(ADD_DIAGNOSIS_BTN);
    assert.equal(addDiagnosisCallCount, 1, 'Request to add diagnosis from my Dx list succeeds from encounter.');
});

test('My Dx List can be used from the encounter assessment', async assert => {
    let addDiagnosisCallCount = 0;
    server.get('PracticeEndpoint/api/v1/preferences/provider', ({ db }, request) => setProviderPreferences(db, request));
    server.post('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/diagnoses', ({ db }, request) => {
        const requestJSON = JSON.parse(request.requestBody);
        const diagnoses = db.diagnoses[0];
        assert.equal(requestJSON.diagnosisCodes.length, 3, 'Correct number of diagnosis codes sent to endpoint');
        assert.equal(requestJSON.name, DIAGNOSIS_STRING, 'Correct diagnosis name sent to endpoint');
        addDiagnosisCallCount++;
        diagnoses.transcriptDiagnoses[0].transcriptGuid = '7022d94f-d70a-4722-a205-dac898cf9f69';
        return diagnoses;
    });
    await visit('/PF/charts/patients/' + PATIENT_GUID + '/encounter/7022d94f-d70a-4722-a205-dac898cf9f69');
    await click(de('edit-note-assessment'));
    await click(de('toolbox-tab-diagnoses'));
    assert.ok(find(`.diagnoses-flyout li:contains('My Dx list')`).length > 0, 'My Dx List sub tab exists when recording an assessment.');
    await click(de('diagnoses-tab-my-dx'));
    assert.ok(find('.favorite-diagnoses--item').length > 0 , 'Favorite diagnoses exist when recording an assessment.');
    await click('.diagnosis-codes-row:first');
    assert.equal(find('.diagnoses-assessment-list.with-diagnoses .field-label').text().trim(), 'Diagnoses attached to this encounter', 'Label showing that diagnoses are attached to the encounter renders properly on record assessment.');
    assert.equal(find('.diagnoses-assessment-list.with-diagnoses #medication-list-container').text().trim(), DIAGNOSIS_STRING, 'Selected diagnosis properly in Record Assessment from my Dx list.');
});

// The rest of these tests will only attempt to use a diagnosis from my Dx list and confirm it populates properly on the diagnosis view after being selected
test('My Dx List can be used from the lab result (edit/view)', async assert => {
    server.get('PracticeEndpoint/api/v1/preferences/provider', ({ db }, request) => setProviderPreferences(db, request));
    server.post('LabsEndpoint/api/v1/resultorders/:resultOrderGuid/resultorderitems/:resultOrderItemsGuid/upsertResultObservation', () => ({}));
    await visit('/PF/charts/patients/' + PATIENT_GUID + '/results/60895fbc-810b-4793-9f65-c914fc8907f4/edit');
    await click('.icon-exand-collapse:first');
    await click(de('record-diagnosis-link'));
    await wait();
    assert.ok(find(MY_DX_DIAGNOSIS).length > 0 , 'Favorite diagnoses exist');
    await click(`${MY_DX_DIAGNOSIS}:first > div`);
    assert.throws(findWithAssert(`.diagnosis-description-icd10 > h4:contains('${DIAGNOSIS_STRING}')`), 'Selected diagnosis properly chosen');
    await click(ADD_DIAGNOSIS_BTN);
    assert.equal(find(de('edit-observation-diagnosis-name')).text().trim(), DIAGNOSIS_STRING, 'Added diagnosis from My Dx List to lab edit view.');

    // Click "View"
    await click(de('view-result-report'));
    await click(de('observation-name'));
    await click(de('record-diagnosis-link'));
    await click(`${MY_DX_DIAGNOSIS}:first > div`);
    assert.throws(findWithAssert(`.diagnosis-description-icd10 > h4:contains('${DIAGNOSIS_STRING}')`), 'Selected diagnosis properly in lab view from my Dx list.');
    await click(ADD_DIAGNOSIS_BTN);
    assert.equal(find(de('view-observation-diagnosis-name')).text().trim(), DIAGNOSIS_STRING, 'Added diagnosis from My Dx List to lab view.');
});
