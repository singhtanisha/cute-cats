import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';
import getText from 'boot/tests/helpers/get-text';

const sig = '1 tablet orally one time';
const comment = 'Some medication comment';
const today = moment().startOf('day').toISOString();
const searchInput = `${de('medications-search')} input`;
const proliaSearchResult = [{
    ndc: '55513071001',
    tradeName: 'Prolia',
    drugName: 'Prolia 60 MG/ML Subcutaneous Solution',
    genericName: 'Denosumab',
    productStrength: '60 MG/ML',
    route: 'Subcutaneous',
    doseForm: 'Solution',
    isGeneric: false,
    isOverTheCounter: false,
    controlledSubstanceSchedule: '',
    isMedicalSupply: false,
    isObsolete: false,
    rxNormCui: '993458',
    searchScore: 10.932226,
    strengthScore: 60.0,
    marketEndDate: '9999-12-31T16:00:00Z'
}];
const SEARCH_RESULT_KEFLEX = [{
    ndc:"58463001101",
    tradeName:"Keflex",
    drugName:"Keflex 250 MG Oral Capsule",
    genericName:"Cephalexin",
    productStrength:"250 MG",
    route:"Oral",
    doseForm:"Capsule",
    isGeneric:false,
    isOverTheCounter:false,
    controlledSubstanceSchedule:"",
    isMedicalSupply:false,
    isObsolete:false,
    drugSubsystemId:0,
    rxNormCui:"309112",
    genericProductId:0,
    searchScore:10.266459,
    strengthScore:250.0,
    marketEndDate:"9999-12-31T08:00:00Z",
    patientMedicationGuid:null,
    brandedRxNormCui:"212306",
    routedDrugId:null
 }];
const MED_DETAIL_NAME = de('medication-detail-drug-name');

moduleForAcceptanceAuth('Acceptance - Core - Clinical | Medications - v2');

test('Empty medications section renders properly', async assert => {
    server.get('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/aggregate', () => ({'diagnoses':{'patientDiagnoses':[],'noKnownDiagnoses':false},
        'medications':{'patientMedications':null,'noKnownMedications':false}}));

    await visit('/PF/charts/patients/c5faffde-78e2-4924-acaf-2115bc686d5e/summary');
    assert.ok(find(de('no-active-medications-label')).text().toLowerCase().indexOf('no active medications') > -1, 'Empty medications section renders properly');
});

test('Add a medication', async assert => {
    server.get('ClinicalEndpoint/api/v2/frequentMedications/', () => []);

    server.post('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/medications', ({ db }, request) => {
        const medication = JSON.parse(request.requestBody);
        assert.ok(!medication.medicationGuid, 'There is no medication guid on the new medication');
        assert.equal(medication.tradeName, 'Vicodin', 'The medication\'s trade name is correct');
        assert.equal(medication.rxNormCui, '856987', 'The medication\'s rxNormCui is correct');
        assert.equal(medication.ndc, '00074304113', 'The medication\'s ndc is correct');
        assert.equal(medication.controlledSubstanceSchedule, '2', 'The medication\'s controlledSubstanceSchedule is correct');
        assert.equal(medication.drugName, 'Vicodin 5-300 MG Oral Tablet', 'The medication\'s drugName is correct');
        assert.equal(medication.rxNormCui, '856987', 'The medication\'s rxNormCui is correct');
        assert.equal(medication.sig.patientDescription, sig, 'The sig\'s patient description is correct');
        assert.equal(medication.sig.professionalDescription, sig, 'The sig\'s professional description is correct');
        assert.equal(moment(medication.startDateTime).toISOString(), today, 'The medication\'s start date is correct');
        assert.equal(medication.transcriptMedications[0].comment, comment, 'The medication\'s comment is correct');

        medication.medicationGuid = 'MED_GUID';
        medication.lastModifiedDateTimeUtc = moment().toISOString();
        return medication;
    });

    await visit('/PF/charts/patients/c5faffde-78e2-4924-acaf-2115bc686d5e/summary');
    await click(de('record-medication'));
    assert.throws(findWithAssert('.medication-detail'));
    assert.equal(getText(de('frequent-medications')), 'There are no frequent medications.', 'The empty state for frequent medications is correct');
    click(searchInput);
    await fillIn(searchInput, 'vicodin');
    await wait();
    await click(de('medications-search-0'));
    click(de('start-date-btn'));
    fillIn(de('medication-comment-txt'), comment);
    fillIn('.sigSearch .sig-text textarea', sig);
    await click('.detail-pane-footer .btn-primary');
    assert.dom(de('medication-summary-list-item-MED_GUID')).exists('The medication appears in the med list');
});

