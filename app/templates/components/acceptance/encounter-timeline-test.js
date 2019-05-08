import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';
import getText from 'boot/tests/helpers/get-text';
import config from 'boot/config';
import { freezeDateAt, unfreezeDate } from 'ember-mockdate-shim';

const UNSIGNED_ENCOUNTER_GUID = '562d5f03-61e5-46cc-a72c-32902c474be0';
const SIGNED_ENCOUNTER_GUID = '82a597e5-b1b8-46e4-8a07-5c3a4f778e95';
const PATIENT_PRACTICE_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const TIMELINE_URL = `/PF/charts/patients/${PATIENT_PRACTICE_GUID}/timeline/encounter`;
const dg = guid => `[data-guid=${guid}]`;
const SIGNED_ENCOUNTER = dg(SIGNED_ENCOUNTER_GUID);

moduleForAcceptanceAuth('Acceptance - Visual - Core - Charting | Encounter timeline', {
    beforeEach() {
        freezeDateAt(new Date(config.visualDiffFrozenDate));
    },
    afterEach() {
        unfreezeDate();
    }
});

test('Visit encounter timeline', async assert => {
    let serviceCallCount = 0;
    server.get('ChartingEndpoint/api/v2/EncounterSummary', ({ db }) => {
        serviceCallCount++;
        return db.encounterSummaries;
    });
    await visit(TIMELINE_URL);
    const UNSIGNED_ENCOUNTER = dg(UNSIGNED_ENCOUNTER_GUID);
    const TYPE_DROPDOWN = de('timeline-type-filter');
    const TYPE_DROPDOWN_BUTTON = `${TYPE_DROPDOWN} .ember-select-choice`;
    const encounterFilter = `${TYPE_DROPDOWN} .dropdown-menu li:contains("Encounters")`;
    percySnapshot(assert);
    assert.equal(find(`${UNSIGNED_ENCOUNTER} ${de('encounter-type')}`).text(), 'Office Visit', 'The encounter type is rendered correctly');
    assert.equal(getText(`${UNSIGNED_ENCOUNTER} ${de('encounter-seen-by')}`), 'Provider Bob MD', 'The seen by provider name is rendered correctly');
    assert.equal(getText(`${UNSIGNED_ENCOUNTER} .encounter-cc`), 'CC: No chief complaint recorded', 'The chief complaint is rendered correctly');
    assert.equal(find(`${UNSIGNED_ENCOUNTER} ${de('encounter-note-type')}`).text(), 'SOAP Note', 'The note type is rendered correctly');
    assert.equal(find(`${UNSIGNED_ENCOUNTER} ${de('encounter-date')}`).text(), '01/19/2016', 'The encounter date of service is rendered correctly');
    assert.equal(find(`${SIGNED_ENCOUNTER} .encounter-status`).text(), 'Signed', 'A signed encounter has a status of "signed"');
    assert.equal(getText(`${SIGNED_ENCOUNTER} ${de('encounter-seen-by')}`), 'George Bush', 'The seen by provider name is rendered correctly for a snapshotted encounter');
    assert.throws(findWithAssert(de('timeline-timestamp')), 'The last refreshed time is present');

    await click(de('refresh-button'));
    assert.equal(serviceCallCount, 2, 'The data was refreshed when the refresh button was clicked');
    await click(TYPE_DROPDOWN_BUTTON);
    assert.throws(findWithAssert(encounterFilter), 'The encounters type filter is present');
    assert.throws(findWithAssert(`${TYPE_DROPDOWN} .dropdown-menu li:contains("Lab orders")`), 'The lab orders type filter is present');
    await click(`${TYPE_DROPDOWN} .dropdown-menu li:contains("Lab results")`);
    assert.ok(find('.row-event').length, 'Labs data is present when clicking the lab orders filter');
});

test('Clicking an encounter item opens the encounter', async assert => {
    await visit(TIMELINE_URL);
    await click(SIGNED_ENCOUNTER);
    assert.equal(currentURL(), `/PF/charts/patients/${PATIENT_PRACTICE_GUID}/encounter/${SIGNED_ENCOUNTER_GUID}`, 'Clicking on an encounter item opened the encounter');
});

test('Create new encounter from timeline', async assert => {
    let postCallCount = 0;
    server.post('ChartingEndpoint/api/v3/patients/:patientPracticeGuid/encounters', ({ db }, request) => {
        postCallCount++;
        const data = JSON.parse(request.requestBody);
        data.transcriptGuid = `UNSIGNED_TRANSCRIPT_GUID_${postCallCount}`;
        data.seenByProviderGuid = 'eaa90f53-9dfa-4c2a-93db-83f3b3243d5b';
        if (postCallCount === 1) {
            assert.equal(data.chartNoteTypeId, 0, 'The encounter was created with the correct note type');
        } else if (postCallCount === 2) {
            assert.equal(data.chartNoteTypeId, 2, 'The encounter was created with the correct note type');
        }
        return data;
    });
    await visit(TIMELINE_URL);
    const NEW_ENCOUNTER_BUTTON = '.btn-new-encounter';
    const NEW_ENCOUNTER_URL = `/PF/charts/patients/${PATIENT_PRACTICE_GUID}/encounter/UNSIGNED_TRANSCRIPT_GUID`;
    assert.throws(findWithAssert(NEW_ENCOUNTER_BUTTON), 'The new encounter button exists');
    assert.throws(findWithAssert(`${NEW_ENCOUNTER_BUTTON} .dropdown-menu li:contains('SOAP Note')`), 'SOAP Note is found in the new encounter dropdown');
    assert.throws(findWithAssert(`${NEW_ENCOUNTER_BUTTON} .dropdown-menu li:contains('Nutritionist Notes')`), 'Nutritionist Notes is found in the new encounter dropdown');
    assert.throws(findWithAssert(`${NEW_ENCOUNTER_BUTTON} .dropdown-menu li:contains('Patient Phone Message')`), 'Patient Phone Message is found in the new encounter dropdown');

    await click(`${NEW_ENCOUNTER_BUTTON} ${de('new-soap-note')}`);
    assert.equal(currentURL(), `${NEW_ENCOUNTER_URL}_1`, 'Clicking on new soap note opened the new encounter');
    await click('.left-nav ul.nav-tabs li a:contains("Timeline")');
    await click(`${NEW_ENCOUNTER_BUTTON} .dropdown-menu li a:contains('Patient Phone Message')`);
    assert.equal(currentURL(), `${NEW_ENCOUNTER_URL}_2`, 'Clicking on Patient Phone Message opened the new encounter');
});
