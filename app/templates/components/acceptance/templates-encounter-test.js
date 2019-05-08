import { isPresent } from '@ember/utils';
import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';
import Mirage from 'ember-cli-mirage';

let store;
const ENCOUNTER_GUID = 'UNSIGNED_TRANSCRIPT_GUID';
const TEMPLATE_NAME = 'My new template';
const TEMPLATE_SHORTCUT = '..T1';
const NEW_TEMPLATE_GUID = 'NEW_TEMPLATE_GUID';
const TEMPLATE_ITEM = '<p>First <b>subjective</b> template item</p>';
const TEMPLATE_ITEM_SHORTCUT = '.TE1';
function dataId(id) {
    return `[data-id='${id}']`;
}
async function editTemplateItem(text, shortcut) {
    await delayAsync(100);
    find(`.carbon-content-modal-component ${de('rich-text-editor')}`).html(text);
    // We are clicking the clear formatting button just to force the editor to update it's value. The blur events don't get triggered properly during testing.
    click('.carbon-content-modal-component [title="Clear formatting"].btn-tool');
    if (isPresent(shortcut)) {
        fillIn(`.carbon-content-modal-component ${de('template-shortcut')}`, shortcut);
    }
    return click('.carbon-content-modal-component footer .btn-primary');
}

moduleForAcceptanceAuth('Acceptance - Core - Charting | Charting templates encounter', {
    beforeEach() {
        store = this.application.__container__.lookup('service:store');
    }
});

test('Add a template via encounter', async assert => {
    assert.expect(11);
    server.post('ChartingEndpoint/api/v1/templates', ({ db }, request) => {
        const data = JSON.parse(request.requestBody);
        assert.equal(data.name, TEMPLATE_NAME, 'The template has the correct name');
        assert.notOk(data.templateGuid, 'The template did not have a template guid');
        data.templateGuid = NEW_TEMPLATE_GUID;
        return data;
    });
    server.put(`ChartingEndpoint/api/v1/templates/${NEW_TEMPLATE_GUID}`, ({ db }, request) => {
        const data = JSON.parse(request.requestBody);
        assert.equal(data.name, TEMPLATE_NAME, 'The template has the correct name');
        assert.equal(data.templateGuid, NEW_TEMPLATE_GUID, 'The template has the correct template guid');
        const subjective = data.templateSections.find(section => section.sectionFilters[0] === 'S');
        assert.ok(subjective, 'The subjective section is present');
        assert.equal(subjective.values.length, 1, 'The subjective has 1 template item');
        assert.equal(subjective.values[0].text, TEMPLATE_ITEM, 'The template item has the correct text');
        assert.equal(subjective.values[0].shortcut, TEMPLATE_ITEM_SHORTCUT, 'The template item has the correct shortcut');
        return data;
    });
    visit(`/PF/charts/patients/ecd212c3-5c99-499e-b3c6-b2645b8a4c98/encounter/${ENCOUNTER_GUID}`);
    click(de('edit-note-subjective'));
    click(de('add-template'));
    fillIn('.template-item-edit input', TEMPLATE_NAME);
    await click(de('save-add-template'));
    const templateSelector = `.editable-chart-template${dataId(NEW_TEMPLATE_GUID)}`;
    assert.throws(findWithAssert(templateSelector), 'New template was added to the template list');
    assert.ok(store.peekRecord('charting-template', NEW_TEMPLATE_GUID), 'The new template exists in the store');
    click(`${templateSelector} .p-link`);
    click(de('add-template-item'));
    await editTemplateItem(TEMPLATE_ITEM, TEMPLATE_ITEM_SHORTCUT);
    const template = store.peekRecord('charting-template', NEW_TEMPLATE_GUID);
    assert.equal(template.get('subjective.length'), 1, 'The model has the correct number of template items');
});

