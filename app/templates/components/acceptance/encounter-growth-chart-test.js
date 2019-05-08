import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';
import getText from 'boot/tests/helpers/get-text';
import Mirage from 'ember-cli-mirage';
import flowsheetDataRepository from 'flowsheets/repositories/flowsheet-data';

const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const TRANSCRIPT_GUID = '7022d94f-d70a-4722-a205-dac898cf9f69';
const SUMMARY_URL = '/PF/charts/patients/' + PATIENT_GUID + '/summary';
const ENCOUNTER_URL = '/PF/charts/patients/' + PATIENT_GUID + '/encounter/' + TRANSCRIPT_GUID;
const GROWTH_CHART_URL = '/PF/charts/patients/' + PATIENT_GUID + '/growthcharts';
const GOTO_BTN = '[data-toggle="dropdown"]:contains("Go to")';
const GROWTH_CHARTS_BTN = 'a:contains("Growth charts")';
const ENCOUNTER_SHOW_GROWTH_CHARTS = de('show-growth-charts-link');
const GIRL_TOOLTIP_TARGET = '.growth-chart.ht-wt.girl svg .line-chart__point-tooltip-target';
const BOY_TOOLTIP_TARGET = '.growth-chart.ht-wt.boy svg .line-chart__point-tooltip-target';
const INNER_TOOLTIP = '.line-chart__popover-content';
const GIRL_CHART_IMAGE = 'g-2-20yr-ht-wt.png';
const BOY_CHART_IMAGE = 'b-2-20yr-ht-wt.png';
const GROWTH_CHART_IMAGE = de('growth-chart-child-height-img');

moduleForAcceptanceAuth('Acceptance - Core - Charting | Encounter and summary growth chart - v2', {
    beforeEach() {
        flowsheetDataRepository.saveIsMetric(false);
    }
});

test('Can open growth chart from summary and renders blue chart for male patient', async assert => {
    await visit(SUMMARY_URL);
    await click(`${de('dropdown-go-to')} .composable-select__choice`);
    await click(de('dropdown-go-to-option-2'));
    assert.ok(find(GROWTH_CHART_IMAGE).attr('src').split('images/')[1], BOY_CHART_IMAGE, 'Loaded image for growth chart height and weight renders blue chart for male patient.');
    await click(BOY_TOOLTIP_TARGET + ':first');
    assert.equal(getText(INNER_TOOLTIP), '3 yrs 70 in', 'First data point point for vitals history - height renders properly on growth chart from summary for male patient.');
    await click(BOY_TOOLTIP_TARGET + ':eq(1)');
    assert.equal(getText(INNER_TOOLTIP), '3 yrs 75 in', 'Second data point point for vitals history - height renders properly on growth chart from summary for male patient.');
    await click(BOY_TOOLTIP_TARGET + ':eq(2)');
    assert.equal(getText(INNER_TOOLTIP), '3 yrs 120 lb', 'First data point point for vitals history - weight renders properly on growth chart from summary for male patient.');
    await click(BOY_TOOLTIP_TARGET + ':eq(3)');
    assert.equal(getText(INNER_TOOLTIP), '3 yrs 130 lb', 'Second data point point for vitals history - weight renders properly on growth chart from summary for male patient.');
});

