import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';
import flowsheetDataRepository from 'flowsheets/repositories/flowsheet-data';

const SIGNED_ENCOUNTER_GUID = '82a597e5-b1b8-46e4-8a07-5c3a4f778e95';
const PATIENT_PRACTICE_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const SUMMARY_URL = `/PF/charts/patients/${PATIENT_PRACTICE_GUID}/summary`;
const ENCOUNTER_URL = `/PF/charts/patients/${PATIENT_PRACTICE_GUID}/encounter/${SIGNED_ENCOUNTER_GUID}`;
const signedEncounterItem = `.previews [data-guid="${SIGNED_ENCOUNTER_GUID}"]`;
const previewIcon = de('quick-preview-icon');
const visiblePreviewPopover = '.patient-previews .popover-modal.visible';
const previewItem = text => `.patient-previews .previews :contains('${text}')`;
const filterItem = text => `.patient-previews .filter-bar ${de('preview-type')} .dropdown-menu li:contains('${text}')`;
const getVitalValue = vital => find(`${de('preview-encounter-vitals')} [data-vital='${vital}'] .encounter-vital-observation`).text().replace(/\s/g, '');
const getSection = section => find(`${de('preview-encounter-' + section)} .display-text`).text();

moduleForAcceptanceAuth('Acceptance - Core - Charting | Encounter preview - v2', {
    beforeEach() {
        flowsheetDataRepository.saveIsMetric(false);
    }
});

test('Open encounter from quick preview', async assert => {
    const previewTitle = de('preview-header-title');
    visit(SUMMARY_URL);
    await click(previewIcon);
    assert.throws(findWithAssert(visiblePreviewPopover), 'The patient preview popover is visible after clicking the clock icon');
    assert.throws(findWithAssert(previewItem('SOAP Note')), 'The previews contain SOAP notes');
    assert.throws(findWithAssert(previewItem('Lab order')), 'The previews contain lab orders');
    assert.throws(findWithAssert(previewItem('Lab result')), 'The previews contain lab results');
    assert.throws(findWithAssert(`${signedEncounterItem} .icon-lock`), 'The lock icon appears on signed items');
    assert.throws(findWithAssert(`.previews ${de('preview-0')}.active`), 'The first item in the list is selected when the preview popover opens');
    assert.throws(findWithAssert(`.patient-previews .filter-bar ${de('preview-type')} .ember-select-choice:contains('Show all types')`), 'The "Show all types" filter is selected');

    await click('.filter-bar .ember-select-choice');
    assert.throws(findWithAssert(filterItem('Encounters')), 'The Encounters filter is present');
    assert.throws(findWithAssert(filterItem('Lab orders')), 'The Lab orders filter is present');
    assert.throws(findWithAssert(filterItem('Lab results')), 'The Lab results filter is present');
    assert.throws(findWithAssert(filterItem('Imaging orders')), 'The Imaging orders filter is present');
    assert.throws(findWithAssert(filterItem('Imaging results')), 'The Imaging results filter is present');

    assert.equal(find(previewTitle).text(), '03/08/2016 - SOAP Note', 'The header contains the correct value');

    await click(signedEncounterItem);
    await waitForPromise(null, 'loadingPromise', find('.preview-pane').attr('id'));
    assert.equal(find(previewTitle).text(), '01/05/2016 - SOAP Note', 'The header changed to the new value');
    assert.equal(find(de('preview-encounter-type')).text(), 'Office Visit', 'The encounter type is correct');
    assert.equal(find(de('preview-encounter-age')).text(), '35 mos', 'The age is correct');
    assert.equal(find(de('preview-encounter-seen-by')).text(), 'George Bush M.D.', 'The snapshotted seen by provider is correct');
    assert.equal(find(de('preview-encounter-seen-on')).text(), 'Jan 05 2016', 'The seen on date is correct');
    assert.equal(find(de('preview-encounter-signed-by')).text(), 'George Bush M.D.', 'The snapshotted signed by provider is correct');
    assert.equal(find(de('preview-encounter-cc')).text(), 'Chiefly complaining', 'The cc is correct');
    assert.equal(getVitalValue('Weight'), '45lb', 'The weight is correct');
    assert.equal(getVitalValue('Height'), '36in', 'The height is correct');
    assert.equal(getVitalValue('BMI'), '24.41', 'The bmi is correct');
    assert.equal(getVitalValue('BP'), '12033', 'The blood pressure is correct');
    assert.equal(getSection('subjective'), 'Some subjective', 'The subjective is correct');
    assert.equal(getSection('objective'), '', 'The objective is correct');
    assert.equal(getSection('assessment'), 'Some assessment', 'The assessment is correct');
    assert.equal(getSection('plan'), 'Some plan', 'The plan is correct');

    await click(de('open-preview'));
    assert.notOk(find(visiblePreviewPopover).length, 'The patient preview popover is no longer visible');
    assert.equal(currentURL(), ENCOUNTER_URL, 'The encounter was opened');
    click('.encounter-tab .icon-go-away-small');
});

test('Open encounter from more vitals... link', async assert => {
    visit(SUMMARY_URL);
    await click(previewIcon);
    assert.throws(findWithAssert(visiblePreviewPopover), 'The patient preview popover is visible after clicking the clock icon');
    click(signedEncounterItem);
    await click(de('preview-encounter-more-vitals'));
    assert.notOk(find(visiblePreviewPopover).length, 'The patient preview popover is no longer visible');
    assert.equal(currentURL(), ENCOUNTER_URL, 'The encounter was opened');
    click('.encounter-tab .icon-go-away-small');
});

test('Close preview', async assert => {
    visit(SUMMARY_URL);
    await click(previewIcon);
    assert.throws(findWithAssert(visiblePreviewPopover), 'The patient preview popover is visible after clicking the clock icon');
    await click(de('preview-footer-close'));
    assert.notOk(find(visiblePreviewPopover).length, 'The patient preview popover is no longer visible');
    await click(previewIcon);
    assert.throws(findWithAssert(visiblePreviewPopover), 'The patient preview popover is visible again after clicking the clock icon');
    await click(de('preview-close'));
    assert.notOk(find(visiblePreviewPopover).length, 'The patient preview popover is no longer visible');
});