test('Edit existing template via encounter', async assert => {
    assert.expect(9);
    const templateGuid = 'e468fd14-795e-4c24-a0b2-6304ca79ceca';
    const templateItemToEditGuid = '5e1a242e-e046-4e5b-9e8d-55430e4351e7';
    const templateItemToDeleteGuid = 'af9f1cd4-9fb2-470b-bb1d-ade60030c32a';
    let putCallCount = 0;
    server.put(`ChartingEndpoint/api/v1/templates/${templateGuid}`, ({ db }, request) => {
        putCallCount++;
        let data = JSON.parse(request.requestBody);
        if (putCallCount === 1) {
            assert.equal(data.name, TEMPLATE_NAME, 'The template has the correct name');
            assert.equal(data.shortcut, TEMPLATE_SHORTCUT, 'The template has the correct shortcut');
            assert.equal(data.templateGuid, templateGuid, 'The template has the correct template guid');
        } else {
            const subjective = data.templateSections.find(section => section.sectionFilters[0] === 'S');
            if (putCallCount === 2) {
                const templateItem = subjective.values.findBy('valueGuid', templateItemToEditGuid);
                assert.equal(templateItem.text, TEMPLATE_ITEM, 'The edited template item has the correct value');
                assert.equal(templateItem.shortcut, TEMPLATE_ITEM_SHORTCUT, 'The edited template item has the correct shortcut');
            } else if (putCallCount === 3) {
                const templateItem = subjective.values.findBy('valueGuid', templateItemToDeleteGuid);
                assert.notOk(templateItem, 'The deleted template item was not present');
            }
        }
        return data;
    });
    visit(`/PF/charts/patients/ecd212c3-5c99-499e-b3c6-b2645b8a4c98/encounter/${ENCOUNTER_GUID}`);
    click(de('edit-note-subjective'));
    click(de('toggle-edit-templates'));
    const templateSelector = `.editable-chart-template${dataId(templateGuid)}`;
    await click(`${templateSelector} .template-name`);
    assert.equal(find(`${templateSelector} input`)[0].value, 'Abscess', 'The initial template name was correct in the textbox');
    fillIn(find(`${templateSelector} input`).first(), TEMPLATE_NAME);
    fillIn(`${templateSelector} ${de('template-shortcut')}`, TEMPLATE_SHORTCUT);
    click(`${templateSelector} ${de('save-edit-template')}`);
    click(de('toggle-edit-templates'));
    click(`${templateSelector} .p-link`);
    click(de('toggle-edit-template-items'));

    let templateItemSelector = `.editable-template-item${dataId(templateItemToEditGuid)}`;
    click(`${templateItemSelector} .template-item-text`);
    await editTemplateItem(TEMPLATE_ITEM, TEMPLATE_ITEM_SHORTCUT);
    assert.equal(find(`${templateItemSelector} .item-shortcut`).text(), TEMPLATE_ITEM_SHORTCUT, 'The template item is rendered with the correct shortcut');
    templateItemSelector = `.editable-template-item${dataId(templateItemToDeleteGuid)}`;
    click(`${templateItemSelector} .template-item-text`);
    delayAsync(100);
    await click('.carbon-content-modal-component footer .pull-left button');
    assert.notOk(find(templateItemSelector).length, 'The deleted template item was removed from the DOM');
});

test('Delete existing template via encounter', async assert => {
    assert.expect(6);
    server.delete('ChartingEndpoint/api/v1/templates/:templateGuid', () => {
        assert.ok(true, 'The delete service call was made');
        return new Mirage.Response(204, {}, null);
    });

    const templateGuid1 = 'ac2c62b4-387c-4f9f-b75d-ac24b503163b';
    const templateGuid2 = 'fcf723ee-a7c6-49d3-a548-ad822ac2ca31';

    visit(`/PF/charts/patients/ecd212c3-5c99-499e-b3c6-b2645b8a4c98/encounter/${ENCOUNTER_GUID}`);
    click(de('edit-note-subjective'));
    click(de('toggle-edit-templates'));
    let templateSelector = `.editable-chart-template${dataId(templateGuid1)}`;
    click(`${templateSelector} .icon-go-away-small`);
    await click('.popover-confirm-warning .confirm-btn');
    assert.notOk(find(templateSelector).length, 'Then template has been removed from the DOM');
    let template = store.peekRecord('charting-template', templateGuid1);
    assert.ok(!template || template.get('isDeleted'), 'The template was removed from the store');

    templateSelector = `.editable-chart-template${dataId(templateGuid2)}`;
    click(`${templateSelector} .template-name`);
    click(`${templateSelector} a:contains('Delete')`);
    await click('.popover-confirm-warning .confirm-btn');
    assert.notOk(find(templateSelector).length, 'Then template has been removed from the DOM');
    template = store.peekRecord('charting-template', templateGuid2);
    assert.ok(!template || template.get('isDeleted'), 'The template was removed from the store');
});
