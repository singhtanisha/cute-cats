import { test } from 'qunit';
import de from 'boot/tests/helpers/data-element';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';

const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';

moduleForAcceptanceAuth('Acceptance - Core - Charting | Summary diagnoses print test - v2');

test('Print diagnoses from encounter summary with term code and confirm print labels and headers', async assert => {
    server.post('ChartingEndpoint/api/v2/PrintAudit', () => null);
    visit('/PF/charts/patients/' + PATIENT_GUID + '/summary');
    await click(`${de('diagnosis-display-select')} .composable-select__choice`);
    await click(de('diagnosis-display-select-option-0'));
    await click(de('print-diagnoses-button'));
    assert.throws(findWithAssert(`${de('print-diagnoses')} .row.header-row > div:contains('Acuity')`), 'There is an Acuity header');

    // Confirm there is an acute/historical diagnoses row for Chronic and Acute diagnoses
    assert.equal($('.row.header-row').find(`div:contains('Historical Diagnoses')`).length, 1, 'There is a historical diagnosis section for diagnoses');
    assert.equal($('.row.header-row').find(`div:contains('Current Diagnoses')`).length, 1, 'There is an active diagnosis section for diagnoses');

    // Confirm start/stop row labels for one of the rows
    assert.throws(findWithAssert(`.row.header-row:contains('Current Diagnoses') div:contains('Start')`), 'There is Start column under current diagnoses');
    assert.throws(findWithAssert(`.row.header-row:contains('Current Diagnoses') div:contains('Stop')`), 'There is Stop column under current diagnoses');

    // Confirm diagnoses code, start and stop dates for one diagnosis
    assert.throws(findWithAssert(`${de('diagnosis-item-text')}:contains('Unspecified fracture')`), 'There is a diagnosis present in the print preview for Term Code');
    assert.equal(find(`${de('print-diagnosis-start-date')}:eq(1)`).text(), '10/03/2016', 'There is a diagnosis start date present');
    assert.equal(find(`${de('print-diagnosis-stop-date')}:eq(1)`).text(), '10/31/2016', 'There is a diagnosis stop date present');

    click('.close-link');
});

test('Print diagnoses from encounter summary with Term', async assert => {
    server.post('ChartingEndpoint/api/v2/PrintAudit', () => null);
    await visit('/PF/charts/patients/' + PATIENT_GUID + '/summary');
    await click(`${de('diagnosis-display-select')} .composable-select__choice`);
    await click(de('diagnosis-display-select-option-1'));
    await click(de('print-diagnoses-button'));
    assert.throws(findWithAssert(`${de('diagnosis-item-text')}:contains('Broken femur')`), 'There is a diagnosis present in the print preview for Term');
    assert.equal(find(`${de('print-diagnosis-start-date')}:eq(0)`).text(), '11/03/2016', 'There is a diagnosis start date present');
    click('.close-link');
});

test('Print diagnoses - acute active and historical', async assert => {
    server.post('ChartingEndpoint/api/v2/PrintAudit', () => null);
    visit('/PF/charts/patients/' + PATIENT_GUID + '/summary');
    await click(`${de('diagnosis-display-select')} .composable-select__choice`);
    await click(de('diagnosis-display-select-option-0'));
    await click(de('print-diagnoses-button'));
    assert.throws(findWithAssert(`${de('diagnosis-item-text')}:contains('(S72.90) Unspecified fracture')`).text(), 'There is an acute active diagnosis present in the print preview');
    assert.equal(find(`${de('print-diagnosis-start-date')}:eq(0)`).text(), '11/03/2016', 'There is a diagnosis start date present for acute active diagnosis.');
    assert.equal(find(`${de('print-diagnosis-stop-date')}:eq(0)`).text(), '', 'There is no diagnosis stop date present for acute active diagnosis.');

    assert.throws(findWithAssert(`${de('diagnosis-item-text')}:contains('(T14.8) Other injury')`).text(), 'There is an acute historical diagnosis present in the print preview');
    assert.equal(find(`${de('print-diagnosis-start-date')}:eq(1)`).text(), '10/03/2016', 'There is a diagnosis start date present for acute historical diagnosis.');
    assert.equal(find(`${de('print-diagnosis-stop-date')}:eq(1)`).text(), '10/31/2016', 'There is a diagnosis stop date present for acute historical diagnosis.');
    click('.close-link');
});
