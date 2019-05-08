import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { startMirage } from 'boot/initializers/ember-cli-mirage';
import wait from 'ember-test-helpers/wait';
import de from 'boot/tests/helpers/data-element';
import session from 'boot/models/session';
import setupStore from 'boot/tests/helpers/store';
import DisplayPreferenceModel from 'settings/models/incoming-ccda-display-preference';
import DisplayPreferenceAdapter from 'settings/adapters/incoming-ccda-display-preference';
import DisplayPreferenceSerializer from 'settings/serializers/incoming-ccda-display-preference';

const testParams = {
    docGUID: 'test-document-guid',
    isHtmlDownloadAvailable: true,
    docType: 'Continuity of Care Document'
};
const validResponse = {
    clinicalDocument: {
        patientDemographics: {
            name: {
                firstName: 'CDS Alert',
                lastName: 'Test'
            },
            sex: 'Male',
            dateOfBirth: '1973-05-27T00:00:00Z',
            race: 'No information',
            ethnicity: 'No information',
            preferredLanguage: 'Provider did not ask'
        },
        careTeamMembers: [{
            providerName: {
                firstName: 'Jay',
                lastName: 'Ross'
            }
        }],
        components: [{
            title: 'Functional status',
            html: 'No functional Status Indicated',
            isDisplayActive: true,
            sortOrder: 1,
            internalCode: 'FunctionalStatus',
            templateOid: '2.16.840.1.113883.10.20.22.2.14',
            sortingTemplateOid: '2.16.840.1.113883.10.20.22.2.14'
        }, {
            title: 'Assessment and plan',
            html: '<table>\r\n<thead>\r\n<tr>\r\n<th>Assessment and Plan</th>\r\n</tr>\r\n</thead>\r\n<tbody>\r\n<tr ID=\'APNULL1\'>\r\n<td>No Plans indicated</td>\r\n</tr>\r\n</tbody>\r\n</table>',
            isDisplayActive: true,
            sortOrder: 2,
            internalCode: 'AssessmentandPlan',
            templateOid: '2.16.840.1.113883.10.20.22.2.9',
            sortingTemplateOid: '2.16.840.1.113883.10.20.22.2.9'
        }],
        documentType: 'Referral Summary'
    },
    clinicalDocumentValidationError: {
        errorCount: 0,
        errorText: 'No Error',
        errorList: []
    }
};

const parseErrorResponse = {
    clinicalDocumentValidationError: {
        errorCount: 5,
        errorText: 'There are errors',
        errorList: [{
            description: 'Test error',
            documentLineNumber: '1',
            type: 'C-CDA MDHT Conformance Error',
            xpath: '/ClinicalDocument/component/structuredBody/component[4]/section'
        }, {
            description: 'Test error 2',
            documentLineNumber: '2',
            type: 'C-CDA MDHT Conformance Error',
            xpath: '/ClinicalDocument/component/structuredBody/component[4]/section'
        }, {
            description: 'Test error 3',
            documentLineNumber: '3',
            type: 'C-CDA MDHT Conformance Error',
            xpath: '/ClinicalDocument/component/structuredBody/component[4]/section'
        }, {
            description: 'Test error 4',
            documentLineNumber: '4',
            type: 'C-CDA MDHT Conformance Error',
            xpath: '/ClinicalDocument/component/structuredBody/component[4]/section'
        }, {
            description: 'Test error 5',
            documentLineNumber: '5',
            type: 'C-CDA MDHT Conformance Error',
            xpath: '/ClinicalDocument/component/structuredBody/component[4]/section'
        }]
    }
};

moduleForComponent('ccda-preview-modal', 'Integration - Core - Clinical | Component - ccda-preview-modal', {
    integration: true,
    sentActionGotoCcdSettings: false,
    sentActionDownloadClinicalDocument: false,
    sendActionDownloadClinicalDocumentHtml: false,
    beforeEach() {
        session.set('isAdmin', true);
        this.set('testDocument', testParams);
        this.set('actions', {
            gotoSettings() {
                this.set('sentActionGotoCcdSettings', true);
            },
            downloadClinicalDocument() {
                this.set('sentActionDownloadClinicalDocument', true);
            },
            downloadClinicalDocumentHtml() {
                this.set('sendActionDownloadClinicalDocumentHtml', true);
            }
        });
        const env = setupStore({
            adapters: {
                'incoming-ccda-display-preference': DisplayPreferenceAdapter
            },
            serializers: {
                'incoming-ccda-display-preference': DisplayPreferenceSerializer
            },
            models: {
                'incoming-ccda-display-preference': DisplayPreferenceModel
            }
        });
        this.set('store', env.store);
        this.server = startMirage();
    },
    afterEach() {
        this.server.shutdown();
        this.set('store');
    }
});

