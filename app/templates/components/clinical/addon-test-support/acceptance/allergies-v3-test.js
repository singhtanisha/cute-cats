import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';
import Mirage from 'ember-cli-mirage';

const ENCOUNTER_GUID = '7022d94f-d70a-4722-a205-dac898cf9f69';
const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const DRUG_ALLERGEN_SEARCH_TERM = 'amoxicillin';
const DRUG_ALLERGEN_TITLE = 'Amoxicillin';
const FOOD_ALLERGEN_SEARCH_TERM = 'peanut';
const FOOD_ALLERGEN_TITLE = 'Peanuts';
const FOOD_ALLERGEN_CUSTOM_SEARCH_TERM = 'Tomato paste';
const ENV_ALLERGEN_SEARCH_TERM = 'wool';
const ENV_ALLERGEN_TITLE = 'Wool';
const ALLERGY_ONSET_DATE = '05/01/2016';
const ALLERGY_ONSET_DATE_EDIT = '05/15/2016';
const ALLERGY_COMMENT_NEW = 'This is a newly created allergy';
const ALLERGY_COMMENT_EDIT = 'This is an updated allergy';
const DRUG_ALLERGY_ID = 'GUID1';
const FOOD_ALLERGY_ID = 'GUID2';
const ENV_ALLERGY_ID = 'GUID3';
const DRUG_ALLERGY_ITEM_SELECTOR = '.allergies-list-section.drug ul.list-selectable li';
const FOOD_ALLERGY_ITEM_SELECTOR = '.allergies-list-section.food ul.list-selectable li';
const ENV_ALLERGY_ITEM_SELECTOR = '.allergies-list-section.environmental ul.list-selectable li';

function validateListUpdate(assert, listSelector, initial, change) {
    const successMessage = (change > 0 ? 'Allergy was added to the correct list' : 'Allergy was removed from the list');

    assert.equal(find(listSelector).length, initial + change, successMessage);
    return initial + change;
}
function validateAllergyPost(assert, request, expectedTitle, id) {
    const data = JSON.parse(request.requestBody);
    const title = id === DRUG_ALLERGY_ID ? data.medication.name : data.substance.title;
    assert.equal(title, expectedTitle, 'Allergy was added with the chosen allergen');
    assert.equal(data.onsetDate, new Date(ALLERGY_ONSET_DATE).toISOString(), 'Allergy onset date is correct');
    assert.equal(data.comments, ALLERGY_COMMENT_NEW, 'Allergy comment is correct');
    data.patientAllergyGuid = id;
    data.drugInteractionAlert = false;
    return { patientAllergy: data };
}
function validateAllergyPut(assert, request, expectedId) {
    const data = JSON.parse(request.requestBody);
    assert.equal(data.patientAllergyGuid, expectedId, 'Selected allergy is updated');
    assert.equal(data.onsetDate, new Date(ALLERGY_ONSET_DATE_EDIT).toISOString(), 'Allergy onset date is correct');
    assert.equal(data.comments, ALLERGY_COMMENT_EDIT, 'Allergy comment is correctly updated');
    data.patientAllergyGuid = expectedId;
    data.drugInteractionAlert = false;
    return new Mirage.Response(204, null);
}
function validateAllergyDelete(assert, request, expectedId) {
    assert.equal(request.params.id, expectedId, 'The correct allergy is deleted');
}

moduleForAcceptanceAuth('Acceptance - Core - Clinical | Encounter allergies v3');

test('Empty allergies section renders properly', async assert => {
    server.get('ClinicalEndpoint/api/v3/patients/:patientPracticeGuid/allergies', () => ({ noKnownAllergies: false, patientAllergies: [] }));

    await visit(`/PF/charts/patients/${PATIENT_GUID}/encounter/${ENCOUNTER_GUID}`);
    assert.ok(find('.allergies-list-section.drug .pf-input--checkbox-label').text().toLowerCase().indexOf('no known drug allergies') > -1, 'Empty drug allergy section renders properly');
    assert.ok(find('.allergies-list-section.food').text().toLowerCase().indexOf('no food allergies recorded') > -1, 'Empty food allergy section renders properly');
    assert.ok(find('.allergies-list-section.environmental').text().toLowerCase().indexOf('no environmental allergies recorded') > -1, 'Empty environmental allergy section renders properly');
});

