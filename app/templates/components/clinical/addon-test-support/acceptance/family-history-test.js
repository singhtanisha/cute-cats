import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';

function dg(guid) {
    return `[data-guid='${guid}']`;
}

const PATIENT_PRACTICE_GUID = 'c5faffde-78e2-4924-acaf-2115bc686d5e';
const FAMILY_HISTORY_ROUTE = `/PF/charts/patients/${PATIENT_PRACTICE_GUID}/familyhistory`;
const RELATIVE_GUID = 'ca13d90a-7c0e-4437-99fd-576f55aaa1c0';
const OBSERVATION_GUID = 'd8858c94-4118-417e-8e0d-5ce135a9ca58';
const RELATIVE_CARD = `${dg(RELATIVE_GUID)}${de('relative-card')}`;
const EDIT_RELATIVE = `${RELATIVE_CARD} ${de('edit-relative')}`;
const EDIT_DX = `${dg(OBSERVATION_GUID)}${de('edit-diagnosis')}`;
const ADD_DIAGNOSIS = `${RELATIVE_CARD} ${de('add-diagnosis')}`;
const RELATIVE_COMMENTS = `${de('relative-comments')} textarea`;
const DX_SEARCH = `${de('diagnosis-search')} input`;
const DX_COMMENTS = `${de('diagnosis-comments')} textarea`;

moduleForAcceptanceAuth('Acceptance - Visual - Core - Clinical | Family health history');

test('Adding a relative', async assert => {
    let callCountHistory = 0;

    server.get('ClinicalEndpoint/api/v1/FamilyHealthHistory/:patientPracticeGuid/conditions', ({ db }) => db.familyHealthConditions[0].noName);
    server.get('ClinicalEndpoint/api/v1/FamilyHealthHistory/:patientPracticeGuid', ({ db }) => {
        callCountHistory += 1;
        if (callCountHistory === 1) {
            return db.familyHealthInformation[0].original;
        }
        return db.familyHealthInformation[0].addedRelative;
    });

    await visit(FAMILY_HISTORY_ROUTE);
    await click(de('record-new-relative'));
    await click(de('relative-relationship-option-2'));
    fillIn(de('relative-first-name'), 'Charles');
    fillIn(de('relative-last-name'), 'Doe');
    fillIn(`${de('relative-birthdate')} input`, '1/2/1924');
    await fillIn(RELATIVE_COMMENTS, 'Most Awesome Dad Evaa!');
    percySnapshot(assert);
    await click(de('relative-save'));
    assert.dom(`${dg('d0b6917f-243f-4059-ac28-e6a329d50d77')}${de('relative-card')} .card__title`).hasText('Parent - Charles Doe');
});

test('Editing and deleting a relative', async assert => {
    let callCountHistory = 0;

    server.put(`ClinicalEndpoint/api/v1/FamilyHealthHistory/${PATIENT_PRACTICE_GUID}/relatives`, () => true);
    server.get('ClinicalEndpoint/api/v1/FamilyHealthHistory/:patientPracticeGuid', ({ db }) => {
        callCountHistory += 1;
        if (callCountHistory === 1) {
            return db.familyHealthInformation[0].original;
        } else if (callCountHistory === 2) {
            return db.familyHealthInformation[0].editRelative;
        }
        return db.familyHealthInformation[0].noRelative;
    });

    await visit(FAMILY_HISTORY_ROUTE);
    await click(EDIT_RELATIVE);
    fillIn(RELATIVE_COMMENTS, 'Some comment');
    await click(de('relative-save'));
    await click(EDIT_RELATIVE);
    assert.dom(RELATIVE_COMMENTS).hasValue('Some comment');
    await click(de('relative-delete'));
    assert.dom(RELATIVE_CARD).doesNotExist();
});

test('Add a diagnosis for a relative', async assert => {
    const dxDescription = 'Disorder of lung';
    let callCountHistory = 0;

    server.get('ClinicalEndpoint/api/v1/FamilyHealthHistory/:patientPracticeGuid', ({ db }) => {
        callCountHistory += 1;
        if (callCountHistory === 1) {
            return db.familyHealthInformation[0].original;
        }
        return db.familyHealthInformation[0].addDx;
    });
    server.get('ClinicalEndpoint/api/v3/diagnosis/typeSearch/', ({ db }) => db.familyHistoryDiagnosisSearches);

    await visit(FAMILY_HISTORY_ROUTE);
    await click(ADD_DIAGNOSIS);
    await click('.family-history-detail__pane');
    fillIn(DX_SEARCH, 'Lung');
    await click(DX_SEARCH);
    await keyEvent(DX_SEARCH, 'keyup', 32);
    await click(de('diagnosis-search-option-2'));
    fillIn(`${de('diagnosis-onset-date')} input`, '11/8/2016');
    await fillIn(DX_COMMENTS, 'Comment');
    percySnapshot(assert);
    await click(de('diagnosis-save'));
    assert.dom(`${dg('27a695ce-048e-4dc7-abcd-ba4b87fc5190')}${de('edit-diagnosis')}`).hasText(dxDescription);
});

test('Edit and delete diagnosis for a relative', async assert => {
    let callCountHistory = 0;

    server.put(`ClinicalEndpoint/api/v1/FamilyHealthHistory/${PATIENT_PRACTICE_GUID}/observations/:observationGuid`, () => true);
    server.get('ClinicalEndpoint/api/v1/FamilyHealthHistory/:patientPracticeGuid', ({ db }) => {
        callCountHistory += 1;
        if (callCountHistory === 1) {
            return db.familyHealthInformation[0].original;
        } else if (callCountHistory === 2) {
            return db.familyHealthInformation[0].editDx;
        }
        return db.familyHealthInformation[0].deletedDx;
    });

    await visit(FAMILY_HISTORY_ROUTE);
    await click(EDIT_DX);
    fillIn(DX_COMMENTS, 'Some comment');
    await click(de('diagnosis-save'));
    await click(EDIT_DX);
    assert.dom(DX_COMMENTS).hasValue('Some comment');
    await click(de('diagnosis-delete'));
    assert.dom(EDIT_DX).doesNotExist();
});

