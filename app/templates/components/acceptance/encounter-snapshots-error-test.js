import { isArray } from '@ember/array';
import { resolve } from 'rsvp';
import Ember from 'ember';
import { test } from 'qunit';
import Mirage from 'ember-cli-mirage';
import sinon from 'sinon';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';
import getText from 'boot/tests/helpers/get-text';

const TRANSCRIPT_GUID = '82a597e5-b1b8-46e4-8a07-5c3a4f778e95';
const PATIENT_PRACTICE_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const TRANSCRIPT_LABEL = '01/05/16 (SOAP Note)';
const ENCOUNTER_URL = `/PF/charts/patients/${PATIENT_PRACTICE_GUID}/encounter/${TRANSCRIPT_GUID}`;
const PRINT_MODAL_BUTTON = '.print-chart .content-modal footer .btn-primary';
let emberError;
let toastrStub;

moduleForAcceptanceAuth('Acceptance - Core - Charting | Encounter snapshots errors - v2', {
    // We don't want to fail the test when the 500 is returned from the snapshots endpoints
    // https://github.com/emberjs/ember.js/issues/12791#issuecomment-218561153
    beforeEach() {
        emberError = Ember.onerror;
        Ember.onerror = arg => {
            if (arg && arg.errors && arg.errors[0] && arg.errors[0].status === '500') {
                return null;
            }
            throw arg;
        };
        toastrStub = sinon.stub(window.toastr, 'error').returns(resolve({diagnoses: [], medications: []}));
    },
    afterEach() {
        Ember.onerror = emberError;
        window.toastr.error.restore();
    }
});

async function checkEncounter(label) {
    const selector = `label:contains("${label}")`;
    if (find('.open.ember-tether .checkbox-dropdown-grouping.dropdown-menu').length) {
        return click(selector);
    }
    await click(`${de('print-chart-notes-dropdown')} .dropdown-toggle`);
    return click(selector);
}

test('Encounter fails to load if practice snapshot endpoint fails', async assert => {
    server.get('ChartingEndpoint/api/v1/snapshots', () => new Mirage.Response(500, {}, null));

    await visit(ENCOUNTER_URL);
    assert.equal(currentURL(), `/PF/charts/patients/${PATIENT_PRACTICE_GUID}/summary`, 'The encounter failed to load, so the summary was loaded');
    assert.equal(toastrStub.args[0], 'Unable to load chart', 'The "Unable to load chart" toaster was displayed');
    click(de('quick-preview-icon'));
    await click(`.patient-previews .preview-list-pane .slc-row[data-guid="${TRANSCRIPT_GUID}"]`);
    assert.equal(getText(de('preview-error-message')), 'Error loading encounter preview', 'The encounter preview fails to load if the snapshot call fails');
    click(de('preview-footer-close'));
    click(de('btn-print-chart-control-bar'));
    click(de('print-modal-select-none'));
    await checkEncounter('01/19/16 (SOAP Note)');
    await checkEncounter(TRANSCRIPT_LABEL);
    await click(PRINT_MODAL_BUTTON);
    assert.equal(toastrStub.getCall(1).args[0], `Failed to load encounter: ${TRANSCRIPT_LABEL}`, 'The "Failed to load encounter" toaster was displayed');
});

test('Encounter print fails if patient snapshot endpoint fails', async assert => {
    server.get('ChartingEndpoint/api/v1/snapshots/patients/:patientPracticeGuid', () => new Mirage.Response(500, {}, null));

    await visit(ENCOUNTER_URL);
    click(de('print-encounter-button'));
    click(de('print-modal-select-none'));
    click('.checkbox-row:contains("Chief complaint") input');
    await click(PRINT_MODAL_BUTTON);
    let toastrArg = toastrStub.args[0];
    if (isArray(toastrArg) && toastrArg[0] === 'Unable to load cds alerts') {
        toastrArg = toastrStub.getCall(1).args[0];
    }
    assert.equal(toastrArg, 'Error loading print preview', 'The "Error loading print preview" toaster was displayed');
});
