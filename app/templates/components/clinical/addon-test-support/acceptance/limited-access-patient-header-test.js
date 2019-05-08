import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';

const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';

const INVITE_PATIENT_PORTAL = '.phr-status-ribbon.ellipses';
const PATIENT_PHOTO = '.patient-photo';
const ADD_PATIENT_PHOTO_MODAL = '.add-photo-modal';
const PIN_ICON = '.patient-pinned-note .icon-pushpin';
const PIN_NOTE_DELETE_BTN = '.popover.pinned-patient-popover button:contains(Delete)';
const PIN_NOTE_EDIT_BTN = '.popover.pinned-patient-popover button:contains(Edit)';
const PIN_NOTE_BTN = '.popover.pinned-patient-popover button:contains(Pin note)';

const RESEND_INVITE = de('resend-invite');
const CANCEL_INVITE = de('cancel-invite');
const REVOKE_ACCESS = de('revoke-access');

const ADD_USER = 'add-user a.add-users';
const PRINT_ACCESS_INSTRUCTIONS = de('print-access-instructions');

moduleForAcceptanceAuth('Acceptance - Core - Clinical | Limited Access Patient Header - v2', {
    beforeLogin() {
        server.get('AuthzEndpoint/api/v1/users/:id/rights', () => ({
            entitledFeatures: ['ERX.Send', 'Chart.Sign', 'EPCS.Send']
        }));
    }
});

test('Visit a patient without patient portal access while in limited access mode', async assert => {
    server.get('/PatientEndpoint/api/v1/patients/:id/phr_enrollments', () => ({
        id: 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98',
        'correlationId': '7709fb32-1b69-45f1-b390-ea6b075649e7',
        'enrollments': [],
        'patientFirstName': 'Some',
        'patientLastName': 'Baby',
        'patientEmail': 'babyadfdsfsdfsdf@baby.com',
        'patientPhone': '(555) 555-5554',
        'isFakePatient': false,
        'dateOfBirth': '2013-02-01T00:00:00',
        'phrAutomaticEnrollmentEnabled': true,
        'patientPracticeGuid': 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98'
    }));

    await visit('/PF/charts/patients/' + PATIENT_GUID + '/summary/');
    assert.notOk(find(INVITE_PATIENT_PORTAL).length > 0, 'invite to patient portal link is removed');
    await click(find(PATIENT_PHOTO));
    assert.ok(find(ADD_PATIENT_PHOTO_MODAL).css('display', 'hidden'), 'clicking patient photo does nothing');
    await click(find(PIN_ICON));
    const MISSING_BTNS = find(PIN_NOTE_DELETE_BTN).length > 0 || find(PIN_NOTE_EDIT_BTN).length > 0 || find(PIN_NOTE_BTN).length > 0;
    assert.notOk(MISSING_BTNS, 'add/edit/delete buttons are missing from the pinned note popover');
});

