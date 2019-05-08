import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';

const PATIENT_PRACTICE_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const TIMELINE_FILTER = de('timeline-type-filter');
const ACTIONS_MENU = de('actions-menu');
const CREATE_BUTTON = de('create-clinical-document');
const actionsMenuItem = function (text) {
    return `${de('actions-menu-options')} a:contains('${text}')`;
};

moduleForAcceptanceAuth('Acceptance - Core - Clinical | Clinical documents - v2');

test('Create clinical document from actions menu', async assert => {
    server.post('ClinicalDocumentEndpoint/api/v1/ccda/patient', ({ db }, request) => {
        const data = JSON.parse(request.requestBody);
        const sections = data.requestedCcdaSections;
        assert.equal(data.ccdaGenerationType, 'Clinical', 'The service call was made with the correct ccdaGenerationType');
        assert.equal(data.patientPracticeGuid, PATIENT_PRACTICE_GUID, 'The service call was made with the correct patientPracticeGuid');
        assert.equal(sections.length, 3, 'The service call was made with the correct number of ccda sections');
        assert.ok(sections.includes('Medications'), 'The medications section was included');
        assert.ok(sections.includes('Encounters'), 'The encounters section was included');
        assert.ok(sections.includes('ChiefComplaintandReasonforVisit'), 'The chief complaint section was included');
        return {};
    });
    await visit(`/PF/charts/patients/${PATIENT_PRACTICE_GUID}/summary`);
    click(ACTIONS_MENU);
    await click(actionsMenuItem('View exported patient records'));
    assert.equal(currentURL(), `/PF/charts/patients/${PATIENT_PRACTICE_GUID}/timeline/clinicaldocuments`, 'The clinical documents timeline was opened');
    click(ACTIONS_MENU);
    await click(actionsMenuItem('Create clinical document'));

    const ccdaModal = '.create-clinical-document-modal .content-modal';
    assert.throws(findWithAssert(ccdaModal), 'The create CCDA modal is visible');
    await click(de('create-ccda-select-none'));
    click(`${de('Medications')} input`);
    click(`${de('Encounters')} input`);
    click(`${de('ChiefComplaintandReasonforVisit')} input`);
    await click(de('create-ccda-create'));
    assert.notOk(find(ccdaModal).length, 'The create CCDA modal is no longer visible');
});

test('View clinical documents from timeline', async assert => {
    await visit(`/PF/charts/patients/${PATIENT_PRACTICE_GUID}/timeline/encounter`);
    assert.notOk(find(CREATE_BUTTON).length, 'The create clinical document button does not exist on the encounters timeline');
    click(`${TIMELINE_FILTER} .ember-select-choice`);
    await click(`${TIMELINE_FILTER} li:contains('Exported patient records')`);
    const item = `${de('clinical-document-event')}[data-guid='7912c0d4-d9b1-4f41-9dfd-61852905063f']`;
    assert.equal(find(`${item} ${de('document-type')}`).text().trim(), 'Clinical Summary', 'The document type is rendered correctly');
    assert.equal(find(`${item} ${de('document-requester')}`).text().trim(), 'Provider Bob MD', 'The requester is rendered correctly');
    await click(`${item} ${de('clinical-document-preview')}`);
    assert.ok(find('.ccda-preview-modal .content-modal-title').text().trim().indexOf('Clinical Summary') > -1, 'The modal contains the correct title');
    assert.equal(find('.ccda-preview-modal #ChiefComplaint_1').text().trim(), '2016-06-01: Such chiefing', 'The modal renders the cc section');
    assert.throws(findWithAssert('.ccda-preview-modal .right-panel-v2 a:contains("Allergies")'), 'The allergies link exists in the right pane');
    assert.throws(findWithAssert('.ccda-preview-modal .right-panel-v2 a:contains("Vital Signs")'), 'The Vital Signs link exists in the right pane');
});