test('Add a medication from the frequent medications toolbox', async assert => {
    let frequentMedsCallCount = 0;
    server.get('ClinicalEndpoint/api/v2/frequentMedications/', ({ db }) => {
        frequentMedsCallCount++;
        return db.frequentMedications;
    });
    server.post('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/medications', ({ db }, request) => {
        const medication = JSON.parse(request.requestBody);
        medication.medicationGuid = 'MED_GUID2';
        medication.lastModifiedDateTimeUtc = moment().toISOString();
        return medication;
    });
    await visit('/PF/charts/patients/c5faffde-78e2-4924-acaf-2115bc686d5e/summary');
    await click(de('record-medication'));
    assert.equal(frequentMedsCallCount, 1, 'The frequentMedications endpoint was called when the add medication details pane was opened');
    const frequentMedSelector = `${de('frequent-medications')} [data-guid='a9682900-ecc1-4c3b-ba9f-aa3bd2b216c7']`;
    const frequentMed = findWithAssert(frequentMedSelector);
    const frequentMedName = 'Vicks Air Purifier/HEPA (Device) Miscellaneous';
    assert.equal(frequentMed.text(), frequentMedName, 'The frequent medications list is populated');
    await click(frequentMed);
    assert.equal(getText(MED_DETAIL_NAME), frequentMedName, 'Clicking on a frequent medication populates the details pane with the info');
    await click('.detail-pane-footer .btn-primary');
    assert.dom(de('medication-summary-list-item-MED_GUID2')).exists('The medication appears in the med list');
    await click(de('record-medication'));
    assert.equal(frequentMedsCallCount, 1, 'The frequentMedications endpoint was not called a second time');
    await fillIn(`${de('frequent-medications')} .search-container input`, 'cks');
    assert.throws(findWithAssert(frequentMedSelector), 'Searching for a substring finds the corresponding medication');
    click(de('cancel-btn'));
});

test('Edit and delete existing medication', async assert => {
    assert.expect(12);
    server.put('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/medications/:id', ({ db }, request) => {
        const medication = JSON.parse(request.requestBody);
        assert.equal(medication.medicationGuid, 'c7b3f21b-bf7a-4850-8690-99840b7e5bf5', 'The medication guid is correct');
        assert.equal(moment(medication.stopDateTime).toISOString(), today, 'The medication stop date is correct');
        assert.equal(medication.sig.patientDescription, '1 to 2 times a day', 'The sig\'s patient description is correct');
        assert.equal(medication.sig.professionalDescription, '1-2X/D', 'The sig\'s professional description is correct');
        assert.equal(medication.transcriptMedications[0].comment, comment, 'The medication\'s comment is correct');
        medication.lastModifiedDateTimeUtc = moment().toISOString();
        return medication;
    });
    server.delete('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/medications', ({ db }, request) => {
        const medication = JSON.parse(request.requestBody);
        assert.equal(medication.medicationGuid, 'c7b3f21b-bf7a-4850-8690-99840b7e5bf5', 'The medication guid is correct');
    });

    visit('/PF/charts/patients/ecd212c3-5c99-499e-b3c6-b2645b8a4c98/summary');
    await click(de('medication-summary-list-item-c7b3f21b-bf7a-4850-8690-99840b7e5bf5'));
    assert.throws(findWithAssert('.medication-detail'), 'The medication detail pane appears');
    assert.equal(find(MED_DETAIL_NAME).text().trim(), 'Methitest 10 mg oral tablet', 'The drug name is rendered correctly');
    await click(`${de('sig-search')} input`);
    await click(de('sig-search-0'));
    assert.equal(find(de('sig-txt'))[0].value, '1 to 2 times a day', 'The sig value is populated with the selected sig');
    await click(de('restart-btn'));
    assert.ok(find(de('discontinue-warning')), 'Discontinue warning renders');
    fillIn(de('medication-comment-txt'), comment);
    await click('.detail-pane-footer a:contains("Record")');
    click(de('historical-medications'));
    await click(`.historical-medication${de('medication-summary-list-item-c7b3f21b-bf7a-4850-8690-99840b7e5bf5')}`);
    click('.detail-pane-footer button:contains("Delete")');
    await click('.ember-tether.popover .confirm-btn');
    assert.notOk(find('.active-medication').length, 'There are no more active medications');
    assert.equal(find('.historical-medication').length, 1, 'There is one less historical medication');
});


