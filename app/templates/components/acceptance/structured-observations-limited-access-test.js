import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';

const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const NEW_TRANSCRIPT_GUID = '9ccee99e-1396-474b-8fc7-bbaf84bec7c9';
const NEW_ENCOUNTER_URL = `/PF/charts/patients/${PATIENT_GUID}/encounter/${NEW_TRANSCRIPT_GUID}`;
const RECORD_BTN = '#observations .heading a';

moduleForAcceptanceAuth('Acceptance - Core - Charting | Structured Functional and Cognitive Observations limited access', {
    beforeLogin() {
        server.get('AuthzEndpoint/api/v1/users/:id/rights', () => ({
            entitledFeatures: ['ERX.Send', 'Chart.Sign', 'EPCS.Send']
        }));
    }
});

test('Observations in limited access', async assert => {
    server.get('ChartingEndpoint/api/v2/EncounterEventType/', ({ db }) => db.structuredFunctionalObservations[0]);
    await visit(NEW_ENCOUNTER_URL);
    assert.dom(RECORD_BTN).doesNotExist('Record button is removed');
    await click(de('observation-description'));
    assert.dom('.observation-date input').isDisabled('observation date picker is disabled');
    assert.dom('.observation-detail' + de('btn-delete')).doesNotExist('delete button is removed');
    assert.dom('.observation-detail' + de('btn-save')).doesNotExist('save button is removed');
});
