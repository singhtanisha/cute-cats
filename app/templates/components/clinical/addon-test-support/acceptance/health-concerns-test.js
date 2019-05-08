import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';
import getText from 'boot/tests/helpers/get-text';
import viewPreferencesRepository from 'boot/repositories/view-preferences';
import getPrintText from 'boot/tests/helpers/get-text-in-print';

const PATIENT_PRACTICE_GUID = 'c5faffde-78e2-4924-acaf-2115bc686d5e';
const DETAIL_PANE = '.health-concern-detail';
const HEALTH_CONCERN_GUID = 'HEALTH_CONCERN_GUID';
const DIAGNOSIS_GUID = 'b3da2472-d894-4b29-967e-c4aadade0841';
const SINGLE_HEALTH_CONCERN = {
    patientHealthConcerns: [{
        patientHealthConcernGuid: HEALTH_CONCERN_GUID,
        patientPracticeGuid: PATIENT_PRACTICE_GUID,
        healthConcernReferenceGuid: DIAGNOSIS_GUID,
        effectiveDate: '2017-06-12T00:00:00.000Z',
        isActive: true
    }]
};
const MULTIPLE_HEALTH_CONCERNS = {
    patientHealthConcerns: [{
        patientHealthConcernGuid: HEALTH_CONCERN_GUID,
        patientPracticeGuid: PATIENT_PRACTICE_GUID,
        healthConcernReferenceGuid: DIAGNOSIS_GUID,
        healthConcernType: 'Diagnosis',
        effectiveDate: '2017-06-12T00:00:00.000Z',
        isActive: true
    }, {
        patientHealthConcernGuid: 'HEALTH_CONCERN_GUID_2',
        patientPracticeGuid: PATIENT_PRACTICE_GUID,
        healthConcernReferenceGuid: '3d26806e-aaa8-4092-87ba-944da229a299',
        effectiveDate: '2015-06-12T00:00:00.000Z',
        healthConcernType: 'Allergy',
        isActive: true
    }, {
        patientHealthConcernGuid: 'HEALTH_CONCERN_GUID_3',
        patientPracticeGuid: PATIENT_PRACTICE_GUID,
        healthConcernReferenceGuid: '437e31e2-dca5-4563-a74d-247b33433558',
        effectiveDate: '2015-06-12T00:00:00.000Z',
        healthConcernType: 'Allergy',
        isActive: false
    }]
};
const SEARCH_RESULT = `${DETAIL_PANE} ${de('selected-source-results')} li`;
const DETAIL_PANE_TITLE = de('health-concern-reference-title');
const DETAIL_PANE_EFFECTIVE_DATE = `${DETAIL_PANE} ${de('health-concern-effective-date')}`;
const EFFECTIVE_DATE = '07/24/2017';
const EFFECTIVE_DATE_UTC = '2017-07-24T00:00:00.000Z';

function isHidden($item) {
    return $item.is('.hidden') || !!$item.parents('.hidden').length;
}

moduleForAcceptanceAuth('Acceptance - Core - Clinical | Health concerns - v2', {
    beforeEach() {
        viewPreferencesRepository.set('_preferences', {
            'patient-summary-page': {
                hideHealthConcerns: false
            }
        });
    }
});