test('Visit a patient with patient portal access pending while in limited access mode', async assert => {
    server.get('/PatientEndpoint/api/v1/patients/:id/phr_enrollments', () => ({
        'enrollments': [{
                'type': 'Request',
                'status': 'Pending',
                'relationshipToPatient': 'Parent',
                'emailAddress': 'sdfj@sdf.com',
                'phoneNumber': '4151231312',
                'username': null,
                'phrUserProfileGuid': null,
                'createdDateTimeUtc': '2015-11-12T03:01:37',
                'createdByProfileTypeName': 'Provider',
                'createdByProfileGuid': '84a5277e-8d30-4de2-bac7-fe4f3c6232c8',
                'lastModifiedDateTimeUtc': '2015-11-12T03:01:37',
                'lastModifiedByProfileTypeName': 'Provider',
                'lastModifiedByProfileGuid': '84a5277e-8d30-4de2-bac7-fe4f3c6232c8',
                'enrollmentPin': 'IOMGMWJB',
                'isAutoInvited': false,
                'phrEnrollmentRequestGuid': 'ef8acaac-f3cb-449c-8f17-ea796cf7c528'
            }, {
                'type': 'Request',
                'status': 'Pending',
                'relationshipToPatient': 'Self',
                'emailAddress': 'bye@bye.com',
                'phoneNumber': '4151231231',
                'username': null,
                'phrUserProfileGuid': null,
                'createdDateTimeUtc': '2015-11-23T22:46:18',
                'createdByProfileTypeName': 'Provider',
                'createdByProfileGuid': '84a5277e-8d30-4de2-bac7-fe4f3c6232c8',
                'lastModifiedDateTimeUtc': '2015-11-23T22:46:18',
                'lastModifiedByProfileTypeName': 'Provider',
                'lastModifiedByProfileGuid': '84a5277e-8d30-4de2-bac7-fe4f3c6232c8',
                'enrollmentPin': 'PYBCPTDN',
                'isAutoInvited': false,
                'phrEnrollmentRequestGuid': '17271a74-088a-4558-8c85-376724364f0c'
            }],
        id: 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98',
        'correlationId': '7709fb32-1b69-45f1-b390-ea6b075649e7',
        'patientFirstName': 'Some',
        'patientLastName': 'Baby',
        'patientEmail': 'babyadfdsfsdfsdf@baby.com',
        'patientPhone': '(555) 555-5554',
        'isFakePatient': false,
        'dateOfBirth': '2013-02-01T00:00:00',
        'phrAutomaticEnrollmentEnabled': true,
        'patientPracticeGuid': 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98'
    }));

    await visit('/PF/charts/patients/' + PATIENT_GUID + '/summary/');
    assert.ok(find(INVITE_PATIENT_PORTAL + ' .icon-pending'), 'patient portal status link renders.');
    await click(INVITE_PATIENT_PORTAL + ' a');
    assert.notOk(find(RESEND_INVITE).length > 0, 'resend invite link is missing');
    assert.notOk(find(CANCEL_INVITE).length > 0, 'cancel invite link is missing');
    assert.notOk(find(PRINT_ACCESS_INSTRUCTIONS).length > 0, 'print access instructions is missing');
});

test('Visit a patient with patient portal access while in limited access mode', async assert => {
    server.get('/PatientEndpoint/api/v1/patients/:id/phr_enrollments', () => ({
        'enrollments': [{
            'type': 'Authorization',
            'status': 'Active',
            'relationshipToPatient': 'Self',
            'emailAddress': 'redacted@gmail.com',
            'phoneNumber': '7753455146',
            'username': 'redacted@gmail.com',
            'phrUserProfileGuid': '2dd0a467-9fb7-42fe-a103-fbe1e0a28164',
            'createdDateTimeUtc': '2017-01-25T19:09:17.257Z',
            'createdByProfileTypeName': 'Provider',
            'createdByProfileGuid': '8b233660-6bc7-4fe5-b81d-224fa3a7acfc',
            'lastModifiedDateTimeUtc': '2017-01-25T19:09:17.257Z',
            'lastModifiedByProfileTypeName': 'Provider',
            'lastModifiedByProfileGuid': '8b233660-6bc7-4fe5-b81d-224fa3a7acfc',
            'isAutoInvited': false
        }],
        id: 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98',
        'correlationId': '7709fb32-1b69-45f1-b390-ea6b075649e7',
        'patientFirstName': 'Some',
        'patientLastName': 'Baby',
        'patientEmail': 'babyadfdsfsdfsdf@baby.com',
        'patientPhone': '(555) 555-5554',
        'isFakePatient': false,
        'dateOfBirth': '2013-02-01T00:00:00',
        'phrAutomaticEnrollmentEnabled': true,
        'patientPracticeGuid': 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98'
    }));
    await visit('/PF/charts/patients/' + PATIENT_GUID + '/summary/');
    assert.ok(find(INVITE_PATIENT_PORTAL + ' .icon-checkmark'), 'patient portal status link renders.');
    await click(INVITE_PATIENT_PORTAL + ' a');
    assert.notOk(find(REVOKE_ACCESS).length > 0, 'revoke access link is missing');
    assert.notOk(find(ADD_USER).length > 0, 'add users link is missing');
});
