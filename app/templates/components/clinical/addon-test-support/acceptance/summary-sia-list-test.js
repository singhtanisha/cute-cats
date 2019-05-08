import { isPresent } from '@ember/utils';
import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';

const PATIENT_PRACTICE_GUID = 'c5faffde-78e2-4924-acaf-2115bc686d5e';
const summaryURL = `/PF/charts/patients/${PATIENT_PRACTICE_GUID}/summary`;
const TRANSCRIPT_EVENT_DETAIL_PANE_URL = `${summaryURL}/sia/2ab9b961-161b-4413-8a23-414fc9a5aab6`;
const WORKSHEET_EVENT_DETAIL_PANE_URL = `${summaryURL}/sia/67586303-5ff2-49a1-a913-87f6b45120f9`;
const MIGRAINE_WORKSHEET_DETAIL_PANE_URL = `${summaryURL}/sia/42ba9501-6c69-4851-99e6-c5f47d5c4991`;
const ENCOUNTER_URL = `/PF/charts/patients/${PATIENT_PRACTICE_GUID}/encounter/562d5f03-61e5-46cc-a72c-32902c474be0`;

const TRANSCRIPT_EVENT = {
    'transcriptEvent': {
        'transcriptEventGuid': '2ab9b961-161b-4413-8a23-414fc9a5aab6',
        'transcriptGuid': '562d5f03-61e5-46cc-a72c-32902c474be0',
        'status': 'Performed',
        'eventType': {
            'displayName': 'Adult 30 year screening',
            'category': 'Procedure',
            'permittedStates': [
                'Ordered',
                'Performed'
            ],
            'codes': [
                {
                    'id': 59745,
                    'codeValue': '171305000',
                    'codeSystem': 'SNOMED-CT',
                    'displayName': 'Adult 30 year screening'
                }
            ],
            'display': 'none',
            'displayOrder': 0,
            'eventTypeGuid': '7d4517d9-5049-411c-b856-18a637460c2e',
            'positiveReasonCodes': [],
            'negativeReasonCodes': [
                {
                    'id': 31,
                    'codeValue': '105480006',
                    'codeSystem': 'SNOMED-CT',
                    'displayName': 'Refusal of treatment by patient'
                },
                {
                    'id': 32,
                    'codeValue': '397745006',
                    'codeSystem': 'SNOMED-CT',
                    'displayName': 'Medical contraindication'
                },
                {
                    'id': 33,
                    'codeValue': '183932001',
                    'codeSystem': 'SNOMED-CT',
                    'displayName': 'Procedure contraindicated'
                },
                {
                    'id': 34,
                    'codeValue': '407563006',
                    'codeSystem': 'SNOMED-CT',
                    'displayName': 'Treatment not tolerated'
                },
                {
                    'id': 44,
                    'codeValue': '107724000',
                    'codeSystem': 'SNOMED-CT',
                    'displayName': 'Patient transfer (procedure)'
                }
            ],
            'permittedResultCodes': [],
            'defaultNegationState': false
        },
        'isNegated': false,
        'dueDate': '2018-08-06T11:04:27.067Z',
        'comments': 'comment text',
        'startDateTimeUtc':'2018-07-30T07:00:00Z',
        'endDateTimeUtc': '2018-08-06T07:00:00Z',
        'lastModifiedAt': '2018-08-06T18:04:27.323Z'
    }
};

const WORKSHEET_EVENT = {
    'transcriptEvent': {
        'transcriptEventGuid': '67586303-5ff2-49a1-a913-87f6b45120f9',
        'transcriptGuid': '562d5f03-61e5-46cc-a72c-32902c474be0',
        'transcriptId': 0,
        'status': 'Performed',
        'eventType': {
            'displayName': 'Adult Asthma Control Test (ages 12 and up)',
            'category': 'Risk Category/Assessment',
            'permittedStates': [],
            'codes': [],
            'display': 'normal',
            'displayOrder': 1,
            'eventTypeGuid': 'ed4c88e0-9083-492d-930b-5d9c1552b924',
            'positiveReasonCodes': [],
            'negativeReasonCodes': [],
            'permittedResultCodes': [],
            'defaultNegationState': false,
            'worksheetGuid': '77fe6944-4a70-4f4f-873c-2b5a747482cc'
        },
        'isNegated': false,
        'dueDate': '2018-07-30T21:33:35.327Z',
        'reasonCode': {
            'id': 31,
            'codeValue': '105480006',
            'codeSystem': 'SNOMED-CT',
            'displayName': 'Refusal of treatment by patient'
        },
        'resultCode': {
            'id': 0
        },
        'resultValue': 5,
        'lastModifiedAt': '2018-07-31T04:33:35.817Z'
    }
};

