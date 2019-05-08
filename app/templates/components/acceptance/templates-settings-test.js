import { run } from '@ember/runloop';
import { isPresent, isEmpty } from '@ember/utils';
import { test } from 'qunit';
import moduleForAcceptanceEntitled from 'boot/tests/helpers/module-for-acceptance-entitled';
import de from 'boot/tests/helpers/data-element';
import Mirage from 'ember-cli-mirage';
import session from 'boot/models/session';

let store;
const SHORTCUT = '..TS1';
const TEMPLATE_NAME = 'My new template';
const DESCRIPTION = 'My template description';
const S1 = '<p>First subjective template item</p>';
const S2 = '<p><b>Second</b> subjective template item</p>';
const S2_SHORTCUT = '.TWO';
const O1 = '<p>First <i>objective</i> template item</p>';
const A1 = '<p>First assessment template item</p>';
const P1 = '<p>First plan template item</p>';
const NEW_TEMPLATE_GUID = 'NEW_TEMPLATE_GUID';
const CUSTOM_PUNCTUATION = 'SUCH_CUSTOM';
const CUSTOM_SEPARATOR = `${CUSTOM_PUNCTUATION}\n\n`;
const PREDEFINED_ID = 'punctuation-predefined';
const CUSTOM_ID = 'punctuation-custom';
const DOUBLE_ID = 'newline-double';
const NONE_ID = 'newline-none';
const COMMA_SPACE = ', ';


function clickAddTemplateItem(sectionName) {
    const section = de(`${sectionName}-section`);
    click(`${section} ${de('add-template-item')}`);
    return delayAsync(100);
}
async function addTemplateItem(sectionName, text, shortcut) {
    await clickAddTemplateItem(sectionName);
    const section = de(`${sectionName}-section`);
    find(`${section} ${de('rich-text-editor')}`).html(text);
    // We are clicking the bold button just to force the editor to update it's value. The blur events don't get triggered properly during testing.
    click(`${section} [title="Clear formatting"].btn-tool`);
    if (isPresent(shortcut)) {
        fillIn(`${section} ${de('template-shortcut')}`, shortcut);
    }
    return click(`${section} .inline-rich-text-editor-button-row .btn-primary`);
}
function findDemographicItem(dropdown, text) {
    return findWithAssert(`${dropdown} .dropdown-menu li a span:not('.pull-right'):contains('${text}')`);
}
async function addTemplateItemWithPatientInfo(sectionName) {
    await clickAddTemplateItem(sectionName);
    const section = de(`${sectionName}-section`);
    const dropdown = `${section} ${de('patient-demographic-dropdown')}`;
    await click(`${dropdown} .dropdown-toggle`);
    const addressItem = findDemographicItem(dropdown, 'Address');
    findDemographicItem(dropdown, 'Age');
    findDemographicItem(dropdown, 'Date of birth');
    findDemographicItem(dropdown, 'Email');
    findDemographicItem(dropdown, 'Patient name');
    findDemographicItem(dropdown, 'Phone');
    return click(addressItem);
}
async function addDescription() {
    click(de('add-description-link'));
    const selector = '.description-container .inline-text-area textarea';
    await fillIn(selector, DESCRIPTION);
    if (window._phantom || find(`${selector}:focus`).length) {
        triggerEvent(selector, 'focusout');
    } else {
        run(find(selector), 'trigger', $.Event('focusout'));
    }
}
async function addShortcut() {
    const inputSelector = de('template-shortcut');
    await fillIn(inputSelector, SHORTCUT);
    if (find(`${inputSelector}:focus`).length) {
        triggerEvent(inputSelector, 'focusout');
    } else {
        run(find('.template-shortcut'), 'trigger', $.Event('focusout'));
    }
}
function exampleText(separator) {
    return `This is template item one${separator}This is template item two`;
}

moduleForAcceptanceEntitled('Acceptance - Core - Charting | Charting templates settings', {
    beforeEach() {
        store = this.application.__container__.lookup('service:store');
    }
});

