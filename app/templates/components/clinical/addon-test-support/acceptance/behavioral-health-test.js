import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';

const PATIENT_PRACTICE_GUID = 'c5faffde-78e2-4924-acaf-2115bc686d5e';
const summaryURL = `/PF/charts/patients/${PATIENT_PRACTICE_GUID}/summary`;
const smokingStatus = {
    'patientSmokingStatuses': [
        {
            'patientSmokingStatusGuid': 'd2798899-b429-4376-aee1-5d146f992070',
            'patientPracticeGuid': 'c5faffde-78e2-4924-acaf-2115bc686d5e',
            'practiceGuid': '2e64dfab-a18f-4e44-8d93-ca09e6473fcc',
            'smokingStatusGuid': '15a7fb5b-6087-471e-80ca-b100f69ae2a8',
            'description': 'Never smoker',
            'effectiveDate': '2018-08-07T07:00:00Z'
        },
        {
            'patientSmokingStatusGuid': 'a883866c-6af1-4dfb-b49f-63531cb82112',
            'patientPracticeGuid': 'c5faffde-78e2-4924-acaf-2115bc686d5e',
            'practiceGuid': '2e64dfab-a18f-4e44-8d93-ca09e6473fcc',
            'smokingStatusGuid': 'f86c4dfb-344d-438a-889c-08fd78bc54e0',
            'description': 'Cigar smoker',
            'effectiveDate': '2018-08-09T07:00:00Z'
        }
    ]
};

moduleForAcceptanceAuth('Acceptance - Core - Clinical | Behavioral health');

test('Summary behavioral health card', async assert => {
    server.get('ClinicalEndpoint/api/v3/patients/:patientPracticeGuid/behavioralhealth/', ({ db }) => db.behavioralHealths[0]);
    server.get('ClinicalEndpoint/api/v2/patients/:patientPracticeGuid/smokingstatuses', () => smokingStatus);
    server.put('PracticeEndpoint/api/v1/preferenceDoc/user/:id/patientSummaryDisplay', ({ db }, request) => JSON.parse(request.requestBody));

    await visit(summaryURL);
    await click(de('link-display-settings'));
    const uncheckedSwitches = find(`${de('social-history')} .d-checkbox-switch:has(input:not(:checked))`);
    uncheckedSwitches.toArray().forEach((uncheckedSwitch) => {
        click(uncheckedSwitch);
    });
    await click(de('btn-save-control-bar'));
    assert.dom(`${de('alcoholUse-section')} ${de('behavioral-health-field-item-0')}`).hasText('0 08/15/2018', 'Alcohol use score, description and date rendered');
    assert.dom(`${de('physicalActivity-section')} ${de('behavioral-health-field-item-0')}`).hasText('Recorded 08/15/2018', 'Physical activity description and date rendered');
    assert.dom(`${de('stress-section')} ${de('behavioral-health-field-item-0')}`).hasText('Only a little 08/07/2018', 'Stress description and date rendered');
    assert.dom(`${de('socialIsolation-section')} ${de('behavioral-health-field-item-0')}`).hasText('4 08/15/2018', 'Social isolation and connection score and date rendered');
    assert.dom(`${de('exposureToViolence-section')} ${de('behavioral-health-field-item-0')}`).hasText('0 08/15/2018', 'Exposure to violence score and date rendered');
    assert.dom(`${de('nutritionHistory-section')} ${de('behavioral-health-field-item-0')}`).hasText('Proin diam velit, sodales at mi id, consectetur consectetur tortor', 'Nutrition history description renders');
    assert.dom(de('tobaccoUse-section')).exists('Tobacco use exists');
    assert.equal(find(`${de('tobaccoUse-section')} ul li`).length, 1, 'Tobacco use only shows the latest record by default.');
    assert.dom(`${de('tobaccoUse-section')} ${de('behavioral-health-field-show-all-toggle')}`).hasText('Show past entries (1)', 'Tobacco use show all toggle text is correct.');

    await click(`${de('tobaccoUse-section')} ${de('behavioral-health-field-show-all-toggle')}`);
    assert.equal(find(`${de('tobaccoUse-section')} ul li`).length, 2, 'Tobacco use shows all records.');
});