test('Save and add another health concern', async assert => {
    let postCalled = false;
    server.post('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/patientHealthConcerns', ({ db }, request) => {
        postCalled = true;
        const data = JSON.parse(request.requestBody);
        data.patientHealthConcernGuid = HEALTH_CONCERN_GUID;
        assert.equal(data.healthConcernReferenceGuid, DIAGNOSIS_GUID, 'The reference guid is correct on POST');
        assert.equal(data.healthConcernType, 'Diagnosis', 'The health concern type is correct on POST');
        assert.equal(data.effectiveDate, EFFECTIVE_DATE_UTC, 'The effective date is correct on POST');
        return {
            patientHealthConcern: data
        };
    });
    await visit(`/PF/charts/patients/${PATIENT_PRACTICE_GUID}/summary/healthConcern/new`);
    const $saveButton = find(`${DETAIL_PANE} ${de('btn-save')}`);
    const $saveAnotherButton = find(`${DETAIL_PANE} ${de('btn-save-add-another')}`);
    const $deleteButton = find(`${DETAIL_PANE} ${de('btn-delete')}`);
    const $typeahead = find(`${DETAIL_PANE} .checkbox-multi-select`);
    assert.notOk(find(DETAIL_PANE_TITLE).length, 'The health concern reference title does not appear until a clinical item has been selected');
    assert.ok(isHidden($saveButton), 'The save button is hidden');
    assert.ok(isHidden($saveAnotherButton), 'The save & add another button is hidden');
    assert.ok(isHidden($deleteButton), 'The delete button is hidden');
    assert.ok($typeahead.length, 'The typeahead clinical item select is visible');
    click($typeahead.find('input'));
    await click(`${SEARCH_RESULT}:first-of-type .option-container`);
    assert.notOk(isHidden($saveButton), 'The save button is visible');
    assert.notOk(isHidden($saveAnotherButton), 'The save & add another button is visible');
    assert.equal(getText(DETAIL_PANE_TITLE), '(E845.9) Accident involving spacecraft injuring other person', 'The title is correct after selecting a clinical item');
    fillIn(DETAIL_PANE_EFFECTIVE_DATE, EFFECTIVE_DATE);
    await click($saveAnotherButton);
    assert.ok(postCalled);
    assert.notOk(find(DETAIL_PANE_TITLE).length, 'The detail pane was reset');
    await click(find(`${DETAIL_PANE} .checkbox-multi-select`).find('input'));
    assert.notOk(find(SEARCH_RESULT).length, 'The diagnoses list does not contain the previous item since it is now a health concern');
    await click(`${DETAIL_PANE} ${de('btn-cancel')}`);
    assert.notOk(find(DETAIL_PANE).length, 'The detail pane disappears after clicking cancel');
});

test('Edit existing health concern', async assert => {
    let putCalled = false;
    server.get('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/patientHealthConcerns', () => SINGLE_HEALTH_CONCERN);
    server.put('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/patientHealthConcerns/:guid', ({ db }, request) => {
        putCalled = true;
        const data = JSON.parse(request.requestBody);
        assert.equal(data.effectiveDate, EFFECTIVE_DATE_UTC, 'The effective date is correct on PUT');
        return {
            patientHealthConcern: data
        };
    });

    await visit(`/PF/charts/patients/${PATIENT_PRACTICE_GUID}/summary/healthConcern/${HEALTH_CONCERN_GUID}`);
    const $saveButton = find(`${DETAIL_PANE} ${de('btn-save')}`);
    const $effectiveDate = find(DETAIL_PANE_EFFECTIVE_DATE);
    assert.equal(getText(DETAIL_PANE_TITLE), '(E845.9) Accident involving spacecraft injuring other person', 'The title is correct when editing a health concern');
    assert.ok(isHidden(find(`${DETAIL_PANE} ${de('btn-save-add-another')}`)), 'The save & add another button is hidden');
    assert.notOk(isHidden($saveButton), 'The save button is visible');
    assert.notOk(isHidden(find(`${DETAIL_PANE} ${de('btn-delete')}`)), 'The delete button is visible');
    assert.equal($effectiveDate.val(), '6/12/2017', 'The effective date is rendered correctly on edit');
    fillIn($effectiveDate, EFFECTIVE_DATE);
    await click($saveButton);
    assert.ok(putCalled, 'PUT was called on save');
    assert.notOk(find(DETAIL_PANE).length, 'The detail pane disappears after clicking save');
});