const MIGRAINE_WORKSHEET_EVENT = {
    'transcriptEvent': {
          'transcriptEventGuid': '42ba9501-6c69-4851-99e6-c5f47d5c4991',
          'transcriptGuid': '562d5f03-61e5-46cc-a72c-32902c474be0',
          'transcriptId': 0,
          'status': 'Performed',
          'eventType': {
              'displayName': 'Migraine Disability Assessment Test (MIDAS)',
              'category': 'Risk Category/Assessment',
              'permittedStates': [],
              'codes': [],
              'display': 'normal',
              'displayOrder': 1,
              'eventTypeGuid': '9fc12137-0078-442a-9120-d5270b71463f',
              'positiveReasonCodes': [],
              'negativeReasonCodes': [],
              'permittedResultCodes': [],
              'defaultNegationState': false,
              'worksheetGuid': 'a8cad205-f659-48d3-9d97-7dfc17c6d2d5'
          },
          'isNegated': false,
          'reasonCode': {
              'id': 0
          },
          'resultCode': {
              'id': 7,
              'codeValue': '1002',
              'codeSystem': 'PF-ASSESSMENT',
              'displayName': 'MIDAS category II'
          },
          'resultValue': 6,
          'lastModifiedAt': '2018-07-17T23:21:52.053Z'
      }
};

moduleForAcceptanceAuth('Acceptance - Core - Clinical | SIAs');

test('Summary SIA list card', async assert => {
    let loadCounts = 0;
    server.get('ChartingEndpoint/api/v3/patients/:patientPracticeGuid/screeningsinterventionsandassessments/', ({ db }, request) => {
        const allSIAs = db.patientSummarySia[0]['transcriptEvents'];
        const meta = db.patientSummarySia[0]['meta'];
        if (isPresent(request.queryParams.pageNumber)) {
            const pageNumber = parseInt(request.queryParams.pageNumber);
            const pageSize = parseInt(request.queryParams.pageSize);
            const SIAs = allSIAs.slice(pageNumber * pageSize, Math.min((pageNumber + 1) * pageSize, allSIAs.length));
            assert.equal(pageNumber, loadCounts, 'pageNumber increases');
            assert.equal(pageSize, 7, 'the default pageSize is 7');
            loadCounts += 1;
            return {
                meta,
                transcriptEvents: SIAs
            };
        }
        return db.patientSummarySia[0];
    });

    await visit(summaryURL);
    assert.equal(find(`${de('sia-list')} li`).length, 7, 'correct number of SIAs are rendered');
    assert.dom(de('sia-name-0')).hasText('Admission to day hospital', 'correct sia name renders');
    assert.dom(de('sia-start-date-0')).hasText('Start date: 07/30/2018', 'correct start date renders');
    assert.dom(de('sia-status-0')).hasText('Status: Performed', 'correct status renders');
    assert.dom(de('load-more-button')).hasText('Show more (8)', 'correct count renders');
    await click(de('load-more-button'));
    assert.equal(find(`${de('sia-list')} li`).length, 14, 'click show more link loads 7 more SIAs');
    assert.dom(de('load-more-button')).hasText('Show more (1)', 'correct count renders after loading more SIAs');
    await click(de('print-sia-button'));
    assert.equal(find(de('print-sia-name')).length, 15, 'click print button loads all SIAs');
    click('#print-modal-controls .close-link');
});