test('Alcohol use detail pane', async assert => {
    server.get('ClinicalEndpoint/api/v3/patients/:patientPracticeGuid/behavioralhealth/', ({ db }) => db.behavioralHealths[0]);
    server.get('ClinicalEndpoint/api/v2/patients/:patientPracticeGuid/smokingstatuses', () => smokingStatus);
    server.put('PracticeEndpoint/api/v1/preferenceDoc/user/:id/patientSummaryDisplay', ({ db }, request) => JSON.parse(request.requestBody));
    server.get('ChartingEndpoint/api/v2/WorksheetResponses/:worksheetResponseGuid', ({ db }, request) => {
        const { worksheetResponseGuid } = request.params;
        return db.behavioralHealthWorksheets.where({
            responsesGuid: worksheetResponseGuid
        })[0];
    });
    server.put('ChartingEndpoint/api/v2/WorksheetResponses/:worksheetResponseGuid', ({ db }, request) => {
        const worksheetResponse = JSON.parse(request.requestBody);
        assert.equal(worksheetResponse.resultSummary, 'Patient declined to specify');
        assert.notOk(worksheetResponse.calculatedScore, 'Checking patient declined to specify checkbox removes calculatedScore proptery in payload');
        delete worksheetResponse.calculatedScore;
        return worksheetResponse;
    });
    await visit(summaryURL);
    await click(de('link-display-settings'));
    const uncheckedSwitches = find(`${de('social-history')} .d-checkbox-switch:has(input:not(:checked))`);
    uncheckedSwitches.toArray().forEach((uncheckedSwitch) => {
        click(uncheckedSwitch);
    });
    await click(de('btn-save-control-bar'));
    await click(`${de('alcoholUse-section')} ${de('behavioral-health-field-item-0')}`);
    assert.dom('h15.header15').hasText('Alcohol use > Record', 'Detail pane header is correct');
    assert.dom(de('decline-checkbox')).exists('Patient declined to specify on all question checkbox exists');
    assert.dom(de('save-button')).hasText('Mark as reviewed');
    await click(`${de('worksheet-question-1')} ${de('option-2')} input`);
    assert.dom(de('undo-question-1')).exists('Undo links shows only when user changed the input');
    assert.dom(de('save-button')).hasText('Save', 'button text changed to save if change is made');
    await click(`${de('decline-checkbox')} input`);
    assert.dom(`${de('worksheet-question-1')} ${de('option-0')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-1')} ${de('option-1')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-1')} ${de('option-2')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-1')} ${de('option-3')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-1')} ${de('option-4')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-2')} ${de('option-0')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-2')} ${de('option-1')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-2')} ${de('option-2')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-2')} ${de('option-3')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-2')} ${de('option-4')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-3')} ${de('option-0')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-3')} ${de('option-1')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-3')} ${de('option-2')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-3')} ${de('option-3')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-3')} ${de('option-4')} input`).isDisabled();
    assert.dom(de('worksheet-score')).hasText('No score');
    click(de('save-button'));
});

test('Physical activity detail pane', async assert => {
    server.get('ClinicalEndpoint/api/v3/patients/:patientPracticeGuid/behavioralhealth/', ({ db }) => db.behavioralHealths[0]);
    server.get('ClinicalEndpoint/api/v2/patients/:patientPracticeGuid/smokingstatuses', () => smokingStatus);
    server.put('PracticeEndpoint/api/v1/preferenceDoc/user/:id/patientSummaryDisplay', ({ db }, request) => JSON.parse(request.requestBody));
    server.get('ChartingEndpoint/api/v2/WorksheetResponses/:worksheetResponseGuid', ({ db }, request) => {
        const { worksheetResponseGuid } = request.params;
        return db.behavioralHealthWorksheets.where({
            responsesGuid: worksheetResponseGuid
        })[0];
    });
    server.put('ChartingEndpoint/api/v2/WorksheetResponses/:worksheetResponseGuid', ({ db }, request) => {
        const worksheetResponse = JSON.parse(request.requestBody);
        assert.equal(worksheetResponse.resultSummary, 'Recorded');
        assert.equal(worksheetResponse.responses[1].value, '4');
        return worksheetResponse;
    });
    await visit(summaryURL);
    await click(de('link-display-settings'));
    const uncheckedSwitches = find(`${de('social-history')} .d-checkbox-switch:has(input:not(:checked))`);
    uncheckedSwitches.toArray().forEach((uncheckedSwitch) => {
        click(uncheckedSwitch);
    });
    await click(de('btn-save-control-bar'));
    await click(`${de('physicalActivity-section')} ${de('behavioral-health-field-item-0')}`);
    assert.dom('h15.header15').hasText('Physical activity > Record', 'Detail pane header is correct');
    assert.dom(de('save-button')).hasText('Mark as reviewed');
    assert.dom(de('decline-checkbox')).exists('Patient declined to specify on all question checkbox exists');
    await fillIn(`${de('worksheet-question-1')} input`, '4');
    assert.dom(de('save-button')).hasText('Save', 'button text changed to save if change is made');
    assert.dom(de('undo-question-1')).doesNotExist('Updating numeric input will not show Undo link');
    await click(`${de('decline-checkbox')} input`);
    assert.dom(`${de('worksheet-question-1')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-2')} input`).isDisabled();
    await click(`${de('decline-checkbox')} input`);
    assert.dom(`${de('worksheet-question-1')} input`).hasNoValue('check decline cleans all answers');
    assert.dom(`${de('worksheet-question-2')} input`).hasNoValue('check decline cleans all answers');
    fillIn(`${de('worksheet-question-1')} input`, '4');
    fillIn(`${de('worksheet-question-2')} input`, '7');
    click(de('save-button'));
});

