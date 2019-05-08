import { next } from '@ember/runloop';
import { isPresent, isEmpty } from '@ember/utils';
import EmberObject, {
  computed,
  observer,
  set
} from '@ember/object';
import { alias, or } from '@ember/object/computed';
import Component from '@ember/component';
import $ from 'jquery';
import { task, timeout } from 'ember-concurrency';
import LoadingMixin from 'clinical/mixins/loading';
import DestroyedMixin from 'tyrion/mixins/destroyed';
import SpinnerMixin from 'common/mixins/spinner';
import PrintPreviewMixin from 'tyrion/components/mixins/print-preview-support';
import WithPatientPrintTitleMixin from 'charting/mixins/with-patient-print-title';
import ccdaPreviewRepository from 'clinical/repositories/ccda-preview';
import pfBrowser from 'boot/util/pf-browser';

export default Component.extend(LoadingMixin, DestroyedMixin, SpinnerMixin, PrintPreviewMixin, WithPatientPrintTitleMixin, {
    contentElement: '.content-modal-body',
    showSpinner: alias('isLoading'),
    classNames: ['ccda-preview-modal'],
    printContentSelector: '.ccda-preview-modal-content',
    documentGuid: alias('ccdaParams.docGUID'),
    patientPracticeGuid: alias('ccdaParams.patientGUID'),
    threadGuid: alias('ccdaParams.threadGuid'),
    titleConfigurable: computed('ccdaParams.doctype', 'ccda.documentType', 'patientName', 'isConfigurable', 'isValidationError', 'showErrorPane', function () {
        const docType = this.get('ccda.documentType') || this.get('ccdaParams.doctype');
        const name = this.get('patientName');
        if (this.get('showErrorPane')) {
            return 'Validation Error';
        }
        if (this.get('isConfigurable') && name) {
            return `${docType} for ${name}`;
        }
        if (this.get('isValidationError')) {
            if (docType) {
                return `${docType} validation error`;
            }
            return 'Validation error';
        }
        return docType;
    }),
    title: alias('ccdaParams.doctype'),
    clinicalDocumentType: null,
    notificationFade: null,
    isHtmlDownloadAvailable: alias('ccdaParams.isHtmlDownloadAvailable'),
    isVisible: alias('ccdaParams'),
    isConfigurable: true,
    isOutbound: alias('ccdaParams.isOutbound'),
    shouldHideSettingsLink: or('isValidationError', 'isOutbound'),
    layoutName: computed('isConfigurable', function () {
        if (this.get('isConfigurable')) {
            return 'components/ccda-preview-modal-configurable';
        }
        return 'components/ccda-preview-modal-default';
    }),
    showErrorPane: false,
    showNotification: true,
    isValidationError: computed('ccda.validationErrors', function () {
        const validationErrors = this.get('ccda.validationErrors');
        return isPresent(validationErrors) && validationErrors.errorCount > 0;
    }),
    isParseError: computed('ccda.validationErrors', 'ccda.clinicalDocument', function () {
        const validationErrors = this.get('ccda.validationErrors');
        const parsedDocument = this.get('ccda.clinicalDocument');
        return isEmpty(parsedDocument) && isPresent(validationErrors) && validationErrors.errorCount > 0;
    }),
    validationErrorMessage: computed('ccda.validationErrors', function () {
        const validationErrors = this.get('ccda.validationErrors');
        if (isEmpty(validationErrors) || validationErrors.errorCount < 1) {
            return '';
        }

        const errorCount = validationErrors.errorCount;
        return errorCount > 1 ? `${errorCount} errors detected ` : '1 error detected';
    }),
    isValidating: alias('validateCcda.isRunning'),
    parentDisplayObserver: observer('ccda.components.@each.isDisplayActive', function () {
        const components = this.get('ccda.components');
        if (isPresent(components)) {
            components.filterBy('isChild').forEach(child => {
                const parentComponent = components.findBy('templateOid', child.sortingTemplateOid);
                if (isPresent(parentComponent)) {
                    set(child, 'isDisplayActive', parentComponent.isDisplayActive);
                }
            });
        }
    }),

    sortedComponents: computed('ccda.components.[]', function() {
        const components = this.get('ccda.components');
        if (isPresent(components)) {
            return components.sortBy('sortOrder');
        }
        return components;
    }),

    isNotificationDisplayed: or('showNotification', 'isValidating'),

    init() {
        this._super();
        const params = this.getProperties('documentGuid', 'patientPracticeGuid', 'threadGuid', 'isOutbound');
        this._withProgress(ccdaPreviewRepository.loadCcda(params).then(ccda => this._unlessDestroyed(() => {
            this.set('ccda', ccda);
            if (isEmpty(this.get('title'))) {
                this.set('title', ccda.documentType);
            }
            this.set('clinicalDocumentType', ccda.documentType);

            if (this.get('isConfigurable')) {
                this.appendParentOnlyComponents(ccda.components);

                if (isEmpty(ccda.validationErrors)) {
                    this.get('validateCcda').perform();
                } else if (isEmpty(ccda.patientDemographics)) {
                    this.set('showErrorPane', true);
                }
                this.get('updateNotification').perform();
            }
        })).catch(() => {
            toastr.error('Unable to load clinical document at this time');
            this._setUnlessDestroyed('isVisible', false);
        }));
    },
    patientName: computed('ccda.patientDemographics.name', function () {
        const name = this.get('ccda.patientDemographics.name');
        let fullName;
        if (name && name.firstName && name.lastName) {
            fullName = `${name.firstName} ${name.lastName}`;
            if (name.suffix) {
                fullName += ` ${name.suffix}`;
            }
        }
        return fullName;
    }),
    preferredLanguage: computed('ccda.patientDemographics.preferredLanguage', function () {
        const language = this.get('ccda.patientDemographics.preferredLanguage');
        if (language === 'eng') {
            return 'English';
        } else if (language === 'spa') {
            return 'Spanish';
        }
        return language;
    }),
    careTeamAddress: alias('ccda.careTeamMembers.firstObject.providerFacility'),
    careTeamPhone: alias('ccda.careTeamMembers.firstObject.providerPhone'),
    careTeamNames: computed('ccda.careTeamMembers', function () {
        const members = this.get('ccda.careTeamMembers') || [];
        const names = members.map(member => {
            let name;
            if (member.providerName && member.providerName.firstName) {
                name = `${member.providerName.firstName} ${member.providerName.lastName}`;
                if (member.providerName.suffix) {
                    name += ` ${member.providerName.suffix}`;
                }
            }
            return name;
        }).compact().uniq();
        return isEmpty(names) ? ['None recorded'] : names;
    }),
    patientSummary: computed('patientPracticeGuid', 'ccda.patientDemographics', function () {
        const patientPracticeGuid = this.get('patientPracticeGuid');
        let summary;
        if (isPresent(patientPracticeGuid)) {
            summary = this.get('store').peekRecord('patient-summary', patientPracticeGuid);
        }
        if (!summary) {
            summary = {
                fullName: this.get('patientName'),
                birthDate: this.get('ccda.patientDemographics.dateOfBirth')
            };
        }
        return summary;
    }),
    shouldHideDownloadButton: computed(function () {
        return pfBrowser.isMobile();
    }),
    printPreviewDidLoad() {
        const $printContainer = $(this.get('printContentSelector'));
        const [printContainer] = $printContainer;
        if (printContainer) {
            $printContainer.addClass('size-for-print-content');
            this.set('printFrameHeightValue', printContainer.scrollHeight);
            $printContainer.removeClass('size-for-print-content');
        }
    },
    appendParentOnlyComponents(components) {
        const parentsToAppend = [];
        if (isPresent(components)) {
            this.get('store').findAll('incoming-ccda-display-preference').then(preferences => {
                components.filterBy('isChild').map(component => component.sortingTemplateOid).forEach(parentOid => {
                    const existingParent = components.findBy('templateOid', parentOid);
                    if (isEmpty(existingParent)) {
                        const preferenceParent = preferences.findBy('templateOid', parentOid);
                        if (isPresent(preferenceParent)) {
                            parentsToAppend.push({
                                isTocOnly: true,
                                title: preferenceParent.get('sectionName'),
                                templateOid: preferenceParent.get('templateOid'),
                                isChild: false,
                                sortOrder: preferenceParent.get('sortOrder'),
                                isDisplayActive: preferenceParent.get('isDisplayActive'),
                                dataElement: 'ccda-component-' + preferenceParent.get('sectionName').replace(/\W/g, ''),
                                dataElementToc: 'ccda-toc-component-' + preferenceParent.get('sectionName').replace(/\W/g, ''),
                                dataElementClass: '.ccda-component-' + preferenceParent.get('sectionName').replace(/\W/g, '')
                            });
                        }
                    }
                });
                parentsToAppend.forEach(component => {
                    if (!components.isAny('templateOid', component.templateOid)) {
                        components.pushObject(component);
                    }
                });
            });
        }
    },
    validateCcda: task(function* () {
        this.set('showNotification', false);
        const params = this.getProperties('documentGuid', 'patientPracticeGuid', 'threadGuid', 'isOutbound');
        try {
            const validation = yield ccdaPreviewRepository.validateCcda(params);
            if (isPresent(validation)) {
                this.set('ccda.validationErrors', validation);
            }
        } catch (e) {
            toastr.error('Unable to validate clinical document at this time');
        }
        this.get('updateNotification').perform();
    }).drop(),
    updateNotification: task(function* () {
        this.set('showNotification', true);
        if (!this.get('isValidationError')) {
            yield timeout(3000);
            this.set('showNotification', false);
        }
    }).restartable(),

    actions: {
        download(isHtml) {
            const clinicalDocumentTypeCode = this.get('clinicalDocumentType') || this.get('title');
            const downloadRequest = EmberObject.create({
                documentGuid: this.get('documentGuid'),
                patientGuid: this.get('patientPracticeGuid'),
                threadGuid: this.get('threadGuid'),
                clinicalDocumentTypeCode
            });

            this.sendAction((isHtml ? 'downloadHtml' : 'download'), downloadRequest);
            this.set('isVisible', false);
        },
        print() {
            if (this.get('isConfigurable') && this.get('isValidationError')) {
                this.set('printContentSelector', '.ccda-preview-modal-error-content');
            } else {
                this.set('printContentSelector', '.ccda-preview-modal-content');
            }
            ccdaPreviewRepository.auditPrint(this.getProperties('patientPracticeGuid', 'patientName'));
            next(this, 'send', 'printPreview');
        },
        goToSection(dataElement) {
            let target = this.$(`.left-panel [data-element='${dataElement}']`);
            if (isEmpty(target)) {
                const components = this.get('sortedComponents');
                const targetRecord = components.findBy('dataElement', dataElement);
                target = components.filterBy('sortingTemplateOid', targetRecord.templateOid).map(component => {
                    return this.$(`.left-panel [data-element='${component.dataElement}']`);
                }).find(element => {
                    return isPresent(element) && element.length > 0;
                });
            }
            if (isPresent(target)) {
                this.$('.left-panel').scrollTop($(target)[0].offsetTop - 45);
            }
        },
        gotoCcdSettings() {
            this.set('isVisible', false);
            this.sendAction('gotoCcdSettings');
        },
        toggleErrorPane() {
            this.toggleProperty('showErrorPane');
        },
        closeNotification() {
            this.set('showNotification', false);
        }
    }
});