test('Can open growth chart from encounter and renders blue chart for male patient', async assert => {
    await visit(ENCOUNTER_URL);
    await click(GOTO_BTN);
    await click(GROWTH_CHARTS_BTN);
    assert.ok(find(GROWTH_CHART_IMAGE).attr('src').split('images/')[1], BOY_CHART_IMAGE, 'Loaded image for growth chart height and weight renders blue chart for male patient.');
    await click(BOY_TOOLTIP_TARGET + ':first');
    assert.equal(getText(INNER_TOOLTIP), '3 yrs 70 in', 'First data point point for vitals history - height renders properly on growth chart from encounter for male patient.');
    await click(BOY_TOOLTIP_TARGET + ':eq(1)');
    assert.equal(getText(INNER_TOOLTIP), '3 yrs 75 in', 'Second data point point for vitals history - height renders properly on growth chart from encounter for male patient.');
    await click(BOY_TOOLTIP_TARGET + ':eq(2)');
    assert.equal(getText(INNER_TOOLTIP), '3 yrs 120 lb', 'First data point point for vitals history - weight renders properly on growth chart from encounter for male patient.');
    await click(BOY_TOOLTIP_TARGET + ':eq(3)');
    assert.equal(getText(INNER_TOOLTIP), '3 yrs 130 lb', 'Second data point point for vitals history - weight renders properly on growth chart from encounter for male patient.');
});

test('Can open growth chart from summary and renders red chart for female patient', async assert => {
    server.get('/PatientEndpoint/api/v1/patients/:id/patientRibbonInfo', ({ db }, request) => {
        const patientPracticeGuid = request.params.id;
        const patient = db.patientRibbonInfos.where({ patientPracticeGuid })[0];
        patient.gender = '1';
        patient.genderString = 'Female';
        return patient;
    });
    await visit(SUMMARY_URL);
    await click(`${de('dropdown-go-to')} .composable-select__choice`);
    await click(de('dropdown-go-to-option-2'));
    assert.ok(find(GROWTH_CHART_IMAGE).attr('src').split('images/')[1], GIRL_CHART_IMAGE, 'Loaded image for growth chart height and weight renders red chart for female patient.');
    await click(GIRL_TOOLTIP_TARGET + ':first');
    assert.equal(getText(INNER_TOOLTIP), '3 yrs 70 in', 'First data point point for vitals history - height renders properly on growth chart from summary for female patient.');
    await click(GIRL_TOOLTIP_TARGET + ':eq(1)');
    assert.equal(getText(INNER_TOOLTIP), '3 yrs 75 in', 'Second data point point for vitals history - height renders properly on growth chart from summary for female patient.');
    await click(GIRL_TOOLTIP_TARGET + ':eq(2)');
    assert.equal(getText(INNER_TOOLTIP), '3 yrs 120 lb', 'First data point point for vitals history - weight renders properly on growth chart from summary for female patient.');
    await click(GIRL_TOOLTIP_TARGET + ':eq(3)');
    assert.equal(getText(INNER_TOOLTIP), '3 yrs 130 lb', 'Second data point point for vitals history - weight renders properly on growth chart from summary for female patient.');
});

test('Can open growth chart directly and renders properly for female patient.', async assert => {
    server.get('/PatientEndpoint/api/v1/patients/:id/patientRibbonInfo', ({ db }, request) => {
        const patientPracticeGuid = request.params.id;
        const patient = db.patientRibbonInfos.where({ patientPracticeGuid })[0];
        patient.gender = '1';
        patient.genderString = 'Female';
        return patient;
    });
    await visit(GROWTH_CHART_URL);
    assert.ok(find(GROWTH_CHART_IMAGE).attr('src').split('images/')[1], GIRL_CHART_IMAGE, 'Loaded image for growth chart height and weight renders red chart for female patient.');
    await click(GIRL_TOOLTIP_TARGET + ':first');
    assert.equal(getText(INNER_TOOLTIP), '3 yrs 70 in', 'First data point point for vitals history - height renders properly on growth chart.');
    await click(GIRL_TOOLTIP_TARGET + ':eq(1)');
    assert.equal(getText(INNER_TOOLTIP), '3 yrs 75 in', 'Second data point point for vitals history - height renders properly on growth chart.');
    await click(GIRL_TOOLTIP_TARGET + ':eq(2)');
    assert.equal(getText(INNER_TOOLTIP), '3 yrs 120 lb', 'First data point point for vitals history - weight renders properly on growth chart.');
    await click(GIRL_TOOLTIP_TARGET + ':eq(3)');
    assert.equal(getText(INNER_TOOLTIP), '3 yrs 130 lb', 'Second data point point for vitals history - weight renders properly on growth chart.');
});