test('Deletes a medication with pending order drafts', async assert => {
    await visit('/PF/charts/patients/fd198d85-b2e4-435b-854a-b924b3261d75/summary');
    await click(de('medication-summary-list-item-e3fcc19b-01a4-41dd-a8e0-136a4b234445'));
    await click('.detail-pane-footer button:contains("Delete")');
    assert.ok(find('.popover.popover-confirm-warning').length, 'Warning popover is visible');
    assert.equal(find('.popover.popover-confirm-warning .popover-title').text().trim(), 'Cannot delete medication');
});

test('Prolia surveillance add medication card dismiss', async assert => {
    let worksheetSaveCallCount = 0;
    server.get('ClinicalEndpoint/api/v2/Drugs/Search', () => proliaSearchResult);
    server.post('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/medications', ({ db }, request) => {
        const medication = JSON.parse(request.requestBody);
        medication.medicationGuid = 'MED_GUID';
        medication.lastModifiedDateTimeUtc = moment().toISOString();
        return medication;
    });
    server.post('ClinicalEndpoint/api/v1/Worksheet', ({ db }, request) => {
        worksheetSaveCallCount++;
        const assessment = JSON.parse(request.requestBody);
        assert.equal(assessment.assessmentToken.name, 'proliaAesiMedicationHistory', 'The worksheet is saved with the correct token');
        assert.equal(assessment.status, 'Dismissed', 'The worksheet is saved with the correct status');
        assert.equal(assessment.patientPracticeGuid, 'c5faffde-78e2-4924-acaf-2115bc686d5e', 'The worksheet is saved with the correct patient practice guid');
        assert.equal(assessment.medicationGuid, 'MED_GUID', 'The worksheet is saved with the correct medication guid');
        assessment.worksheetInstanceGuid = 'WORKSHEET_GUID';
        return assessment;
    });
    await visit('/PF/charts/patients/c5faffde-78e2-4924-acaf-2115bc686d5e/summary');
    click(de('record-medication'));
    const dismissLink = de('prolia-assessment-card-dismiss');
    click(searchInput);
    await fillIn(searchInput, 'prolia');
    await wait();
    click(de('medications-search-0'));
    await click(dismissLink);
    assert.notOk(find(dismissLink).length, 'The card is hidden after the dismiss link is clicked');
    await click('.detail-pane-footer .btn-primary');
    assert.equal(worksheetSaveCallCount, 1, 'The worksheet POST call was made');
});

const proliaCardSelect = de('prolia-assessment-card-history');
const proliaCardSelectButton = `${proliaCardSelect} .ember-select-choice`;
function proliaCardSelectItem(text) {
    return `${proliaCardSelect} .dropdown-menu li:contains("${text}")`;
}

test('Prolia surveillance add medication card functionality', async assert => {
    let worksheetSaveCallCount = 0;
    server.get('ClinicalEndpoint/api/v2/Drugs/Search', () => proliaSearchResult);
    server.post('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/medications', ({ db }, request) => {
        const medication = JSON.parse(request.requestBody);
        medication.medicationGuid = 'MED_GUID';
        medication.lastModifiedDateTimeUtc = moment().toISOString();
        return medication;
    });
    server.post('ClinicalEndpoint/api/v1/Worksheet', ({ db }, request) => {
        worksheetSaveCallCount++;
        const assessment = JSON.parse(request.requestBody);
        assert.equal(assessment.assessmentToken.name, 'proliaAesiMedicationHistory', 'The worksheet is saved with the correct token');
        assert.equal(assessment.status, 'Completed', 'The worksheet is saved with the correct status');
        assert.equal(assessment.patientPracticeGuid, 'c5faffde-78e2-4924-acaf-2115bc686d5e', 'The worksheet is saved with the correct patient practice guid');
        assert.equal(assessment.medicationGuid, 'MED_GUID', 'The worksheet is saved with the correct medication guid');
        assert.equal(assessment.responses[0].answerToken[0], 'PreviousHistory', 'The worksheet is saved with the correct answer');
        assert.equal(assessment.responses[0].questionToken, 'proliaMedicationHistory', 'The worksheet is saved with the correct question');
        assessment.worksheetInstanceGuid = 'WORKSHEET_GUID';
        return assessment;
    });
    await visit('/PF/charts/patients/c5faffde-78e2-4924-acaf-2115bc686d5e/summary');
    click(de('record-medication'));
    click(searchInput);
    await fillIn(searchInput, 'prolia');
    await wait();
    await click(de('medications-search-0'));
    click(proliaCardSelectButton);
    await click(proliaCardSelectItem('Past and/or current medication'));
    await click('.detail-pane-footer .btn-primary');
    assert.equal(worksheetSaveCallCount, 1, 'The worksheet POST call was made');
});

