import Mirage from 'ember-cli-mirage';
import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';

const ENCOUNTER_GUID = '7022d94f-d70a-4722-a205-dac898cf9f69';
const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const NEW_SMOKING_STATUS_DATE = '05/01/2016';
const EDIT_SMOKING_STATUS_DATE = '05/09/2016';
const NEW_STATUS_ID = 'SMOKING_GUID';

moduleForAcceptanceAuth('Acceptance - Core - Charting | Encounter smoking status', {
});

test('Empty smoking status renders properly', async assert => {
    server.get('ClinicalEndpoint/api/v2/patients/:id/smokingstatuses', () => ({ patientSmokingStatuses: [] }));
    await visit('/PF/charts/patients/' + PATIENT_GUID + '/encounter/' + ENCOUNTER_GUID);
    assert.ok(find('.smoking-status-container').text().toLowerCase().indexOf('no smoking status recorded') > -1, 'Empty smoking status renders properly');
});

test('Can add, update and remove smoking status', async assert => {
    // Use Mirage to stub calls
    server.post('ClinicalEndpoint/api/v2/patients/:id/smokingstatuses', ({ db }, request) => {
        const data = JSON.parse(request.requestBody);
        assert.equal(data.description, 'Non-smoker', 'Smoking status was added with the selected status');
        assert.equal(data.effectiveDate, NEW_SMOKING_STATUS_DATE, 'Smoking status was added with the chosen effective date');
        assert.notOk(data.patientSmokingStatusGuid, 'The smoking status did not already have an id prior to adding');
        data.patientSmokingStatusGuid = NEW_STATUS_ID;
        return { patientSmokingStatus: data };
    });
    server.put('ClinicalEndpoint/api/v2/patients/:patientPracticeGuid/smokingstatuses/:id', ({ db }, request) => {
        const data = JSON.parse(request.requestBody);
        assert.equal(data.description, 'Ex-smoker', 'Smoking status was updated with the selected status');
        assert.equal(data.effectiveDate, EDIT_SMOKING_STATUS_DATE, 'Smoking status effective date was updated');
        assert.equal(request.params.id, NEW_STATUS_ID, 'Smoking status id matches existing status during edit');
        return new Mirage.Response(204, {}, null);
    });
    server.del('ClinicalEndpoint/api/v2/patients/:patientPracticeGuid/smokingstatuses/:id', ({ db }, request) => {
        assert.equal(request.params.id, NEW_STATUS_ID, 'Smoking status with the proper Id is deleted');
        return new Mirage.Response(204, {}, null);
    });
    server.get('ClinicalEndpoint/api/v2/patients/:id/smokingstatuses', () => ({ patientSmokingStatuses: [] }));

    await visit('/PF/charts/patients/' + PATIENT_GUID + '/encounter/' + ENCOUNTER_GUID);
    const startingStatusCount = find(`${de('smoking-status-container')} ${de('smoking-status-item')}`).length;
    const statusItemSelector = `${de('smoking-status-container')} ${de('smoking-status-item')}`;

    assert.expect(14);
    assert.equal(find(de('smoking-status-header')).length, 1, 'The smoking status is rendered on the page');
    await click(`${de('smoking-status-header')} .btn.heading-action:first`);
    // validate recording a new smoking status
    assert.dom('.right-module h15').hasText('Tobacco use > Record', 'Tobacco use detail panel appears when recording new status');
    click(`${de('smoking-option-0')}`);
    fillIn(`${de('effective-date')} input`, NEW_SMOKING_STATUS_DATE);
    await click(`${de('save-button')}`);
    // Save is validated by Mirage - check that new status shows up in list
    assert.equal(find(statusItemSelector).length, startingStatusCount + 1, 'New smoking status was added to the list');
    assert.equal(find(statusItemSelector + ':last .smoking-date').text(), NEW_SMOKING_STATUS_DATE, 'New smoking status was added to the list with correct date');

    // validate editing new status
    await click(`${de('smoking-status-container')} ${de('smoking-status-item')}:last`);
    assert.dom('.right-module h15').hasText('Tobacco use > Record', 'Smoking status detail panel appears when editing status');
    click(`${de('smoking-option-1')}`);
    fillIn(`${de('effective-date')} input`, EDIT_SMOKING_STATUS_DATE);
    await click(`${de('save-button')}`);
    // Save is validated by Mirage - check that edited status is updated in list
    assert.equal(find(statusItemSelector + ':last .smoking-date').text(), EDIT_SMOKING_STATUS_DATE, 'Smoking status date was updated in the list');

    // validate deleting the status
    click(`${de('smoking-status-container')} ${de('smoking-status-item')}:last`);
    click('.detail-pane-footer .btn--default:eq(1)');
    await click('.popover-btn-row .confirm-btn');
    assert.equal(find(statusItemSelector).length, startingStatusCount, 'Smoking status was removed from the list');
});
