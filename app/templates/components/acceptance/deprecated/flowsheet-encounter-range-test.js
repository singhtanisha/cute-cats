import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';
import dv from 'boot/tests/helpers/data-value';
import Mirage from 'ember-cli-mirage';

const PATIENT_PRACTICE_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const SUMMARY_URL = `/PF/charts/patients/${PATIENT_PRACTICE_GUID}/summary`;
const FLOWSHEET_LINK = 'summary-flowsheet-list-item';
const SELECT_RANGE_LINK = '.input-dropdown-button';
const CUSTOM_LINK = 'custom';
const SET_RANGE_BTN = '.pull-right .btn-primary';
const START_DATE_INPUT = 'flowsheet-modal-start-date';
const END_DATE_INPUT = 'flowsheet-modal-end-date';

// The following tests are based on user inputted ranges and asserting against what query params are sent to the service.
moduleForAcceptanceAuth('Acceptance - Core - Charting | Flowsheet range');

test('Flowsheet Encounter Range - Render last 5, 10 or most recent encounter(s) makes the proper service calls', async assert => {
    let callCount = 0;
    server.get('FlowsheetEndpoint/api/v1/patients/:patientPracticeGuid/flowsheetData/:flowsheetGuid', ({ db }, request) => {
        const { mostRecentCount } = request.queryParams;
        callCount++;
        if (callCount === 1) {
            assert.equal(mostRecentCount, '5', 'Flowsheets most recent call count default lists the last 5 encounters on load.');
        } else if (callCount === 2) {
            assert.equal(mostRecentCount, '10', 'Flowsheets most recent call count lists the last 10 encounters.');
        } else if (callCount === 3) {
            assert.equal(mostRecentCount, '1', 'Flowsheets most recent call count lists the last encounter.');
        } else if (callCount === 4) {
            assert.equal(mostRecentCount, '5', 'Flowsheets most recent call count lists the last 5 encounters.');
        }
        return db.flowsheetData.find(request.params.patientPracticeGuid);
    });

    await visit(SUMMARY_URL);
    await click(de(FLOWSHEET_LINK));
    await click(SELECT_RANGE_LINK);
    await click(dv('lastTen'));
    await click('.input-dropdown-button');
    await click(dv('mostRecent'));
    await click('.input-dropdown-button');
    click(dv('lastFive'));
});

test('Flowsheet Encounter Range - Render encounters from a specified date range makes the proper service calls', async assert => {
    const dateFormat = 'MM/DD/YYYY';
    const startDate = moment('11/03/2016').format(dateFormat);
    const endDate = moment('11/06/2016').format(dateFormat);
    let callCount = 0;

    server.get('FlowsheetEndpoint/api/v1/patients/:patientPracticeGuid/flowsheetData/:flowsheetGuid', ({ db }, request) => {
        const { fromDate, toDate } = request.queryParams;
        callCount++;
        if (callCount === 1) {
            assert.ok('Flowsheets are loaded from service.');
        } else if (callCount === 2) {
            // Dates need to be converted to utc for normalization during testing run time
            assert.equal(moment(fromDate).utc().format(dateFormat), moment(startDate).utc().format(dateFormat), 'Correct start date range is sent to flowsheetData service.');
            // End date is set to end of day, so we need to set the endDate to end of day to compare.
            assert.equal(moment(toDate).utc().format(dateFormat), moment(endDate).endOf('day').utc().format(dateFormat), 'Correct end date range is sent to flowsheetData service.');
        } else if (callCount === 3) {
            assert.equal(fromDate, 'Invalid date', 'Empty start date sets the fromDate as invalid to the flowsheetData service.');
            assert.equal(toDate, 'Invalid date', 'Empty end date sets the toDate as invalid to the flowsheetData service.');
            return new Mirage.Response(400);
        }

        return db.flowsheetData.find(request.params.patientPracticeGuid);
    });

    await visit(SUMMARY_URL);
    await click(de(FLOWSHEET_LINK));
    await click(SELECT_RANGE_LINK);
    await click(dv(CUSTOM_LINK));
    assert.ok(find('.content-modal').length > 0, 'The custom range of flowsheets modal pops up.');
    await fillIn(de(START_DATE_INPUT), startDate);
    await fillIn(de(END_DATE_INPUT), endDate);
    await click(SET_RANGE_BTN);
    await click('.input-dropdown-button');
    await click(dv('custom'));
    // Invalid dates sent to service returns 400
    await fillIn(de(START_DATE_INPUT), '');
    await fillIn(de(END_DATE_INPUT), '');
    click(SET_RANGE_BTN);
});

test('Flowsheet Encounter Range - Render encounters from a specified number of columns makes the proper service calls', async assert => {
    let callCount = 0;
    server.get('FlowsheetEndpoint/api/v1/patients/:patientPracticeGuid/flowsheetData/:flowsheetGuid', ({ db }, request) => {
        const { mostRecentCount } = request.queryParams;
        callCount++;
        if (callCount === 1) {
            assert.ok('Flowsheets are loaded from service.');
        } else if (callCount === 2) {
            assert.equal(mostRecentCount, '2', 'Setting custom column range to 2 sends the propery query parameter to flowsheetData service call.');
        }
        return db.flowsheetData.find(request.params.patientPracticeGuid);
    });

    await visit(SUMMARY_URL);
    await click(de(FLOWSHEET_LINK));
    await click(SELECT_RANGE_LINK);
    await click(dv(CUSTOM_LINK));
    assert.ok(find('.content-modal').length > 0, 'The custom range of flowsheets modal pops up.');
    await click(de('flowsheet-modal-column-range'));
    await fillIn(de('flowsheet-modal-n-most-recent'), '2');
    click(SET_RANGE_BTN);
});

test('Flowsheet Encounter Range - Refresh renders last selected number of encounters to display', async assert => {
    let callCount = 0;
    server.get('FlowsheetEndpoint/api/v1/patients/:patientPracticeGuid/flowsheetData/:flowsheetGuid', ({ db }, request) => {
        const { mostRecentCount } = request.queryParams;
        callCount++;
        if (callCount === 1) {
            assert.equal(mostRecentCount, '5', 'Flowsheets most recent call count default lists the last 5 encounters on load.');
        } else if (callCount === 2) {
            assert.equal(mostRecentCount, '10', 'Flowsheets most recent call count lists the last 10 encounters.');
        } else if (callCount === 3) {
            assert.equal(mostRecentCount, '10', 'Flowsheets most recent call count retains user selected number of encounters (10) on refresh.');
        }
        return db.flowsheetData.find(request.params.patientPracticeGuid);
    });

    await visit(SUMMARY_URL);
    await click(de(FLOWSHEET_LINK));
    await click(SELECT_RANGE_LINK);
    await click(dv('lastTen'));
    await click('.input-dropdown-button');
    await click(de('flowsheet-refresh-link'));
    assert.equal(find(SELECT_RANGE_LINK).text().trim(), 'Last 10 encounters or labs', 'Refresh flowsheet retains user selected number of encounters to render.');
});