test('Stress detail pane', async assert => {
    server.get('ClinicalEndpoint/api/v3/patients/:patientPracticeGuid/behavioralhealth/', ({ db }) => db.behavioralHealths[0]);
    server.get('ClinicalEndpoint/api/v2/patients/:patientPracticeGuid/smokingstatuses', () => smokingStatus);
    server.put('PracticeEndpoint/api/v1/preferenceDoc/user/:id/patientSummaryDisplay', ({ db }, request) => JSON.parse(request.requestBody));
    server.get('ChartingEndpoint/api/v2/WorksheetResponses/:worksheetResponseGuid', ({ db }, request) => {
        const { worksheetResponseGuid } = request.params;
        return db.behavioralHealthWorksheets.where({
            responsesGuid: worksheetResponseGuid
        })[0];
    });
    server.put('ChartingEndpoint/api/v2/WorksheetResponses/:worksheetResponseGuid', ({ db }, request) => {
        const worksheetResponse = JSON.parse(request.requestBody);
        assert.equal(worksheetResponse.resultSummary, 'To some extent');
        return worksheetResponse;
    });
    await visit(summaryURL);
    await click(de('link-display-settings'));
    const uncheckedSwitches = find(`${de('social-history')} .d-checkbox-switch:has(input:not(:checked))`);
    uncheckedSwitches.toArray().forEach((uncheckedSwitch) => {
        click(uncheckedSwitch);
    });
    await click(de('btn-save-control-bar'));
    await click(`${de('stress-section')} ${de('behavioral-health-field-item-0')}`);
    assert.dom('h15.header15').hasText('Stress > Record', 'Detail pane header is correct');
    assert.dom(de('save-button')).hasText('Mark as reviewed');
    await click(`${de('worksheet-question-0')} ${de('option-2')} input`);
    assert.dom(de('undo-question-0')).exists('Undo links shows only when user changed the input');
    assert.dom(de('save-button')).hasText('Save', 'button text changed to save if change is made');
    click(de('save-button'));
});

