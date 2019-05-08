/* jshint ignore:start */
import { run } from '@ember/runloop';

import { get, set } from '@ember/object';
import { test } from 'qunit';
import de from 'boot/tests/helpers/data-element';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import config from 'boot/config';

const OLD_DUDER_PATIENT = '78f2e278-4519-4b0e-b192-f1f7f360215b';

moduleForAcceptanceAuth('Acceptance - Core - Clinical | Bidirectional patient immunizations');

test('View list of immunizations', async assert => {
    await visit(`/PF/charts/patients/${OLD_DUDER_PATIENT}/immunizations`);
    assert.dom(de('immunization-group-0')).exists();
});

test('Toggle add immunization', async assert => {
    await visit(`/PF/charts/patients/${OLD_DUDER_PATIENT}/immunizations`);
    await click(de('btn-add-vaccine'));
    assert.dom(de('add-immunization-content')).exists();
});
/* jshint ignore:end */