test('Add a template via settings', async assert => {
    server.post('ChartingEndpoint/api/v1/templates', (schema, request) => {
        const data = JSON.parse(request.requestBody);

        assert.equal(data.name, TEMPLATE_NAME, 'The template has the correct name');
        assert.equal(data.shortcut, SHORTCUT, 'The template has the correct shortcut');
        assert.equal(data.description, DESCRIPTION, 'The template has the correct description');
        assert.deepEqual(data.specializations, [260], 'The template has the correct specialties');
        assert.notOk(data.templateGuid, 'The template did not have a template guid');
        assert.equal(data.templateSections.length, 4, 'The template has the correct number of sections');
        data.templateSections.forEach(section => {
            const sectionFilter = section.sectionFilters[0];
            if (sectionFilter === 'S') {
                assert.equal(section.values.length, 2, 'The "S" section has the correct number of items');
                const s1 = section.values.findBy('text', S1);
                const s2 = section.values.findBy('text', S2);
                assert.ok(s1, 'The first "S" item is present');
                assert.ok(s2, 'The second "S" item is present');
                assert.notOk(s1.shortcut, 'The first "S" item does not have a shortcut');
                assert.equal(s2.shortcut, S2_SHORTCUT, 'The second "S" item\'s shortcut is correct');
            } else if (sectionFilter === 'O') {
                assert.equal(section.values.length, 2, 'The "O" section only has 2 items');
                assert.equal(section.values[0].text, O1, 'The "O" item has the correct value');
                assert.notOk(section.values[0].shortcut, 'The "O" item does not have a shortcut');
                assert.ok(section.values[1].text.indexOf('{address}') > 0, 'The second "O" item has the patient demographic variable in it');
            } else if (sectionFilter === 'A') {
                assert.equal(section.values.length, 1, 'The "A" section only has 1 item');
                assert.equal(section.values[0].text, A1, 'The "A" item has the correct value');
                assert.notOk(section.values[0].shortcut, 'The "A" item does not have a shortcut');
            } else if (sectionFilter === 'P') {
                assert.equal(section.values.length, 1, 'The "P" section only has 1 item');
                assert.equal(section.values[0].text, P1, 'The "P" item has the correct value');
                assert.notOk(section.values[0].shortcut, 'The "P" item does not have a shortcut');
            }
        });

        data.templateGuid = NEW_TEMPLATE_GUID;
        return data;
    });

    await visit('/PF/settings/templates/provider');
    click(de('create-template'));
    addShortcut();
    fillIn(de('template-name'), TEMPLATE_NAME);
    click(`${de('specialties-select')} .ember-select-search-choice-close`);
    click(`${de('specialties-select')} .dropdown-toggle`);
    click(de('specialties-select-0'));

    await addDescription();
    await addTemplateItem('subjective', S1);
    await addTemplateItem('subjective', S2, S2_SHORTCUT);
    await addTemplateItem('objective', O1);
    await addTemplateItem('assessment', A1);
    await addTemplateItem('plan', P1);

    await addTemplateItemWithPatientInfo('objective');

    await click(de('template-save'));

    const template = store.peekRecord('charting-template', NEW_TEMPLATE_GUID);
    assert.ok(template, 'The new template is present in the store');
});

