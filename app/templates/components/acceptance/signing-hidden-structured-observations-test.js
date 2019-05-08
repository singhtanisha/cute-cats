import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import { test } from 'qunit';
import de from 'boot/tests/helpers/data-element';

const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const NEW_TRANSCRIPT_GUID = 'ab352z11-45z1-bv21-9fg9-c3246c9f5d14';
const NEW_ENCOUNTER_URL = `/PF/charts/patients/${PATIENT_GUID}/encounter/${NEW_TRANSCRIPT_GUID}`;

moduleForAcceptanceAuth('Acceptance - Core - Charting | Signing hidden observations');

test('Sign confirm modal - show hidden observation section when observation data is present', async assert => {
    server.get('ChartingEndpoint/api/v2/EncounterEventType/', ({ db }) => db.structuredFunctionalObservations[0]);

    visit(NEW_ENCOUNTER_URL);
    await toggleEncounterSections(['Observations'], false);
    assert.dom('#observations').doesNotExist('Observations section is originally hidden');
    await click('.btn-sign');
    assert.dom('#observations').exists('Observation section appears when observation data is present but hidden');
    assert.dom(`${de('hidden-sections-list')} li`).hasText('Observations', '\'Observations\' listed under hidden sections in warning modal');
});
