import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';

const PROLIA_PERMANENT_PLACE_LINK = de('prolia-permanent-link');
const CUSTOM_PATIENT_AGGREGATE = {
    id: 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98',
    diagnoses: {
        patientDiagnoses: [{
            diagnosisGuid: 'd3c5451b-ccb5-4770-b98e-054750b369a5',
            patientPracticeGuid: 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98',
            name: 'Diabetes mellitus without mention of complication, type II or unspecified type, not stated as uncontrolled',
            code: '',
            isAcute: false,
            isTerminal: false,
            startDate: '2014-10-05T07:00:00Z',
            stopDate: '2014-10-06T07:00:00Z',
            diagnosisCodes: [],
            isActive: true,
            transcriptDiagnoses: [{
                transcriptGuid: '980e0fb7-1e36-432a-ac8a-9969f38aad92',
                comment: '',
                isActive: true,
                lastModifiedByProviderGuid: '00000000-0000-0000-0000-000000000000',
                lastModifiedAt: '2014-12-16T16:46:31.227Z',
                sortOrder: -10
            }, {
                transcriptGuid: '8c7c7202-f2be-45a0-a528-68eef6722d60',
                comment: '',
                isActive: true,
                lastModifiedByProviderGuid: '00000000-0000-0000-0000-000000000000',
                lastModifiedAt: '2014-10-29T18:36:02.347Z',
                sortOrder: 4
            }]
        }],
        noKnownDiagnoses: false
    },
    medications: {
        patientMedications: [{
            medicationGuid: 'd548134c-278f-4b68-840b-06793b4ea2b8',
            patientPracticeGuid: 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98',
            tradeName: 'Prolia',
            genericName: 'Denosumab',
            rxNormCui: '993458',
            ndc: '55513071001',
            controlledSubstanceSchedule: '',
            sig: {
                dose: null,
                route: 'Subcutaneous',
                frequency: null,
                duration: null,
                professionalDescription: '',
                patientDescription: '',
                searchTerm: null
            },
            doseForm: 'Solution',
            route: 'Subcutaneous',
            productStrength: '60 MG/ML',
            startDateTime: '2017-07-04T07:00:00Z',
            medicationDiscontinuedReason: {
                id: 0,
                description: null
            },
            transcriptMedications: [
                {
                    transcriptGuid: null,
                    transcriptDateOfService: null,
                    comment: null,
                    lastModifiedDateTimeUtc: '2017-07-30T23:22:38.703Z',
                    lastModifiedProviderGuid: '85821ab8-ac27-4eca-a7bd-bc4c0b6cc980',
                    providerFirstName: 'Mad',
                    providerLastName: 'Hatter',
                    providerMiddleName: null,
                    providerSuffix: 'PhD',
                    providerTitle: 'Dr'
                },
                {
                    transcriptGuid: '1e2c5401-6ff2-4e9f-9cfa-49a1779c5f0d',
                    transcriptDateOfService: null,
                    comment: null,
                    lastModifiedDateTimeUtc: '2017-07-30T23:22:38.703Z',
                    lastModifiedProviderGuid: '85821ab8-ac27-4eca-a7bd-bc4c0b6cc980',
                    providerFirstName: 'Mad',
                    providerLastName: 'Hatter',
                    providerMiddleName: null,
                    providerSuffix: 'PhD',
                    providerTitle: 'Dr'
                }
            ],
            lastModifiedDateTimeUtc: '2017-07-30T23:22:38.703Z',
            drugName: 'Prolia 60 MG/ML Subcutaneous Solution',
            prescriptions: [],
            isGeneric: false,
            isMedicalSupply: false
        }],
        noKnownMedications: false
    }
};

moduleForAcceptanceAuth('Acceptance - Core - Clinical | Assessment modal limited access - v2', {
    beforeEach() {
        server.get('AuthzEndpoint/api/v1/users/:id/rights', () => ({
            entitledFeatures: ['ERX.Send', 'Chart.Sign', 'EPCS.Send']
        }));
    }
});

test('Prolia modal is hidden upon visiting encounter if Prolia CDS Alert os present', async assert => {
    const patientPracticeGuid = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
    const transcriptGuid = '7022d94f-d70a-4722-a205-dac898cf9f69';
    const alertText = 'Patient Safety: Monitor and record adverse events of special interest that may be experienced in patients receiving Prolia.';

    server.get('AlertEndpoint/api/v1/CdsAlerts/:patientPracticeGuid/:transcriptGuid', () => [{
        alertIdentifier: 'Surveillance.Prolia',
        ruleId: 34,
        alertText: alertText,
        citations: [],
        developer: 'Practice Fusion, Inc.',
        sponsor: 'Amgen Inc.',
        link: 'http://www.proliahcp.com/risk-evaluation-mitigation-strategy/',
        source: 'Practice Fusion, Inc.',
        actionLinkType: 'addClinicalAssessment',
        actionLinkData: 'name=proliaAesiModal',
        actionLinkText: 'Record',
        error: false
    }]);

    await visit(`/PF/charts/patients/${patientPracticeGuid}/encounter/${transcriptGuid}`);
    const adverseEffectDescriptions = find(`${de('prolia-aesi-modal')} .disease-description`);
    assert.equal(adverseEffectDescriptions.length, 0, 'The updated adverse effect descriptions are hidden.');
});

test('Prolia permanent place link is hidden from patient summary and encounter', async assert => {
    const patientPracticeGuid = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
    const transcriptGuid = '7022d94f-d70a-4722-a205-dac898cf9f69';

    server.get('ClinicalEndpoint/api/v1/patients/:id/aggregate', () => CUSTOM_PATIENT_AGGREGATE);

    await visit(`/PF/charts/patients/${patientPracticeGuid}/summary`);
    assert.ok(find(PROLIA_PERMANENT_PLACE_LINK).length === 0, 'Prolia permanent place link is hidden on patient summary.');

    await visit(`/PF/charts/patients/${patientPracticeGuid}/encounter/${transcriptGuid}`);
    assert.ok(find(PROLIA_PERMANENT_PLACE_LINK).length === 0, 'Prolia permanent place link is hidden on encounter.');
});