test('Edit an existing template via settings', async assert => {
    const templateGuid = 'e468fd14-795e-4c24-a0b2-6304ca79ceca';
    server.put(`ChartingEndpoint/api/v1/templates/${templateGuid}`, (schema, request) => {
        const data = JSON.parse(request.requestBody);

        assert.equal(data.name, TEMPLATE_NAME, 'The template has the correct name');
        assert.equal(data.shortcut, SHORTCUT, 'The template has the correct shortcut');
        assert.equal(data.description, DESCRIPTION, 'The template has the correct description');
        assert.equal(data.templateGuid, templateGuid, 'The template has the correct template guid');
        data.templateSections.forEach(section => {
            const sectionFilter = section.sectionFilters[0];
            if (sectionFilter === 'S') {
                const s2 = section.values.findBy('text', S2);
                assert.ok(s2, 'The new "S" item is present');
                assert.equal(s2.shortcut, S2_SHORTCUT, 'The new "S" item\'s shortcut is correct');
            } else if (sectionFilter === 'O') {
                const o1 = section.values.findBy('text', O1);
                assert.ok(o1, 'The new "O" item is present');
                assert.notOk(o1.shortcut, 'The new "O" item does not have a shortcut');
            } else if (sectionFilter === 'A') {
                assert.ok(false, 'The "A" section is not present');
            } else if (sectionFilter === 'P') {
                const p1 = section.values.findBy('text', P1);
                assert.ok(p1, 'The new "P" item is present');
                assert.notOk(p1.shortcut, 'The new "P" item does not have a shortcut');
            }
        });
        return data;
    });
    visit('/PF/settings/templates/provider');
    await click(`.flex-table [data-id="${templateGuid}"] ${de('template-name')}`);
    assert.equal(find(de('template-name'))[0].value, 'Abscess', 'The template has the correct name');
    await addDescription();
    fillIn(de('template-name'), TEMPLATE_NAME);
    await addShortcut();
    await addTemplateItem('subjective', S2, S2_SHORTCUT);
    await addTemplateItem('objective', O1);
    await addTemplateItem('plan', P1);

    click(`${de('assessment-section')} .icon-go-away-small`);

    await click(de('template-save'));
    const template = store.peekRecord('charting-template', templateGuid);
    assert.ok(template, 'The template is still present in the store');
    assert.ok(isEmpty(template.get('assessment')), 'The assessment section has no template items');
});

test('Delete an existing template via settings using checkbox', async assert => {
    const templateGuid = 'ac2c62b4-387c-4f9f-b75d-ac24b503163b';
    assert.expect(3);
    server.delete(`ChartingEndpoint/api/v1/templates/${templateGuid}`, () => {
        assert.ok(true, 'The delete service call was made');
        return new Mirage.Response(204, {}, null);
    });

    visit('/PF/settings/templates/provider');
    click(`.flex-table [data-id="${templateGuid}"] input[type="checkbox"]`);
    click('.composable-header__tool-bar .split-button__arrow-button--primary');
    click(de('templates-delete'));
    await click('.carbon-content-modal-component .btn-primary');
    assert.dom(`.flex-table [data-id="${templateGuid}"]`).doesNotExist('The template was removed from the screen');
    const template = store.peekRecord('charting-template', templateGuid);
    assert.ok(!template || template.get('isDeleted'), 'The template was removed from the store');
});

test('Delete an existing template via settings from edit tab', async assert => {
    const templateGuid = 'fcf723ee-a7c6-49d3-a548-ad822ac2ca31';
    assert.expect(3);
    server.delete(`ChartingEndpoint/api/v1/templates/${templateGuid}`, ({ db }) => {
        assert.ok(true, 'The delete template service call was made');
        db.chartingTemplates.remove({ templateGuid });
        return new Mirage.Response(204, {}, null);
    });

    visit('/PF/settings/templates/provider');
    click(`.flex-table [data-id="${templateGuid}"] ${de('template-name')}`);
    click(de('template-more-actions'));
    click(de('template-delete'));
    await click(`.confirm-dialog.in ${de('confirm-dialog-confirm')}`);
    assert.notOk(find(`.nav-tabs [href="/PF/settings/templates/edit/${templateGuid}"]`).length, 'The template tab was removed from the screen');
    const template = store.peekRecord('charting-template', templateGuid);
    assert.ok(!template || template.get('isDeleted'), 'The template was removed from the store');
});

