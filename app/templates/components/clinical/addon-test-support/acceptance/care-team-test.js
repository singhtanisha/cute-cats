import { test } from 'qunit';
import sinon from 'sinon';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';
import getText from 'boot/tests/helpers/get-text';

let toastrStub;
moduleForAcceptanceAuth('Acceptance - Core - Clinical | Care team', {
    beforeEach() {
        toastrStub = sinon.stub(window.toastr, 'error');
    },
    afterEach() {
        window.toastr.error.restore();
    }
});

const PATIENT_GUID = 'fd198d85-b2e4-435b-854a-b924b3261d75';
const CARE_TEAM_SEARCH = de('care-team-search');
const FIRST_NAME = 'Careful';
const LAST_NAME = 'Teammate';
const FAX_NUMBER = '5555555555';
const TABLE = '.care-team-list-table tbody';
const FIRST_MEMBER = `${TABLE} tr:first`;
const SECOND_MEMBER = `${TABLE} tr:nth-child(2)`;
const SAVE_BUTTON = de('care-team-save');
const PROVIDER_PROFILE_GUID = '7526db72-eff7-4d2d-9517-6404916a3b4f';

function findInSearch(assert, name, isProvider) {
    assert.throws(findWithAssert(`${CARE_TEAM_SEARCH} .ember-select-results li:contains("${name}")`), `The ${isProvider ? 'provider' : 'contact'} exists in the search results`);
}

test('Add, edit, and delete care team members', async assert => {
    const careTeamArray = [];
    let providerAddCount = 0;
    let providerEditCount = 0;
    let providerDeleteCount = 0;
    server.get('PatientEndpoint/api/v1/patient/:id/careTeam/members', () => careTeamArray);
    server.post('CollaborationEndpoint/contacts', ({ db }, request) => {
        const data = JSON.parse(request.requestBody);
        const { profile } = data;
        assert.equal(profile.firstName, FIRST_NAME, 'The first name is correct on the POSTed contact');
        assert.equal(profile.lastName, LAST_NAME, 'The last name is correct on the POSTed contact');
        assert.equal(profile.officeFax, FAX_NUMBER, 'The fax number is correct on the POSTed contact');
        profile.profileGuid = 'SOME_GUID';
        return data;
    });
    server.get('PatientEndpoint/api/v1/phr_patients/:id/demographics', () => {
        // Ethnicity: Central American: Costa Rican ; Race: Asian: Filipino
        return {'languageOptionId':3, 'ethnicityOptionGuids': ['d6a37b7c-c763-4695-90e7-097cdb8c2ec7'], 'raceOptionGuids':['9f94fa9e-18f5-4ba7-90d4-18ffb0d918a4']};
    });
    server.put('PatientEndpoint/api/v1/patient/:patientPracticeGuid/careTeam/provider', ({ db }, request) => {
        const data = JSON.parse(request.requestBody);
        const profileOrContactGuid = data.providerProfileGuid;
        const existing = careTeamArray.findBy('providerUserProfileGuid', profileOrContactGuid);
        const relationship = data.relationships[0];
        const careTeamMemberType = relationship ? relationship.careTeamMemberType : null;
        if (existing) {
            if (relationship) {
                providerEditCount++;
                assert.equal(profileOrContactGuid, PROVIDER_PROFILE_GUID, 'The provider profile guid is correct when editing the provider');
                assert.equal(careTeamMemberType, 'BackupProvider', 'The careTeamMemberType is correct when editing the provider');
                existing.careTeamMemberType = careTeamMemberType;
            } else {
                providerDeleteCount++;
                assert.equal(profileOrContactGuid, PROVIDER_PROFILE_GUID, 'The provider profile guid is correct when deleting the provider');
                careTeamArray.removeAt(careTeamArray.indexOf(existing));
            }
        } else {
            providerAddCount++;
            if (providerAddCount === 1) {
                assert.equal(profileOrContactGuid, 'SOME_GUID', 'The contact guid is correct for the new contact');
                assert.equal(careTeamMemberType, 'PrimaryCareProvider', 'The careTeamMemberType is correct for the new contact');
            } else if (providerAddCount === 2) {
                assert.equal(profileOrContactGuid, PROVIDER_PROFILE_GUID, 'The provider profile guid is correct for the existing provider');
                assert.equal(careTeamMemberType, 'PreferredProvider', 'The careTeamMemberType is correct for the existing provider');
            }
            careTeamArray.pushObject({
                providerUserProfileGuid: profileOrContactGuid,
                careTeamMemberType: careTeamMemberType,
                patientPracticeGuid: request.params.patientPracticeGuid
            });
        }
        return [];
    });
    await visit(`/PF/charts/patients/${PATIENT_GUID}/profile`);
    assert.equal(findWithAssert(de('care-team-empty-message')).text(), 'No care team for this patient. Add care team member.', 'The empty care team state exists');
    click(de('care-team-add-button'));
    await click(`${CARE_TEAM_SEARCH} input`);
    findInSearch(assert, 'Another User', true);
    findInSearch(assert, 'Cannot Save', true);
    findInSearch(assert, 'Marsh Mallow', false);
    findInSearch(assert, 'Tomato Jimenez', false);
    click(`${CARE_TEAM_SEARCH} .ember-select-add-item`);
    fillIn(de('care-team-form-first-name'), FIRST_NAME);
    fillIn(de('care-team-form-last-name'), LAST_NAME);
    fillIn(de('care-team-form-fax'), FAX_NUMBER);
    click(`${de('care-team-relationship-pcp')} input`);
    await click(SAVE_BUTTON);
    assert.ok(providerAddCount, 'The provider add endpoint was called');
    assert.equal(getText(`${FIRST_MEMBER} .provider-name`), `${FIRST_NAME} ${LAST_NAME}`, 'The new contact was added to the care team list');
    assert.equal(find(`${FIRST_MEMBER} ${de('care-team-member-relationship')}`).text(), 'Primary care provider (PCP)', 'The new contact\'s relationship is correct');
    assert.equal(getText(`${FIRST_MEMBER} ${de('care-team-member-contact')}`), 'F: 5555555555', 'The new contact\'s contact information is correct');
    click(de('care-team-add-button'));
    click(`${CARE_TEAM_SEARCH} input`);
    await click(de('care-team-search-1'));
    assert.equal(find(de('care-team-form-first-name'))[0].value, 'Another', 'The first name was autopopulated from the clicked provider');
    assert.equal(find(de('care-team-form-last-name'))[0].value, 'User', 'The last name was autopopulated from the clicked provider');
    await click(SAVE_BUTTON);
    assert.equal(toastrStub.args[0], 'You need to select at least one relationship', 'The "You need to select at least one relationship" toaster was displayed');
    click(`${de('care-team-relationship-preferred')} input`);
    await click(SAVE_BUTTON);
    assert.equal(providerAddCount, 2, 'The provider add endpoint was called again');
    assert.equal(getText(`${SECOND_MEMBER} .provider-name`), 'Another User', 'The provider was added to the care team list');
    assert.equal(find(`${SECOND_MEMBER} ${de('care-team-member-relationship')}`).text(), 'Preferred provider in practice', 'The provider\'s relationship is correct');
    click(`${SECOND_MEMBER} .provider-name`);
    click(`${de('care-team-relationship-preferred')} input`);
    click(`${de('care-team-relationship-backup')} input`);
    await click(SAVE_BUTTON);
    assert.ok(providerEditCount, 'The provider edit endpoint was called');
    assert.equal(find(`${SECOND_MEMBER} ${de('care-team-member-relationship')}`).text(), 'Backup provider in practice', 'The provider\'s relationship was updated');
    await click(`${SECOND_MEMBER} ${de('care-team-member-delete')}`);
    assert.ok(providerDeleteCount, 'The provider deleted endpoint was called');
    assert.notOk(find(SECOND_MEMBER).length, 'The provider was removed from the care team when the delete button was clicked');
});

