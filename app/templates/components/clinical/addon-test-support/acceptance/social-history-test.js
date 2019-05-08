import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';

const PATIENT_PRACTICE_GUID = 'c5faffde-78e2-4924-acaf-2115bc686d5e';
const NEW_GENDER_IDENTITY = {
    optionGuid: '1dd3321b-5dc0-443f-bc18-da6110d3e294',
    description: 'Transgender Male/Trans Man/Female-to-Male',
    notes: 'This is a test of gender identity'
};
const NEW_SEXUAL_ORIENTATION = {
    optionGuid: 'f8e4b009-e430-4e25-bd29-d8d9644ccaba',
    description: 'Something else, please describe',
    notes: 'This is a test of sexual orientation'
};
const EMPTY_SOCIAL_HISTORY = {
    genderIdentity: null,
    sexualOrientation: null
};

moduleForAcceptanceAuth('Acceptance - Core - Clinical | Social History - v2');

test('Add Gender Identity on patient summary', async assert => {
    let socialHistoryPayload = EMPTY_SOCIAL_HISTORY;
    server.get('/PatientEndpoint/api/v3/patients/patientDemographic/:patientPracticeGuid', () => socialHistoryPayload);
    server.put('/PatientEndpoint/api/v3/patients/patientDemographic/:patientPracticeGuid', ({ db }, request) => {
        const newSettings = JSON.parse(request.requestBody);
        assert.equal(newSettings.genderIdentity.optionGuid, NEW_GENDER_IDENTITY.optionGuid, 'The correct gender identity guid was saved');
        assert.equal(newSettings.genderIdentity.notes, NEW_GENDER_IDENTITY.notes, 'The correct gender identity note was saved');
        socialHistoryPayload = {
            genderIdentity: NEW_GENDER_IDENTITY,
            sexualOrientation: null
        };
        return socialHistoryPayload;
    });

    assert.expect(9);
    await visit(`/PF/charts/patients/${PATIENT_PRACTICE_GUID}/summary`);
    assert.dom(de('genderIdentity-section')).exists('Gender identity section displays on patient summary');
    assert.dom(`${de('genderIdentity-section')} ${de('behavioral-health-placeholder-text')}`).hasText('No gender identity recorded', 'Gender identity section displays empty');
    await click(`${de('genderIdentity-section')} ${de('behavioral-health-field-add-button')}`);
    assert.throws(findWithAssert('.right-module h15:contains("Gender identity > Record")'), 'Gender identity detail panel displays after add is clicked');
    assert.dom(`${de('txt-social-health-notes')}`).isDisabled('Notes are disabled without selected option');
    await click(`${de('social-health-option-2')} input`);
    assert.dom(`${de('txt-social-health-notes')}`).isNotDisabled('Notes are enabled after selection');
    fillIn(`${de('genderIdentity-detail')} ${de('txt-social-health-notes')}`, NEW_GENDER_IDENTITY.notes);
    await click(`${de('btn-social-health-save')}`);
    assert.notOk(find('.right-module h15:contains("Gender identity > Record")').length, 'Gender identity pane closed upon saving');
    assert.dom(`${de('genderIdentity-section')} ${de('behavioral-health-field-item-0')}`).exists('Gender identity list is updated after save');
});

test('Add Sexual Orientation on patient summary', async assert => {
    let socialHistoryPayload = EMPTY_SOCIAL_HISTORY;
    server.get('/PatientEndpoint/api/v3/patients/patientDemographic/:patientPracticeGuid', () => socialHistoryPayload);
    server.put('/PatientEndpoint/api/v3/patients/patientDemographic/:patientPracticeGuid', ({ db }, request) => {
        const newSettings = JSON.parse(request.requestBody);
        assert.equal(newSettings.sexualOrientation.optionGuid, NEW_SEXUAL_ORIENTATION.optionGuid, 'The correct sexual orientation guid was saved');
        assert.equal(newSettings.sexualOrientation.notes, NEW_SEXUAL_ORIENTATION.notes, 'The correct sexual orientation note was saved');
        socialHistoryPayload = {
            genderIdentity: null,
            sexualOrientation: NEW_SEXUAL_ORIENTATION
        };
        return socialHistoryPayload;
    });

    assert.expect(9);
    await visit(`/PF/charts/patients/${PATIENT_PRACTICE_GUID}/summary`);
    assert.dom(de('sexualOrientation-section')).exists('Sexual orientation section displays on patient summary');
    assert.dom(`${de('sexualOrientation-section')} ${de('behavioral-health-placeholder-text')}`).hasText('No sexual orientation recorded', 'Sexual orientation section displays empty');
    await click(`${de('sexualOrientation-section')} ${de('behavioral-health-field-add-button')}`);
    assert.throws(findWithAssert('.right-module h15:contains("Sexual orientation > Record")'), 'Sexual orientation detail panel displays after add is clicked');
    assert.dom(`${de('txt-social-health-notes')}`).isDisabled('Notes are disabled without selected option');
    await click(`${de('social-health-option-3')} input`);
    assert.dom(`${de('txt-social-health-notes')}`).isNotDisabled('Notes are enabled after selection');
    fillIn(`${de('sexualOrientation-detail')} ${de('txt-social-health-notes')}`, NEW_SEXUAL_ORIENTATION.notes);
    await click(`${de('btn-social-health-save')}`);
    assert.notOk(find('.right-module h15:contains("Sexual orientation > Record")').length, 'Sexual orientation pane closed upon saving');
    assert.dom(`${de('sexualOrientation-section')} ${de('behavioral-health-field-item-0')}`).exists('Sexual orientation list is updated after save');
});

test('Print preview social history', async assert => {
    server.get('/PatientEndpoint/api/v3/patients/patientDemographic/:patientPracticeGuid', ({ db }) => {
        return db.socialHistories[0];
    });

    await visit(`/PF/charts/patients/${PATIENT_PRACTICE_GUID}/summary`);
    assert.throws(findWithAssert(de('print-behavioral-health-button')), 'Print social history button is available');
    await click(de('print-behavioral-health-button'));
    assert.dom('.print-behavioral-health-section').exists('Behavioral health section displays in the print modal');
    assert.equal(find('.print-behavioral-health-section .table .header-row .col-xs-10:eq(0)').text(), 'Tobacco use', 'Smoking status displays in the print modal');
    assert.equal(find('.print-behavioral-health-section .table .header-row .col-xs-12:eq(2)').text(), 'Gender identity', 'Gender identity displays in the print modal');
    assert.equal(find('.print-behavioral-health-section .table .header-row .col-xs-12:eq(3)').text(), 'Sexual orientation', 'Sexual orientation displays in the print modal');

    click('#print-modal-controls .close-link');
});
