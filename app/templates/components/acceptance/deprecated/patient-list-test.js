import { isEmpty } from '@ember/utils';
import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';
import getText from 'boot/tests/helpers/get-text';
import config from 'boot/config';

moduleForAcceptanceAuth('Acceptance - Visual - Core - Charting | Patient list', {
    beforeEach() {
        if (window.localStorage && window.localStorage.clear) {
            window.localStorage.clear();
        }
    }
});

const page = '.charts.outlet';
const buttonBar = `${page} .charts-list-toolbar`;
const providerDropdown = `${buttonBar} ${de('patient-list-provider-dropdown')}`;
const recentPatientList = `${page} .recent-patients-container`;
const firstRecentPatient = `${recentPatientList} .row-patient:first`;
const firstNameColumn = 'first-name-column';
const patientPracticeGuid = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const inactiveCheckbox = `${buttonBar} .show-inactive-checkbox`;
const inactiveCheckboxInput = `${inactiveCheckbox} input`;
const PREFERENCES = { preferences: {} };

function headerColumn(dataElement) {
    return `${page} .header-row ${de(dataElement)}`;
}
function validateColumnSort(assert, dataElement, isAscending) {
    const arrow = isAscending ? '.arrow-up' : '.arrow-down';
    assert.throws(findWithAssert(`${headerColumn(dataElement)} ${arrow}`), 'The correct column sort is visible');
}
function validateFirstRecentPatientColumn(assert, column, expected) {
    assert.equal(getText(`${firstRecentPatient} ${de(column)}`), expected, `The first patient's ${column} is correct`);
}
function validateFirstScheduledPatientColumn(assert, column, expected) {
    assert.equal(getText(find(`#appointments .row-patient ${de(column)}`).first()), expected, `The first patient's ${column} is correct`);
}
function validateFirstSearchPatientColumn(assert, column, expected) {
    assert.equal(getText(`#search-results .row-patient:first-child ${de(column)}`), expected, `The first patient's ${column} is correct`);
}

test('Recent patients list', async assert => {
    config.isNewPatientListChartOn = false;
    server.get('PracticeEndpoint/api/v1/preferences/provider', () => PREFERENCES);
    await visit('/PF/charts/list');
    percySnapshot(assert);
    assert.throws(findWithAssert(`${buttonBar} ${de('new-patient-button')}`), 'The new patient button exists');
    assert.throws(findWithAssert(`${buttonBar} .patient-search2`), 'The patient search box exists');
    assert.throws(findWithAssert(inactiveCheckbox), 'The show inactive checkbox exists');
    click(`${de('patient-list-scheduled-recent-toggle-1')}`);
    click(`${providerDropdown} .composable-select__choice`);
    await click(`${providerDropdown} .composable-select__result-item:eq(1)`);
    assert.equal(getText(de('patient-list-number-of-patients')), '0 recent patients', 'The correct number of recent patients is displayed');
    if (!find(inactiveCheckboxInput)[0].checked) {
        click(inactiveCheckboxInput);
    }
    click(`${providerDropdown} .composable-select__choice`);
    await click(`${providerDropdown} .composable-select__result-item:eq(0)`);
    await wait();
    assert.equal(getText(de('patient-list-number-of-patients')), '55 recent patients', 'The correct number of recent patients is displayed');
    validateColumnSort(assert, 'accessed-column', false);
    validateFirstRecentPatientColumn(assert, 'patient-first-name', 'Testtest');
    validateFirstRecentPatientColumn(assert, 'patient-last-name', 'PAtient');
    validateFirstRecentPatientColumn(assert, 'patient-dob', '09/02/2015 Sep 02, 2015');
    validateFirstRecentPatientColumn(assert, 'patient-gender', 'Male');
    validateFirstRecentPatientColumn(assert, 'patient-address', '1 fake street, San Francisco, CA 94110');
    validateFirstRecentPatientColumn(assert, 'patient-record-number', 'PRN PT169775');
    validateFirstRecentPatientColumn(assert, 'patient-phone-numbers', 'M (123) 123-1234');
    assert.throws(findWithAssert(`${recentPatientList} .row-patient ${de('patient-first-name')}:contains('(Inactive)')`), 'An inactive patient is visible after clicking the inactive checkbox');
    await click(`${recentPatientList} [data-guid="${patientPracticeGuid}"]`);
    assert.equal(currentURL(), `/PF/charts/patients/${patientPracticeGuid}/summary`, 'The patient was opened after clicking on it');
    await click('.pf.outlet .menu-list li a:contains("Patient lists")');
    await click(headerColumn(firstNameColumn));
    validateColumnSort(assert, firstNameColumn, true);
    await click(headerColumn(firstNameColumn));
    validateColumnSort(assert, firstNameColumn, false);
    // Disabling for now. This was causing failures after the ember 2.4
    // upgrade. The test would only fail when run as part of the entire test suite
    // validateFirstRecentPatientColumn(assert, 'patient-first-name', 'zxc');
    // validateFirstRecentPatientColumn(assert, 'patient-last-name', 'zxc');
    // click(headerColumn('dob-column')).then(() => {
    //     validateColumnSort(assert, 'dob-column', true);
    //     validateFirstRecentPatientColumn(assert, 'patient-first-name', 'new');
    //     validateFirstRecentPatientColumn(assert, 'patient-last-name', 'patient');
    // });
});