test('Summary SIA read only detail pane', async assert => {
    server.get('ChartingEndpoint/api/v3/patients/:patientPracticeGuid/screeningsinterventionsandassessments/', ({ db }, request) => {
        const allSIAs = db.patientSummarySia[0]['transcriptEvents'];
        const meta = db.patientSummarySia[0]['meta'];
        if (isPresent(request.queryParams.pageNumber)) {
            const pageNumber = parseInt(request.queryParams.pageNumber);
            const pageSize = parseInt(request.queryParams.pageSize);
            const SIAs = allSIAs.slice(pageNumber * pageSize, Math.min((pageNumber + 1) * pageSize, allSIAs.length));
            return {
                meta,
                transcriptEvents: SIAs
            };
        }
        return db.patientSummarySia[0];
    });

    server.get('ChartingEndpoint/api/v3/patients/:patientPracticeGuid/transcriptEvents/:transcriptEventGuid', () => TRANSCRIPT_EVENT);

    await visit(summaryURL);
    await click(de('sia-start-date-1'));
    assert.equal(currentURL(), TRANSCRIPT_EVENT_DETAIL_PANE_URL, 'URL is correct.');
    assert.dom(de('sia-detail-display-name')).hasText('Adult 30 year screening', 'SIA name is correct.');
    assert.dom(de('sia-detail-status')).hasText('Performed', 'status is correct.');
    assert.dom(de('sia-detail-result')).hasText('No result recorded.', 'result is correct.');
    assert.dom(de('sia-detail-start-date')).exists('start date exists.');
    assert.dom(de('sia-detail-end-date')).exists('end date exists.');
    assert.dom(de('sia-detail-encounter-type')).hasText('Office Visit (SOAP Note)View encounter', 'encounter type is correct.');
    assert.dom(de('sia-detail-encounter-link')).exists('encounter link exists.');
    assert.dom(de('sia-detail-date-of-service')).exists('date of service exists.');
    assert.dom(de('sia-detail-comments')).hasText('comment text', 'comments is correct.');
    await click(de('sia-detail-encounter-link'));
    assert.equal(currentURL(), ENCOUNTER_URL, 'click encounter link opens related encounter');
});

test('Summary SIA read only worksheet detail pane', async assert => {
    server.get('ChartingEndpoint/api/v3/patients/:patientPracticeGuid/screeningsinterventionsandassessments/', ({ db }, request) => {
        const allSIAs = db.patientSummarySia[0]['transcriptEvents'];
        const meta = db.patientSummarySia[0]['meta'];
        if (isPresent(request.queryParams.pageNumber)) {
            const pageNumber = parseInt(request.queryParams.pageNumber);
            const pageSize = parseInt(request.queryParams.pageSize);
            const SIAs = allSIAs.slice(pageNumber * pageSize, Math.min((pageNumber + 1) * pageSize, allSIAs.length));
            return {
                meta,
                transcriptEvents: SIAs
            };
        }
        return db.patientSummarySia[0];
    });

    server.get('ChartingEndpoint/api/v3/patients/:patientPracticeGuid/transcriptEvents/:transcriptEventGuid', () => WORKSHEET_EVENT);

    server.get('ChartingEndpoint/api/v2/WorksheetResponses', ({ db }, request) => {
        const transcriptEventGuid = request.queryParams.transcriptEncounterEventGuid;
        assert.equal(transcriptEventGuid, '67586303-5ff2-49a1-a913-87f6b45120f9');
        return db.worksheetResponses.where({ responsesGuid: '190fdb53-12c3-4dc0-9732-0b9d4e8e809c' })[0];
    });

    await visit(summaryURL);
    await click(de('sia-start-date-2'));
    assert.equal(currentURL(), WORKSHEET_EVENT_DETAIL_PANE_URL, 'URL is correct.');
    assert.dom(de('worksheet-display-name')).hasText('Asthma Control Test™', 'worksheet name is correct.');
    assert.dom(de('worksheet-description')).hasText('The Asthma Control Test™ is a quick test for people with asthma 12 years and older. It provides a numerical score to help assess asthma control.', 'worksheet description is correct.');
    assert.dom(de('worksheet-status')).hasText('Performed', 'status is correct.');
    assert.dom(de('worksheet-result')).hasText('No result recorded.', 'result is correct.');
    assert.dom(de('worksheet-start-date')).exists('start date exists.');
    assert.dom(de('worksheet-end-date')).exists('end date exists.');
    assert.dom(de('worksheet-encounter-type')).hasText('Office Visit (SOAP Note)View encounter', 'encounter type is correct.');
    assert.dom(de('worksheet-encounter-link')).exists('encounter link exists.');
    assert.dom(de('worksheet-date-of-service')).exists('date of service exists.');
    assert.equal(find(`${de('worksheet-questions')} li`).length, 5, 'questions are rendered.');
    assert.dom(de('worksheet-question-label-0')).hasText('In the past 4 weeks, how much of the time did your asthma keep you from getting as much done at work, school or at home?', 'question label is correct.');
    assert.dom(de('worksheet-question-anwser-0')).hasText('All of the time (1)', 'answer is correct.');
    assert.dom(de('worksheet-score')).hasText('No score', 'score is correct.');
    assert.dom(de('worksheet-summary')).hasText('If your score is 19 or less, your asthma may not be as well controlled as it could be.', 'summary is correct');
    assert.dom(de('worksheet-copyright')).hasText('Copyright 2002, by QualityMetric Incorporated. Asthma Control Test is a trademark of QualityMetric Incorporated.', 'copyright is correct.');
    await click(de('worksheet-encounter-link'));
    assert.equal(currentURL(), ENCOUNTER_URL, 'click encounter link opens related encounter');
});