test('Social isolation and connection detail pane', async assert => {
    server.get('ClinicalEndpoint/api/v3/patients/:patientPracticeGuid/behavioralhealth/', ({ db }) => db.behavioralHealths[0]);
    server.get('ClinicalEndpoint/api/v2/patients/:patientPracticeGuid/smokingstatuses', () => smokingStatus);
    server.put('PracticeEndpoint/api/v1/preferenceDoc/user/:id/patientSummaryDisplay', ({ db }, request) => JSON.parse(request.requestBody));
    server.get('ChartingEndpoint/api/v2/WorksheetResponses/:worksheetResponseGuid', ({ db }, request) => {
        const { worksheetResponseGuid } = request.params;
        return db.behavioralHealthWorksheets.where({
            responsesGuid: worksheetResponseGuid
        })[0];
    });
    server.put('ChartingEndpoint/api/v2/WorksheetResponses/:worksheetResponseGuid', ({ db }, request) => {
        const worksheetResponse = JSON.parse(request.requestBody);
        return worksheetResponse;
    });
    server.del('ChartingEndpoint/api/v2/WorksheetResponses/:worksheetResponseGuid', () => {});
    await visit(summaryURL);
    await click(de('link-display-settings'));
    const uncheckedSwitches = find(`${de('social-history')} .d-checkbox-switch:has(input:not(:checked))`);
    uncheckedSwitches.toArray().forEach((uncheckedSwitch) => {
        click(uncheckedSwitch);
    });
    await click(de('btn-save-control-bar'));
    await click(`${de('socialIsolation-section')} ${de('behavioral-health-field-item-0')}`);
    assert.dom('h15.header15').hasText('Social isolation and connection > Record', 'Detail pane header is correct');
    assert.dom(de('save-button')).hasText('Mark as reviewed');
    assert.dom(`${de('worksheet-question-2')} input`).hasValue('7', 'response renders correct');
    assert.dom(`${de('worksheet-question-3')} input`).hasValue('2', 'response renders correct');
    assert.dom(`${de('worksheet-question-4')} input`).hasValue('7', 'response renders correct');
    assert.dom(de('decline-checkbox')).exists('Patient declined to specify on all question checkbox exists');
    await click(`${de('worksheet-question-1')} ${de('option-2')} input`);
    assert.dom(de('undo-question-1')).exists('Undo links shows only when user changed the input');
    assert.dom(de('save-button')).hasText('Save', 'button text changed to save if change is made');
    await click(`${de('decline-checkbox')} input`);
    assert.dom(`${de('worksheet-question-1')} ${de('option-0')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-1')} ${de('option-1')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-1')} ${de('option-2')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-1')} ${de('option-3')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-1')} ${de('option-4')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-1')} ${de('option-5')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-1')} ${de('option-6')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-1')} ${de('option-7')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-2')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-3')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-4')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-5')} ${de('option-0')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-5')} ${de('option-1')} input`).isDisabled();
    assert.dom(de('worksheet-score')).hasText('No score');
    await click(`${de('decline-checkbox')} input`);
    await fillIn(`${de('worksheet-question-2')} input`, '3');
    assert.dom(de('worksheet-score')).hasText('No score', 'score is correct');
    click(de('cancel-button'));
});

test('Exposure to violence detail pane', async assert => {
    server.get('ClinicalEndpoint/api/v3/patients/:patientPracticeGuid/behavioralhealth/', ({ db }) => db.behavioralHealths[0]);
    server.get('ClinicalEndpoint/api/v2/patients/:patientPracticeGuid/smokingstatuses', () => smokingStatus);
    server.put('PracticeEndpoint/api/v1/preferenceDoc/user/:id/patientSummaryDisplay', ({ db }, request) => JSON.parse(request.requestBody));
    server.get('ChartingEndpoint/api/v2/WorksheetResponses/:worksheetResponseGuid', ({ db }, request) => {
        const { worksheetResponseGuid } = request.params;
        return db.behavioralHealthWorksheets.where({
            responsesGuid: worksheetResponseGuid
        })[0];
    });
    server.put('ChartingEndpoint/api/v2/WorksheetResponses/:worksheetResponseGuid', ({ db }, request) => {
        const worksheetResponse = JSON.parse(request.requestBody);
        assert.equal(worksheetResponse.resultSummary, 'Patient declined to specify');
        assert.notOk(worksheetResponse.calculatedScore, 'Checking patient declined to specify checkbox removes calculatedScore proptery in payload');
        delete worksheetResponse.calculatedScore;
        return worksheetResponse;
    });
    await visit(summaryURL);
    await click(de('link-display-settings'));
    const uncheckedSwitches = find(`${de('social-history')} .d-checkbox-switch:has(input:not(:checked))`);
    uncheckedSwitches.toArray().forEach((uncheckedSwitch) => {
        click(uncheckedSwitch);
    });
    await click(de('btn-save-control-bar'));
    await click(`${de('exposureToViolence-section')} ${de('behavioral-health-field-item-0')}`);
    assert.dom('h15.header15').hasText('Exposure to violence > Record', 'Detail pane header is correct');
    assert.dom(de('save-button')).hasText('Mark as reviewed');
    assert.dom(de('decline-checkbox')).exists('Patient declined to specify on all question checkbox exists');
    await click(`${de('worksheet-question-1')} ${de('option-0')} input`);
    assert.dom(de('undo-question-1')).exists('Undo links shows only when user changed the input');
    assert.dom(de('save-button')).hasText('Save', 'button text changed to save if change is made');
    await click(`${de('decline-checkbox')} input`);
    assert.dom(`${de('worksheet-question-1')} ${de('option-0')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-1')} ${de('option-1')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-2')} ${de('option-0')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-2')} ${de('option-1')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-3')} ${de('option-0')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-3')} ${de('option-1')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-4')} ${de('option-0')} input`).isDisabled();
    assert.dom(`${de('worksheet-question-4')} ${de('option-1')} input`).isDisabled();
    assert.dom(de('worksheet-score')).hasText('No score');
    click(de('save-button'));
});

