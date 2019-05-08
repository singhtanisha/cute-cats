import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';

const ENCOUNTER_GUID = '7022d94f-d70a-4722-a205-dac898cf9f69';
const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';

moduleForAcceptanceAuth('Acceptance - Core - Charting | CDS alert linking');

// Deep links mean action attributes.
test('Cds Alerts with with deep links contain data-ember-action attribtues', async assert => {
    await visit('/PF/charts/patients/' + PATIENT_GUID + '/encounter/' + ENCOUNTER_GUID);
    const vaccineLink = find('a:contains("Add vaccine")');

    assert.ok(typeof vaccineLink.attr('data-ember-action') !== 'undefined', 'action attribute exists');
});