test('Summary SIA read only migraine detail pane', async assert => {
    server.get('ChartingEndpoint/api/v3/patients/:patientPracticeGuid/screeningsinterventionsandassessments/', ({ db }, request) => {
        const allSIAs = db.patientSummarySia[0]['transcriptEvents'];
        const meta = db.patientSummarySia[0]['meta'];
        if (isPresent(request.queryParams.pageNumber)) {
            const pageNumber = parseInt(request.queryParams.pageNumber);
            const pageSize = parseInt(request.queryParams.pageSize);
            const SIAs = allSIAs.slice(pageNumber * pageSize, Math.min((pageNumber + 1) * pageSize, allSIAs.length));
            return {
                meta,
                transcriptEvents: SIAs
            };
        }
        return db.patientSummarySia[0];
    });

    server.get('ChartingEndpoint/api/v3/patients/:patientPracticeGuid/transcriptEvents/:transcriptEventGuid', () => MIGRAINE_WORKSHEET_EVENT);

    server.get('ChartingEndpoint/api/v2/WorksheetResponses', ({ db }, request) => {
        const transcriptEventGuid = request.queryParams.transcriptEncounterEventGuid;
        assert.equal(transcriptEventGuid, '42ba9501-6c69-4851-99e6-c5f47d5c4991');
        return db.worksheetResponses.where({ responsesGuid: 'fb6e227b-d027-4f34-b427-d430fcfbff53' })[0];
    });

    await visit(summaryURL);
    await click(de('sia-start-date-3'));
    assert.equal(currentURL(), MIGRAINE_WORKSHEET_DETAIL_PANE_URL, 'URL is correct.');
    assert.dom(de('worksheet-display-name')).hasText('Migraine disability assessment test', 'worksheet name is correct.');
    assert.dom(de('worksheet-description')).hasText('The MIDAS (Migraine Disability Assessment) questionnaire helps you determine the level of pain and disability caused by your patients headaches and to assist you in identifying the best treatment.', 'worksheet description is correct.');
    assert.dom(de('worksheet-status')).hasText('Performed', 'status is correct.');
    assert.dom(de('worksheet-encounter-type')).hasText('Office Visit (SOAP Note)View encounter', 'encounter type is correct.');
    assert.dom(de('worksheet-encounter-link')).exists('encounter link exists.');
    assert.equal(find(`${de('worksheet-questions')} li`).length, 8, 'all components are rendered.');
    assert.equal(find(`${de('worksheet-questions')} li p`).length, 7, 'migraine has 7 questions.');
    assert.dom(de('worksheet-question-label-0')).hasText('On how many days in the last 3 months did you miss work or school because of your headaches?', 'question label is correct.');
    assert.dom(de('worksheet-question-anwser-0')).hasText('Number of days:2', 'answer is correct.');
    assert.dom(de('worksheet-question-9')).hasText('Questions 6-7 can help further determine the level of disability due to migraine, but do not affect MIDAS score:', 'text separator is correct.');
    assert.dom(de('worksheet-score')).hasText('6 - Grade II, mild disability', 'score is correct.');
    assert.dom(de('worksheet-summary')).hasText('0 to 5 - MIDAS Grade I, Little or no disability6 to 10 - MIDAS Grade II, Mild disability11 to 20 - MIDAS Grade III, Moderate disability21+ - MIDAS Grade IV, Severe disability', 'summary is correct');
    await click(de('worksheet-encounter-link'));
    assert.equal(currentURL(), ENCOUNTER_URL, 'click encounter link opens related encounter');
});
