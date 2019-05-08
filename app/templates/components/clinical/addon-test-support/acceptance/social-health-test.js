import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';
import Mirage from 'ember-cli-mirage';

moduleForAcceptanceAuth('Acceptance - Core - Clinical | Social health');

function enableTheSwitches() {
    const uncheckedSwitches = find(`${de('social-history')} .d-checkbox-switch:has(input:not(:checked))`);
    uncheckedSwitches.toArray().forEach(uncheckedSwitch => click(uncheckedSwitch));
}

async function assertAddSocialHealthField(assert, fieldKey, expectedDescription, expectedDate) {
    const deFieldSection = de(`${fieldKey}-section`);
    const deFieldDetail = de(`${fieldKey}-detail`);

    assert.dom(`${deFieldSection} ${de('behavioral-health-placeholder-text')}`).doesNotHaveClass('hidden', 'Placeholder text displays for empty fields');
    await click(`${deFieldSection} ${de('behavioral-health-field-add-button')}`);
    assert.dom(de('btn-social-health-delete')).hasClass('hidden', 'Delete button is hidden unless content is present');
    switch (fieldKey) {
        case 'socialHistory':
            fillIn(`${deFieldDetail} ${de('text-area-counter')}`, expectedDescription);
            break;
        case 'education':
            click(`${de('select-education')} .composable-select__choice`);
            click(`${de('select-education-option-0')}`);
            break;
        case 'financialResourceStatus':
            click(`${de('social-health-option-0')} .radio-button__label`);
            break;
        case 'genderIdentity':
        case 'sexualOrientation':
            assert.dom(de('txt-social-health-notes')).isDisabled('Notes is disabled until an option is picked');
            await click(`${de('social-health-option-0')} .radio-button__label`);
            assert.dom(de('txt-social-health-notes')).isNotDisabled('Notes is enabled after picking an option');
            break;
    }
    await click(de('btn-social-health-save'));
    assert.dom(`${deFieldSection} ${de('behavioral-health-placeholder-text')}`).doesNotExist('Placeholder text is hidden when field is not empty');
    assert.dom(`${deFieldSection} ${de('behavioral-health-field-item-0')} a`).hasText(expectedDescription);
    if (expectedDate) {
        assert.dom(`${deFieldSection} ${de('behavioral-health-field-item-0')} span`).hasText(expectedDate);
    }
}

async function assertUpdateSocialHealthField(assert, fieldKey, initialDescription, expectedDescription, initialDate, expectedDate) {
    const deFieldSection = de(`${fieldKey}-section`);
    const deFieldDetail = de(`${fieldKey}-detail`);

    assert.dom(`${deFieldSection} ${de('behavioral-health-placeholder-text')}`).doesNotExist('Placeholder text is hidden when field is not empty');
    assert.dom(`${deFieldSection} ${de('behavioral-health-field-item-0')} a`).hasText(initialDescription);
    if (initialDate) {
        assert.dom(`${deFieldSection} ${de('behavioral-health-field-item-0')} span`).hasText(initialDate);
    }
    await click(`${deFieldSection} ${de('behavioral-health-field-item-0')}`);
    assert.dom(de('btn-social-health-delete')).doesNotHaveClass('hidden', 'Delete button is hidden unless content is present');
    switch (fieldKey) {
        case 'socialHistory':
            fillIn(`${deFieldDetail} ${de('text-area-counter')}`, expectedDescription);
            break;
        case 'education':
            click(`${de('select-education')} .composable-select__choice`);
            click(`${de('select-education-option-1')}`);
            break;
        case 'financialResourceStatus':
            click(`${de('social-health-option-1')} .radio-button__label`);
            break;
        case 'genderIdentity':
        case 'sexualOrientation':
            assert.dom(de('txt-social-health-notes')).isNotDisabled('Notes is enabled after picking an option');
            click(`${de('social-health-option-1')} .radio-button__label`);
            break;
    }
    await click(de('btn-social-health-save'));
    assert.dom(`${deFieldSection} ${de('behavioral-health-field-item-0')} a`).hasText(expectedDescription);
    if (expectedDate) {
        assert.dom(`${deFieldSection} ${de('behavioral-health-field-item-0')} span`).hasText(expectedDate);
    }
}