test('Can add, update and remove drug allergies', async assert => {
    assert.expect(16);
    server.post('ClinicalEndpoint/api/v3/patients/:patientPracticeGuid/allergies', ({ db }, request) => validateAllergyPost(assert, request, DRUG_ALLERGEN_TITLE, DRUG_ALLERGY_ID));
    server.put('ClinicalEndpoint/api/v3/patients/:patientPracticeGuid/allergies/:id', ({ db }, request) => validateAllergyPut(assert, request, DRUG_ALLERGY_ID));
    server.del('ClinicalEndpoint/api/v3/patients/:patientPracticeGuid/allergies/:id', ({ db }, request) => validateAllergyDelete(assert, request, DRUG_ALLERGY_ID));

    await visit(`/PF/charts/patients/${PATIENT_GUID}/encounter/${ENCOUNTER_GUID}`);
    let startingAllergyCount = find(DRUG_ALLERGY_ITEM_SELECTOR).length;
    assert.equal(find('.encounter-allergies-container').length, 1, 'Allergies section is rendered on the page');

    // Add a new allergy
    await click('.encounter-allergies-container .heading .btn.heading-action:first');
    assert.ok(find('.allergy-details:visible').length, 'Allergy detail panel appears when recording new allergy');
    assert.ok(find('.allergy-details .right-module-top .header15').text().indexOf('Record allergy') > -1, 'Allergy detail panel shows the recording new allergy header');
    click('.allergy-details .ember-button-group .group-option:first button');
    fillIn(`.allergy-details ${de('drug-allergen-search')} input`, DRUG_ALLERGEN_SEARCH_TERM);
    await keyEvent(`.allergy-details ${de('drug-allergen-search')} input`, 'keydown', 13);
    await wait();
    assert.ok(find(`.allergy-details ${de('drug-allergen-search')} .ember-select-result-item:last`).text().indexOf(DRUG_ALLERGEN_TITLE) > -1, 'Drug allergen search shows expected results');
    click(`.allergy-details ${de('drug-allergen-search')} .ember-select-result-item:last`);
    fillIn('.allergy-details .onset-section .ember-text-field input', ALLERGY_ONSET_DATE);
    fillIn(`.allergy-details ${de('text-area')}`, ALLERGY_COMMENT_NEW);
    click('.allergy-details .ember-button-group .group-option.yellow:first button');
    await click('.allergy-details .pull-right .btn:first');
    // Save is validated by Mirage - check that new allergy shows up in list
    startingAllergyCount = validateListUpdate(assert, DRUG_ALLERGY_ITEM_SELECTOR, startingAllergyCount, 1);

    // Edit the allergy
    await click(`${DRUG_ALLERGY_ITEM_SELECTOR} [data-guid='${DRUG_ALLERGY_ID.toString()}']`);
    assert.ok(find('.allergy-details:visible').length, 'Allergy detail panel appears when editing allergy');
    assert.ok(find('.allergy-details .right-module-top .header15').text().indexOf('Review drug allergy') > -1, 'Allergy detail panel shows the editing header');
    fillIn('.allergy-details .onset-section .ember-text-field input', ALLERGY_ONSET_DATE_EDIT);
    fillIn(`.allergy-details ${de('text-area')}`, ALLERGY_COMMENT_EDIT);
    await click('.allergy-details .pull-right > .btn-primary:last');
    // Save is validated by Mirage
    // Delete the allergy
    await click(`${DRUG_ALLERGY_ITEM_SELECTOR} [data-guid='${DRUG_ALLERGY_ID.toString()}']`);
    await click(`.allergy-details ${de('btn-delete')}`);
    assert.ok(find('.allergy-details .confirm-dialog-content:visible').length, 'User must confirm to delete the allergy');
    await click(`.allergy-details .confirm-dialog-content ${de('confirm-dialog-confirm')}`);
    // Delete validated by Mirage
    startingAllergyCount = validateListUpdate(assert, DRUG_ALLERGY_ITEM_SELECTOR, startingAllergyCount, -1);
});