test('Load care team providers', async assert => {
    server.get('PatientEndpoint/api/v1/patient/:id/careTeam/members', ({ db }) => db.careTeamPatientProfiles);
    await visit(`/PF/charts/patients/${PATIENT_GUID}/profile`);
    // In practice provider
    assert.equal(find('.care-team-list-table .provider-name:eq(0)').text().trim(), 'Belinda Nambooze', 'Provider name is rendered correctly');
    assert.equal(find(`${de('care-team-member-relationship')}:eq(0)`).text().trim(), 'Preferred provider in practice', 'Provider relationship is rendered correctly');
    assert.equal(find(`${de('care-team-member-contact')}:eq(0) div:eq(0)`).text().trim(), 'P: (415) 333-3333', 'Provider phone number is rendered correctly');
    assert.equal(find(`${de('care-team-member-contact')}:eq(0) div:eq(1)`).text().trim(), 'bnambooze@practicefusion.com', 'Provider email is rendered correctly');
    assert.equal(find(`${de('provider-type')}:eq(0)`).text().trim(), 'In practice', 'Provider type is rendered correctly');
    assert.equal(find(`${de('provider-specialty')}:eq(0)`).text().trim(), 'Allergy and Immunology', 'Provider specialty is rendered correctly');

    // In directory provider
    assert.equal(find('.care-team-list-table .provider-name:eq(1)').text().trim(), 'Marsh Mallow', 'Provider name is rendered correctly');
    assert.equal(find(`${de('care-team-member-relationship')}:eq(1)`).text().trim(), 'Other provider', 'Provider relationship is rendered correctly');
    assert.equal(find(`${de('care-team-member-contact')}:eq(1) div:eq(0)`).text().trim(), 'F: (555)512-3455', 'Provider fax number is rendered correctly');
    assert.equal(find(`${de('care-team-member-contact')}:eq(1) div:eq(1)`).text().trim(), '', 'Provider email is rendered correctly');
    assert.equal(find(`${de('provider-type')}:eq(1)`).text().trim(), 'My connections', 'Provider type is rendered correctly');
    assert.equal(find(`${de('provider-specialty')}:eq(1)`).text().trim(), '', 'Provider specialty is rendered correctly');
});