test('Can open growth chart from encounter and can toggle metric units', async assert => {
    let callCount = 0;
    server.put('/ChartingEndpoint/api/v1/UserOperation/Metric/:isMetric', ({ db }, request) => {
        const { isMetric } = request.params;
        callCount++;
        if (callCount === 1) {
            assert.equal(isMetric, 'true', 'Toggling from US Customary to Metric sends true query parameter to metric service call.');
        } else if (callCount === 2) {
            assert.equal(isMetric, 'false', 'Toggling from Metric to US Customary sends false query parameter to metric service call.');
        }
        return new Mirage.Response(204, {}, null);
    });
    await visit(ENCOUNTER_URL);
    await click(ENCOUNTER_SHOW_GROWTH_CHARTS);
    // Confirm that US customary first
    const flowsheetMetricToggle = 'flowsheet-metric-toggle-link';
    assert.equal(find(de(flowsheetMetricToggle)).text(), 'US Customary', 'Encounter loads with US Customary units');
    // Toggle to Metric
    await click(de(flowsheetMetricToggle));
    assert.equal(find(de(flowsheetMetricToggle)).text(), 'Metric', 'Encounter flowsheet metric toggle now renders Metrics units');
    await click(BOY_TOOLTIP_TARGET + ':first');
    assert.equal(getText(INNER_TOOLTIP), '3 yrs 177.8 cm', 'First data point point for vitals history - metric height renders properly on growth chart from encounter.');
    await click(BOY_TOOLTIP_TARGET + ':eq(1)');
    assert.equal(getText(INNER_TOOLTIP), '3 yrs 190.5 cm', 'Second data point point for vitals history - metric height renders properly on growth chart from encounter.');
    await click(BOY_TOOLTIP_TARGET + ':eq(2)');
    assert.equal(getText(INNER_TOOLTIP), '3 yrs 54.43 kg', 'First data point point for vitals history - metric weight renders properly on growth chart from encounter.');
    await click(BOY_TOOLTIP_TARGET + ':eq(3)');
    assert.equal(getText(INNER_TOOLTIP), '3 yrs 58.97 kg', 'Second data point point for vitals history - metric weight renders properly on growth chart from encounter.');

    // Toggle back to US Customary
    await click(de(flowsheetMetricToggle));
    await click(BOY_TOOLTIP_TARGET + ':first');
    assert.equal(getText(INNER_TOOLTIP), '3 yrs 70 in', 'First data point point for vitals history - US Customary height renders properly on growth chart from encounter.');
    await click(BOY_TOOLTIP_TARGET + ':eq(1)');
    assert.equal(getText(INNER_TOOLTIP), '3 yrs 75 in', 'Second data point point for vitals history - US Customary height renders properly on growth chart from encounter.');
    await click(BOY_TOOLTIP_TARGET + ':eq(2)');
    assert.equal(getText(INNER_TOOLTIP), '3 yrs 120 lb', 'First data point point for vitals history - US Customary weight renders properly on growth chart from encounter.');
    await click(BOY_TOOLTIP_TARGET + ':eq(3)');
    assert.equal(getText(INNER_TOOLTIP), '3 yrs 130 lb', 'Second data point point for vitals history - US Customary weight renders properly on growth chart from encounter.');
});

