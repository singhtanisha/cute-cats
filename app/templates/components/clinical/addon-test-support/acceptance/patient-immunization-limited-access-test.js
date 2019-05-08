import { run } from '@ember/runloop';
import { get, set } from '@ember/object';
import { test } from 'qunit';
import de from 'boot/tests/helpers/data-element';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';

const OLD_DUDER_PATIENT = '78f2e278-4519-4b0e-b192-f1f7f360215b';

moduleForAcceptanceAuth('Acceptance - Core - Clinical | Patient immunizations limited access', {
    beforeLogin() {
        server.get('AuthzEndpoint/api/v1/users/:id/rights', () => ({
            entitledFeatures: []
        }));
    }
});

test('Immunization actions in limited access', async assert => {
    await visit(`/PF/charts/patients/${OLD_DUDER_PATIENT}/immunizations`);
    assert.dom(de('btn-add-vaccine')).doesNotExist();
    assert.dom(de('btn-transmit')).doesNotExist();
    assert.dom(de('btn-connect-registry')).doesNotExist();
});

test('Administered vaccine in limited access', async assert => {
    await visit(`/PF/charts/patients/${OLD_DUDER_PATIENT}/immunizations`);
    await click(`${de('immunization-group-2')} ${de('vaccine-0')}`);
    assert.dom(`${de('select-ordered-by')} .composable-select__choice`).isDisabled();
    assert.dom(`${de('txt-comments')} textarea`).isDisabled();
    assert.dom(de('btn-delete-immunization')).isDisabled();
    assert.dom(de('btn-save-immunization')).isDisabled();
    assert.dom(de('btn-cancel-add')).exists();
});

test('Historical vaccine in limited access', async assert => {
    await visit(`/PF/charts/patients/${OLD_DUDER_PATIENT}/immunizations`);
    await click(`${de('immunization-group-0')} ${de('vaccine-0')}`);
    assert.dom(`${de('dropdown-facility')} .composable-select__choice`).isDisabled();
    assert.dom(`${de('comments')} textarea`).isDisabled();
    assert.dom(de('btn-delete-immunization')).isDisabled();
    assert.dom(de('btn-save-immunization')).isDisabled();
    assert.dom(de('btn-cancel-add')).exists();
});

test('Refused vaccine in limited access', async assert => {
    await visit(`/PF/charts/patients/${OLD_DUDER_PATIENT}/immunizations`);
    await click(`${de('immunization-group-2')} ${de('vaccine-0')}`);
    assert.dom(`${de('dropdown-facility')} .composable-select__choice`).isDisabled();
    assert.dom(`${de('comments')} textarea`).isDisabled();
    assert.dom(de('btn-delete-immunization')).isDisabled();
    assert.dom(de('btn-save-immunization')).isDisabled();
    assert.dom(de('btn-cancel-add')).exists();
});
