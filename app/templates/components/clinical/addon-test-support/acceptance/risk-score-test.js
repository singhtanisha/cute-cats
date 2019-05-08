import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';
import getTextInPrint from 'boot/tests/helpers/get-text-in-print';
import sinon from 'sinon';

const PATIENT_PRACTICE_GUID = 'c5faffde-78e2-4924-acaf-2115bc686d5e';
const NEW_RISK_SCORE = {
    optionGuid: '28f3add6-6b6b-4795-bd87-e9432f824fdf',
    description: 'Hierarchical Condition Category (HCC)',
    riskScore: 40.50,
    dateAssigned: moment().format('MM/DD/YYYY')
};
const EMPTY_SOCIAL_HISTORY = {
    genderIdentity: null,
    sexualOrientation: null,
    riskScore: null
};
const DEFAULT_DATE = moment().format('M/D/YYYY');
const VALIDATION_MESSAGES = {
    riskScoreType: 'Please select a risk score type',
    riskScore: 'Please enter a numeric risk score',
    riskScoreInvalid: 'Scores are limited to positive numbers below 1000 with up to 3 decimal places',
    dateAssigned: 'Date assigned is required'
};
const INVALID_RISK_SCORE = '9999.9999';
let toastrSuccessStub;
moduleForAcceptanceAuth('Acceptance - Core - Clinical | Patient Risk Score - v2', {
    beforeEach() {
        toastrSuccessStub = sinon.stub(window.toastr, 'success');
    },
    afterEach() {
        window.toastr.success.restore();
    }
});

test('Empty risk score renders properly', async assert => {
    server.get('/PatientEndpoint/api/v3/patients/patientDemographic/:patientPracticeGuid', () => EMPTY_SOCIAL_HISTORY);

    await visit(`/PF/charts/patients/${PATIENT_PRACTICE_GUID}/summary`);
    assert.dom(de('patient-risk-score-placeholder-text')).hasText('No patient risk score recorded', 'Empty risk score rendered properly');
});

test('Add patient risk score on patient summary', async assert => {
    let socialHistoryPayload = EMPTY_SOCIAL_HISTORY;
    server.get('/PatientEndpoint/api/v3/patients/patientDemographic/:patientPracticeGuid', () => socialHistoryPayload);
    server.put('/PatientEndpoint/api/v3/patients/patientDemographic/:patientPracticeGuid', ({ db }, request) => {
        const newSettings = JSON.parse(request.requestBody);
        assert.equal(newSettings.riskScore.optionGuid, NEW_RISK_SCORE.optionGuid, 'The correct risk score type guid was saved');
        assert.equal(newSettings.riskScore.riskScore, NEW_RISK_SCORE.riskScore, 'The correct risk score was saved');
        assert.equal(newSettings.riskScore.dateAssigned, NEW_RISK_SCORE.dateAssigned, 'The correct assigned date was saved');
        socialHistoryPayload = {
            genderIdentity: null,
            sexualOrientation: null,
            riskScore: NEW_RISK_SCORE
        };
        return socialHistoryPayload;
    });

    assert.expect(14);
    await visit(`/PF/charts/patients/${PATIENT_PRACTICE_GUID}/summary`);
    assert.dom(de('patient-risk-score-card')).exists('Risk Score section displays on patient summary');
    await delayAsync(100);
    assert.dom(de('patient-risk-score-placeholder-text')).hasText('No patient risk score recorded', 'Risk score section displays empty');
    assert.throws(findWithAssert(de('patient-risk-score-add-button')), 'Risk score add button is visible');
    await click(de('patient-risk-score-add-button'));
    await delayAsync(100);
    assert.throws(findWithAssert('.patient-risk-score-detail'), 'Detail panel displays after add is clicked');
    assert.equal(find(`.patient-risk-score-detail ${de('date-assigned-txt')}`).val(), DEFAULT_DATE, 'Date assigned defaults to current date');
    await click('.detail-pane-footer .btn-primary');
    // Validation shows that risk score type is required
    assert.throws(findWithAssert(`.tooltip-inner:contains('${VALIDATION_MESSAGES.riskScoreType}')`), 'Validation for the risk score type is shown');
    await click(`.patient-risk-score-detail ${de('risk-type')} .dropdown-toggle`);
    await click(`.patient-risk-score-detail ${de('risk-type')} ${de('risk-type-0')}`);
    await click('.detail-pane-footer .btn-primary');
    // Validation shows that risk score is required
    assert.throws(findWithAssert(`.tooltip-inner:contains('${VALIDATION_MESSAGES.riskScore}')`), 'Validation for the risk score is shown');
    fillIn(`.patient-risk-score-detail ${de('risk-score')}`, INVALID_RISK_SCORE);
    await click('.detail-pane-footer .btn-primary');
    // validation shows that risk score is not validation
    assert.throws(findWithAssert(`.tooltip-inner:contains('${VALIDATION_MESSAGES.riskScoreInvalid}')`), 'Validation for the risk score is shown');
    fillIn(`.patient-risk-score-detail ${de('risk-score')}`, NEW_RISK_SCORE.riskScore);
    await click('.detail-pane-footer .btn-primary');
    assert.equal(toastrSuccessStub.args[0][0], 'Patient risk score saved.', 'Confirmation toast displays after saving');
    assert.notOk(find('.patient-risk-score-detail').length, 'Risk score pane closed upon saving');
    assert.throws(findWithAssert(de('patient-risk-score-item')), 'Risk score list is updated after save');
});