test('Validating the existence of duplicate medicaion warnings based on NDC', async assert => {
    server.post('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/medications', ({ db }, request) => {
        const medication = JSON.parse(request.requestBody);
        medication.medicationGuid = 'MED_GUID';
        medication.lastModifiedDateTimeUtc = moment().toISOString();
        return medication;
    });

    server.get('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/medications/:medicationid', ({ db }, request) => {
        /* Validate clicking on medication name will update the panel's contents to match that medication */
        const medicationGuid = request.params.medicationid;
        const medicationInfo = db.patientMedications.where({
            medicationGuid
        })[0];
        return medicationInfo;
    });
    await visit('/PF/charts/patients/c5faffde-78e2-4924-acaf-2115bc686d5e/summary');
    await click(de('record-medication'));
    assert.throws(findWithAssert('.medication-detail'));
    await click(searchInput);
    await fillIn(searchInput, 'vicodin');
    await wait();
    await click(de('medications-search-0'));
    assert.ok(find(de('you-may-have-duplicates-warning-top-panel')).text().trim().indexOf('You may have therapeutic duplications') > -1, 'Therapeutic duplications warning renders correctly');
    assert.ok(find('.icon-urgent').length === 1, 'Urgent icon renders correctly');
    assert.ok(find(de('duplicate-therapy-summary')).text(), 'Severe Interaction: Therapeutic duplication (1) Show more...', 'Severe interaction warning renders correctly');
    await click(de('duplicate-medication-name') + ':eq(0)');
    /* Validate the sections below the warning still render (sig, associated dx, start date, stop date, comment, resources links) */
    const sigText = find(de('sig-txt'))[0].value;
    const associatedDiagnosis = find(de('associated-diagnosis'));
    const startDate = find(de('start-date-txt'))[0].value;
    const stopDate = find(de('stop-date-txt'))[0].value;
    const medicationCommentText = find(de('medication-comment-txt'));
    const resrouces = find(de('resources-section'));
    assert.equal(sigText, '1 to 2 times a day', 'Sig sections below duplicate warning renders correctly');
    assert.ok(associatedDiagnosis.length === 1, 'Associated Diagnosis section below duplicate warning renders correctly');
    assert.equal(startDate, '11/8/2016', 'Start date field below duplicate warning renders correctly');
    assert.equal(stopDate, '11/24/2999', 'Stop date field below duplicate warning renders correctly');
    assert.ok(medicationCommentText.length === 1, 'Medication comment seciton below duplicate warning renders correctly');
    assert.ok(resrouces.length === 1, 'resource section below duplicate warning renders correctly');
    await click(de('cancel-btn'));
    await click(de('record-medication'));
    assert.throws(findWithAssert('.medication-detail'));
    await click(searchInput);
    await fillIn(searchInput, 'vicodin');
    await wait();
    await click(de('medications-search-0'));
    await click(de('discontinue-duplicate-link'));
    await click(de('historical-medications'));
    const historicalMedicationName = find('.historical-medication ' + de('medication-name') + ':eq(0)').text();
    const activeMedicationName = find('.active-medication ' + de('medication-name')).text();
    const discontinuedStartDate = find('.historical-medication .ember-view')[0].innerText.trim();
    const discontinuedStopDate = find('.historical-medication .ember-view')[1].innerText.trim();

    /* Validate discontinue link (moves that medication to historical section with a stop date) */
    assert.equal(historicalMedicationName, 'Hydrocodone-Acetaminophen (Vicodin)', 'Discontinued medication was added to list of historical medications');
    assert.ok(activeMedicationName.length === 0, 'Discontinued medication was removed from list of active medications');
    assert.equal(discontinuedStartDate, '11/08/16', 'Discontinued start date renders correctly');
    assert.equal(discontinuedStopDate, moment().format('MM/DD/YY'), 'Discontinued stop date renders correclty');
    click('.detail-pane-footer .btn-primary');
});

