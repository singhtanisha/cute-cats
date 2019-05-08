import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';

const TRANSCRIPT_GUID = 'UNSIGNED_ENCOUNTER_WITH_SIA';
const PATIENT_PRACTICE_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const TOOLBAR = '.encounter-container .control-bar';
const ACTIONS_MENU = de('actions-menu-options');
const FLOWSHEET_CELL_POPUP = '.flowsheet-cell-details-popup';

moduleForAcceptanceAuth('Acceptance - Core - Charting | Encounter limited access - v2', {
    beforeLogin() {
        server.get('AuthzEndpoint/api/v1/users/:id/rights', () => ({
            entitledFeatures: ['ERX.Send', 'Chart.Sign', 'EPCS.Send']
        }));
    }
});

function assertEncounterSections(assert) {
    // Encounter toolbar
    assert.dom(`${TOOLBAR} .btn-save-encounter`).doesNotExist('Save button is hidden');
    assert.dom(`${TOOLBAR} .btn-sign`).doesNotExist('Sign button is hidden');

    // Encounter details
    assert.dom(de('encounter-details-encounter-type-dropdown')).doesNotExist('Encounter type is not a dropdown');
    assert.dom(de('encounter-details-note-type-dropdown')).doesNotExist('Note type is not a dropdown');
    assert.dom(`${de('encounter-details-date')} .k-datepicker`).doesNotExist('Encounter date is not a date picker');
    assert.dom(de('encounter-details-seen-by-dropdown')).doesNotExist('Seen by is not a dropdown');
    assert.dom(de('encounter-details-facility-dropdown')).doesNotExist('Facility is not a dropdown');

    // Flowsheets
    assert.dom(de('flowsheet-top-edit-button')).doesNotExist('Edit flowsheets button is hidden');
    assert.dom(de('flowsheet-add-column-link')).doesNotExist('Add column button is hidden');
    assert.dom(de('flowsheet-edit-link')).doesNotExist('Edit individual flowsheet button is hidden');
    assert.dom('.flowsheet-table .flowsheet-add-column').doesNotExist('"Add column" column on a flowsheet does not exist');
    assert.dom(`.flowsheet-table .flowsheet-cell ${de('flowsheet-cell-value-and-units')}`).doesNotExist('No flowsheet cells are editable');

    // Record buttons
    assert.dom('#chief-complaint .heading-action').doesNotExist('CC Record button is hidden');
    assert.dom(de('encounter-record-diagnoses-btn')).doesNotExist('Diagnoses record button is hidden');
    assert.dom(de('add-allergy-button')).doesNotExist('Allergies record button is hidden');
    assert.dom(de('encounter-record-medication-btn')).doesNotExist('Medications record button is hidden');
    assert.dom(`${de('smoking-status-header')} .btn.heading-action`).doesNotExist('Smoking status record button is hidden');
    assert.dom(de('encounter-record-pmh-btn')).doesNotExist('PMH record button is hidden');
    assert.dom(de('pmh-record-allergy-link')).doesNotExist('PMH record allergy link is hidden');
    assert.dom(de('edit-note-subjective')).doesNotExist('Edit subjective button is hidden');
    assert.dom(de('edit-note-objective')).doesNotExist('Edit objective button is hidden');
    assert.dom(de('edit-note-assessment')).doesNotExist('Edit assessment button is hidden');
    assert.dom(de('edit-note-plan')).doesNotExist('Edit plan button is hidden');
    assert.dom('.orders-attached-to-encounter > div .btn.heading-action').doesNotExist('Add labs and imaging order buttons are hidden');
    assert.dom('.encounter-documents .btn.heading-action').doesNotExist('Attach document button is hidden');
    assert.dom('#dFinalizeEvents .btn.heading-action').doesNotExist('Add SIA button is hidden');
    assert.dom('#observations .btn.heading-action').doesNotExist('Record functional and cognitive status buttons are hidden');
    assert.dom(`#dFinalizeCarePlan ${de('auto-saving-text-area-edit')}`).doesNotExist('Record care plan button is hidden');
    assert.dom(de('add-referral-button')).doesNotExist('Add referral button is hidden');
    assert.dom('#dFinalizeSuperbill .btn.heading-action').doesNotExist('Add/edit superbill button is hidden');
    assert.dom('#dFinalizeQOC input[type="checkbox"]').isDisabled('QoC checkboxes are disabled');
    assert.dom('.patient-health-concerns-list >.btn').doesNotExist('Add health concerns button and Edit health concern note button are hidden');
}
function assertActionsMenuItemIsDisabled(assert, text) {
    assert.dom(find(`${ACTIONS_MENU} a:contains("${text}")`)[0]).hasClass('disabled', `Actions menu item "${text}" is disabled`);
}
function assertActionsMenuItemIsEnabled(assert, text) {
    assert.dom(find(`${ACTIONS_MENU} a:contains("${text}")`)[0]).doesNotHaveClass('disabled', `Actions menu item "${text}" is enabled`);
}
async function assertActionsMenu(assert) {
    await click(de('actions-menu'));
    assertActionsMenuItemIsDisabled(assert, 'Add referral');
    assertActionsMenuItemIsDisabled(assert, 'Edit superbill');
    assertActionsMenuItemIsDisabled(assert, 'Copy note to clipboard');
    assertActionsMenuItemIsDisabled(assert, 'Delete encounter');
    assertActionsMenuItemIsDisabled(assert, 'Send follow-up message');
    assertActionsMenuItemIsDisabled(assert, 'Add imaging order');
    assertActionsMenuItemIsDisabled(assert, 'Add lab order');
    assertActionsMenuItemIsDisabled(assert, 'Copy link to patient');
    assertActionsMenuItemIsDisabled(assert, 'Invite to patient portal');
    assertActionsMenuItemIsDisabled(assert, 'Enter imaging results');
    assertActionsMenuItemIsDisabled(assert, 'Enter lab results');
    assertActionsMenuItemIsDisabled(assert, 'Send message');
    assertActionsMenuItemIsDisabled(assert, 'Create task');
    assertActionsMenuItemIsEnabled(assert, 'View imaging orders');
    assertActionsMenuItemIsEnabled(assert, 'View lab orders');
    assertActionsMenuItemIsEnabled(assert, 'Print encounter');
    assertActionsMenuItemIsEnabled(assert, 'Print visit summary');
    assertActionsMenuItemIsEnabled(assert, 'Syndromic Surveillance');
    assertActionsMenuItemIsEnabled(assert, 'Create clinical document');
    assertActionsMenuItemIsEnabled(assert, 'Print patient chart');
    assertActionsMenuItemIsEnabled(assert, 'Refresh patient chart');
    assertActionsMenuItemIsEnabled(assert, 'View access history');
    assertActionsMenuItemIsEnabled(assert, 'View exported patient records');
    assertActionsMenuItemIsEnabled(assert, 'View recent activity');
}
async function assertFlowsheets(assert) {
    await click('.flowsheet-table .flowsheet-cell.selectable:not(.flowsheet-table-header):first');
    assert.dom(`${FLOWSHEET_CELL_POPUP} ${de('flowsheet-validated-cell-result')}`).doesNotExist('No edit fields in flowsheet cell popup');
    assert.dom(`${FLOWSHEET_CELL_POPUP} .comments-container textarea`).doesNotExist('Comments text area is hidden');
    assert.dom(de('flowsheet-cell-popup-delete-button')).doesNotExist('Delete button is hidden');
    assert.dom(de('flowsheet-cell-popup-done-button')).hasText('Done');
}
async function assertDxDetails(assert) {
    await click(de('acute-dx-0'));
    assert.dom(`.diagnosis-detail ${de('diagnosis-attach-to-encounter')} input[type="checkbox"]`).doesNotExist('Dx attach diagnosis to encounter checkbox is hidden');
    assert.dom('.diagnosis-detail #acuity-chronic').isDisabled('Dx chronic radio button is disabled');
    assert.dom('.diagnosis-detail #acuity-acute').isDisabled('Dx acute radio button is disabled');
    assert.dom('.diagnosis-detail #start-dates input').isDisabled('Dx start date picker is disabled');
    assert.dom('.diagnosis-detail #start-stop input').isDisabled('Dx stop date picker is disabled');
    assert.dom(`.diagnosis-detail ${de('dx-add-medication-link')}`).doesNotExist('Associate med with Dx link is hidden');
    assert.dom(`.diagnosis-detail ${de('dx-show-comment-link')}`).doesNotExist('Dx edit comment link is hidden');
    assert.dom(`.diagnosis-detail ${de('delete-diagnosis-button')}`).doesNotExist('Save Dx button is hidden');
}
async function assertAllergiesDetails(assert) {
    await click(`.encounter-allergies-container ${de('active-allergy')}:first`);
    assert.dom(`.allergy-details ${de('allergy-severity-button-group')}`).doesNotExist('Allergy severity button group is hidden');
    assert.dom(`.allergy-details ${de('allergy-reactions-select')}`).doesNotExist('Allergy reactions select is hidden');
    assert.dom('.allergy-details .onset-section .ember-button-group').doesNotExist('Allergy onset button group is hidden');
    assert.dom('.allergy-details .onset-section .k-datepicker').doesNotExist('Allergy onset datepicker is hidden');
    assert.dom(`.allergy-details ${de('allergy-comment')}`).doesNotExist('Allergy comment textarea is hidden');
    assert.dom('.allergy-details .make-switch').doesNotExist('Allergy status switch is hidden');
    assert.dom(`.allergy-details ${de('btn-delete')}`).doesNotExist('Allergy delete button is hidden');
    assert.dom('.allergy-details .detail-pane-footer .btn-primary').doesNotExist('Allergy save button is hidden');
}
async function assertMedDetails(assert) {
    await click('.medications-grid .data-grid-cell a:first');
    assert.dom(`.medication-detail ${de('sig-search')}`).doesNotExist('Med sig search is hidden');
    assert.dom('.medication-detail .sig-text textarea').doesNotExist('Med sig textarea is hidden');
    assert.dom(`.medication-detail ${de('quantity-txt')}`).doesNotExist('Med dispense quantity input is hidden');
    assert.dom(`.medication-detail ${de('doseForm-search')}`).doesNotExist('Med unit search is hidden');
    assert.dom(`.medication-detail ${de('daysSupply-txt')}`).doesNotExist('Med days supply input is hidden');
    assert.dom(`.medication-detail ${de('diagnosis-search')}`).doesNotExist('Med associate with dx search is hidden');
    assert.dom('.medication-detail #start-dates input').doesNotExist('Med start date picker is hidden');
    assert.dom('.medication-detail #start-stop input').doesNotExist('Med stop date picker is hidden');
    assert.dom(`.medication-detail ${de('medication-comment-txt')}`).doesNotExist('Med comment text box is hidden');
    assert.dom(`.medication-detail ${de('attachToEncounter-ck')} input[type="checkbox"]`).isDisabled('Med attach to encounter checkbox is disabled');
    assert.dom(`.medication-detail ${de('medication-detail-footer-buttons')}`).doesNotExist('Med footer buttons are hidden');
}
async function assertSocialHistory(assert) {
    click(`${de('smoking-status-item')}:first`).then(() => assert.dom('.smoking-detail').doesNotExist('Smoking status detail pane is hidden'));
    await click(`${de('gender-identity-item')}:first`);
    assert.dom('.social-history-detail input[type="radio"]').isDisabled('Social history radio buttons are disabled');
    assert.dom(`.social-history-detail ${de('gender-identity-delete')}`).doesNotExist('Delete gender identity link is hidden');
    assert.dom('.social-history-detail .detail-pane-footer .btn-primary').doesNotExist('Social history save button is hidden');
}
async function assertSia(assert) {
    await click('#dFinalizeEvents li:first');
    // Verify the editable fields are not visible on the details pane anymore.
    assert.dom(`.event-details ${de('sia-status-select')}`).doesNotExist('SIA status dropdown is hidden');
    assert.dom(`.event-details ${de('sia-reason-select')}`).doesNotExist('SIA reason dropdown is hidden');
    assert.dom(`.event-details ${de('sia-result-select')}`).doesNotExist('SIA result dropdown is hidden');
    assert.dom('.event-details .k-datepicker').doesNotExist('SIA datepickers are hidden');
    assert.dom('.event-details textareas').doesNotExist('SIA comment field is hidden');
    assert.dom(`.event-details ${de('sia-delete-button')}`).doesNotExist('SIA delete button is hidden');

    // Verify the read-only fields are displayed on the details pane.
    assert.dom('.event-details .title').exists({ count: 6 });
}
async function assertObservations(assert) {
    await click(`#dFinalizeObservations ${de('observation-description')}:first`);
    assert.dom('.observation-detail .k-datepicker input').isDisabled('Observation date picker is disabled');
    assert.dom(`.observation-details ${de('btn-delete')}`).doesNotExist('Observation delete button is hidden');
    assert.dom(`.observation-details ${de('btn-save')}`).doesNotExist('Observation save button is hidden');
}
async function assertSuperbill(assert) {
    await click('#dFinalizeSuperbill .d-complex-list-container a:first');
    assert.dom(de('edit-procedure')).doesNotExist('Superbill edit procedure link is hidden');
    assert.dom(de('remove-procedure')).doesNotExist('Superbill remove procedure link is hidden');
    assert.dom('.procedure-edit-diagnosis .inline-edit-link').doesNotExist('Superbill delete Dx link is hidden');
    assert.dom(de('edit-diagnosis-button')).doesNotExist('Superbill add Dx link is hidden');
    assert.dom(de('edit-modifiers-button')).doesNotExist('Superbill add modifiers link is hidden');
    assert.dom(de('add-procedure')).doesNotExist('Superbill add procedure link is hidden');
    assert.dom(de('edit-other-details')).doesNotExist('Superbill edit other details link is hidden');
    assert.dom('.patient-superbill .button-bar .btn-group.dropdown').doesNotExist('Superbill save button dropdown is hidden');
}
test('Encounter is disabled in limited access mode', async assert => {
    await visit(`/PF/charts/patients/${PATIENT_PRACTICE_GUID}/encounter/${TRANSCRIPT_GUID}`);
    assertEncounterSections(assert);
    await assertActionsMenu(assert);
    await assertFlowsheets(assert);
    await assertDxDetails(assert);
    await assertAllergiesDetails(assert);
    await assertMedDetails(assert);
    click(`.medication-detail ${de('cancel-btn')}`);
    await assertSocialHistory(assert);
    await assertSia(assert);
    await assertObservations(assert);
    assertSuperbill(assert);
});
