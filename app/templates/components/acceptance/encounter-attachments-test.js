import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import Mirage from 'ember-cli-mirage';
import getText from 'boot/tests/helpers/get-text';

const UNSIGNED_TRANSCRIPT_GUID = '7022d94f-d70a-4722-a205-dac898cf9f69';
const SIGNED_TRANSCRIPT_GUID = 'SIGNED_TRANSCRIPT_GUID';
const PATIENT_PRACTICE_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const ATTACHMENTS_SECTION = '.encounter-documents';
const ATTACHMENTS_ATTACH_BUTTON = `${ATTACHMENTS_SECTION} .heading-action`;
const DETAILS_PANE = '.side-fixed.attach-documents';
const DETAILS_PANE_ATTACH = `${DETAILS_PANE} .detail-pane-footer .btn-primary`;
const FAX_REFERRAL_GUID = 'cf6ed305-5e7f-4615-89d1-ca5f965b7634';
const FAX_REFERRAL_NAME = 'Fax Referral.pdf';
const XML_GUID = '6eaf927b-19e4-4c5b-9334-57e1afd52802';
const XML_NAME = '12216.xml';
const DIGITAL_REFERRAL_GUID = 'ccecb46c-994d-4ae4-a0b9-c43480e2afdd';
const DOCUMENTS_TABLE = `${ATTACHMENTS_SECTION} .encounter-documents-table`;
const ADDENDA_SECTION = '#dFinalizeAmendments';

moduleForAcceptanceAuth('Acceptance - Core - Charting | Encounter attachments');

function getAttachDocumentRow(guid) {
    return `.document-list-row[data-guid="${guid}"]`;
}
function getAttachDocumentName(guid) {
    return getText(`${getAttachDocumentRow(guid)} .document-name-column`);
}
function checkDocument(guid) {
    return click(`${getAttachDocumentRow(guid)} input`);
}
function getDocumentTableRow(name) {
    return `${DOCUMENTS_TABLE} tr:contains("${name}")`;
}
function clickXButton(name) {
    return click(`${getDocumentTableRow(name)} td .icon-go-away-small`);
}
function clickPopoverButton(selector) {
    return click(`.popover .popover-btn-row ${selector}`);
}

test('Attach documents to an encounter', async assert => {
    let transcriptDocumentPostCount = 0;
    let deletedDocumentGuid;
    let fullDeleteDocumentCalled = false;

    server.post('ChartingEndpoint/api/v2/TranscriptDocument', ({ db }, request) => {
        transcriptDocumentPostCount++;
        const data = JSON.parse(request.requestBody);
        if (transcriptDocumentPostCount < 4) {
            assert.equal(data.transcriptGuid, UNSIGNED_TRANSCRIPT_GUID, 'The transcriptGuid is correct on the POST data');
            assert.equal(data.transcriptDocumentType, 'Encounter', 'The transcript document type is correct for unsigned encounters');
        } else {
            assert.equal(data.transcriptGuid, SIGNED_TRANSCRIPT_GUID, 'The transcriptGuid is correct on the POST data');
            assert.equal(data.transcriptDocumentType, 'Addendum', 'The transcript document type is correct for signed encounters');
        }
        return data;
    });

    server.delete(`ChartingEndpoint/api/v2/TranscriptDocument/${UNSIGNED_TRANSCRIPT_GUID}/:documentGuid`, ({ db }, request) => {
        deletedDocumentGuid = request.params.documentGuid;
        return new Mirage.Response(204, {}, null);
    });

    server.delete('DocumentsEndpoint/api/v2/documents/meta/:documentGuid', ({ db }, request) => {
        fullDeleteDocumentCalled = true;
        assert.equal(request.params.documentGuid, XML_GUID, 'The document full delete was called with the correct documentGuid');
        return new Mirage.Response(204, {}, null);
    });

    await visit(`/PF/charts/patients/${PATIENT_PRACTICE_GUID}/encounter/${UNSIGNED_TRANSCRIPT_GUID}`);
    await click(ATTACHMENTS_ATTACH_BUTTON);
    assert.throws(findWithAssert(DETAILS_PANE), 'The attach documents details pane appears after clicking the Attach button');
    assert.equal(getAttachDocumentName(FAX_REFERRAL_GUID), FAX_REFERRAL_NAME, 'The Fax Referral document name is rendered correctly');
    assert.equal(getAttachDocumentName(XML_GUID), XML_NAME, 'The xml file name is rendered correctly');
    assert.throws(findWithAssert(`${getAttachDocumentRow(FAX_REFERRAL_GUID)} .document-name-column .icon-lock`), 'Signed documents contain the lock icon');
    checkDocument(FAX_REFERRAL_GUID);
    checkDocument(XML_GUID);
    checkDocument(DIGITAL_REFERRAL_GUID);
    await click(DETAILS_PANE_ATTACH);

    const FAX_REFERRAL_ROW = getDocumentTableRow(FAX_REFERRAL_NAME);
    const XML_ROW = getDocumentTableRow(XML_NAME);
    assert.equal(transcriptDocumentPostCount, 3, 'The POST TranscriptDocument endpoint was called 3 times');
    assert.throws(findWithAssert(`${FAX_REFERRAL_ROW} td .icon-lock`), 'Signed documents contain the lock icon in the table');
    assert.throws(findWithAssert(`${FAX_REFERRAL_ROW} td:contains("Fax Referral")`), 'The document comment is rendered correctly');
    assert.throws(findWithAssert(XML_ROW), 'The unsigned document appears in the table');
    clickXButton(FAX_REFERRAL_NAME);
    await clickPopoverButton('.confirm-btn');
    assert.equal(deletedDocumentGuid, FAX_REFERRAL_GUID, 'The delete endpoint was called with the correct document guid');
    assert.notOk(find(FAX_REFERRAL_ROW).length, 'The document was removed from the table after the "x" icon was clicked');
    clickXButton(XML_NAME);
    await clickPopoverButton('.secondary-confirm-btn');
    assert.equal(deletedDocumentGuid, XML_GUID, 'The delete endpoint was called with the correct document guid');
    assert.ok(fullDeleteDocumentCalled, 'The document full delete endpoint was called');
    assert.notOk(find(XML_ROW).length, 'The document was removed from the table after the "x" icon was clicked');
    await click(ATTACHMENTS_ATTACH_BUTTON);
    assert.throws(findWithAssert(`${getAttachDocumentRow(DIGITAL_REFERRAL_GUID)}.is-selected .icon-checkmark`), 'Documents that are already attached are rendered as selected with a checkmark');
    await visit(`/PF/charts/patients/${PATIENT_PRACTICE_GUID}/encounter/${SIGNED_TRANSCRIPT_GUID}`);
    click(`${ADDENDA_SECTION} .heading-action:contains("Attach documents")`);
    checkDocument(FAX_REFERRAL_GUID);
    checkDocument(DIGITAL_REFERRAL_GUID);
    await click(DETAILS_PANE_ATTACH);
    assert.equal(transcriptDocumentPostCount, 5, 'The POST TranscriptDocument endpoint was called 2 more times');
    assert.throws(findWithAssert(`${ADDENDA_SECTION} .encounter-documents-table tr:contains("${FAX_REFERRAL_NAME}")`), 'The newly attached documents appear in the addenda attachments table');
});
