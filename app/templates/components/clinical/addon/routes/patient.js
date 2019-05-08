import { merge } from '@ember/polyfills';
import { isPresent } from '@ember/utils';
import { A } from '@ember/array';
import EmberObject, { get } from '@ember/object';
import { inject as service } from '@ember/service';
import NavigationRoute from 'common/routes/navigation';
import printAudit from 'charting/repositories/chart-print-audit';
import config from 'boot/config';
import session from 'boot/models/session';
import PFServer from 'boot/util/pf-server';
import MessagingContact from 'collaboration/models/contact';

export default NavigationRoute.extend({
    adBanner: service(),
    analytics: service(),
    subscription: service(),
    referrerService: service('referrer'),
    tunnel: service(),
    pfRouting: service('pf-routing'),

    templateName: 'patient',
    defaultRoute: 'patient.summary',

    model(param) {
        const store = this.get('store');
        let model;

        if (param.patient_guid && param.patient_guid !== 'search') {
            model = store.peekRecord('patientSummary', param.patient_guid);
            if (model && !model.get('isLoading') && !model.get('isEmpty')) {
                return model.reload();
            } else {
                return store.findRecord('patientSummary', param.patient_guid).catch(() => {
                    toastr.error('Failed to load patient');
                    this.replaceWith('charts.list');
                });
            }
        }
    },
    setupController(controller, model) {
        this._super(controller, model);

        const chartsController = this.controllerFor('charts');
        const patientPracticeGuid = model ? model.get('patientPracticeGuid') : null;
        const tabs = this.initTabs(patientPracticeGuid);
        this.set('menuItems', tabs);
        controller.set('menuItems', tabs);
        controller.set('navigationClass', 'nav nav-tabs');
        controller.set('useMenuRollup', true);
        controller.set('tabWidth', 135);

        if (model) {
            controller.set('outletClass', 'patient');
            controller.set('guid', patientPracticeGuid);
            session.set('patientGUID', patientPracticeGuid);

            if (!chartsController.get('menuItems').isAny('arg1', patientPracticeGuid)) {
                chartsController.send('openTab', EmberObject.create({
                    label: model.get('displayName'),
                    route: 'patient',
                    arg1: patientPracticeGuid,
                    dismissible: true,
                    dupeOk: true
                }));
            }

            // We are manually logging a chart pull here. CHAR-1847
            PFServer.callWebService(config.chartingURL + 'Access/' + patientPracticeGuid, null, null, 'POST');
        } else {
            controller.set('outletClass', 'patient missing-patient');
        }
    },
    initTabs(patientPracticeGuid) {
        if (!patientPracticeGuid) {
            return [];
        }
        let menuItems = this.get('menuItems-' + patientPracticeGuid);
        // Don't reset the tabs if the patient tab is open and we have already cached
        // the patient's open tabs.
        if (this.controllerFor('charts').get('menuItems').isAny('arg1', patientPracticeGuid) && menuItems) {
            return menuItems;
        }
        menuItems = A();
        menuItems.addObject(EmberObject.create({
            label: 'Summary',
            route: 'patient.summary',
            arg1: patientPracticeGuid
        }));
        menuItems.addObject(EmberObject.create({
            label: 'Timeline',
            route: 'timeline',
            arg1: patientPracticeGuid
        }));
        menuItems.addObject(EmberObject.create({
            label: 'Profile',
            route: 'patient.profile',
            arg1: patientPracticeGuid
        }));
        this.set('menuItems-' + patientPracticeGuid, menuItems);
        return menuItems;
    },
    serialize(model, params) {
        const name = params[0];
        const object = {};
        object[name] = model && model.get('id');
        return object;
    },
    redirect(model, transition) {
        if (transition.targetName === 'patient.index' && transition.params && transition.params.patient && transition.params.patient.patient_guid) {
            const patientPracticeGuid = transition.params.patient.patient_guid;
            const lastHandler = this.get('lastHandler-' + patientPracticeGuid);
            // Navigate to the previous open patient subtab if the patient's tab was open.
            if (lastHandler && this.controllerFor('charts').get('menuItems').isAny('arg1', patientPracticeGuid)) {
                this.replaceWithHandler(lastHandler);
            }
        }
    },
    getHandlerForTab(tab) {
        // Instead of searching by route name we will search based on the chart guid for encounter tabs.
        if (tab.route === 'encounter') {
            return this.router._routerMicrolib.currentHandlerInfos.findBy('params.transcriptGuid', tab.arg1);
        }
        return this._super(tab);
    },
    removeTabHistory(tab) {
        const lastHandlerKey = 'lastHandler-' + this.get('controller.guid');
        const lastHandler = this.get(lastHandlerKey);
        if (lastHandler && tab.route === lastHandler.name) {
            if (tab.route !== 'encounter' || tab.arg1 === lastHandler.params.transcriptGuid) {
                this.set(lastHandlerKey, null);
            }
        }
    },
    actions: {
        addDocumentTab(document) {
            const documentGuid = get(document, 'documentGuid');
            const menuItems = this.get('menuItems');
            const returnRoute = this.get('controller.returnRoute');
            let tab = menuItems.findBy('documentGuid', documentGuid);

            if (!tab) {
                tab = EmberObject.create({
                    label: get(document, 'title'),
                    route: 'patient.documents.document',
                    arg1: get(document, 'id'),
                    documentGuid,
                    dismissible: true,
                    noIcon: true,
                    dupeOk: false
                });
                menuItems.addObject(tab);
            }

            if (returnRoute) {
                tab.setProperties({
                    transitionOnCloseRoute: returnRoute.route,
                    transitionOnCloseArguments: returnRoute.arguments
                });
                this.set('controller.returnRoute');
            }

            // Prevent this action from bubbling up.
            return false;
        },
        closeDocumentTab(documentGuid) {
            const menuItems = this.get('menuItems');
            const tab = documentGuid && menuItems.findBy('documentGuid', documentGuid);

            if (tab) {
                this.send('closeTab', tab);
            }
        },
        willTransition(transition) {
            const patientPracticeGuid = this.get('controller.patientPracticeGuid');
            if (this.get('closingActiveTab')) {
                this.set('closingActiveTab', false);
            } else {
                this.set(`lastHandler-${patientPracticeGuid}`, this.getChildHandler());
            }
            this.set('controller.showRecentActivity', false);
            // We are either leaving to another patient or somewhere outside the patient context, so let's clear the referrer to make sure the user is not
            // automatically navigated back to the current patient.
            if (get(transition, 'params.patient.patient_guid') !== patientPracticeGuid) {
                this.set('referrerService.referrer', null);
            }
            return true;
        },
        addLabOrder() {
            this.transitionTo('orders.new', 'diagnostic');
        },
        addImagingOrder() {
            this.transitionTo('orders.new', 'imaging');
        },
        viewLabOrders() {
            this.transitionTo('timeline.events', 'laborder');
        },
        viewImagingOrders() {
            this.transitionTo('timeline.events', 'imgorder');
        },
        enrollPatientInPHR() {
            this.send('openPopup', 'enrollPhr', {
                patientPracticeGUID: this.get('controller.patientPracticeGuid')
            });

            this.send('refreshAd');
        },
        enterLabResults() {
            this.send('refreshAd');

            this.transitionTo('results.new', 'diagnostic');
        },
        enterImagingResults() {
            this.send('refreshAd');

            this.transitionTo('results.new', 'imaging');
        },
        copyPatientLink() {
            const urlParts = [];
            if (window.location.origin) {
                urlParts.push(window.location.origin);
            } else {
                urlParts.push(window.location.protocol);
                urlParts.push('//');
                urlParts.push(window.location.hostname);
            }
            urlParts.push(window.location.pathname);
            urlParts.push('#/PF/charts/patients/');
            urlParts.push(this.get('controller.patientPracticeGuid'));
            urlParts.push('/summary');
            this.set('controller.patientLink', urlParts.join(''));
            this.set('controller.showPatientLinkCopyModal', true);

            this.send('refreshAd');
        },
        viewAccessHistory() {
            this.set('controller.showAccessHistory', true);
            this.send('refreshAd');
        },
        refreshChart() {
            this.get('tunnel').send('summary-messages-list', { reloadMessages: true });
            this.get('controller').refreshChart();
        },
        createClinicalSummary() {
            if (this.get('session.isStaff') && !this.get('session.isAdmin')) {
                toastr.error('You do not have permission to use this feature');
                return;
            }
            this.set('controller.isCreateClinicalDocumentVisible', true);
            this.send('refreshAd');
        },
        listClinicalSummary() {
            this.set('controller.isClinicalDocumentPendingModalVisible', false);
            const timelineEventsController = this.controllerFor('timeline.events');

            if (this.get('pfRouting.currentRouteName') === 'timeline.events' && timelineEventsController && timelineEventsController.get('filterByClinicalDocuments')) {
                this.controllerFor('timeline.events').send('refresh');
                return;
            }
            this.transitionTo('timeline.events', 'clinicaldocuments', { queryParams: { forceRefresh: true } });
        },
        openPracticeSuiteTab(tabType) {
            if (isPresent(tabType)) {
                this.transitionTo('patient.practice-suite', tabType);
            }
        },
        showClinicalSummary(params) {
            this.send('openCcdPreview', merge({ isCCD: true, isOutbound: true }, params));
            this.send('refreshAd');
        },
        viewRecentActivity() {
            this.set('controller.showRecentActivity', true);

            this.send('refreshAd');
        },

        printChart() {
            this.set('controller.isPrintChartVisible', true);

            this.send('refreshAd');
        },

        orderReferral() {
            this.transitionTo('timeline.events', 'encounter', {
                queryParams: {
                    action: 'orderReferral'
                }
            });
        },
        printAudit(printEvent, transcriptGuid) {
            printAudit.sendEvent({
                patientPracticeGuid: this.get('controller.patientPracticeGuid'),
                printEvent,
                transcriptGuid
            }, this.get('analytics'));

            this.send('refreshAd');
        },
        sendPatientNewMessage() {
            PFServer.promise(config.addPatientURL + '/' + this.controllerFor('patient').get('patientPracticeGuid'))
                .then(data => {
                    this.send('openNewMessage', 'new', {
                        regardingPatient: data.patient
                    });
                }).catch(function() {
                    toastr.error('Failed to load patient details');
                });

            this.send('refreshAd');
        },
        messagePatient() {
            PFServer.promise(config.addPatientURL + '/' + this.controllerFor('patient').get('patientPracticeGuid'))
                .then(data => {
                    const patientRecipient = MessagingContact.create({
                        firstName: data.patient.firstName,
                        lastName: data.patient.lastName,
                        reversedName: data.patient.lastName + ', ' + data.patient.firstName,
                        guid: data.patient.patientGuid,
                        type: 'patient'
                    });
                    this.send('openNewMessage', 'new', {
                        recipients: [patientRecipient],
                        toPatient: true
                    });
                }).catch(() => {
                    toastr.error('Failed to load patient details');
                });
            this.send('refreshAd');
        },
        navigateToEncounter(transcriptGuid) {
            this.transitionTo('encounter', transcriptGuid);
        },
        refreshAd(subzone) {
            const patientPracticeGuid = this.paramsFor('patient').patient_guid;
            this.get('adBanner').updateAdUrl({
                currentPatientGuid: patientPracticeGuid,
                zone: 'charts',
                subzone: subzone || 'action',
                currentMedication: null
            });
        },
        downloadClinicalDocument() {
            this.get('analytics').track('Data Portability Patient Download', { 'Document Format': 'xml' });
            return true;
        },
        downloadClinicalDocumentHtml() {
            this.get('analytics').track('Data Portability Patient Download', { 'Document Format': 'html' });
            return true;
        },
        showDeletedEncounterWarning() {
            this.set('controller.shouldShowDeletedEncounterWarning', true);
        },
        transitionToEncounterTimeline() {
            this.set('controller.shouldShowDeletedEncounterWarning', false);
            this.transitionTo('timeline.events', 'encounter');
        },
        showEditPinnedNoteModal(location) {
            this.set('controller.shouldShowEditPinnedNoteModal', true);
            this.set('controller.pinnedNoteModalLocation', location);
        },
        subscribe() {
            this.get('subscription').showSignupModal({
                stepToDisplay: this.get('config.isSubscriptionRenewalOn') ? 'signup/signup-splash' : 'subscription-signup-plans'
            });
            if (this.get('router.currentRouteName').includes('encounter')) {
                this.get('analytics').trackLimitedAccess('Encounter actions menu');
            } else if (this.get('router.currentRouteName').includes('summary')) {
                this.get('analytics').trackLimitedAccess('Chart actions menu');
            }
        }
    }
});
