import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';

const PATIENT_PRACTICE_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const SUMMARY_URL = `/PF/charts/patients/${PATIENT_PRACTICE_GUID}/summary`;
const SUMMARY_TAB = `[data-tracking='Summary']`;
const FIRST_SIGNED_ENCOUNTER_TAB = `[data-tracking='01/05/2016']:eq(0)`;
const SECOND_SIGNED_ENCOUNTER_TAB = `[data-tracking='01/05/2016']:eq(1)`;
const FIRST_ENCOUNTER_LINK = de('encounter-item-0');
const SECOND_ENCOUNTER_LINK = de('encounter-item-1');
const SEEN_BY_ELEMENT = `${de('encounter-details-seen-by')}:first`;
const FACILITY_ELEMENT = `${de('encounter-details-facility')}:first`;

moduleForAcceptanceAuth('Acceptance - Core - Charting | Encounter preview - v2');

test('Tabbing different encounters renders the proper seen by name and facility name', async assert => {
    server.get('ChartingEndpoint/api/v2/EncounterSummary', () => [{
        'transcriptGuid': '82a597e5-b1b8-46e4-8a07-5c3a4f778e95',
        'encounterType': 'Office Visit',
        'dateOfService': '2016-01-05T00:00:00Z',
        'seenByProvider': '',
        'seenByProviderGuid': 'eaa90f53-9dfa-4c2a-93db-83f3b3243d5b',
        'signed': true,
        'noteType': 'SOAP Note',
        'facilityGuid': 'cac98ae6-1add-4780-b923-1df79732add6',
        'createdDateTime': '2016-01-05T21:36:27.400Z',
        'lastModifiedDateTime': '2016-01-06T21:02:23.677Z'
    }, {
        'transcriptGuid': 'SIGNED_TRANSCRIPT_GUID',
        'encounterType': 'Office Visit',
        'dateOfService': '2016-01-05T00:00:00Z',
        'seenByProvider': '',
        'seenByProviderGuid': 'eaa90f53-9dfa-4c2a-93db-83f3b3243d5b',
        'signed': true,
        'noteType': 'SOAP Note',
        'facilityGuid': 'cac98ae6-1add-4780-b923-1df79732add6',
        'createdDateTime': '2016-01-05T21:36:27.397Z',
        'lastModifiedDateTime': '2016-01-06T21:02:23.677Z'
    }]);
    await visit(SUMMARY_URL);
    await click(FIRST_ENCOUNTER_LINK);
    assert.equal(find(SEEN_BY_ELEMENT).text(), 'George Bush M.D.', 'First encounter seen by snapshot renders properly after loading from summary');
    assert.equal(find(FACILITY_ELEMENT).text(), 'Snapshot Building', 'First encounter facility snapshot renders properly after loading from summary');
    await click(SUMMARY_TAB);
    await click(SECOND_ENCOUNTER_LINK);
    assert.equal(find(SEEN_BY_ELEMENT).text(), 'William Clinton F.B.I.', 'Second encounter seen by snapshot renders properly after loading from summary');
    assert.equal(find(FACILITY_ELEMENT).text(), 'Above the SuperDuper', 'Second encounter facility snapshot renders properly after loading from summary');
    await click(FIRST_SIGNED_ENCOUNTER_TAB);
    assert.equal(find(SEEN_BY_ELEMENT).text(), 'George Bush M.D.', 'First encounter seen by snapshot renders properly after tabbing');
    assert.equal(find(FACILITY_ELEMENT).text(), 'Snapshot Building', 'First encounter facility snapshot renders properly after tabbing');
    await click(SECOND_SIGNED_ENCOUNTER_TAB);
    assert.equal(find(SEEN_BY_ELEMENT).text(), 'William Clinton F.B.I.', 'Second encounter seen by snapshot renders properly after tabbing');
    assert.equal(find(FACILITY_ELEMENT).text(), 'Above the SuperDuper', 'Second encounter facility snapshot renders properly after tabbing');
});
