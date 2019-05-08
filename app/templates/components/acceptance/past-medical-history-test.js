import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';

const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const SUMMARY_URL = '/PF/charts/patients/' + PATIENT_GUID + '/summary';

moduleForAcceptanceAuth('Acceptance - Core - Charting | Past medical history on patient summary - v2');

test('Can add, edit, clear out and print past medical history on patient summary', async assert => {
    let callCount = 0;
    server.put('/ClinicalEndpoint/api/v2/PersonalMedicalHistory/:id', ({ db }, request) => {
        callCount++;
        const history = JSON.parse(request.requestBody);
        switch (callCount) {
        case callCount === 1:
            assert.equal(history.patientPracticeGuid, PATIENT_GUID, 'The patient practice guid is correctly sent to the request.');
            assert.equal(history.events, 'This is a major event.', 'The major event text is correctly sent to the request.');
            break;
        case callCount === 2:
            assert.equal(history.developmentalHistory, 'This is developmental history.', 'The developmental history text is correctly sent to the request.');
            break;
        case callCount === 3:
            assert.equal(history.ongoingMedicalProblems, 'This is an ongoing medical problem.', 'The ongoing medical problem text is correctly sent to the request.');
            break;
        case callCount === 4:
            assert.equal(history.preventativeCare, 'This is preventative care.', 'The preventative care text is correctly sent to the request.');
            break;
        case callCount === 5:
            assert.equal(history.ongoingMedicalProblems, 'This is edited ongoing medical problem.', 'Edited ongoing medical problem gets sent properly to request.');
            break;
        default:
            break;
        }
        return history;
    });
    server.post('/ChartingEndpoint/api/v2/PrintAudit', () => {
        assert.ok('Print audit count was called properly.');
        return {};
    });
    await visit(SUMMARY_URL);
    // add button for empty sub-sections
    assert.dom(`${de('events-section')} ${de('past-medical-history-field-add-button')}`).exists('Add button exists when major events is empty.');
    assert.dom(`${de('ongoingMedicalProblems-section')} ${de('past-medical-history-field-add-button')}`).exists('Add button exists when ongoing medical problems is empty.');
    assert.dom(`${de('preventativeCare-section')} ${de('past-medical-history-field-add-button')}`).exists('Add button exists when preventive care is empty.');
    assert.dom(`${de('developmentalHistory-section')} ${de('past-medical-history-field-add-button')}`).exists('Add button exists when developmental history is empty.');
    // placeholder text for sub-sections
    assert.dom(`${de('events-section')} ${de('past-medical-history-placeholder-text')}`).hasText('No major events recorded', 'Empty state for major events renders properly.');
    assert.dom(`${de('ongoingMedicalProblems-section')} ${de('past-medical-history-placeholder-text')}`).hasText('No ongoing medical problems recorded', 'Empty state for ongoing medical problems renders properly.');
    assert.dom(`${de('preventativeCare-section')} ${de('past-medical-history-placeholder-text')}`).hasText('No preventive care recorded', 'Empty state for preventive care renders properly.');
    assert.dom(`${de('developmentalHistory-section')} ${de('past-medical-history-placeholder-text')}`).hasText('No developmental history recorded', 'Empty state for developmental history renders properly.');
    // changes in new design
    assert.dom(de('past-medical-history-placeholder-message')).hasClass('hidden', 'Empty state for past medical history renders properly.');
    assert.dom(de('pmh-pencil-button')).doesNotExist('pencil button does not exist');
    // add major events
    await click(`${de('events-section')} ${de('past-medical-history-field-add-button')}`);
    assert.dom('h15.header15').hasText('Major events > Record', 'Major events detail pane header renders properly');
    assert.dom(`${de('events-detail')} .field-label`).hasText('Major events', 'Major events detail pane label renders properly');
    assert.dom(de('btn-past-medical-history-delete')).hasClass('hidden', 'Delete button is invisible when there is no content in text area');
    await fillIn(`${de('events-detail')} ${de('text-area-counter')}`, 'This is a major event.');
    assert.dom(de('btn-past-medical-history-delete')).doesNotHaveClass('hidden', 'Delete button is visible when there is some content in text area');
    await click(de('btn-past-medical-history-save'));
    assert.dom(`${de('events-section')} ${de('past-medical-history-field-item-0')}`).hasText('This is a major event.', 'Major events renders properly on summary');
    assert.dom(`${de('events-section')} ${de('past-medical-history-field-add-button')}`).doesNotExist('Add button does not exist when major events has record.');
    await click(`${de('events-section')} ${de('past-medical-history-field-item-0')}`);
    assert.dom(`${de('events-detail')} ${de('text-area-counter')}`).hasValue('This is a major event.', 'Record renders properly');
    await fillIn(`${de('events-detail')} ${de('text-area-counter')}`, 'Some changes');
    // cancel major events update
    await click(de('btn-past-medical-history-cancel'));
    assert.dom(`${de('events-section')} ${de('past-medical-history-field-item-0')}`).hasText('This is a major event.', 'Cancel changes works properly');
    // add ongoing medical problem
    await click(`${de('ongoingMedicalProblems-section')} ${de('past-medical-history-field-add-button')}`);
    await fillIn(`${de('ongoingMedicalProblems-detail')} ${de('text-area-counter')}`, 'This is an ongoing medical problem.');
    await click(de('btn-past-medical-history-save'));
    // add preventative care
    await click(`${de('preventativeCare-section')} ${de('past-medical-history-field-add-button')}`);
    await fillIn(`${de('preventativeCare-detail')} ${de('text-area-counter')}`, 'This is preventative care.');
    await click(de('btn-past-medical-history-save'));
    // add developmental history
    await click(`${de('developmentalHistory-section')} ${de('past-medical-history-field-add-button')}`);
    await fillIn(`${de('developmentalHistory-detail')} ${de('text-area-counter')}`, 'This is developmental history.');
    await click(de('btn-past-medical-history-save'));
    // cancel works correct
    await click(`${de('preventativeCare-section')} ${de('past-medical-history-field-item-0')}`);
    await click('.close-box');
    // update ongoing medical problems
    await click(`${de('ongoingMedicalProblems-section')} ${de('past-medical-history-field-item-0')}`);
    await fillIn(`${de('ongoingMedicalProblems-detail')} ${de('text-area-counter')}`, 'This is edited ongoing medical problem.');
    await click(de('btn-past-medical-history-save'));
    // print pmh
    await click(de('print-pmh-button'));
    assert.dom(de('print-past-medical-history-field-value-0')).hasText('This is a major event.', 'Major event renders properly on print.');
    click('#print-modal-controls .close-link');
});
