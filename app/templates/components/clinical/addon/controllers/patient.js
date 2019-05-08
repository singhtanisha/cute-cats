import { on } from '@ember/object/evented';
import EmberObject, { computed } from '@ember/object';
import { alias, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller, { inject as controller } from '@ember/controller';
import NavigationSupport from 'common/mixins/navigation-legacy';
import dateHelper from 'common/helpers/dates';
import LoadingMixin from 'clinical/mixins/loading';

export default Controller.extend(NavigationSupport, LoadingMixin, {
    authorization: service(),
    analytics: service(),
    pfController: controller('pf'),
    patientService: service('patient'),
    priorAuthService: service('surescripts-prior-auth'),

    boundedBillingPartnerSettings: service('getBoundedBillingPartnerSettings'),
    isPracticePayerListOn: alias('boundedBillingPartnerSettings.isPracticePayerListOn'),
    isPracticeManagementSsoOn: alias('boundedBillingPartnerSettings.isPracticeManagementSsoOn'),
    isPracticeManagementIFrameOn: alias('boundedBillingPartnerSettings.isPracticeManagementIFrameOn'),

    patientPracticeGuid: alias('patient.patientPracticeGuid'),
    patient: alias('model'),
    isLoading: false,
    isPrintChartVisible: false,
    isClinicalDocumentPendingModalVisible: false,
    showPhotoUpload: false,
    patientMissingMessage: null,
    patientMissingMessageDetail: null,
    showPatientLinkCopyModal: false,
    patientLink: null,
    showAccessHistory: false,
    tabActionItems: null,
    showRecentActivity: false,

    guid: alias('model.guid'),
    id: alias('model.id'),
    patientRecordNumber: alias('model.patientRecordNumber'),
    birthDate: alias('model.birthDate'),
    shouldShowDeletedEncounterWarning: false,
    length: 0,
    shouldHideNavigation: false,
    isCreateClinicalDocumentVisible: false,

    persistentNavigationItemsClass: computed(function() {
        return EmberObject.create({
            componentName: 'patient-persistent-navigation',
            patient: this
        });
    }),
    isEntitledToEnhancedActions: computed('authorization.entitledFeatures.[]', function () {
        return this.get('authorization').isEntitledFor('Chart.Actions.Enhanced');
    }),
    isNotEntitledToEnhancedActions: not('isEntitledToEnhancedActions'),

    navigationPadding: 80,
    dob: computed('patient.birthDate', function () {
        if (this.get('patient.birthDate')) {
            var momentDob = moment(this.get('patient.birthDate'));
            if (momentDob.isValid()) {
                return momentDob.format('L');
            }
        }
        return null;
    }),
    ageInMonths: computed('patient.birthDate', function() {
        return moment().diff(this.get('patient.birthDate'), 'months');
    }),
    getAgeOnDate(date) {
        return dateHelper.getAgeOnDate(this.get('patient.birthDate'), date);
    },
    fullName: alias('patient.fullName'),
    genderString: alias('patient.genderString'),
    gender: computed('patient.genderString', function () {
        var gender = this.get('patient.genderString');
        return (_.isString(gender)) ? gender.charAt(0).toUpperCase() : '';
    }),
    patientImageExists: computed('patient.imageUrlAuthenticated', function() {
        var patient = this.get('patient');
        return (patient && patient.imageUrlAuthenticated);
    }),
    actionsMenuItems: computed('patient', 'tabActionItems.[]', 'isNotEntitledToEnhancedActions', 'priorAuthService.hasPriorAuthEnabledProviders', function () {
        const tabActionItems = this.get('tabActionItems');
        const isEnhancedActionDisabled = this.get('isNotEntitledToEnhancedActions');
        const isCreatePriorAuthDisabled = !this.get('priorAuthService.canInitiateManualPriorAuth');
        const actions = [];

        if (tabActionItems) {
            actions.pushObjects(tabActionItems);
        }

        if (this.get('patient')) {
            actions.pushObjects([
                { separatorText: 'For this patient' },
                { text: 'Add imaging order', action: 'addImagingOrder', isDisabled: isEnhancedActionDisabled },
                { text: 'Add lab order', action: 'addLabOrder', isDisabled: isEnhancedActionDisabled }
            ]);
            if (this.get('priorAuthService.canInitiateManualPriorAuth') && this.get('priorAuthService.hasPriorAuthEnabledProviders')) {
                actions.pushObject({ text: 'Add prior authorization', action: 'showSurescriptsInitiateModal', isDisabled: isCreatePriorAuthDisabled });
            }
            if ((!tabActionItems || !tabActionItems.findBy('text', 'Add referral'))) {
                actions.pushObject({ text: 'Add referral', action: 'orderReferral', isDisabled: isEnhancedActionDisabled });
            }
            actions.pushObjects([
                { text: 'Copy link to patient', action: 'copyPatientLink', isDisabled: isEnhancedActionDisabled },
                { text: 'Invite to patient portal', action: 'enrollPatientInPHR', isDisabled: isEnhancedActionDisabled },
                { text: 'Enter imaging results', action: 'enterImagingResults', isDisabled: isEnhancedActionDisabled },
                { text: 'Enter lab results', action: 'enterLabResults', isDisabled: isEnhancedActionDisabled }
            ]);

            actions.pushObject({ text: 'Create clinical document', action: 'createClinicalSummary' });

            actions.pushObjects([
                { text: 'Print patient chart', action: 'printChart' },
                { text: 'Refresh patient chart', action: 'refreshChart' },
                { text: 'View access history', action: 'viewAccessHistory' },
                { text: 'Send message', action: 'sendPatientNewMessage', isDisabled: isEnhancedActionDisabled },
                { text: 'Create task', action: 'openNewTaskDialog', hotkeys: [{ hotkeyModifier: 'N', hotkey: 'T' }, { hotkeyModifier: 'T', hotkey: 'N' }], isDisabled: isEnhancedActionDisabled },
                { text: 'View exported patient records', action: 'listClinicalSummary' },
                { text: 'View imaging orders', action: 'viewImagingOrders' },
                { text: 'View lab orders', action: 'viewLabOrders' },
                { text: 'View recent activity', action: 'viewRecentActivity' }
            ]);

            if (this.get('isPracticeManagementIFrameOn')) {
                actions.pushObjects([
                    { separatorText: 'Billing for this patient' },
                    { text: 'Enter payment', action: 'openPsPaymentModal' },
                    { text: 'View financial summary', action: 'openPsFinancialSummaryModal' },
                    { text: 'View ledger', action: 'openPsLedgerTab' },
                    { text: 'View statement history', action: 'openPsStatementHistoryTab' }
                ]);
            }
        }

        return actions;
    }),
    refreshChart() {
        const patientPracticeGuid = this.get('patientPracticeGuid');
        return this._withProgress(this.get('patientService').refreshChart(patientPracticeGuid)).then(() => {
            this.get('patientService').updatePinnedNote();
        });
    },

    loadProviders: on('init', function () {
        this.get('priorAuthService.loadProviders').perform();
    }),

    actions: {
        addPhoto() {
            this.set('showPhotoUpload', true);
        },
        closePracticeSuiteModal() {
            this.send('closePsModal');
        },
        displayPendingClinicalSummaryModal() {
            this.set('isClinicalDocumentPendingModalVisible', true);
        },
        messagePatient() {
            this.send('messagePatient');
        },
        editPinnedNote() {
            this.send('showEditPinnedNoteModal', 'Patient ribbon');
        },
        openPsFinancialSummaryModal() {
            const modalData = {
                fullName: this.get('fullName'),
                modalType: 'financial-summary',
                patientPracticeGuid: this.get('patientPracticeGuid')
            };
            this.send('openPracticeSuiteModal', modalData);
        },
        openPsPaymentModal() {
            const modalData = {
                fullName: this.get('fullName'),
                modalType: 'payment',
                patientPracticeGuid: this.get('patientPracticeGuid')
            };
            this.send('openPracticeSuiteModal', modalData);
        },
        openPsLedgerTab() {
            this.send('openPracticeSuiteTab', 'ledger');
        },
        openPsStatementHistoryTab() {
            this.send('openPracticeSuiteTab', 'statement');
        },
        openPhrEnrollment() {
            this.send('openPopup', 'enrollPhr', {
                patientPracticeGUID: this.get('patientPracticeGuid')
            });
        },
        showSurescriptsModal(priorAuthGuid, isReinitiate) {
            this.get('pfController').send('showSurescriptsModal', this.get('patient'), priorAuthGuid, isReinitiate);
        },
        showSurescriptsInitiateModal() {
            this.get('pfController').send('showSurescriptsModal', this.get('patient'), null, false);
            this.get('analytics').track('Add PA', { Action: 'Action menu' });
        },
        goToClinicalSummaryTimeline() {
            this.send('listClinicalSummary');
        }
    }
});
