import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import { run } from '@ember/runloop';

const ENCOUNTER_GUID = '7022d94f-d70a-4722-a205-dac898cf9f69';
const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
let store;

moduleForAcceptanceAuth('Acceptance - Core - Charting | CDS alert functionality', {
    beforeEach() {
        store = this.application.__container__.lookup('service:store');
    }
});

test('Cds Alerts Render', async assert => {
    await visit('/PF/charts/patients/' + PATIENT_GUID + '/encounter/' + ENCOUNTER_GUID);
    assert.equal(find('.cdsAccordion .cds-alerts').length, 1, 'There is 1 CDS alert container.');
    assert.ok(find('.cds-alert-text').length > 0, 'There is more than one CDS alert.');
});

test('A CDS alert is dismissible.', async assert => {
    await visit('/PF/charts/patients/' + PATIENT_GUID + '/encounter/' + ENCOUNTER_GUID);

    // Assert there are 6 CDS alerts to start, which there are based on the fixture data. Using .ember-accordion-container as the seleector
    assert.equal(find('.ember-accordion-container').length, 5, 'There are 5 CDS alert containers');

    // Click to dismiss the last alert
    await click('.ember-accordion-container:last-child .ember-accordion-header .icon-go-away-small');

    // Assert there are then 5 CDS alerts.
    assert.equal(find('.ember-accordion-container').length, 4, 'There are 4 CDS alert containers');
});

test('A cds alert according can be expanded', async assert => {
    await visit('/PF/charts/patients/' + PATIENT_GUID + '/encounter/' + ENCOUNTER_GUID);
    assert.ok(find('.ember-accordion-expand-icon:first'), 'The first expand icon exists.');

    // none before click
    assert.equal(find('.ember-accordion-pane-content').length, 0, 'No content panes are visible before clicking icon.');

    await click('.ember-accordion-expand-icon:first');
    assert.equal(find('.ember-accordion-pane-content').length, 1, 'One content pane is visible after clicking icon.');
});

test('Cds alert with infobutton links', async assert => {
    let cdsAlertCallCount = 0;
    let infobuttonUrl;
    const patientPracticeGuid = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
    const transcriptGuid = '7022d94f-d70a-4722-a205-dac898cf9f69';
    const alertText = 'Diabetes Care: Patient due for retina exam.';
    const cdsAccordion = 'div.cds-alert-text-custom-action';
    const refreshButton = 'a:contains(Refresh):eq(1)';
    const intendedUrl = 'https://apps.nlm.nih.gov/medlineplus/services/mpconnect.cfm?mainSearchCriteria.v.cs=2.16.840.1.113883.6.90&mainSearchCriteria.v.c=E11.9';
    const infobuttonParams = [{
        paramName: 'mainSearchCriteria.v.cs',
        paramValue: '2.16.840.1.113883.6.90'
    }, {
        paramName: 'mainSearchCriteria.v.c',
        paramValue: 'E11.9'
    }];

    server.get('PracticeEndpoint/api/v1/preferences/practice', () => ({ preferences: { 'infobutton.BaseUrl': null } }));

    server.get('AlertEndpoint/api/v1/CdsAlerts/:patientPracticeGuid/:transcriptGuid', () => {
        const params = cdsAlertCallCount < 2 ? infobuttonParams : [];
        cdsAlertCallCount++;

        return [{
            alertIdentifier: 'DiabetesCare.Eye',
            ruleId: 6,
            citations: [],
            developer: 'Practice Fusion, Inc.',
            sponsor: '',
            link: 'https://www.qualitymeasures.ahrq.gov/summaries/summary/49720',
            source: 'Practice Fusion, Inc.',
            error: false,
            infobutton: params,
            alertText
        }];
    });

    await visit(`/PF/charts/patients/${patientPracticeGuid}/encounter/${transcriptGuid}`);
    await click(cdsAccordion);
    infobuttonUrl = find('a:contains(Diagnostic/Therapeutic Information)')[0].href;

    assert.throws(findWithAssert('a:contains(Diagnostic/Therapeutic Information)'), 'Infobutton link appears when cds alert contains infobutton params');
    assert.equal(infobuttonUrl, intendedUrl, 'Infobutton defualts to Medline plus when practice preference is empty and link is constructed correctly');
    run(() => store.peekRecord('practice-preference', 'infobutton.BaseUrl').set('value', 'http://www.uptodate.com/online/content/search.do?'));

    await click(refreshButton);
    await click('div.cds-header');
    await delayAsync(100);
    await click(cdsAccordion);
    infobuttonUrl = find('a:contains(Diagnostic/Therapeutic Information)')[0].href;
    assert.ok(infobuttonUrl.indexOf('www.uptodate.com') >= 0, 'Base url is updated when practice preference is set');
    await click(refreshButton);
    await click('div.cds-header');
    await delayAsync(100);
    await click(cdsAccordion);
    assert.equal(find('a:contains(Diagnostic/Therapeutic Information)').length, 0, 'Infobutton link does not appear when cds alert does not contain infobutton params');
});