test('validate component rendering', function (assert) {
    server.get('ClinicalDocumentEndpoint/api/v2/incomingCcda/:docId', ({ db }, request) => {
        assert.equal(request.params.docId, testParams.docGUID, 'Call correctly made to retrieve CCDA document');
        return validResponse;
    });

    assert.expect(9);
    const ccdaPatientName = `${validResponse.clinicalDocument.patientDemographics.name.firstName} ${validResponse.clinicalDocument.patientDemographics.name.lastName}`;

    this.render(hbs`{{ccda-preview-modal ccdaParams=testDocument download=(action 'downloadClinicalDocument') downloadHtml=(action 'downloadClinicalDocumentHtml') gotoCcdSettings=(action 'gotoSettings') store=store}}`);

    return wait().then(() => {
        assert.equal($('.left-panel-v2 h4.header4semibold').text().trim(), ccdaPatientName, 'Patient header was rendered correctly');
        assert.ok($(de('ccda-component-Functionalstatus')).length, 'Functional status section was rendered correctly');
        assert.ok($(de('ccda-component-Assessmentandplan')).length, 'Assessment and plan section was rendered correctly');
        assert.equal($('.right-panel-v2 .ccda-toc-item').length, 2, 'Table of contents was rendered correctly');


        this.$('.right-panel-v2 .ccda-toc-item:first .switch').click();
        return wait().then(() => {
            assert.notOk($(de('ccda-component-Functionalstatus')).length, 'Functional status section was hidden correctly');
            this.$(de('link-ccda-settings')).click();
            return wait().then(() => {
                assert.ok(this.get('sentActionGotoCcdSettings'), 'Clicking on the settings link performs correctly');
                this.$(de('button-download-ccda-xml')).click();
                return wait().then(() => {
                    assert.ok(this.get('sentActionDownloadClinicalDocument'), 'Downloading the XML performs correctly');
                    this.$(de('button-download-ccda-html')).click();
                    return wait().then(() => {
                        assert.ok(this.get('sendActionDownloadClinicalDocumentHtml'), 'Downloading the HTML performs correctly');
                    });
                });
            });
        });
    });
});

test('validate component shows parsing errors', function (assert) {
    server.get('ClinicalDocumentEndpoint/api/v2/incomingCcda/:docId', ({ db }, request) => {
        assert.equal(request.params.docId, testParams.docGUID, 'Call correctly made to retrieve CCDA document');
        return parseErrorResponse;
    });

    assert.expect(3);
    this.render(hbs`{{ccda-preview-modal ccdaParams=testDocument download=(action 'downloadClinicalDocument') downloadHtml=(action 'downloadClinicalDocumentHtml') gotoCcdSettings=(action 'gotoSettings') store=store}}`);

    return wait().then(() => {
        assert.ok($('.ccda-preview-modal-error-content').length, 'Parsing Errors are rendered correctly');
        assert.notOk($(de('button-download-ccda-html')).length, 'Html download button not available');
    });
});

test('validate component shows validation errors', function (assert) {
    server.get('ClinicalDocumentEndpoint/api/v2/incomingCcda/:docId', ({ db }, request) => {
        assert.equal(request.params.docId, testParams.docGUID, 'Call correctly made to retrieve CCDA document');
        return {
            clinicalDocument: validResponse.clinicalDocument,
            clinicalDocumentValidationError: parseErrorResponse.clinicalDocumentValidationError
        };
    });

    assert.expect(7);
    const ccdaPatientName = `${validResponse.clinicalDocument.patientDemographics.name.firstName} ${validResponse.clinicalDocument.patientDemographics.name.lastName}`;

    this.render(hbs`{{ccda-preview-modal ccdaParams=testDocument download=(action 'downloadClinicalDocument') downloadHtml=(action 'downloadClinicalDocumentHtml') gotoCcdSettings=(action 'gotoSettings') store=store}}`);

    return wait().then(() => {
        assert.equal($('.left-panel-v2 h4.header4semibold').text().trim(), ccdaPatientName, 'Patient header was rendered correctly');
        assert.ok($('.ccda-error-indicator').length, 'Error indicator was rendered correctly');
        assert.equal($(de('validation-error-message')).text().trim(), '5 errors detected', 'Error indicator shows correct count');

        this.$(de('view-validation-errors-link')).click();
        return wait().then(() => {
            assert.ok($(de('link-back-to-ccda')).length, 'Link back to view parsed CCDA renders correctly');
            assert.notOk($('.left-panel-v2 h4.header4semibold').length, 'Patient header was hidden correctly');
            this.$(de('link-back-to-ccda')).click();
            return wait().then(() => {
                assert.equal($('.left-panel-v2 h4.header4semibold').text().trim(), ccdaPatientName, 'Patient header was shown correctly');
            });
        });
    });
});
