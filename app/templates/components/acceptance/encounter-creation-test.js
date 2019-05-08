import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';
import Mirage from 'ember-cli-mirage';

const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const SUMMARY_URL = '/PF/charts/patients/' + PATIENT_GUID + '/summary';

moduleForAcceptanceAuth('Acceptance - Visual - Core - Charting | Create encounter from summary - v2');

test('Encounter - Create From Summary with Proper Date', async assert => {
    const currentDate = moment().startOf('day').format('MM/DD/YYYY');
    let dateOfService;
    server.post('ChartingEndpoint/api/v3/patients/:patientPracticeGuid/encounters', ({ db }, request) => {
        const data = JSON.parse(request.requestBody);
        data.transcriptGuid = 'NEW_TRANSCRIPT_GUID';
        dateOfService = data.dateOfServiceUtc;
        return data;
    });
    server.put('/ChartingEndpoint/api/v3/patients/:patientPracticeGuid/encounters/NEW_TRANSCRIPT_GUID/autosave', () => new Mirage.Response(204, {}));
    server.put('ChartingEndpoint/api/v3/patients/:patientPracticeGuid/encounters/NEW_TRANSCRIPT_GUID', ({ db }, request) => {
        const data = JSON.parse(request.requestBody);
        return data;
    });
    await visit(SUMMARY_URL);
    await click(de('new-soap-note'));
    const formattedDateOfService = moment.utc(dateOfService).format('MM/DD/YYYY');
    assert.equal(formattedDateOfService, currentDate, 'Encounter date sent to service is current date.');
    assert.equal(find('.encounter-tab .menu-label').text().trim(), formattedDateOfService, 'Encounter date renders current date from service properly on tab.');
    await fillIn(de('encounter-details-date') + ' input', '11/11/2016');
    await click('.btn-save-encounter');
    percySnapshot(assert);
    assert.equal(find('.encounter-tab .menu-label').text().trim(), '11/11/2016', 'Updated encounter date renders properly on tab.');
});