test('Nutrition history detail pane', async assert => {
    server.get('ClinicalEndpoint/api/v3/patients/:patientPracticeGuid/behavioralhealth/', ({ db }) => db.behavioralHealths[0]);
    server.get('ClinicalEndpoint/api/v2/patients/:patientPracticeGuid/smokingstatuses', () => smokingStatus);
    server.put('PracticeEndpoint/api/v1/preferenceDoc/user/:id/patientSummaryDisplay', ({ db }, request) => JSON.parse(request.requestBody));
    server.put('ClinicalEndpoint/api/v2/PersonalMedicalHistory/:patientPracticeGuid', ({ db }, request) => {
        const personalMedicalHistory = JSON.parse(request.requestBody);
        assert.equal(personalMedicalHistory.nutritionHistory, 'test content', 'nutrition history content has been changed');
        return personalMedicalHistory;
    });
    await visit(summaryURL);
    await click(de('link-display-settings'));
    const uncheckedSwitches = find(`${de('social-history')} .d-checkbox-switch:has(input:not(:checked))`);
    uncheckedSwitches.toArray().forEach((uncheckedSwitch) => {
        click(uncheckedSwitch);
    });
    await click(de('btn-save-control-bar'));
    await click(`${de('nutritionHistory-section')} ${de('behavioral-health-field-item-0')}`);
    assert.dom('h15.header15').hasText('Nutrition history > Record', 'Detail pane header is correct');
    assert.dom(de('text-area-counter')).hasValue('Proin diam velit, sodales at mi id, consectetur consectetur tortor');
    await fillIn(de('text-area-counter'), '');
    assert.dom(de('save-button')).isDisabled('Save button is disabled when there is no content');
    await fillIn(de('text-area-counter'), 'test content');
    click(de('save-button'));
});

test('Tobacco use detail pane', async assert => {
    server.get('ClinicalEndpoint/api/v3/patients/:patientPracticeGuid/behavioralhealth/', ({ db }) => db.behavioralHealths[0]);
    server.get('ClinicalEndpoint/api/v2/patients/:patientPracticeGuid/smokingstatuses', () => smokingStatus);
    server.put('PracticeEndpoint/api/v1/preferenceDoc/user/:id/patientSummaryDisplay', ({ db }, request) => JSON.parse(request.requestBody));
    server.get('ClinicalEndpoint/api/v3/smokingstatuses', ({ db }, request) => {
        const { version } = request.queryParams;
        return db.smokingStatusTypes.where({
            version
        })[0].content;
    });
    await visit(summaryURL);
    await click(de('link-display-settings'));
    const uncheckedSwitches = find(`${de('social-history')} .d-checkbox-switch:has(input:not(:checked))`);
    uncheckedSwitches.toArray().forEach((uncheckedSwitch) => {
        click(uncheckedSwitch);
    });
    await click(de('btn-save-control-bar'));
    await click(`${de('tobaccoUse-section')} ${de('behavioral-health-field-show-all-toggle')}`);
    await click(`${de('tobaccoUse-section')} ${de('behavioral-health-field-item-1')}`);
    assert.dom('h15.header15').hasText('Tobacco use > Record', 'Detail pane header is correct');
    assert.dom(de('save-button')).hasText('Mark as reviewed');
    assert.dom(de('smoking-option-old-label')).hasText('Never smoker', 'Selection of old options is preserved');
    assert.dom(de('info-popover-target')).exists('An info icon exists next to old option');
    await click(de('smoking-option-3-label'));
    assert.dom(de('undo-link')).doesNotExist('Undo links does not show when user replace a old option with new option');
    assert.dom('input#smoking-option-old').isDisabled('Old option is disabled when user select a new option');
});