test('Changing from custom template separator to predefined', async assert => {
    const commaSpaceNewlines = `${COMMA_SPACE}\n\n`;
    server.get('PracticeEndpoint/api/v1/preferences/provider', {
        preferences: {
            'charting.Templates.ItemSeparator': CUSTOM_SEPARATOR
        }
    });
    server.post('PracticeEndpoint/api/v1/preferences/provider/:providerGuid', (schema, request) => {
        const data = JSON.parse(request.requestBody);
        const separator = data.preferences['charting.Templates.ItemSeparator'];
        assert.equal(separator, commaSpaceNewlines, 'The comma space separator value was saved correctly');
        return {};
    });
    await visit('PF/settings/templates/settings');
    const $customRadio = findWithAssert(`${de(CUSTOM_ID)} input[type="radio"]`);
    const $customInput = findWithAssert(`${de(CUSTOM_ID)} input.ember-text-field`);
    const $doubleRadio = findWithAssert(`${de(DOUBLE_ID)} input[type="radio"]`);
    assert.ok($customRadio[0].checked, 'The custom radio button is checked');
    assert.equal($customInput[0].value, CUSTOM_PUNCTUATION, 'The custom separator punctuation value was correct on load');
    assert.ok($doubleRadio[0].checked, 'The double newline radio button is checked');
    assert.equal(find(de('templates-separator-example')).text(), exampleText(CUSTOM_SEPARATOR), 'The example text renders correctly');
    click(`${de(PREDEFINED_ID)} label`);

    await click(`${de('templates-separator-predefined-dropdown')} .composable-select__choice`);
    await click(de('templates-separator-predefined-dropdown-option-0'));
    assert.equal(find(de('templates-separator-example')).text(), exampleText(commaSpaceNewlines), 'The example text renders correctly after changing the separator');
    await click(de('templates-separator-save'));
    const model = store.peekRecord('provider-preference', `${session.get('providerGuid')}charting.Templates.ItemSeparator`);
    assert.equal(model.get('value'), commaSpaceNewlines, 'The store\'s model was updated with the correct value');
});

test('Changing from predefined template separator to custom', async assert => {
    server.get('PracticeEndpoint/api/v1/preferences/provider', {
        preferences: {
            'charting.Templates.ItemSeparator': COMMA_SPACE
        }
    });
    server.post('PracticeEndpoint/api/v1/preferences/provider/:providerGuid', (schema, request) => {
        const data = JSON.parse(request.requestBody);
        const separator = data.preferences['charting.Templates.ItemSeparator'];
        assert.equal(separator, CUSTOM_PUNCTUATION, 'The custom separator value was saved correctly');
        return {};
    });
    await visit('PF/settings/templates/settings');
    const $predefinedRadio = findWithAssert(`${de(PREDEFINED_ID)} input[type="radio"]`);
    const $noneRadio = findWithAssert(`${de(NONE_ID)} input[type="radio"]`);
    assert.ok($predefinedRadio[0].checked, 'The predefined radio button is checked');
    assert.ok($noneRadio[0].checked, 'The no newlines radio button is checked');
    assert.equal(find(`${de('templates-separator-predefined-dropdown')} .composable-select__choice`).text().trim(), 'Comma and space', 'The correct predefined dropdown item is selected');
    assert.equal(find(de('templates-separator-example')).text(), exampleText(COMMA_SPACE), 'The example text renders correctly');
    click(`${de(CUSTOM_ID)} input[type="radio"]`);
    await fillIn(`${de(CUSTOM_ID)} input.ember-text-field`, CUSTOM_PUNCTUATION);
    assert.equal(find(de('templates-separator-example')).text(), exampleText(CUSTOM_PUNCTUATION), 'The example text renders correctly after changing the separator');
    await click(de('templates-separator-save'));
    const model = store.peekRecord('provider-preference', `${session.get('providerGuid')}charting.Templates.ItemSeparator`);
    assert.equal(model.get('value'), CUSTOM_PUNCTUATION, 'The store\'s model was updated with the correct value');
});

function clickProviderCheckBox(text) {
    return click(`.practice-share-content .provider-row:contains('${text}') input`);
}

