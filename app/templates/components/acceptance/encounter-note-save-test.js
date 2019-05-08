import Ember from 'ember';
import { test } from 'qunit';
import Mirage from 'ember-cli-mirage';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';

const TRANSCRIPT_GUID = '7022d94f-d70a-4722-a205-dac898cf9f69';
const PATIENT_PRACTICE_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const NOTE_NEXT = '.auto-saving-section .right-module-bottom .save';
const SAVE_ENCOUNTER = '.btn-save-encounter';
const OBJECTIVE_TEXT = 'Test objective text';

let emberError;
moduleForAcceptanceAuth('Acceptance - Core - Charting | Encounter note save', {
    // We don't want to fail the test when the 500 is returned from the autosave endpoint
    // https://github.com/emberjs/ember.js/issues/12791#issuecomment-218561153
    beforeEach() {
        emberError = Ember.onerror;
        Ember.onerror = arg => {
            if (arg && arg.status === 500) {
                return null;
            }
            throw arg;
        };
    },
    afterEach() {
        Ember.onerror = emberError;
    }
});

test('Manual save on encounter functions correctly on autosave failure', async assert => {
    let autosaveCallCount = 0;
    let fullSaveCount = 0;
    server.put('ChartingEndpoint/api/v3/patients/:patientPracticeGuid/encounters/:transcriptGuid/autosave', () => {
        autosaveCallCount++;
        return new Mirage.Response(500, {}, null);
    });

    server.put('ChartingEndpoint/api/v3/patients/:patientPracticeGuid/encounters/:transcriptGuid', ({ db }, request) => {
        fullSaveCount++;
        return JSON.parse(request.requestBody);
    });

    await visit(`/PF/charts/patients/${PATIENT_PRACTICE_GUID}/encounter/${TRANSCRIPT_GUID}`);
    click(de('edit-note-subjective'));
    await click(NOTE_NEXT);
    assert.equal(autosaveCallCount, 0, 'The autosave endpoint was not called because the encounter is not dirty');
    fillInRichText('.auto-saving-section .rich-text-editor', OBJECTIVE_TEXT);
    await click(NOTE_NEXT);
    assert.equal(autosaveCallCount, 1, 'The autosave endpoint was called because the encounter is dirty');
    click(NOTE_NEXT);
    click(NOTE_NEXT);
    await click(SAVE_ENCOUNTER);
    assert.equal(fullSaveCount, 1, 'The full save endpoint was called since the autosave failed');
    await click(SAVE_ENCOUNTER);
    assert.equal(fullSaveCount, 1, 'The encounter was not saved since it is not dirty');
});
