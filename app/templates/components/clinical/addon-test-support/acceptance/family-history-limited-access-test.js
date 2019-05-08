import { run } from '@ember/runloop';
import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';
import session from 'boot/models/session';

function dg(guid) {
    return `[data-guid='${guid}']`;
}

const PATIENT_PRACTICE_GUID = 'c5faffde-78e2-4924-acaf-2115bc686d5e';
const FAMILY_HISTORY_ROUTE = `/PF/charts/patients/${PATIENT_PRACTICE_GUID}/familyhistory`;
const RELATIVE_GUID = 'ca13d90a-7c0e-4437-99fd-576f55aaa1c0';
const OBSERVATION_GUID = 'd8858c94-4118-417e-8e0d-5ce135a9ca58';
const RELATIVE_CARD = `${dg(RELATIVE_GUID)}${de('relative-card')}`;
const EDIT_DX = `${dg(OBSERVATION_GUID)}${de('edit-diagnosis')}`;
const EDIT_RELATIVE = `${RELATIVE_CARD} ${de('edit-relative')}`;

moduleForAcceptanceAuth('Acceptance - Core - Clinical | Family health history limited access', {
    beforeEach() {
        run(() => {
            session.set('isAdmin', true);
        });
    },
    beforeLogin() {
        server.get('AuthzEndpoint/api/v1/users/:id/rights', () => ({
            entitledFeatures: ['ERX.Send', 'Chart.Sign', 'EPCS.Send']
        }));
    }
});

test('Adding relative is disabled', async assert => {
    server.get('ClinicalEndpoint/api/v1/FamilyHealthHistory/:patientPracticeGuid/conditions', ({ db }) => db.familyHealthConditions[0].noName);
    server.get('ClinicalEndpoint/api/v1/FamilyHealthHistory/:patientPracticeGuid', ({ db }) => db.familyHealthInformation[0].original);

    await visit(FAMILY_HISTORY_ROUTE);
    assert.dom(de('record-new-relative')).hasClass('invisible');
});

test('Editing or deleting a relative is disabled', async assert => {
    server.get('ClinicalEndpoint/api/v1/FamilyHealthHistory/:patientPracticeGuid', ({ db }) => db.familyHealthInformation[0].original);

    server.get('ClinicalEndpoint/api/v3/diagnosis/typeSearch/', ({ db }) => db.familyHistoryDiagnosisSearch);

    await visit(FAMILY_HISTORY_ROUTE);
    assert.dom(EDIT_RELATIVE).hasText('View');
    await click(EDIT_RELATIVE);
    assert.dom(`input${de('relative-first-name')}`).doesNotExist();
    assert.dom(`input${de('relative-last-name')}`).doesNotExist();
    assert.dom(`${de('relative-birthdate')} input`).doesNotExist();
    assert.dom(`${de('relative-deceased-checkbox')} input`).isDisabled();
    assert.dom(`${de('relative-comments')} textarea`).doesNotExist();
    assert.dom(de('relative-delete')).doesNotExist();
    assert.dom(de('relative-save')).doesNotExist();
});

test('Editing and deleting diagnosis for a relative is disabled', async assert => {
    server.put(`ClinicalEndpoint/api/v1/FamilyHealthHistory/${PATIENT_PRACTICE_GUID}/observations/:observationGuid`, () => true);

    server.get('ClinicalEndpoint/api/v1/FamilyHealthHistory/:patientPracticeGuid', ({ db }) => db.familyHealthInformation[0].original);

    await visit(FAMILY_HISTORY_ROUTE);
    await click(EDIT_DX);
    assert.dom(`${de('diagnosis-comments')} textarea`).doesNotExist();
    assert.dom(`${de('diagnosis-onset-date')} input`).doesNotExist();
    assert.dom(de('diagnosis-delete')).doesNotExist();
    assert.dom(de('diagnosis-save')).doesNotExist();
});