async function assertDeleteSocialHealthField(assert, fieldKey, initialDescription, initialDate) {
    const deFieldSection = de(`${fieldKey}-section`);

    assert.dom(`${deFieldSection} ${de('behavioral-health-placeholder-text')}`).doesNotExist('Placeholder text is hidden when field is not empty');
    assert.dom(`${deFieldSection} ${de('behavioral-health-field-item-0')} a`).hasText(initialDescription);
    if (initialDate) {
        assert.dom(`${deFieldSection} ${de('behavioral-health-field-item-0')} span`).hasText(initialDate);
    }
    await click(`${deFieldSection} ${de('behavioral-health-field-item-0')}`);
    assert.dom(de('btn-social-health-delete')).doesNotHaveClass('hidden', 'Delete button is hidden unless content is present');
    await click(de('btn-social-health-delete'));
    assert.dom(`${deFieldSection} ${de('behavioral-health-placeholder-text')}`).doesNotHaveClass('hidden', 'Placeholder text displays for empty fields');
}

test('Add social health fields', async assert => {
    server.put('ClinicalEndpoint/api/v2/PersonalMedicalHistory/:id', () => new Mirage.Response(204, {}, null));
    server.put('PatientEndpoint/api/v3/patients/patientDemographic/:id', ({ db }, request) => JSON.parse(request.requestBody));
    await visit('/PF/charts/patients/c5faffde-78e2-4924-acaf-2115bc686d5e/summary');
    await click(de('link-display-settings'));
    enableTheSwitches();
    await click(de('btn-save-control-bar'));
    await assertAddSocialHealthField(assert, 'socialHistory', 'This one time when I was a wee lad, I forgot to brush my hair');
    await assertAddSocialHealthField(assert, 'financialResourceStatus', 'Very hard', moment().format('MM/DD/YYYY'));
    await assertAddSocialHealthField(assert, 'education', 'Never attended/kindergarten only', moment().format('MM/DD/YYYY'));
    await assertAddSocialHealthField(assert, 'genderIdentity', 'Male');
    await assertAddSocialHealthField(assert, 'sexualOrientation', 'Straight or heterosexual');
});

test('Update social health fields', async assert => {
    server.put('ClinicalEndpoint/api/v2/PersonalMedicalHistory/:id', () => new Mirage.Response(204, {}, null));
    server.put('PatientEndpoint/api/v3/patients/patientDemographic/:id', ({ db }, request) => JSON.parse(request.requestBody));
    await visit('/PF/charts/patients/fd198d85-b2e4-435b-854a-b924b3261d75/summary');
    await click(de('link-display-settings'));
    enableTheSwitches();
    await click(de('btn-save-control-bar'));
    await assertUpdateSocialHealthField(assert, 'socialHistory', 'asdfasd', 'This one time when I was a wee lad, I forgot to brush my hair');
    await assertUpdateSocialHealthField(assert, 'financialResourceStatus', 'Very hard', 'Hard', moment().format('MM/DD/YYYY'), moment().format('MM/DD/YYYY'));
    await assertUpdateSocialHealthField(assert, 'education', 'Never attended/kindergarten only', '1st grade', moment().format('MM/DD/YYYY'), moment().format('MM/DD/YYYY'));
    await assertUpdateSocialHealthField(assert, 'genderIdentity', 'Male', 'Female');
    await assertUpdateSocialHealthField(assert, 'sexualOrientation', 'Straight or heterosexual', 'Lesbian, gay or homosexual');
});

test('Delete social health fields', async assert => {
    server.put('ClinicalEndpoint/api/v2/PersonalMedicalHistory/:id', () => new Mirage.Response(204, {}, null));
    server.delete('PatientEndpoint/api/v3/patients/:id/demographics/:key', () => new Mirage.Response(204, {}, null));
    server.delete('PatientEndpoint/api/v3/patients/:id/demographics/:key/:optionGuid', () => new Mirage.Response(204, {}, null));
    await visit('/PF/charts/patients/fd198d85-b2e4-435b-854a-b924b3261d75/summary');
    await click(de('link-display-settings'));
    enableTheSwitches();
    await click(de('btn-save-control-bar'));
    await assertDeleteSocialHealthField(assert, 'socialHistory', 'asdfasd');
    await assertDeleteSocialHealthField(assert, 'financialResourceStatus', 'Very hard', moment().format('MM/DD/YYYY'));
    await assertDeleteSocialHealthField(assert, 'education', 'Never attended/kindergarten only', moment().format('MM/DD/YYYY'));
    await assertDeleteSocialHealthField(assert, 'genderIdentity', 'Male');
    await assertDeleteSocialHealthField(assert, 'sexualOrientation', 'Straight or heterosexual');
});
