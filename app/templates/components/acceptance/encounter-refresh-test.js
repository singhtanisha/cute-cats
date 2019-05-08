import { test } from 'qunit';
import de from 'boot/tests/helpers/data-element';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import { run } from '@ember/runloop';

const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const TRANSCRIPT_GUID = '82a597e5-b1b8-46e4-8a07-5c3a4f778e95';
const ENCOUNTER_URL = `/PF/charts/patients/${PATIENT_GUID}/encounter/${TRANSCRIPT_GUID}`;
const REFRESH_BTN = '.refresh-button';
const ACTIONS_MENU_REFRESH_CHART = `${de('actions-menu-options')} a:contains('Refresh patient chart')`;

moduleForAcceptanceAuth('Acceptance - Core - Charting | Encounter refresh');

test('Can refresh encounter under actions and when clicking the refresh icon', async function (assert) {
    await visit(ENCOUNTER_URL);
    let hasCalledPatientAggregate = false;
    let hasCalledGetEncounter = false;
    let hasCalledGetTranscriptDocument = false;
    let hasCalledGetAllergies = false;
    let hasCalledGetPhrEnrollments = false;
    let hasCalledGetPatientRibbonInfo = false;
    let hasCalledGetPersonalMedicalHistory = false;
    let hasCalledGetAdditionalVitals = false;
    let hasCalledGetVitals = false;
    let hasCalledGetSuperbills = false;
    let hasCalledGetAmendments = false;
    let hasCalledReferralEndpoint = false;
    let hasCalledGetGoals = false;
    let hasCalledGetHealthConcerns = false;

    // Bust cache for various encounter models to make sure we make the appropriate service calls
    const store = this.application.__container__.lookup('service:store');
    run(() => {
        store.unloadAll('encounter-addendum');
        store.unloadAll('encounter-vital');
        store.unloadAll('encounter-vital-set');
    });

    server.get('ClinicalEndpoint/api/v1/patients/:id/aggregate', ({ db }, request) => {
        hasCalledPatientAggregate = true;
        return db.patientAggregates.find(request.params.id);
    });
    server.get('ChartingEndpoint/api/v3/patients/:id/encounters/:chartid', ({ db }, request) => {
        const transcriptGuid = request.params.chartid;
        hasCalledGetEncounter = true;
        return db.encounters.where({ transcriptGuid })[0];
    });
    server.get('ChartingEndpoint/api/v2/TranscriptDocument/:chartid', ({ db }, request) => {
        const transcriptGuid = request.params.chartid;
        hasCalledGetTranscriptDocument = true;
        return db.transcriptDocuments.where({ transcriptGuid })[0].document;
    });
    server.get('ClinicalEndpoint/api/v3/patients/:id/allergies', () => {
        hasCalledGetAllergies = true;
        return { patientAllergies: [] };
    });
    server.get('PatientEndpoint/api/v1/patients/:id/phr_enrollments', ({ db }, request) => {
        const patientPracticeGuid = request.params.id;
        hasCalledGetPhrEnrollments = true;
        return db.phrEnrollments.find(patientPracticeGuid);
    });
    server.get('PatientEndpoint/api/v1/patients/:id/patientRibbonInfo', ({ db }, request) => {
        const patientPracticeGuid = request.params.id;
        hasCalledGetPatientRibbonInfo = true;
        return db.patientRibbonInfos.where({ patientPracticeGuid })[0];
    });
    server.get('ClinicalEndpoint/api/v2/PersonalMedicalHistory/:id', ({ db }, request) => {
        const patientPracticeGuid = request.params.id;
        hasCalledGetPersonalMedicalHistory = true;
        return db.personalMedicalHistories.where({ patientPracticeGuid })[0];
    });
    server.get('FlowsheetEndpoint/api/v1/patients/:id/transcripts/:chartid/additionalVitals', ({ db }, request) => {
        const transcriptGuid = request.params.chartid;
        const flowsheetVitals = db.flowsheetAdditionalVitals.where({ transcriptGuid });

        hasCalledGetAdditionalVitals = true;

        if (flowsheetVitals.length > 0) {
            return flowsheetVitals[0].vitals;
        }
    });
    server.get('ChartingEndpoint/api/v3/patients/:id/encounters/:chartid/vitals', ({ db }) => {
        hasCalledGetVitals = true;
        return db.vitals;
    });
    server.get('BillingEndpoint/api/v3/Superbills', ({ db }, request) => {
        hasCalledGetSuperbills = true;
        return db.encounterSuperbills.where({ transcriptGuid: request.queryParams.transcriptGuid })[0];
    });
    server.get('ReferralEndpoint/api/v2/referral/transcript/:chartid', ({ db }, request) => {
        const transcriptGuid = request.params.chartid;
        hasCalledReferralEndpoint = true;
        return db.referralTranscripts.where({ transcriptGuid })[0].transcript;
    });
    server.get('ChartingEndpoint/api/v3/patients/:id/encounters/:chartid/amendments', ({ db }, request) => {
        const transcriptGuid = request.params.chartid;
        hasCalledGetAmendments = true;
        return db.encounterAmendments.where({ transcriptGuid })[0].amendments;
    });
    server.get('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/patientGoals', () => {
        hasCalledGetGoals = true;
        return { patientGoals: [] };
    });
    server.get('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/patientHealthConcerns', () => {
        hasCalledGetHealthConcerns = true;
        return {
            patientHealthConcerns: [],
            meta: { noKnownHealthConcerns: false }
        };
    });
    await click(REFRESH_BTN);
    assert.ok(hasCalledPatientAggregate, 'Refreshing encounter reloads patient aggregate information from clicking refresh icon.');
    assert.ok(hasCalledGetEncounter, 'Refreshing encounter reloads encounter information from clicking refresh icon.');
    assert.ok(hasCalledGetTranscriptDocument, 'Refreshing encounter reloads transcript document information from clicking refresh icon.');
    assert.ok(hasCalledGetAllergies, 'Refreshing encounter reloads allergy information from clicking refresh icon.');
    assert.ok(hasCalledGetPhrEnrollments, 'Refreshing encounter reloads phr enrollment information from clicking refresh icon.');
    assert.ok(hasCalledGetPatientRibbonInfo, 'Refreshing encounter reloads patient ribbon information from clicking refresh icon.');
    assert.ok(hasCalledGetPersonalMedicalHistory, 'Refreshing encounter reloads personal medical history from clicking refresh icon.');
    assert.ok(hasCalledGetAdditionalVitals, 'Refreshing encounter reloads additional vitals from clicking refresh icon.');
    assert.ok(hasCalledGetVitals, 'Refreshing encounter reloads vitals from clicking refresh icon.');
    assert.ok(hasCalledGetSuperbills, 'Refreshing encounter reloads superbills from clicking refresh icon.');
    assert.ok(hasCalledGetAmendments, 'Refreshing encounter reloads amendments from clicking refresh icon.');
    assert.ok(hasCalledReferralEndpoint, 'Refreshing encounter reloads referrals from clicking refresh icon.');

    // Reset refresh checks for actions -> refresh patient chart
    hasCalledPatientAggregate = false;
    hasCalledGetEncounter = false;
    hasCalledGetTranscriptDocument = false;
    hasCalledGetAllergies = false;
    hasCalledGetPhrEnrollments = false;
    hasCalledGetPatientRibbonInfo = false;
    hasCalledGetPersonalMedicalHistory = false;
    hasCalledGetAdditionalVitals = false;
    hasCalledGetVitals = false;
    hasCalledGetSuperbills = false;
    hasCalledGetAmendments = false;
    hasCalledReferralEndpoint = false;

    // Bust cache again for various encounter models to make sure we make the appropriate service calls
    run(() => {
        store.unloadAll('encounter-addendum');
        store.unloadAll('encounter-vital');
        store.unloadAll('encounter-vital-set');
    });
    await click(de('actions-menu'));
    await click(ACTIONS_MENU_REFRESH_CHART);
    assert.ok(hasCalledPatientAggregate, 'Refreshing encounter reloads patient aggregate information from refreshing patient chart under actions.');
    assert.ok(hasCalledGetEncounter, 'Refreshing encounter reloads encounter information from refreshing patient chart under actions.');
    assert.ok(hasCalledGetTranscriptDocument, 'Refreshing encounter reloads transcript document information from refreshing patient chart under actions.');
    assert.ok(hasCalledGetAllergies, 'Refreshing encounter reloads allergy information from refreshing patient chart under actions.');
    assert.ok(hasCalledGetPhrEnrollments, 'Refreshing encounter reloads phr enrollment information from refreshing patient chart under actions.');
    assert.ok(hasCalledGetPatientRibbonInfo, 'Refreshing encounter reloads patient ribbon information from refreshing patient chart under actions.');
    assert.ok(hasCalledGetPersonalMedicalHistory, 'Refreshing encounter reloads personal medical history from refreshing patient chart under actions.');
    assert.ok(hasCalledGetAdditionalVitals, 'Refreshing encounter reloads additional vitals from refreshing patient chart under actions.');
    assert.ok(hasCalledGetVitals, 'Refreshing encounter reloads vitals from refreshing patient chart under actions.');
    assert.ok(hasCalledGetSuperbills, 'Refreshing encounter reloads superbills from refreshing patient chart under actions.');
    assert.ok(hasCalledGetAmendments, 'Refreshing encounter reloads amendments from refreshing patient chart under actions.');
    assert.ok(hasCalledReferralEndpoint, 'Refreshing encounter reloads referrals from refreshing patient chart under actions.');
    assert.ok(hasCalledGetGoals, 'Refreshing encounter reloads patient goals from refreshing patient chart under actions.');
    assert.ok(hasCalledGetHealthConcerns, 'Refreshing encounter reloads health concerns from refreshing patient chart under actions.');
});
