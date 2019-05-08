import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';

const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98',
      TRANSCRIPT_GUID = '7022d94f-d70a-4722-a205-dac898cf9f69',
      ENCOUNTER_URL = '/PF/charts/patients/' + PATIENT_GUID + '/encounter/' + TRANSCRIPT_GUID,
      GOTO_BTN = `[data-toggle='dropdown']:contains('Go to')`,
      CUSTOMIZE_BTN = `a:contains('Customize')`,
      FLOWSHEETS_CHECKBOX = `.pf-input--checkbox-label:contains('Flowsheets')`,
      HEALTHCONCERNS_CHECKBOX = `.pf-input--checkbox-label:contains('Health concerns')`,
      DONE_CUSTOMIZING_BTN = `.customize-links a:contains('Done')`,
      FLOWSHEET_ENCOUNTER_LIST = '.flowsheet-list',
      HEALTHCONCERNS_LIST = '.patient-health-concerns-list',
      CUSTOMIZE_LIST = '.control-bar .dropdown-menu .pf-input--checkbox-label',
      FLOWSHEETS_GOTO_LINK = `a:contains('Flowsheets')`,
      HEALTHCONCERNS_GOTO_LINK = `a:contains('Health concerns')`;

moduleForAcceptanceAuth('Acceptance - Core - Charting | Customize summary and encounter - v2');

test('Customize Charting - Encounter test', async assert => {
    const customizeOptionsArr = [
        'Encounter details',
        'Chief complaint',
        'Health concerns',
        'Flowsheets',
        'Growth charts',
        'Diagnoses',
        'Allergies',
        'Medications',
        'Family history',
        'Immunizations',
        'Social history',
        'Past medical history',
        'Note - Subjective',
        'Note - Objective',
        'Note - Assessment',
        'Note - Plan',
        'Orders',
        'Attachments',
        'Procedures (S/I/A)',
        'Observations',
        'Quality of care',
        'Care plan',
        'Referrals',
        'Superbill'
    ];
    await visit(ENCOUNTER_URL);
    assert.ok(find(FLOWSHEET_ENCOUNTER_LIST).length > 0, 'Flowsheet encounter list renders properly upon load of the encounter.');
    await click(GOTO_BTN);
    await click(CUSTOMIZE_BTN);
    const customizeOpts = find(CUSTOMIZE_LIST);
    const customizeOptsLength = customizeOpts.length;
    let hasExpectedCustomizableOptions = true;
    for (let i = 0; i < customizeOptsLength; i++) {
        if (find(customizeOpts[i]).text().trim() !== customizeOptionsArr[i]) {
            hasExpectedCustomizableOptions = false;
        }
    }
    assert.ok(hasExpectedCustomizableOptions, 'Customize encounter options are rendered properly.');

    await click(FLOWSHEETS_CHECKBOX);
    await click(DONE_CUSTOMIZING_BTN);
    assert.equal(find(FLOWSHEET_ENCOUNTER_LIST).length, 0, 'Flowsheet encounter list is no longer visible on encounter after customization.');
    await click(GOTO_BTN);
    assert.equal(find('.section-search ' + FLOWSHEETS_GOTO_LINK).attr('class'), 'disabled', 'Flowsheets link from goto dropdown menu is now disabled on encounter.');
    await click(CUSTOMIZE_BTN);
    await click(FLOWSHEETS_CHECKBOX);
    await click(DONE_CUSTOMIZING_BTN);
    assert.equal(find('.section-search ' + FLOWSHEETS_GOTO_LINK).attr('class'), undefined, 'Flowsheets link from goto dropdown menu is no longer disabled on encounter.');
    assert.ok(find(FLOWSHEET_ENCOUNTER_LIST).length > 0, 'Flowsheet encounter list is visible again on encounter after customization.');

    assert.equal(find(HEALTHCONCERNS_LIST).length, 0, 'Health Concerns section hidden on encounter by default (intended for new users) before customization.');
    await click(GOTO_BTN);
    await click(CUSTOMIZE_BTN);
    await click(HEALTHCONCERNS_CHECKBOX);
    await click(DONE_CUSTOMIZING_BTN);
    assert.ok(find(HEALTHCONCERNS_LIST).length > 0, 'Health Concerns section shown on encounter after customization.');
    await click(GOTO_BTN);
    assert.equal(find('.section-search ' + HEALTHCONCERNS_GOTO_LINK).attr('class'), undefined, 'Health concerns link from goto dropdown menu is enabled on encounter.');
    await click(CUSTOMIZE_BTN);
    await click(HEALTHCONCERNS_CHECKBOX);
    await click(DONE_CUSTOMIZING_BTN);
    assert.equal(find('.section-search ' + HEALTHCONCERNS_GOTO_LINK).attr('class'), 'disabled', 'Health concerns link from goto dropdown menu is disabled again on encounter.');
    assert.equal(find(HEALTHCONCERNS_LIST).length, 0, 'Health concerns list is hidden again on encounter after customization.');
});
