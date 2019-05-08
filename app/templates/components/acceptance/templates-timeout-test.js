import { test } from 'qunit';
import moduleForAcceptanceEntitled from 'boot/tests/helpers/module-for-acceptance-entitled';
import Mirage from 'ember-cli-mirage';
import de from 'boot/tests/helpers/data-element';

moduleForAcceptanceEntitled('Acceptance - Core - Charting | Templates timeout fallback', {
    beforeEach() {
        const providerTemplatesUrl = 'ChartingEndpoint/api/v1/templates/provider';
        server.get(providerTemplatesUrl, () => new Mirage.Response(504, {}, null));
        server.get(`${providerTemplatesUrl}/paged`, ({ db }) => ({
            totalRecords: 504,
            resultList: db.chartingTemplates
        }));
    }
});

const TEMPLATES_SETTINGS_URL = '/PF/settings/templates/provider';
const PAGINATED_URL = `${TEMPLATES_SETTINGS_URL}/paginated`;

test('Navigating to templates settings redirects to fallback page', async assert => {
    const templateRow = de('template-row-7836905b-9aeb-41ca-8138-dfc103d3b7ea');
    let deleteCalled = false;
    server.delete('ChartingEndpoint/api/v1/templates/:templateGuid', () => {
        deleteCalled = true;
        return new Mirage.Response(204, {}, null);
    });
    await visit(TEMPLATES_SETTINGS_URL);
    assert.equal(currentURL(), PAGINATED_URL, 'Redirect occurred');
    assert.dom(de('create-template-button')).exists();
    assert.dom('.option-ribbon .persistent-error').hasText('You have too many templates');
    assert.dom(`${templateRow} .col-name`).hasText('Example Template');
    assert.dom(`${templateRow} .col-created-by`).hasText('XiuLi supdude Shen');
    await click(`${templateRow} .check-box input`);
    await click('.option-ribbon .split-button__arrow-button--primary');
    click('.option-ribbon .split-button__dropdown-menu li:contains("Delete")');
    await click('.carbon-content-modal-component .btn-primary');
    assert.ok(deleteCalled, 'Delete endpoint was called');
});

test('Timeout in encounter displays error', async assert => {
    const errorMessage = '.template-search-flyout .results-error';
    const patientPracticeGuid = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
    const transcriptGuid = 'UNSIGNED_TRANSCRIPT_GUID';
    server.put(`/ChartingEndpoint/api/v3/patients/${patientPracticeGuid}/encounters/${transcriptGuid}`, ({ db }) => db.encounters.where({ transcriptGuid })[0]);
    visit(`/PF/charts/patients/${patientPracticeGuid}/encounter/${transcriptGuid}`);
    await click(de('edit-note-subjective'));
    assert.dom(errorMessage).containsText('You have too many templates');
    await click(`${errorMessage} a`);
    assert.equal(currentURL(), PAGINATED_URL, 'Clicking error message routed to fallback templates page');
});