test('Scheduled patients list', async assert => {
    config.isNewPatientListChartOn = false;
    const dateFormat = 'YYYY-MM-DD';
    const today = moment().format(dateFormat);
    const tomorrow = moment().add(1, 'days').format(dateFormat);
    let lastScheduleDate;
    let lastProviderGuid;
    server.get('ChartingEndpoint/api/v2/Appointment', ({ db }, request) => {
        lastScheduleDate = request.queryParams.scheduleDate;
        lastProviderGuid = request.queryParams.providerGuid;

        if (isEmpty(lastProviderGuid) && lastScheduleDate === today) {
            return db.chartsAppointments;
        }
        return [];
    });
    server.get('PracticeEndpoint/api/v1/preferences/provider', () => PREFERENCES);

    await visit('/PF/charts/list/all/recent');
    await click(`${de('patient-list-scheduled-recent-toggle-0')}`);
    assert.equal(getText(de('patient-list-number-of-patients')), '4 scheduled', 'The correct number of scheduled patients is displayed');
    assert.equal(getText('.date-navigation-date'), moment().format('dddd, MMM Do'), 'Today\'s date is displayed correctly');
    assert.equal(lastScheduleDate, today, 'The appointments endpoint was called with the correct initial date');
    validateColumnSort(assert, 'appointment-time-column', true);
    validateFirstScheduledPatientColumn(assert, 'patient-first-name', 'Some L');
    validateFirstScheduledPatientColumn(assert, 'patient-last-name', 'Baby');
    validateFirstScheduledPatientColumn(assert, 'patient-dob', '02/01/2013 Feb 01, 2013');
    validateFirstScheduledPatientColumn(assert, 'patient-gender', 'Male');
    validateFirstScheduledPatientColumn(assert, 'patient-address', '123 Who cares, No way, AL 95835');
    validateFirstScheduledPatientColumn(assert, 'patient-phone-numbers', 'M (555) 555-5554 H (555) 456-7890');
    validateFirstScheduledPatientColumn(assert, 'patient-appointment-date', '10:00 AM');
    validateFirstScheduledPatientColumn(assert, 'patient-appointment-status', 'Pending');
    await click(headerColumn(firstNameColumn));
    validateColumnSort(assert, firstNameColumn, true);
    await click(headerColumn(firstNameColumn));
    validateColumnSort(assert, firstNameColumn, false);
    validateFirstScheduledPatientColumn(assert, 'patient-first-name', 'Testtest');
    validateFirstScheduledPatientColumn(assert, 'patient-last-name', 'PAtient');
    await click(headerColumn('dob-column'));
    validateColumnSort(assert, 'dob-column', true);
    validateFirstScheduledPatientColumn(assert, 'patient-first-name', 'Some L');
    validateFirstScheduledPatientColumn(assert, 'patient-last-name', 'Baby');
    click(`${providerDropdown} .composable-select__choice`);
    await click(`${providerDropdown} .composable-select__result-item:eq(1)`);
    assert.ok(lastProviderGuid, 'The appointments endpoint was called with a provider guid after changing providers');
    assert.throws(findWithAssert(`${page} .no-appointments`), 'The empty state is visible when there are no scheduled patients');
    assert.equal(getText(de('patient-list-number-of-patients')), 'None Scheduled', 'The correct number of scheduled patients is displayed');
    await click('.charts-list-header .date-navigation .date-navigation-next');
    assert.equal(lastScheduleDate, tomorrow, 'The appointments endpoint was called with the correct date after clicking next');
    click('.charts-list-header .date-navigation .date-navigation-previous');
    click(`${providerDropdown} .composable-select__choice`);
    click(`${providerDropdown} .composable-select__result-item:eq(0)`);
    await click(`.row-patient[data-guid="${patientPracticeGuid}"]`);
    assert.equal(currentURL(), `/PF/charts/patients/${patientPracticeGuid}/summary`, 'The patient was opened after clicking on it');
});