test('Family Health History Print Preview', async assert => {
    server.post('ChartingEndpoint/api/v2/PrintAudit', () => true);

    await visit(FAMILY_HISTORY_ROUTE);
    await click(de('actions-menu'));
    await click(`${de('action-menu-item-1')} a`);
    assert.dom(de('print-header-patient-name')).hasText('Cade Baby', 'Patient name renders correctly');
    assert.dom(de('print-header-patient-dob')).hasText('02/05/2013', 'Patient date of birth renders correctly');
    assert.dom(de('print-header-patient-age')).hasText('3 yrs', 'Patient age renders correctly');
    assert.dom(de('print-header-patient-gender')).hasText('Male', 'Patient genders renders correctly');
    assert.dom(de('print-header-patient-prn')).hasText('BC251057', 'Patient prn renders correctly');

    assert.dom(de('print-header-facility-name')).hasText('Rosalise Ron Practice', 'Facility name renders correctly');
    assert.dom(de('print-header-facility-address')).hasText('123', 'Facility address renders correctly');
    assert.dom(de('print-header-facility-phone')).hasText('(555) 555-0000', 'Facility phone number renders correctly');
    assert.dom(de('print-header-facility-city-state-zip')).hasText('Schenectady, NY 12345', 'Facility city-state-zip renders correctly');

    assert.dom(de('relative')).hasText('Grandparent - Joe', 'Relative renders correctly');
    assert.dom(de('dx')).hasText('Heart disease', 'Relative diagnosis renders correctly');
    assert.dom(de('dx-onset-date')).hasText('11/01/2016', 'Relative\'s diagnosis onset date renders correctly');
    assert.dom(de('observation-comment')).hasText('Comments: Comment', 'Comments renders correctly');
    await click('.glyphicon-remove');
});

test('Add, edit, clear family health history on patient summary', async assert => {
    const patientWithHistory = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
    const patientWithoutHistory = 'c5faffde-78e2-4924-acaf-2115bc686d5e';
    const patientWithHistoryToClear = 'fd198d85-b2e4-435b-854a-b924b3261d75';

    server.get('/ClinicalEndpoint/api/v2/PersonalMedicalHistory/:id', ({ db }, request) => db.personalMedicalHistories.where({
        patientPracticeGuid: request.params.id
    })[0]);

    server.put('/ClinicalEndpoint/api/v2/PersonalMedicalHistory/:id', (schema, request) => {
        const history = JSON.parse(request.requestBody);
        switch (request.params.id) {
        case patientWithHistory:
            assert.equal(history.familyHealthHistory, 'Min farfar är gammal', 'Edited family health history is sent correctly');
            break;
        case patientWithoutHistory:
            assert.equal(history.familyHealthHistory, 'Min familj har en gula halsduk', 'New family health history is sent correctly');
            break;
        case patientWithHistoryToClear:
            assert.equal(history.familyHealthHistory, '', 'Cleared family health history is sent correctly');
            break;
        default:
        }
        return history;
    });

    await visit(`/PF/charts/patients/${patientWithoutHistory}/summary`);
    assert.dom(de('family-history-section-message')).hasText('No family health history recorded', 'The family health history placeholder text is correct');
    assert.dom(de('family-health-history-card-list-item')).hasClass('hidden', 'Item that displays family health history text is hidden');
    await click(de('add-family-history-button'));
    assert.dom(de('family-health-history-card-list-record-item')).doesNotHaveClass('hidden', 'Record placeholder appears while adding new history');
    assert.dom(de('add-family-history-button')).doesNotExist('Add icon is hidden while editing');
    fillIn(`${de('family-health-history-text-area-container')} ${de('text-area-counter')}`, 'Min familj har en gula halsduk');
    await click(de('btn-save-family-health-history'));
    assert.dom(de('family-history-text')).hasText('Min familj har en gula halsduk', 'The family health history card updated');

    await visit(`/PF/charts/patients/${patientWithHistory}/summary`);
    assert.dom(de('family-history-section-message')).hasClass('hidden', 'The family health history placeholder is not displayed');
    assert.dom(de('family-history-text')).hasText('Such a family', 'The family health history card displays correct text');
    assert.dom(de('add-family-history-button')).doesNotExist('Add icon is hidden when has history');
    await click(de('family-health-history-card-list-item'));
    assert.dom(de('family-health-history-card-list-record-item')).hasClass('hidden', 'Record placeholder hidden while editing saved history');
    assert.dom(de('family-health-history-card-list-item')).hasClass('is-active', 'History item is active');
    assert.dom(de('add-family-history-button')).doesNotExist('Add icon is hidden while editing');
    fillIn(`${de('family-health-history-text-area-container')} ${de('text-area-counter')}`, 'Min farfar är gammal');
    await click(de('btn-save-family-health-history'));
    assert.dom(de('family-history-text')).hasText('Min farfar är gammal', 'The family health history card updated');

    await visit(`/PF/charts/patients/${patientWithHistoryToClear}/summary`);
    assert.dom(de('family-history-text')).hasText('Family dinner night', 'The family health history card displays correct text');
    await click(de('family-health-history-card-list-item'));
    fillIn(`${de('family-health-history-text-area-container')} ${de('text-area-counter')}`, '');
    await click(de('btn-save-family-health-history'));
    assert.dom(de('family-history-text')).hasText('', 'The family health history card updated');
});