test('Can open growth chart from summary and renders metric units for patient', async assert => {
    server.put('/ChartingEndpoint/api/v1/UserOperation/Metric/true', () => null);
    await visit(SUMMARY_URL);
    await click(`${de('dropdown-go-to')} .composable-select__choice`);
    await click(de('dropdown-go-to-option-2'));
    await click('.btn.heading-action.pull-left');
    await click(BOY_TOOLTIP_TARGET + ':first');
    assert.equal(getText(INNER_TOOLTIP), '3 yrs 177.8 cm', 'First data point point for vitals history - metric height renders properly on growth chart from summary.');
    await click(BOY_TOOLTIP_TARGET + ':eq(1)');
    assert.equal(getText(INNER_TOOLTIP), '3 yrs 190.5 cm', 'Second data point point for vitals history - metric height renders properly on growth chart from summary.');
    await click(BOY_TOOLTIP_TARGET + ':eq(2)');
    assert.equal(getText(INNER_TOOLTIP), '3 yrs 54.43 kg', 'First data point point for vitals history - metric weight renders properly on growth chart from summary.');
    await click(BOY_TOOLTIP_TARGET + ':eq(3)');
    assert.equal(getText(INNER_TOOLTIP), '3 yrs 58.97 kg', 'Second data point point for vitals history - metric weight renders properly on growth chart from summary.');
});

test('Can open growth chart from encounter and toggling between patients renders the correct plot points', async assert => {
    let growthChartCount = 0;
    let encounterSummaryCount = 0;
    server.put('/ChartingEndpoint/api/v1/UserOperation/Metric/true', () => null);
    server.get('/ChartingEndpoint/api/v3/patients/:patientGuid/growthCharts', ({ db }) => {
        growthChartCount++;
        const growthCharts = db.growthCharts;
        if (growthChartCount === 2) {
            return [{
                'observationGuid':'08d3fd32-2c26-898f-981b-1afcc19ae937',
                'transcriptGuid':'GROWTH_CHART_TRANSCRIPT_EMPTY',
                'eventSetGuid':'6087f089-9789-4a8e-8642-5ebfeb615658',
                'patientPracticeGuid' : 'c5faffde-78e2-4924-acaf-2115bc686d5e',
                'eventDateTimeUtc':'2016-10-25T23:53:00Z',
                'code':{
                    'codeSystem':'LOINC',
                    'code':'8302-2'
                },
                'value':'150.0',
                'units':'cm'
            }];
        }
        return growthCharts;
    });
    server.get('ChartingEndpoint/api/v2/EncounterSummary', ({ db }) => {
        encounterSummaryCount++;
        if (encounterSummaryCount === 2) {
            return [{
                'transcriptGuid': 'GROWTH_CHART_TRANSCRIPT_EMPTY',
                'encounterType': 'Office Visit',
                'dateOfService': '2016-01-19T00:00:00Z',
                'seenByProvider': '',
                'seenByProviderGuid': 'eaa90f53-9dfa-4c2a-93db-83f3b3243d5b',
                'signed': false,
                'noteType': 'SOAP Note',
                'facilityGuid': 'cac98ae6-1add-4780-b923-1df79732add6',
                'createdDateTime': '2016-01-19T18:07:11.85Z',
                'lastModifiedDateTime': '2016-03-04T19:31:52.233Z'
            }];
        }
        return db.encounterSummaries;
    });
    await visit(SUMMARY_URL);
    await click(de('encounter-item-0'));
    await click(de('show-growth-charts-link'));
    await click('[data-tracking="Patient lists"]');
    await wait();
    await click('[data-guid="c5faffde-78e2-4924-acaf-2115bc686d5e"]');
    // Get another patient's encounter
    await click(de('encounter-item-0'));
    assert.ok('ok');
    await click(BOY_TOOLTIP_TARGET + ':first');
    assert.equal(getText(INNER_TOOLTIP), '3 yrs 59.06 in', 'Data point for vitals history in growth charts renders for second patient.');
    await click('.menu-label:contains("Some L Baby")');
    await click(BOY_TOOLTIP_TARGET + ':first');
    assert.equal(getText(INNER_TOOLTIP), '3 yrs 70 in', 'Data point for vitals history in growth charts renders correctly for first patient after toggling from one patient to another.');
});
