import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';

const PATIENT_PRACTICE_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';

moduleForAcceptanceAuth('Acceptance - Core - Charting | Summary limited access - v2', {
    beforeEach() {
        server.get('AuthzEndpoint/api/v1/users/:id/rights', () => ({
            entitledFeatures: ['ERX.Send', 'Chart.Sign', 'EPCS.Send']
        }));
    }
});

async function assertSummarySections(assert) {
    // Flowsheets
    assert.dom(de('summary-flowsheet-pencil-button')).doesNotExist('summary flowsheet edit button does not exist');
    // Diagnoses
    assert.dom(de('add-diagnosis-button')).doesNotExist('add diagnosis button does not exist');
    // Social history
    assert.dom(`${de('smoking-status-section')} ${de('social-health-field-add-button')}`).doesNotExist('smoking status add button does not exist');
    assert.dom(`${de('gender-identity-section')} ${de('social-health-field-add-button')}`).doesNotExist('gender identity add button does not exist');
    assert.dom(`${de('sexual-orientation-section')} ${de('social-health-field-add-button')}`).doesNotExist('sexual orientation add button does not exist');
    assert.dom(`${de('social-history-section')} ${de('social-health-field-add-button')}`).doesNotExist('social history pencil button does not exist');
    // Past medical history
    assert.dom(de('pmh-pencil-button')).doesNotExist('past medical history pencil button does not exist');
    // Advance directives
    assert.dom(de('advanced-directive-pencil-button')).doesNotExist('advanced directive pencil button does not exist');
    // Allergies
    assert.dom(de('add-allergy-button')).doesNotExist('add allergy button does not exist');
    // Medications
    assert.dom(de('record-medication')).doesNotExist('record medication button does not exist');
    // Implantable devices
    assert.dom(de('record-device')).doesNotExist('record implantable device button does not exist');
    // Health concerns
    assert.dom(de('add-health-concern-button')).doesNotExist('add health concern button does not exist');
    assert.dom(de('add-health-concern-note-button')).doesNotExist('add health concern note button does not exist');
    // Goals
    assert.dom(de('add-goal-button')).doesNotExist('add goal button does not exist');
    // Messages
    assert.dom(de('add-message-link')).doesNotExist('add messages button does not exist');
    // Family health history
    assert.dom(de('add-family-history-button')).doesNotExist('add family health history button does not exist');
    await click(de('family-health-history-card-list-item'));
    assert.dom(`${de('family-health-history-text-area-container')} ${de('text-area-counter')}`).isDisabled('Family health history text area is disabled');
    assert.dom(de('btn-save-family-health-history')).doesNotExist('User cannot save family health history');
}

function assertWalkMe(assert) {
    assert.dom('.btn-new-encounter').doesNotExist('new encounter button does not exist');
}

function assertImplantableDevices(assert) {
    assert.dom('.device-detail').exists('click device item opens detail pane');
    assert.dom(de('device-active') + '>input').isDisabled('device active checkbox is disabled');
    assert.dom(de('implant-date-txt')).isDisabled('implant date picker is disabled');
    assert.dom('delete-device-button').doesNotExist('delete device button does not exist');
    assert.dom('.device-detail .btn-primary').doesNotExist('save device button does not exist');
}

test('Summary is disabled in limited access mode', async assert => {
    await visit(`/PF/charts/patients/${PATIENT_PRACTICE_GUID}/summary/`);
    await assertSummarySections(assert);
    assertWalkMe(assert);
    await click(de('active-device-0'));
    assertImplantableDevices(assert);
});