test('Can add, update and remove food allergies', async assert => {
    assert.expect(16);

    server.post('ClinicalEndpoint/api/v3/patients/:patientPracticeGuid/allergies', ({ db }, request) => validateAllergyPost(assert, request, FOOD_ALLERGEN_TITLE, FOOD_ALLERGY_ID));
    server.put('ClinicalEndpoint/api/v3/patients/:patientPracticeGuid/allergies/:id', ({ db }, request) => validateAllergyPut(assert, request, FOOD_ALLERGY_ID));
    server.del('ClinicalEndpoint/api/v3/patients/:patientPracticeGuid/allergies/:id', ({ db }, request) => validateAllergyDelete(assert, request, FOOD_ALLERGY_ID));

    await visit(`/PF/charts/patients/${PATIENT_GUID}/encounter/${ENCOUNTER_GUID}`);
    let startingAllergyCount = find(FOOD_ALLERGY_ITEM_SELECTOR).length;
    assert.equal(find('.encounter-allergies-container').length, 1, 'Allergies section is rendered on the page');

    // Add a new allergy
    await click('.encounter-allergies-container .heading .btn.heading-action:first');
    assert.ok(find('.allergy-details:visible').length, 'Allergy detail panel appears when recording new allergy');
    assert.ok(find('.allergy-details .right-module-top .header15').text().indexOf('Record allergy') > -1, 'Allergy detail panel shows the recording new allergy header');
    await click('.allergy-details .ember-button-group .group-option:nth(1) button');
    fillIn(`.allergy-details ${de('other-allergen-search')} input`, FOOD_ALLERGEN_SEARCH_TERM);
    await click(`.allergy-details ${de('other-allergen-search')} input`);
    assert.ok(find(`.allergy-details ${de('other-allergen-search')} .ember-select-result-item:first`).text().indexOf(FOOD_ALLERGEN_TITLE) > -1, 'Food allergen search shows expected results');
    click(`.allergy-details ${de('other-allergen-search')} .ember-select-result-item:first`);
    fillIn('.allergy-details .onset-section .ember-text-field input', ALLERGY_ONSET_DATE);
    fillIn(`.allergy-details ${de('text-area')}`, ALLERGY_COMMENT_NEW);
    click('.allergy-details .ember-button-group .group-option.yellow:first button');
    await click('.allergy-details .pull-right .btn:first');
    // Save is validated by Mirage - check that new allergy shows up in list
    startingAllergyCount = validateListUpdate(assert, FOOD_ALLERGY_ITEM_SELECTOR, startingAllergyCount, 1);

    // Edit the allergy
    await click(`${FOOD_ALLERGY_ITEM_SELECTOR} [data-guid='${FOOD_ALLERGY_ID.toString()}']`);
    assert.ok(find('.allergy-details:visible').length, 'Allergy detail panel appears when editing allergy');
    assert.ok(find('.allergy-details .right-module-top .header15').text().indexOf('Review food allergy') > -1, 'Allergy detail panel shows the editing header');
    fillIn('.allergy-details .onset-section .ember-text-field input', ALLERGY_ONSET_DATE_EDIT);
    fillIn(`.allergy-details ${de('text-area')}`, ALLERGY_COMMENT_EDIT);
    await click('.allergy-details .pull-right > .btn-primary:last');
    // Save is validated by Mirage
    // Delete the allergy
    await click(`${FOOD_ALLERGY_ITEM_SELECTOR} [data-guid='${FOOD_ALLERGY_ID.toString()}']`);
    await click(`.allergy-details ${de('btn-delete')}`);
    assert.ok(find('.allergy-details .confirm-dialog-content:visible').length, 'User must confirm to delete the allergy');
    await click(`.allergy-details .confirm-dialog-content ${de('confirm-dialog-confirm')}`);
    // Delete validated by Mirage
    startingAllergyCount = validateListUpdate(assert, FOOD_ALLERGY_ITEM_SELECTOR, startingAllergyCount, -1);
});

