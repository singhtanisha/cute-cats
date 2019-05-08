import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import waitUntil from '@ember/test-helpers/wait-until';

const COMPONENT = '.add-photo-modal';
const DISPLAY_NONE = 'display: none;';

moduleForComponent('add-patient-photo', 'Integration - Core - Clinical | Component - add-patient-photo', {
    integration: true
});

test('Modal is not visible when isVisible is false', function (assert) {
    this.render(hbs`{{add-patient-photo isVisible=false}}`);

    assert.dom(`${COMPONENT} .content-modal`).doesNotExist();
});

test('Renders when isVisible is true', async function (assert) {
    this.set('isVisible', true);
    this.render(hbs`{{add-patient-photo isVisible=isVisible patientGuid="blah" photoUrl=""}}`);
    await wait();

    assert.dom(`${COMPONENT} .content-modal-title`).hasText('Add patient photo');
    assert.dom(`${COMPONENT} .upload-button a`).hasText('Upload photo');

    await waitUntil(() => this.$(`${COMPONENT} .photo-preview`).attr('style') === DISPLAY_NONE);
    assert.dom(`${COMPONENT} .link-change-photo`).hasAttribute('style', DISPLAY_NONE);

    this.$(`${COMPONENT} .content-modal>footer button`).click();
    await wait();

    assert.dom(`${COMPONENT} .content-modal`).doesNotExist();
    assert.notOk(this.get('isVisible'));
});
