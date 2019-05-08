import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';
import getText from 'boot/tests/helpers/get-text';

const OSTEOPOROSIS_MODAL = '.osteoporosis-dexa-modal';
const IMAGING_ORDER_BUTTON = 'imaging-order-btn';
const IMAGING_RESULT_BUTTON = 'imaging-result-btn';
const IMAGING_ORDER_URL = '/PF/charts/patients/ecd212c3-5c99-499e-b3c6-b2645b8a4c98/orders';
const IMAGING_RESULT_URL = '/PF/charts/patients/ecd212c3-5c99-499e-b3c6-b2645b8a4c98/results/new/imaging';

moduleForAcceptanceAuth('Acceptance - Core - Clinical | Osteoporosis modal', {
});

test('Osteoposis modal links imaging orders appropriately', async assert => {
    const patientPracticeGuid = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
    const transcriptGuid = '7022d94f-d70a-4722-a205-dac898cf9f69';
    const alertText = 'Osteoporosis screening: Patient has no record of osteoporosis screening. Consider DXA or document results.';

    server.get('AlertEndpoint/api/v1/CdsAlerts/:patientPracticeGuid/:transcriptGuid', () => [{
        alertIdentifier: 'CDS.Osteoporosis.Order',
        ruleId: 35,
        alertText,
        citations: ['Quality Payment Program, Measure #39: Screening for Osteoporosis for Women Aged 65-85 Years of Age – National Quality Strategy Domain: Effective Clinical Care. Measure Source: Centers for Medicare and Medicaid Services. Version 1.0 11/15/2016'],
        developer: 'Practice Fusion, Inc.',
        sponsor: 'Amgen Inc.',
        link: 'https://mdinteractive.com/files/uploaded/file/CMS2017/2017_Measure_039_Registry.pdf',
        source: 'Practice Fusion, Inc.',
        actionLinkType: 'showOsteoporosisModal',
        actionLinkData: 'isOrderVisible=true',
        actionLinkText: 'Document DXA results',
        error: false
    }]);
    await visit(`/PF/charts/patients/${patientPracticeGuid}/encounter/${transcriptGuid}`);
    assert.equal(find('.ember-accordion-container').length, 1, 'There are 1 CDS alert container');
    assert.equal(getText('.ember-accordion-header .cds-alert-text'), alertText, 'The CDS alert text renders correctly');
    assert.equal(getText('.ember-accordion-header .custom-action'), 'Document DXA results', 'The custom action text is correct');
    await click('.ember-accordion-header .custom-action a');
    assert.equal(find(OSTEOPOROSIS_MODAL).length, 1, 'The osteoporosis modal is shown');
    assert.equal(find(de(IMAGING_ORDER_BUTTON)).length, 1, 'The imaging order button is shown');
    assert.equal(find(de(IMAGING_RESULT_BUTTON)).length, 1, 'The imaging results button is shown');

    await click(de(IMAGING_ORDER_BUTTON));
    assert.ok(currentURL().indexOf(IMAGING_ORDER_URL) === 0);
});

test('Osteoposis modal links imaging results appropriately', async assert => {
    const patientPracticeGuid = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
    const transcriptGuid = '7022d94f-d70a-4722-a205-dac898cf9f69';
    const alertText = 'Osteoporosis screening: Patient has no record of osteoporosis screening. Consider DXA or document results.';

    server.get('AlertEndpoint/api/v1/CdsAlerts/:patientPracticeGuid/:transcriptGuid', () => [{
        alertIdentifier: 'CDS.Osteoporosis.Order',
        ruleId: 35,
        alertText,
        citations: ['Quality Payment Program, Measure #39: Screening for Osteoporosis for Women Aged 65-85 Years of Age – National Quality Strategy Domain: Effective Clinical Care. Measure Source: Centers for Medicare and Medicaid Services. Version 1.0 11/15/2016'],
        developer: 'Practice Fusion, Inc.',
        sponsor: 'Amgen Inc.',
        link: 'https://mdinteractive.com/files/uploaded/file/CMS2017/2017_Measure_039_Registry.pdf',
        source: 'Practice Fusion, Inc.',
        actionLinkType: 'showOsteoporosisModal',
        actionLinkData: 'isOrderVisible=true',
        actionLinkText: 'Document DXA results',
        error: false
    }]);
    await visit(`/PF/charts/patients/${patientPracticeGuid}/encounter/${transcriptGuid}`);
    assert.equal(find('.ember-accordion-container').length, 1, 'There are 1 CDS alert container');
    assert.equal(getText('.ember-accordion-header .cds-alert-text'), alertText, 'The CDS alert text renders correctly');
    assert.equal(getText('.ember-accordion-header .custom-action'), 'Document DXA results', 'The custom action text is correct');
    await click('.ember-accordion-header .custom-action a');
    assert.equal(find(OSTEOPOROSIS_MODAL).length, 1, 'The osteoporosis modal is shown');
    assert.equal(find(de(IMAGING_ORDER_BUTTON)).length, 1, 'The imaging order button is shown');
    assert.equal(find(de(IMAGING_RESULT_BUTTON)).length, 1, 'The imaging results button is shown');

    await click(de(IMAGING_RESULT_BUTTON));
    assert.ok(currentURL().indexOf(IMAGING_RESULT_URL) === 0);
});

test('Osteoposis modal hides imaging order appropriately', async assert => {
    const patientPracticeGuid = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
    const transcriptGuid = '7022d94f-d70a-4722-a205-dac898cf9f69';
    const alertText = 'Osteoporosis screening: Patient has no record of osteoporosis screening. Consider DXA or document results.';

    server.get('AlertEndpoint/api/v1/CdsAlerts/:patientPracticeGuid/:transcriptGuid', () => [{
        alertIdentifier: 'CDS.Osteoporosis.Order',
        ruleId: 35,
        alertText,
        citations: ['Quality Payment Program, Measure #39: Screening for Osteoporosis for Women Aged 65-85 Years of Age – National Quality Strategy Domain: Effective Clinical Care. Measure Source: Centers for Medicare and Medicaid Services. Version 1.0 11/15/2016'],
        developer: 'Practice Fusion, Inc.',
        sponsor: 'Amgen Inc.',
        link: 'https://mdinteractive.com/files/uploaded/file/CMS2017/2017_Measure_039_Registry.pdf',
        source: 'Practice Fusion, Inc.',
        actionLinkType: 'showOsteoporosisModal',
        actionLinkData: 'isOrderVisible=false',
        actionLinkText: 'Document DXA results',
        error: false
    }]);
    await visit(`/PF/charts/patients/${patientPracticeGuid}/encounter/${transcriptGuid}`);
    assert.equal(find('.ember-accordion-container').length, 1, 'There are 1 CDS alert container');
    assert.equal(getText('.ember-accordion-header .cds-alert-text'), alertText, 'The CDS alert text renders correctly');
    assert.equal(getText('.ember-accordion-header .custom-action'), 'Document DXA results', 'The custom action text is correct');
    await click('.ember-accordion-header .custom-action a');
    assert.equal(find(OSTEOPOROSIS_MODAL).length, 1, 'The osteoporosis modal is shown');
    assert.equal(find(de(IMAGING_ORDER_BUTTON)).length, 0, 'The imaging order button is not shown');
    assert.equal(find(de(IMAGING_RESULT_BUTTON)).length, 1, 'The imaging results button is shown');
});