test('Relay dispense, unit, and days supply to eRx order', async assert => {
    server.get('ClinicalEndpoint/api/v2/frequentMedications/', () => []);

    server.post('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/medications', ({ db }, request) => JSON.parse(request.requestBody));

    server.put('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/medications/:id', ({ db }, request) => JSON.parse(request.requestBody));

    await visit('/PF/charts/patients/fd198d85-b2e4-435b-854a-b924b3261d75/summary');
    await click(de('medication-summary-list-item-c090aed5-b80d-4131-ba3c-0a25ea015164'));
    assert.equal(find(de('quantity-txt')).val(), 5, 'Quantity is loaded from previous prescription');
    assert.equal(find(`${de('doseForm-search')} input`).val(), 'Tablet', 'Unit is loaded from previous prescription');
    assert.equal(find(de('daysSupply-txt')).val().trim(), '', 'Days supply defaults to nuffin');

    // Change the default quantity, unit, and days supply
    fillIn(de('quantity-txt'), 57);
    fillIn(`${de('doseForm-search')} input`, 'Box');
    keyEvent(de('doseForm-search'), 'keydown', 13);
    fillIn(de('daysSupply-txt'), 100);

    await click(de('btn-order-eRx'));
    await click(de('edit-btn-0'));
    assert.equal(find(de('quantity-txt')).val(), 57, 'Quantity is loaded from previous prescription');
    assert.equal(find(`${de('doseForm-search')} input`).val(), 'Box', 'Unit is loaded from previous prescription');
    assert.equal(find(de('daysSupply-txt')).val(), 100, 'Days supply defaults to 100');
});

test('Click multiple medications will open the correct details panes', async assert => {
    const summaryUrl = '/PF/charts/patients/fd198d85-b2e4-435b-854a-b924b3261d75/summary';
    await visit(summaryUrl);
    await click(de('medication-summary-list-item-e3fcc19b-01a4-41dd-a8e0-136a4b234445'));
    assert.dom(MED_DETAIL_NAME).hasText('Lipitor 10 MG Oral Tablet');
    await click(de('medication-summary-list-item-c090aed5-b80d-4131-ba3c-0a25ea015164'));
    assert.dom(MED_DETAIL_NAME).hasText('Lexapro 5 MG Oral Tablet');
    await click(de('medication-summary-list-item-a133d877-2a21-410b-b902-7ed99ae02533'));
    assert.dom(MED_DETAIL_NAME).hasText('Simvastatin 20 MG Oral Tablet');
    await click(de('medication-summary-list-item-3b11ed1a-27d0-4d5d-91ee-b7d3d367b475'));
    assert.dom(MED_DETAIL_NAME).hasText('Childrens Ibuprofen 100 MG/5ML Oral Suspension');
    await click(de('medication-summary-list-item-19d4c375-2bf7-4734-8f1c-68d248c4eb3c'));
    assert.dom(MED_DETAIL_NAME).hasText('Pravastatin Sodium 80 MG Oral Tablet');
    await click(`.medication-detail ${de('cancel-btn')}`);
    assert.equal(currentURL(), summaryUrl);
});

test('Medication with allergy alert and reactions', async assert => {
    server.get('ClinicalEndpoint/api/v2/Drugs/Search', () => SEARCH_RESULT_KEFLEX);
    await visit('/PF/charts/patients/78f2e278-4519-4b0e-b192-f1f7f360215b/summary');
    await click(de('record-medication'));
    assert.throws(findWithAssert('.medication-detail'));
    click(searchInput);
    await fillIn(searchInput, 'Keflex');
    await wait();
    await click(de('medications-search-0'));
    assert.dom(de('drug-allergy-interaction-btn-0-0')).hasText('Very Mild Allergy: Penicillins (Anaphylaxis, Cough)');
    click(de('cancel-btn'));
});