test('Patient search', async assert => {
    config.isNewPatientListChartOn = false;
    let lastSearchQuery;
    server.post('PatientEndpoint/api/v1/patients/search', ({ db }, request) => {
        const data = JSON.parse(request.requestBody);
        lastSearchQuery = data.firstOrLastName;
        if (lastSearchQuery === 'empty') {
            return { patients: [] };
        }
        return db.patientSearches[0];
    });
    server.get('PracticeEndpoint/api/v1/preferences/provider', () => PREFERENCES);

    await visit('/PF/charts/list/all/recent');
    const patientSearch = '.patient-search2';
    const searchInput = `${patientSearch} input`;
    const searchButton = `${patientSearch} .filtered-search-btn`;
    fillIn(searchInput, 'empty');
    await click(searchButton);
    assert.equal(lastSearchQuery, 'empty', 'The search call was made with the correct firstOrLastName query');
    assert.throws(findWithAssert('#search-results .no-patients-found'), 'The empty state is displayed when no patients are found');
    click(`${patientSearch} .ember-select-search-choice-close`);
    fillIn(searchInput, 'test');
    await click(searchButton);
    validateFirstSearchPatientColumn(assert, 'patient-first-name', 'JOHNATHAN');
    validateFirstSearchPatientColumn(assert, 'patient-last-name', 'SWIFT');
    validateFirstSearchPatientColumn(assert, 'patient-dob', '10/24/1979 Oct 24, 1979');
    validateFirstSearchPatientColumn(assert, 'patient-address', '99238 VERTIGO LANE, MINNEAPOLIS, MN 55427');
    validateFirstSearchPatientColumn(assert, 'patient-phone-numbers', 'M (415) 555-4444 H (307) 855-3055');
    await click(headerColumn(firstNameColumn));
    validateColumnSort(assert, firstNameColumn, false);
    validateFirstSearchPatientColumn(assert, 'patient-first-name', 'Zart L');
    validateFirstSearchPatientColumn(assert, 'patient-last-name', 'Simpson');
    await click(headerColumn('dob-column'));
    validateColumnSort(assert, 'dob-column', true);
    validateFirstSearchPatientColumn(assert, 'patient-first-name', 'Test');
    validateFirstSearchPatientColumn(assert, 'patient-last-name', 'ER');
    await click(inactiveCheckboxInput);
    assert.throws(findWithAssert(`#search-results .row-patient ${de('patient-first-name')}:contains('(Inactive)')`), 'An inactive patient is visible after clicking the inactive checkbox');
    await click(`.row-patient[data-guid="${patientPracticeGuid}"]`);
    assert.equal(currentURL(), `/PF/charts/patients/${patientPracticeGuid}/summary`, 'The patient was opened after clicking on it');
});