test('Edit patient risk score', async assert => {
    let socialHistoryPayload = EMPTY_SOCIAL_HISTORY;
    server.get('/PatientEndpoint/api/v3/patients/patientDemographic/:patientPracticeGuid', ({ db }) => {
        socialHistoryPayload = db.socialHistories[0];
        return socialHistoryPayload;
    });
    server.put('/PatientEndpoint/api/v3/patients/patientDemographic/:patientPracticeGuid', ({ db }, request) => {
        const newSettings = JSON.parse(request.requestBody);
        assert.equal(newSettings.riskScore.optionGuid, NEW_RISK_SCORE.optionGuid, 'The correct risk score type guid was saved');
        assert.equal(newSettings.riskScore.riskScore, NEW_RISK_SCORE.riskScore, 'The correct risk score was saved');
        assert.equal(newSettings.riskScore.dateAssigned, NEW_RISK_SCORE.dateAssigned, 'The correct assigned date was saved');
        socialHistoryPayload.riskScore = NEW_RISK_SCORE;
        return socialHistoryPayload;
    });

    assert.expect(12);
    await visit(`/PF/charts/patients/${PATIENT_PRACTICE_GUID}/summary`);
    assert.dom(de('patient-risk-score-card')).exists('Risk Score section displays on patient summary');
    await delayAsync(100);
    assert.throws(findWithAssert(de('patient-risk-score-item')), 'Risk score section displays expected result');
    assert.notOk(find(de('patient-risk-score-add-button')).length, 'Risk score add button is not visible');
    await click(de('patient-risk-score-item'));
    await delayAsync(100);
    assert.throws(findWithAssert('.patient-risk-score-detail'), 'Detail panel displays after item is clicked');
    await click(`.patient-risk-score-detail ${de('risk-type')} .dropdown-toggle`);
    await click(`.patient-risk-score-detail ${de('risk-type')} ${de('risk-type-0')}`);
    fillIn(`.patient-risk-score-detail ${de('risk-score')}`, NEW_RISK_SCORE.riskScore);
    fillIn(`.patient-risk-score-detail ${de('date-assigned-txt')}`, NEW_RISK_SCORE.dateAssigned);
    await click('.detail-pane-footer .btn-primary');
    assert.equal(toastrSuccessStub.args[0][0], 'Patient risk score saved.', 'Confirmation toast displays after saving');
    assert.notOk(find('.patient-risk-score-detail').length, 'Risk score pane closed upon saving');
    assert.throws(findWithAssert(`${de('patient-risk-score-item')}:contains('${NEW_RISK_SCORE.description}')`), 'Risk score list is updated with correct type');
    assert.throws(findWithAssert(`${de('patient-risk-score-item')}:contains('${NEW_RISK_SCORE.riskScore}')`), 'Risk score list is updated with correct score');
    assert.throws(findWithAssert(`${de('patient-risk-score-item')}:contains('${NEW_RISK_SCORE.dateAssigned}')`), 'Risk score list is updated with correct date');
});

test('Delete patient risk score', async assert => {
    let socialHistoryPayload = EMPTY_SOCIAL_HISTORY;
    server.get('/PatientEndpoint/api/v3/patients/patientDemographic/:patientPracticeGuid', ({ db }) => {
        socialHistoryPayload = db.socialHistories[0];
        return socialHistoryPayload;
    });
    server.del('/PatientEndpoint/api/v3/patients/riskScore/:patientPracticeGuid', ({ db }, request) => {
        assert.equal(request.params.patientPracticeGuid, PATIENT_PRACTICE_GUID, 'Risk score was deleted for the correct patient');
    });

    assert.expect(10);
    await visit(`/PF/charts/patients/${PATIENT_PRACTICE_GUID}/summary`);
    assert.dom(de('patient-risk-score-card')).exists('Risk Score section displays on patient summary');
    await delayAsync(100);
    assert.throws(findWithAssert(de('patient-risk-score-item')), 'Risk score section displays expected result');
    assert.notOk(find(de('patient-risk-score-add-button')).length, 'Risk score add button is not visible');
    await click(de('patient-risk-score-item'));
    await delayAsync(100);
    assert.throws(findWithAssert('.patient-risk-score-detail'), 'Detail panel displays after item is clicked');
    await click(de('delete-risk-score-button'));
    assert.throws(findWithAssert(`.content-modal .content-modal-title:contains('Delete patient risk score')`), 'Delete requires confirmation');
    await click('.content-modal footer .btn-primary');
    assert.equal(toastrSuccessStub.args[0][0], 'Patient risk score deleted.', 'Confirmation toast displays after deleting');
    assert.notOk(find('.patient-risk-score-detail').length, 'Risk score pane closed upon saving');
    assert.dom(de('patient-risk-score-placeholder-text')).hasText('No patient risk score recorded', 'Risk score section displays empty');
    assert.throws(findWithAssert(de('patient-risk-score-add-button')), 'Risk score add button is visible');
});

test('Print preview risk score', async assert => {
    let socialHistoryPayload;
    server.get('/PatientEndpoint/api/v3/patients/patientDemographic/:patientPracticeGuid', ({ db }) => {
        socialHistoryPayload = db.socialHistories[0];
        return socialHistoryPayload;
    });
    assert.expect(3);
    await visit(`/PF/charts/patients/${PATIENT_PRACTICE_GUID}/summary`);
    assert.throws(findWithAssert(de('print-patient-risk-score-button')), 'Print risk score button is available');
    await click(de('print-patient-risk-score-button'));
    assert.equal(getTextInPrint(`.print-section ${de('print-patient-risk-score-description')}`), socialHistoryPayload.riskScore.description, 'Risk score shows correct type description');
    assert.equal(getTextInPrint(`.print-section ${de('print-patient-risk-score')}`), socialHistoryPayload.riskScore.riskScore, 'Risk score shows correct score');
    click('#print-modal-controls .close-link');
});