test('Can add, update and remove environmental allergies', async assert => {
    assert.expect(16);

    server.post('ClinicalEndpoint/api/v3/patients/:patientPracticeGuid/allergies', ({ db }, request) => validateAllergyPost(assert, request, ENV_ALLERGEN_TITLE, ENV_ALLERGY_ID));
    server.put('ClinicalEndpoint/api/v3/patients/:patientPracticeGuid/allergies/:id', ({ db }, request) => validateAllergyPut(assert, request, ENV_ALLERGY_ID));
    server.del('ClinicalEndpoint/api/v3/patients/:patientPracticeGuid/allergies/:id', ({ db }, request) => validateAllergyDelete(assert, request, ENV_ALLERGY_ID));

    await visit('/PF/charts/patients/' + PATIENT_GUID + '/encounter/' + ENCOUNTER_GUID);
    let startingAllergyCount = find(ENV_ALLERGY_ITEM_SELECTOR).length;
    assert.equal(find('.encounter-allergies-container').length, 1, 'Allergies section is rendered on the page');

    // Add a new allergy
    await click('.encounter-allergies-container .heading .btn.heading-action:first');
    assert.ok(find('.allergy-details:visible').length, 'Allergy detail panel appears when recording new allergy');
    assert.ok(find('.allergy-details .right-module-top .header15').text().indexOf('Record allergy') > -1, 'Allergy detail panel shows the recording new allergy header');
    await click('.allergy-details .ember-button-group .group-option:nth(2) button');
    fillIn(`.allergy-details ${de('other-allergen-search')} input`, ENV_ALLERGEN_SEARCH_TERM);
    await click(`.allergy-details ${de('other-allergen-search')} input`);
    assert.ok(find(`.allergy-details ${de('other-allergen-search')} .ember-select-result-item:first`).text().indexOf(ENV_ALLERGEN_TITLE) > -1, 'Environmental allergen search shows expected results');
    click(`.allergy-details ${de('other-allergen-search')} .ember-select-result-item:first`);
    fillIn('.allergy-details .onset-section .ember-text-field input', ALLERGY_ONSET_DATE);
    fillIn(`.allergy-details ${de('text-area')}`, ALLERGY_COMMENT_NEW);
    click('.allergy-details .ember-button-group .group-option.yellow:first button');
    await click('.allergy-details .pull-right .btn:first');
    // Save is validated by Mirage - check that new allergy shows up in list
    startingAllergyCount = validateListUpdate(assert, ENV_ALLERGY_ITEM_SELECTOR, startingAllergyCount, 1);

    // Edit the allergy
    await click(`${ENV_ALLERGY_ITEM_SELECTOR} [data-guid='${ENV_ALLERGY_ID.toString()}']`);
    assert.ok(find('.allergy-details:visible').length, 'Allergy detail panel appears when editing allergy');
    assert.ok(find('.allergy-details .right-module-top .header15').text().indexOf('Review environmental allergy') > -1, 'Allergy detail panel shows the editing header');
    fillIn('.allergy-details .onset-section .ember-text-field input', ALLERGY_ONSET_DATE_EDIT);
    fillIn(`.allergy-details ${de('text-area')}`, ALLERGY_COMMENT_EDIT);
    await click('.allergy-details .pull-right > .btn-primary:last');
    // Save is validated by Mirage
    // Delete the allergy
    await click(`${ENV_ALLERGY_ITEM_SELECTOR} [data-guid='${ENV_ALLERGY_ID.toString()}']`);
    await click(`.allergy-details ${de('btn-delete')}`);
    assert.ok(find('.allergy-details .confirm-dialog-content:visible').length, 'User must confirm to delete the allergy');
    await click(`.allergy-details .confirm-dialog-content ${de('confirm-dialog-confirm')}`);
    // Delete validated by Mirage
    startingAllergyCount = validateListUpdate(assert, ENV_ALLERGY_ITEM_SELECTOR, startingAllergyCount, -1);
});

test('Can add custom food allergies', async assert => {
    assert.expect(10);

    server.post('ClinicalEndpoint/api/v3/patients/:patientPracticeGuid/allergies', ({ db }, request) => validateAllergyPost(assert, request, FOOD_ALLERGEN_CUSTOM_SEARCH_TERM, FOOD_ALLERGY_ID));

    await visit(`/PF/charts/patients/${PATIENT_GUID}/encounter/${ENCOUNTER_GUID}`);
    let startingAllergyCount = find(FOOD_ALLERGY_ITEM_SELECTOR).length;
    assert.equal(find('.encounter-allergies-container').length, 1, 'Allergies section is rendered on the page');

    // Add a new allergy
    await click('.encounter-allergies-container .heading .btn.heading-action:first');
    assert.ok(find('.allergy-details:visible').length, 'Allergy detail panel appears when recording new allergy');
    assert.ok(find('.allergy-details .right-module-top .header15').text().indexOf('Record allergy') > -1, 'Allergy detail panel shows the recording new allergy header');
    await click('.allergy-details .ember-button-group .group-option:nth(1) button');
    fillIn(`.allergy-details ${de('other-allergen-search')} input`, FOOD_ALLERGEN_TITLE);
    assert.ok(find(`.allergy-details ${de('other-allergen-search')} .ember-select-result-item:first`));
    await click(`.allergy-details ${de('other-allergen-search')} input`);
    assert.equal(find('.allergy-details .no-custom-results').length, 1, 'Add custom link is not clickable');
    await fillIn(`.allergy-details ${de('other-allergen-search')} input`, FOOD_ALLERGEN_CUSTOM_SEARCH_TERM);
    assert.equal(find('.allergy-details .no-custom-results').length, 0, 'Add custom link is clickable');
    await click(`.allergy-details ${de('other-allergen-search')} .ember-select-add-item`);
    fillIn('.allergy-details .onset-section .ember-text-field input', ALLERGY_ONSET_DATE);
    fillIn(`.allergy-details ${de('text-area')}`, ALLERGY_COMMENT_NEW);
    click('.allergy-details .ember-button-group .group-option.yellow:first button');
    await click('.allergy-details .pull-right .btn:first');
    // Save is validated by Mirage - check that new allergy shows up in list
    startingAllergyCount = validateListUpdate(assert, FOOD_ALLERGY_ITEM_SELECTOR, startingAllergyCount, 1);
});