test('Delete allergy & diagnosis removes health concern', async assert => {
    server.get('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/patientHealthConcerns', () => MULTIPLE_HEALTH_CONCERNS);
    server.get('ClinicalEndpoint/api/v3/patients/:id/allergies', ({ db }) => {
        const [allergies] = db.patientAllergies;
        allergies.patientAllergies.setEach('patientPracticeGuid', PATIENT_PRACTICE_GUID);
        return allergies;
    });
    server.delete('ClinicalEndpoint/api/v3/patients/:patientPracticeGuid/allergies/:id', () => {});
    server.delete('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/diagnoses/:guid', () => {});
    server.get('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/diagnoses/:diagnosisGuid', ({ db }, request) => {
        return {
            diagnosisGuid: request.params.diagnosisGuid
        };
    });
    await visit(`/PF/charts/patients/${PATIENT_PRACTICE_GUID}/summary`);
    const list = '.patient-health-concerns-list';
    const item = `${list} ul.list li`;
    const itemTitle = `${item} ${de('health-concern-title')}`;
    const allergyItem = `${itemTitle}:contains('AA&C')`;
    const diagnosisItem = `${itemTitle}:contains('(E845.9) Accident involving spacecraft injuring other person')`;
    assert.throws(findWithAssert(allergyItem), 'The allergy health concern is present before deleting the allergy');
    assert.throws(findWithAssert(diagnosisItem), 'The diagnosis health concern is present before deleting the diagnosis');
    click(de('active-allergy-1'));
    click(`.allergy-details ${de('btn-delete')}`);
    await click(`.allergy-details .confirm-dialog-content ${de('confirm-dialog-confirm')}`);
    assert.notOk(find(allergyItem).length, 'The allergy health concern is no longer present after deleting the allergy');
    click(`${de('diagnosis-item-text')}:contains('Victim of spacecraft accident')`);
    click('.diagnosis-detail--footer button:contains("Delete")');
    await click('.ember-tether.popover .btn-primary');
    assert.notOk(find(diagnosisItem).length, 'The diagnosis health concern is no longer present after deleting the diagnosis');
});

test('Print health concerns', async assert => {
    let printAuditCalled = false;
    server.get('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/patientHealthConcerns', () => MULTIPLE_HEALTH_CONCERNS);
    server.get('ClinicalEndpoint/api/v3/patients/:id/allergies', ({ db }) => {
        const [allergies] = db.patientAllergies;
        allergies.patientAllergies.setEach('patientPracticeGuid', PATIENT_PRACTICE_GUID);
        return allergies;
    });
    server.post('ChartingEndpoint/api/v2/PrintAudit', () => {
        printAuditCalled = true;
        return null;
    });
    await visit(`/PF/charts/patients/${PATIENT_PRACTICE_GUID}/summary`);
    click(de('print-health-concerns-button'));
    await click(`${de('print-health-concerns')} .dropdown-menu li:eq(0) a`);
    const PRINT_CONTENT = de('print-health-concerns-content');
    assert.ok(printAuditCalled, 'The print audit endpoint was called');
    assert.equal(getPrintText('head title'), 'Health concerns - Patient: Cade Baby DOB: 02/05/2013 PRN: BC251057', 'The print preview has the correct header');
    assert.equal(getPrintText(de('print-header-patient-name')), 'Cade Baby', 'The patient name renders correctly on the print preview');
    assert.equal(getPrintText(de('print-header-facility-name')), 'Rosalise Ron Practice', 'The facility name renders correctly on the print preview');

    assert.ok(find(`${PRINT_CONTENT} h2:contains('Active health concerns')`).length, 'There is an Active health concerns header');
    assert.ok(find(`${PRINT_CONTENT} h2:contains('Inactive health concerns')`).length, 'There is a Inactive health concerns header');

    assert.equal(find(`${PRINT_CONTENT} .row.header-row:contains('Description')`).length, 2, 'There is a sig column under active and inactive health concerns');
    assert.equal(find(`${PRINT_CONTENT} .row.header-row:contains('Effective Date')`).length, 2, 'There is a start/stop date column under active and inactive health concerns');

    assert.equal(find(`${de('health-concern-item-title')}:eq(0)`).text().trim(), '(E845.9) Accident involving spacecraft injuring other person', 'The active health concern title renders correctly');
    assert.equal(find(`${de('health-concern-item-date')}:eq(0)`).text().trim(), '06/12/2017', 'The active health concern date renders correctly');

    assert.equal(find(`${de('health-concern-item-title')}:eq(2)`).text().trim(), 'Accu-Chek Compact Plus Care Kit W/CARRYING CASE, W/CONTROL SOLUTION(S), W/LANCET(S), W/METER, W/TEST DRUM', 'The inactive health concern title renders correctly');
    assert.equal(find(`${de('health-concern-item-date')}:eq(2)`).text().trim(), '06/12/2015', 'The inactive health concern date renders correctly.');

    click('.close-link');
});
