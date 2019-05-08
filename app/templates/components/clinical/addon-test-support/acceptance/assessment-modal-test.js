import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';
import getText from 'boot/tests/helpers/get-text';
import sinon from 'sinon';

let toastrSuccessStub;
const SEARCH_INPUT = `${de('medications-search')} input`;
const ASSESSMENT_MODAL = '.assessment-modal-control';
const ASSESSMENT_SAVE_BUTTON = de('save-prolia-modal');
const ASSESSMENT_CANCEL_BUTTON = '.assessment-modal-control .pull-left button:first';
const COMPLETE_TOAST = 'assessment-complete-message';
const INCOMPLETE_TOAST = '.assessment-incomplete-message';
const PROLIA_PERMANENT_PLACE_LINK = de('prolia-permanent-link');
const SEARCH_RESULT_PROLIA = [{
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
const PATIENT_GUID = 'c5faffde-78e2-4924-acaf-2115bc686d5e';
const MED_GUID = 'myMedicationGuid';
const WORKSHEET_GUID = 'myWorksheetGuid';
const SOURCE_MEDICATION_FORM = 'Medication Form';
const PROLIA_ADVERSE_EFFECT_SELECTOR = '.prolia-with-description:first-child > input';
const CUSTOM_PATIENT_AGGREGATE = {
    id: 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98',
    diagnoses: {
        patientDiagnoses: [{
            diagnosisGuid: 'd3c5451b-ccb5-4770-b98e-054750b369a5',
            patientPracticeGuid: 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98',
            name: 'Diabetes mellitus without mention of complication, type II or unspecified type, not stated as uncontrolled',
            code: '',
            isAcute: false,
            isTerminal: false,
            startDate: '2014-10-05T07:00:00Z',
            stopDate: '2014-10-06T07:00:00Z',
            diagnosisCodes: [],
            isActive: true,
            transcriptDiagnoses: [{
                transcriptGuid: '980e0fb7-1e36-432a-ac8a-9969f38aad92',
                comment: '',
                isActive: true,
                lastModifiedByProviderGuid: '00000000-0000-0000-0000-000000000000',
                lastModifiedAt: '2014-12-16T16:46:31.227Z',
                sortOrder: -10
            }, {
                transcriptGuid: '8c7c7202-f2be-45a0-a528-68eef6722d60',
                comment: '',
                isActive: true,
                lastModifiedByProviderGuid: '00000000-0000-0000-0000-000000000000',
                lastModifiedAt: '2014-10-29T18:36:02.347Z',
                sortOrder: 4
            }]
        }],
        noKnownDiagnoses: false
    },
    medications: {
        patientMedications: [{
            medicationGuid: 'd548134c-278f-4b68-840b-06793b4ea2b8',
            patientPracticeGuid: 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98',
            tradeName: 'Prolia',
            genericName: 'Denosumab',
            rxNormCui: '993458',
            ndc: '55513071001',
            controlledSubstanceSchedule: '',
            sig: {
                dose: null,
                route: 'Subcutaneous',
                frequency: null,
                duration: null,
                professionalDescription: '',
                patientDescription: '',
                searchTerm: null
            },
            doseForm: 'Solution',
            route: 'Subcutaneous',
            productStrength: '60 MG/ML',
            startDateTime: '2017-07-04T07:00:00Z',
            medicationDiscontinuedReason: {
                id: 0,
                description: null
            },
            transcriptMedications: [
                {
                    transcriptGuid: null,
                    transcriptDateOfService: null,
                    comment: null,
                    lastModifiedDateTimeUtc: '2017-07-30T23:22:38.703Z',
                    lastModifiedProviderGuid: '85821ab8-ac27-4eca-a7bd-bc4c0b6cc980',
                    providerFirstName: 'Mad',
                    providerLastName: 'Hatter',
                    providerMiddleName: null,
                    providerSuffix: 'PhD',
                    providerTitle: 'Dr'
                },
                {
                    transcriptGuid: '1e2c5401-6ff2-4e9f-9cfa-49a1779c5f0d',
                    transcriptDateOfService: null,
                    comment: null,
                    lastModifiedDateTimeUtc: '2017-07-30T23:22:38.703Z',
                    lastModifiedProviderGuid: '85821ab8-ac27-4eca-a7bd-bc4c0b6cc980',
                    providerFirstName: 'Mad',
                    providerLastName: 'Hatter',
                    providerMiddleName: null,
                    providerSuffix: 'PhD',
                    providerTitle: 'Dr'
                }
            ],
            lastModifiedDateTimeUtc: '2017-07-30T23:22:38.703Z',
            drugName: 'Prolia 60 MG/ML Subcutaneous Solution',
            prescriptions: [],
            isGeneric: false,
            isMedicalSupply: false
        }],
        noKnownMedications: false
    }
};

function medicationPost(request) {
    request.medicationGuid = MED_GUID;
    request.lastModifiedDateTimeUtc = moment().toISOString();
    return request;
}
function worksheetPost(assert, request, expected) {
    if (request.assessmentToken.name === expected.tokenName) {
        assert.equal(request.status, expected.status, 'The modal is saved with the correct status');
        assert.equal(request.patientPracticeGuid, expected.patientPracticeGuid, 'The modal is saved with the correct patient practice guid');
        assert.equal(request.medicationGuid, expected.medicationGuid, 'The modal is saved with the correct medication guid');
        assert.equal(request.source, expected.source, 'The modal is saved with the correct source');
        request.worksheetInstanceGuid = WORKSHEET_GUID;
        expected.responses.forEach(response => {
            const sent = $.grep(request.responses, item => {
                return item.questionToken === response.questionToken && JSON.stringify(item.answerToken) === JSON.stringify(response.answerToken);
            });
            assert.equal(sent.length, 1, `The property ${response.questionToken} is saved with the correct value of ${JSON.stringify(response.answerToken)}`);
        });
    }
    return request;
}
function validateCompletionMessage(assert, expectCompleted) {
    if (expectCompleted) {
        assert.equal(toastrSuccessStub.args[1][2]['toastClass'], COMPLETE_TOAST, 'The completion toast message displayed correctly');
    } else {
        assert.ok(find(INCOMPLETE_TOAST).length >= 1, 'The incomplete dialog displayed correctly');
        click(`${INCOMPLETE_TOAST} .btn-primary`);
    }
}
function findDropdownItem(dropdownElement, textValue) {
    return `${dropdownElement} .dropdown-menu li:contains("${textValue}")`;
}

async function addProliaFromSummary() {
    await visit(`/PF/charts/patients/${PATIENT_GUID}/summary`);
    click(de('record-medication'));
    click(SEARCH_INPUT);
    await fillIn(SEARCH_INPUT, 'prolia');
    await wait();
    return click(de('medications-search-0'));
}

moduleForAcceptanceAuth('Acceptance - Core - Clinical | Assessment modal - v2', {
    beforeEach() {
        toastrSuccessStub = sinon.stub(window.toastr, 'success');
    },
    afterEach() {
        window.toastr.success.restore();
    }
});

test('Prolia modal works from dismissed medication card and no events', async assert => {
    const expectedSettings = {
        tokenName: 'proliaAesiModal',
        status: 'Completed',
        source: SOURCE_MEDICATION_FORM,
        defaultHistory: 'Select patient\'s Prolia history...',
        responses: [
            {answerToken: ['PreviousHistory'], questionToken: 'proliaMedicationHistory'},
            {answerToken: ['no'], questionToken: 'proliaAnyAesi'}
        ],
        patientPracticeGuid: PATIENT_GUID,
        medicationGuid: MED_GUID
    };
    const proliaHistorySelect = de('prolia-assessment-modal-history');
    const proliaHistorySelectButton = `${proliaHistorySelect} .ember-select-choice`;

    server.get('ClinicalEndpoint/api/v2/Drugs/Search', () => SEARCH_RESULT_PROLIA);
    server.post('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/medications', ({ db }, request) => medicationPost(JSON.parse(request.requestBody)));
    server.post('ClinicalEndpoint/api/v1/Worksheet', ({ db }, request) => worksheetPost(assert, JSON.parse(request.requestBody), expectedSettings));

    assert.expect(15);
    await addProliaFromSummary();
    await click(de('prolia-assessment-card-dismiss'));
    await click('.detail-pane-footer .btn-primary');
    assert.equal(find(ASSESSMENT_MODAL).length, 1, 'The assessment modal is shown');
    assert.equal(find(`${ASSESSMENT_MODAL} ${proliaHistorySelectButton} span`).text(), expectedSettings.defaultHistory, 'The medication history is defaulted correctly');
    await click(ASSESSMENT_SAVE_BUTTON);
    // Expect validation to stop the save if not medication history is selected
    assert.equal(find('.prolia-history-section .tooltip:visible').length, 1, 'Validation prevented saving without medication history');

    click(proliaHistorySelectButton);
    await click(findDropdownItem(proliaHistorySelect, 'Past and/or current medication'));
    assert.equal(find(`${ASSESSMENT_MODAL} .pf-input--radio`).length, 2, 'Radio buttons are shown when history is past or current');
    assert.ok(find(`${ASSESSMENT_MODAL} .pf-input--checkbox`).length > 0, 'Adverse Event choices are shown when history is past or current');

    click(`${ASSESSMENT_MODAL} .pf-input--radio:last`);
    await click(ASSESSMENT_SAVE_BUTTON);
    // Expect validation to stop the save if events are expected but not selected
    assert.equal(find('.validation-adverse-events').length, 1, 'Validation prevented saving event selection without events');

    // Clicking on a checkbox should change the radio button selection
    click(`${ASSESSMENT_MODAL} .pf-input--radio:first`);
    await click(`${ASSESSMENT_MODAL} .pf-input--checkbox:first`);
    assert.equal(find(`${ASSESSMENT_MODAL} #adverse:checked`).length, 1, 'Adverse event radio button is selected when event is added');

    await click(`${ASSESSMENT_MODAL} .pf-input--radio:first`);
    assert.equal(find(`${ASSESSMENT_MODAL} .pf-input--checkbox:checked`).length, 0, 'Adverse event checkboxes are cleared when radio changes to no events');

    await click(ASSESSMENT_SAVE_BUTTON);
    validateCompletionMessage(assert, true);
});

test('Prolia modal works from medication card with past/current history', async assert => {
    const expectedSettings = {
        tokenName: 'proliaAesiModal',
        status: 'Completed',
        source: SOURCE_MEDICATION_FORM,
        defaultHistory: 'Past and/or current medication',
        responses: [
            {answerToken: ['PreviousHistory'], questionToken: 'proliaMedicationHistory'},
            {answerToken: ['yes'], questionToken: 'proliaAnyAesi'},
            {answerToken: ['yes'], questionToken: 'proliaAesiHypocalcemia'},
            {answerToken: ['yes'], questionToken: 'proliaAesiDermatologicReactions'},
            {answerToken: ['no'], questionToken: 'proliaLinkClicked'}
        ],
        patientPracticeGuid: PATIENT_GUID,
        medicationGuid: MED_GUID
    };
    const proliaCardSelect = de('prolia-assessment-card-history');
    const proliaCardSelectButton = `${proliaCardSelect} .ember-select-choice`;

    server.get('ClinicalEndpoint/api/v2/Drugs/Search', () => SEARCH_RESULT_PROLIA);
    server.post('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/medications', ({ db }, request) => medicationPost(JSON.parse(request.requestBody)));
    server.post('ClinicalEndpoint/api/v1/Worksheet', ({ db }, request) => worksheetPost(assert, JSON.parse(request.requestBody), expectedSettings));

    assert.expect(16);
    await addProliaFromSummary();
    click(proliaCardSelectButton);
    await click(findDropdownItem(proliaCardSelect, 'Past and/or current medication'));
    await click('.detail-pane-footer .btn-primary');
    assert.equal(find(ASSESSMENT_MODAL).length, 1, 'The assessment modal is shown');
    assert.ok(find(`${ASSESSMENT_MODAL} ${de('prolia-assessment-modal-history')} .ember-select-choice span`).text().indexOf(expectedSettings.defaultHistory) > -1, 'The medication history is defaulted correctly');
    assert.equal(find(`${ASSESSMENT_MODAL} .pf-input--radio`).length, 2, 'Radio buttons are shown by default');
    assert.ok(find(`${ASSESSMENT_MODAL} .pf-input--checkbox`).length > 0, 'Adverse Event choices are shown by default');

    click(`${ASSESSMENT_MODAL} .pf-input--radio:last`);
    await click(ASSESSMENT_SAVE_BUTTON);
    // Expect validation to stop the save if events are expected but not selected
    assert.equal(find('.validation-adverse-events:visible').length, 1, 'Validation prevented saving event selection without events');
    await click(`${ASSESSMENT_MODAL} .pf-input--radio:first`);
    await click(`${ASSESSMENT_MODAL} .pf-input--checkbox:first`);
    assert.equal(find(`${ASSESSMENT_MODAL} #adverse:checked`).length, 1, 'Adverse event radio button is selected when event is added');
    click(`${ASSESSMENT_MODAL} .pf-input--checkbox:last`);
    await click(ASSESSMENT_SAVE_BUTTON);
    validateCompletionMessage(assert, false);
});

test('Prolia modal from medication card saves reporting link clicked state', async assert => {
    const expectedSettings = {
        tokenName: 'proliaAesiModal',
        status: 'Completed',
        source: SOURCE_MEDICATION_FORM,
        defaultHistory: 'Past and/or current medication',
        responses: [
            {answerToken: ['PreviousHistory'], questionToken: 'proliaMedicationHistory'},
            {answerToken: ['yes'], questionToken: 'proliaAnyAesi'},
            {answerToken: ['yes'], questionToken: 'proliaAesiHypocalcemia'},
            {answerToken: ['yes'], questionToken: 'proliaLinkClicked'}
        ],
        patientPracticeGuid: PATIENT_GUID,
        medicationGuid: MED_GUID
    };
    const proliaCardSelect = de('prolia-assessment-card-history');
    const proliaCardSelectButton = `${proliaCardSelect} .ember-select-choice`;
    const proliaReportingLink = de('prolia-reporting-link');

    server.get('ClinicalEndpoint/api/v2/Drugs/Search', () => SEARCH_RESULT_PROLIA);
    server.post('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/medications', ({ db }, request) => medicationPost(JSON.parse(request.requestBody)));
    server.post('ClinicalEndpoint/api/v1/Worksheet', ({ db }, request) => worksheetPost(assert, JSON.parse(request.requestBody), expectedSettings));

    assert.expect(13);
    await addProliaFromSummary();
    click(proliaCardSelectButton);
    await click(findDropdownItem(proliaCardSelect, 'Past and/or current medication'));
    await click('.detail-pane-footer .btn-primary');
    assert.equal(find(ASSESSMENT_MODAL).length, 1, 'The assessment modal is shown');
    assert.ok(find(`${ASSESSMENT_MODAL} ${de('prolia-assessment-modal-history')} .ember-select-choice span`).text().indexOf(expectedSettings.defaultHistory) > -1, 'The medication history is defaulted correctly');
    assert.equal(find(`${ASSESSMENT_MODAL} .pf-input--radio`).length, 2, 'Radio buttons are shown by default');
    assert.ok(find(`${ASSESSMENT_MODAL} .pf-input--checkbox`).length > 0, 'Adverse Event choices are shown by default');

    await click(`${ASSESSMENT_MODAL} .pf-input--checkbox:first`);
    await click(proliaReportingLink);
    await click(ASSESSMENT_SAVE_BUTTON);
    validateCompletionMessage(assert, true);
});

test('Prolia modal from medication card saves when dismissed', async assert => {
    const expectedSettings = {
        tokenName: 'proliaAesiModal',
        status: 'Dismissed',
        source: SOURCE_MEDICATION_FORM,
        defaultHistory: 'Past and/or current medication',
        responses: [
            {answerToken: ['HistoryNotAsked'], questionToken: 'proliaMedicationHistory'}
        ],
        patientPracticeGuid: PATIENT_GUID,
        medicationGuid: MED_GUID
    };
    const proliaHistorySelect = de('prolia-assessment-modal-history');
    const proliaHistorySelectButton = `${proliaHistorySelect} .ember-select-choice`;

    server.get('ClinicalEndpoint/api/v2/Drugs/Search', () => SEARCH_RESULT_PROLIA);
    server.post('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/medications', ({ db }, request) => medicationPost(JSON.parse(request.requestBody)));
    server.post('ClinicalEndpoint/api/v1/Worksheet', ({ db }, request) => worksheetPost(assert, JSON.parse(request.requestBody), expectedSettings));

    assert.expect(8);
    await addProliaFromSummary();
    await click(de('prolia-assessment-card-dismiss'));
    await click('.detail-pane-footer .btn-primary');
    assert.equal(find(ASSESSMENT_MODAL).length, 1, 'The assessment modal is shown');
    click(proliaHistorySelectButton);
    await click(findDropdownItem(proliaHistorySelect, 'Provider declined to ask'));
    assert.equal(find(`${ASSESSMENT_MODAL} .adverse-options`).length, 0, 'Adverse events are hidden when declined to ask');
    assert.ok(find(`${ASSESSMENT_MODAL} ${de('prolia-assessment-card-status')}`).length > 0, 'Correct status message is displayed');

    click(ASSESSMENT_CANCEL_BUTTON);
});

test('Prolia modal from CDS alert saves correctly', async assert => {
    const patientPracticeGuid = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
    const transcriptGuid = '7022d94f-d70a-4722-a205-dac898cf9f69';
    const alertText = 'Patient Safety: Monitor and record adverse events of special interest that may be experienced in patients receiving Prolia.';
    const expectedSettings = {
        tokenName: 'proliaAesiModal',
        status: 'Completed',
        source: 'CDS Alert',
        defaultHistory: 'Past and/or current medication',
        responses: [
            {answerToken: ['PreviousHistory'], questionToken: 'proliaMedicationHistory'},
            {answerToken: ['no'], questionToken: 'proliaAnyAesi'}
        ],
        patientPracticeGuid
    };
    let worksheetPostCalled = false;

    server.get('AlertEndpoint/api/v1/CdsAlerts/:patientPracticeGuid/:transcriptGuid', () => [{
        alertIdentifier: 'Surveillance.Prolia',
        ruleId: 34,
        alertText: alertText,
        citations: [],
        developer: 'Practice Fusion, Inc.',
        sponsor: 'Amgen Inc.',
        link: 'http://www.proliahcp.com/risk-evaluation-mitigation-strategy/',
        source: 'Practice Fusion, Inc.',
        actionLinkType: 'addClinicalAssessment',
        actionLinkData: 'name=proliaAesiModal',
        actionLinkText: 'Record',
        error: false
    }]);

    server.post('ClinicalEndpoint/api/v1/Worksheet', ({ db }, request) => {
        worksheetPostCalled = true;
        return worksheetPost(assert, JSON.parse(request.requestBody), expectedSettings);
    });

    await visit(`/PF/charts/patients/${patientPracticeGuid}/encounter/${transcriptGuid}`);
    assert.equal(find('.ember-accordion-container').length, 1, 'There are 1 CDS alert container');
    assert.equal(getText('.ember-accordion-header .cds-alert-text'), alertText, 'The CDS alert text renders correctly');
    assert.equal(getText('.ember-accordion-header .custom-action'), 'Record', 'The custom action text is correct');
    await click('.ember-accordion-header .custom-action a');
    assert.equal(find(ASSESSMENT_MODAL).length, 1, 'The assessment modal is shown');
    assert.ok(find(`${ASSESSMENT_MODAL} ${de('prolia-assessment-modal-history')} .ember-select-choice span`).text().indexOf(expectedSettings.defaultHistory) > -1, 'The medication history is defaulted correctly');
    await click(ASSESSMENT_SAVE_BUTTON);
    assert.ok(worksheetPostCalled, 'The assessment was POSTed to the worksheet endpoint');
});

test('Prolia modal pops up upon visiting encounter if Prolia CDS Alert os present, new prolia markup is present', async assert => {
    const patientPracticeGuid = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
    const transcriptGuid = '7022d94f-d70a-4722-a205-dac898cf9f69';
    const alertText = 'Patient Safety: Monitor and record adverse events of special interest that may be experienced in patients receiving Prolia.';
    let worksheetPostCalled = false;

    server.get('AlertEndpoint/api/v1/CdsAlerts/:patientPracticeGuid/:transcriptGuid', () => [{
        alertIdentifier: 'Surveillance.Prolia',
        ruleId: 34,
        alertText: alertText,
        citations: [],
        developer: 'Practice Fusion, Inc.',
        sponsor: 'Amgen Inc.',
        link: 'http://www.proliahcp.com/risk-evaluation-mitigation-strategy/',
        source: 'Practice Fusion, Inc.',
        actionLinkType: 'addClinicalAssessment',
        actionLinkData: 'name=proliaAesiModal',
        actionLinkText: 'Record',
        error: false
    }]);

    server.post('ClinicalEndpoint/api/v1/Worksheet', () => {
        worksheetPostCalled = true;
        return {};
    });

    await visit(`/PF/charts/patients/${patientPracticeGuid}/encounter/${transcriptGuid}`);
    const adverseEffectDescriptions = find(`${de('prolia-aesi-modal')} .disease-description`);
    assert.equal(adverseEffectDescriptions.length, 5, 'The updated adverse effect descriptions are present.');

    await click(PROLIA_ADVERSE_EFFECT_SELECTOR);
    await click(ASSESSMENT_SAVE_BUTTON);
    assert.ok(worksheetPostCalled, 'The assessment was POSTed to the worksheet endpoint');
});

test('Prolia permanent place link displays and works from encounter', async assert => {
    const patientPracticeGuid = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
    const transcriptGuid = '7022d94f-d70a-4722-a205-dac898cf9f69';
    let worksheetPostCalled = false;
    const expectedSettings = {
        tokenName: 'proliaAesiModal',
        status: 'Completed',
        source: 'Prolia Permanent Link',
        defaultHistory: 'Past and/or current medication',
        responses: [
            { answerToken: ['PreviousHistory'], questionToken: 'proliaMedicationHistory' },
            { answerToken: ['yes'], questionToken: 'proliaAnyAesi' }
        ],
        patientPracticeGuid
    };

    server.get('ClinicalEndpoint/api/v1/patients/:id/aggregate', () => CUSTOM_PATIENT_AGGREGATE);

    server.post('ClinicalEndpoint/api/v1/Worksheet', ({ db }, request) => {
        worksheetPostCalled = true;
        return worksheetPost(assert, JSON.parse(request.requestBody), expectedSettings);
    });

    await visit(`/PF/charts/patients/${patientPracticeGuid}/encounter/${transcriptGuid}`);
    assert.ok(find(PROLIA_PERMANENT_PLACE_LINK).length > 0, 'A prolia permanent place link is present.');
    await click(PROLIA_PERMANENT_PLACE_LINK);
    await click(PROLIA_ADVERSE_EFFECT_SELECTOR);
    await click(ASSESSMENT_SAVE_BUTTON);
    assert.ok(worksheetPostCalled, 'The assessment was POSTed to the worksheet endpoint');
});

test('Prolia permanent place link displays and works from patient summary', async assert => {
    const patientPracticeGuid = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
    let worksheetPostCalled = false;
    const expectedSettings = {
        tokenName: 'proliaAesiModal',
        status: 'Completed',
        source: 'Prolia Permanent Link',
        defaultHistory: 'Past and/or current medication',
        responses: [
            { answerToken: ['PreviousHistory'], questionToken: 'proliaMedicationHistory' },
            { answerToken: ['yes'], questionToken: 'proliaAnyAesi' }
        ],
        patientPracticeGuid
    };

    server.get('ClinicalEndpoint/api/v1/patients/:id/aggregate', () => CUSTOM_PATIENT_AGGREGATE);

    server.post('ClinicalEndpoint/api/v1/Worksheet', ({ db }, request) => {
        worksheetPostCalled = true;
        return worksheetPost(assert, JSON.parse(request.requestBody), expectedSettings);
    });

    await visit(`/PF/charts/patients/${patientPracticeGuid}/summary`);
    assert.ok(find(PROLIA_PERMANENT_PLACE_LINK).length > 0, 'A prolia permanent place link is present.');
    await click(PROLIA_PERMANENT_PLACE_LINK);
    await click(PROLIA_ADVERSE_EFFECT_SELECTOR);
    await click(ASSESSMENT_SAVE_BUTTON);
    assert.ok(worksheetPostCalled, 'The assessment was POSTed to the worksheet endpoint');
});