test('Share templates with practice', async assert => {
    const TEMPLATE_GUID_1 = 'ac2c62b4-387c-4f9f-b75d-ac24b503163b';
    const TEMPLATE_GUID_2 = 'fcf723ee-a7c6-49d3-a548-ad822ac2ca31';
    const PROVIDER_GUID_1 = 'bbdd6e15-2eac-4e0f-96b6-6583e3e15cd7';
    const PROVIDER_GUID_2 = 'eaa90f53-9dfa-4c2a-93db-83f3b3243d5b';
    const PROVIDER_GUID_3 = '5cb51be9-3688-4ae3-b67b-a7c72914488d';
    const MODAL = '.practice-share .modal';
    const SHARE_MODAL_BUTTON = '.practice-share .modal .btn--brand';
    let postCallCount = 0;

    server.post('ChartingEndpoint/api/v1/templates/practice', (schema, request) => {
        const data = JSON.parse(request.requestBody);
        postCallCount += 1;
        if (postCallCount === 1) {
            assert.equal(data.providerGuids.length, 2, 'The endpoint was called with the correct number of providerGuids');
            assert.equal(data.templateGuids.length, 2, 'The endpoint was called with the correct number of templateGuids');
            assert.ok(data.providerGuids.includes(PROVIDER_GUID_1), 'The endpoint was called with the correct providerGuids');
            assert.ok(data.providerGuids.includes(PROVIDER_GUID_2), 'The endpoint was called with the correct providerGuids');
            assert.ok(data.templateGuids.includes(TEMPLATE_GUID_1), 'The endpoint was called with the correct templateGuids');
            assert.ok(data.templateGuids.includes(TEMPLATE_GUID_2), 'The endpoint was called with the correct templateGuids');
        } else if (postCallCount === 2) {
            assert.equal(data.templateGuids.length, 1, 'The endpoint was called with the correct number of templateGuids');
            assert.equal(data.templateGuids[0], TEMPLATE_GUID_1, 'The endpoint was called with the correct templateGuid');
            assert.equal(data.providerGuids.length, 5, 'The endpoint was called with the correct number of providerGuids');
            assert.ok(data.providerGuids.includes(PROVIDER_GUID_1), 'The endpoint was called with the correct providerGuids');
            assert.ok(data.providerGuids.includes(PROVIDER_GUID_2), 'The endpoint was called with the correct providerGuids');
            assert.ok(data.providerGuids.includes(PROVIDER_GUID_3), 'The endpoint was called with the correct providerGuids');
        } else {
            assert.ok(false, 'The POST practice template endpoint was called too many times');
        }
        return true;
    });

    visit('PF/settings/templates/provider');
    click(`.flex-table [data-id="${TEMPLATE_GUID_1}"] input[type="checkbox"]`);
    click(`.flex-table [data-id="${TEMPLATE_GUID_2}"] input[type="checkbox"]`);
    click('.composable-header__tool-bar .split-button__arrow-button--primary');
    await click(de('templates-share'));
    assert.throws(findWithAssert(MODAL), 'The share with practice modal appears after clicking the button');
    assert.notOk(find('.practice-share-content .provider-row:contains("Mad Hatter PhD")').length, 'The share modal does not contain a checkbox for the current provider');
    assert.ok(find(SHARE_MODAL_BUTTON).attr('disabled'), 'The share button is disabled when no providers are selected');
    clickProviderCheckBox('new user MD');
    clickProviderCheckBox('Provider Bob MD');
    await click(SHARE_MODAL_BUTTON);
    assert.equal(postCallCount, 1, 'The endpoint was called when the share button was clicked');
    assert.notOk(find(MODAL).length, 'The modal was hidden after the share button was clicked');
    await click(`.flex-table [data-id="${TEMPLATE_GUID_1}"] ${de('template-name')}`);
    click(de('template-more-actions'));
    click(de('template-share'));
    click(de('templates-share-select-all'));
    await click(SHARE_MODAL_BUTTON);
    assert.equal(postCallCount, 2, 'The endpoint was called when the share button was clicked');
    assert.notOk(find(MODAL).length, 'The modal was hidden after the share button was clicked');
});
