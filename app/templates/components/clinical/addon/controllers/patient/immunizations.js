import { task } from 'ember-concurrency';
import Object, {
    computed,
    get,
    set,
    setProperties,
    observer
} from '@ember/object';
import { or, empty, notEmpty, alias } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import Controller, { inject as controller } from '@ember/controller';
import ImmunizationRepository from 'clinical/repositories/immunization';
import ImmunizationRegistryRepository from 'clinical/repositories/immunization-registry';
import scrollHelper from 'common/utils/scroll-helper';
import { isArray } from '@ember/array';

export default Controller.extend({
    analytics: service(),
    authorization: service(),
    patientController: controller('patient'),

    cdsAlerts: null,
    facilities: null,
    immunizationRegistries: null,
    immunizationTransmitPreference: null,
    isAllowedToEditImmunizations: false,
    isPrintPreviewVisible: false,
    isPrintRegistryRecordEnabled: false,
    preloadCode: null,
    preloadKeyword: null,
    printWithComments: false,
    registryConnections: null,
    selectedImmunizationRegistry: null,
    selectedVaccination: null,
    isRegistrySearchVisible: false,
    immunizationList: null,
    transmissionRequestErrors: null,
    hasNoImmunizations: empty('immunizationList'),
    isConnectedToRegistry: notEmpty('registryConnections'),
    isElectronicTransmission: notEmpty('electronicRegistryConnection'),
    patient: alias('patientController.patient'),
    patientPracticeGuid: alias('patientController.guid'),
    immunizationListLoading: or('loadPatientImmunizations.isRunning', 'transmitPatientImmunizations.isRunning'),
    isDetailsVisible: or('isAddingImmunization', 'selectedVaccination'),

    electronicRegistryConnection: computed('registryConnections.@each.immunizationRegistryConnectionStatus', function () {
        const registryConnections = get(this, 'registryConnections') || [];
        return registryConnections.findBy('immunizationRegistryConnectionStatus', 'Successfully activated');
    }),
    lastTransmissionDate: computed('transmissionStatuses', function () {
        const transmissions = (get(this, 'transmissionStatuses') || []).filterBy('hasNoErrors').sortBy('transmissionDateTimeUtc').reverse();
        if (isPresent(transmissions)) {
            return get(transmissions[0], 'transmissionDateTimeUtc');
        }
        return null;
    }),
    transmissionErrors: computed('transmissionStatuses', 'transmissionRequestErrors', 'lastTransmissionDate', function () {
        const registryErrors = {};
        const lastSuccessfulTransmission = moment(get(this, 'lastTransmissionDate'));
        const newErrorStatuses = (get(this, 'transmissionStatuses') || []).filter(status => {
            return get(status, 'hasErrors') && moment(get(status, 'transmissionDateTimeUtc')) >= lastSuccessfulTransmission;
        }).sortBy('transmissionDateTimeUtc').reverse();
        (newErrorStatuses || []).forEach(status => {
            const index = moment.utc(status.get('transmissionDateTimeUtc')).format('MM/DD/YYYY');
            const errors = status.get('transmissionErrorList').map(error => ({ errorMessage: error }));
            registryErrors[index] = [...(registryErrors[index] || []), ...errors];
        });
        const transmissionRequestErrors = (get(this, 'transmissionRequestErrors') || []).map(error => ({ errorMessage: error }));
        if (isPresent(transmissionRequestErrors)) {
            const today = moment().format('MM/DD/YYYY');
            registryErrors[today] = [...(registryErrors[today] || []), ...transmissionRequestErrors];
        }
        return registryErrors;
    }),
    transmitPopOverText: computed('immunizationTransmitPreference', function () {
        if (get(this, 'immunizationTransmitPreference')) {
            return 'The patient indicated to not transmit and share immunization information. Go to Patient Profile to change immunization registry settings.';
        }
        return 'You will transmit all vaccination info including administered, historical and refused vaccination records for this patient.';
    }),

    connectToRegistryBySetting: task(function* () {
        const settings = yield get(this, 'store').findAll('newSetting');
        const setting = settings.findBy('id', 'IMMUNIZATION-REGISTRY');
        if (setting) {
            this.transitionToRoute(setting.get('destinationInCarbon'));
        }
    }).drop(),
    deletePatientVaccination: task(function* (vaccination) {
        const vaccinationGuid = get(vaccination, 'vaccinationGuid');
        this.get('patientImmunizations').forEach(immunization => {
            const vaccinationToDelete = get(immunization, 'vaccinations').findBy('vaccinationGuid', vaccinationGuid);
            if (vaccinationToDelete) {
                get(immunization, 'vaccinations').removeObject(vaccinationToDelete);
            }
        });

        try {
            yield vaccination.deleteRecord();
            yield vaccination.save();

            toastr.success('Immunization record deleted');
            this.send('updatePatientAdContextCvxCodes');
        } catch (err) {
            toastr.error('Failed to delete vaccination.');
        }
        this.send('closeDetails');
    }).drop(),
    loadAlerts: task(function* () {
        const alerts = yield ImmunizationRepository.getPatientVaccinationAlerts(get(this, 'patientPracticeGuid'));
        set(this, 'cdsAlerts', alerts);
    }).drop(),
    loadFacilities: task(function* () {
        const facilities = yield this.get('store').findAll('facility');
        set(this, 'facilities', (facilities.toArray() || []));
    }).drop(),
    loadLookupData: task(function* () {
        const lookup = yield get(this, 'store').findAll('vaccine-lookup-datum');
        this.set('immunizationLookupData', lookup);
    }).drop(),
    loadPatientImmunizations: task(function* () {
        const immunizations = yield get(this, 'store').query('immunization', {
            patientPracticeGuid: get(this, 'patientPracticeGuid')
        });
        set(this, 'patientImmunizations', immunizations);
        set(this, 'immunizationList', ImmunizationRepository.getPatientVaccinations(
            get(this, 'patientImmunizations'),
            get(this, 'practiceProviders'),
            get(this, 'registryConnections'),
            get(this, 'immunizationRegistries')
        ));
    }).keepLatest(),
    loadPatientPreference: task(function* () {
        const preferences = yield get(this, 'store').findRecord('patient', get(this, 'patientPracticeGuid'));
        this.set('immunizationTransmitPreference', get(preferences, 'immunizationProtectionTypeId') === 2);
    }).drop(),
    loadProviderList: task(function* () {
        set(this, 'practiceProviders', []);
        const providers = yield get(this, 'store').findAll('provider-profile');
        this.set('practiceProviders', providers);
    }).drop(),
    loadRegistries: task(function* () {
        const registries = yield ImmunizationRegistryRepository.loadActiveRegistries(get(this, 'store'));
        set(this, 'immunizationRegistries', registries);
    }).drop(),
    loadRegistryConnections: task(function* () {
        const connections = yield ImmunizationRegistryRepository.loadRegistryConnections(get(this, 'store'));
        set(this, 'registryConnections', connections);
    }).drop(),
    loadTransmissionStatuses: task(function* () {
        const statuses = yield get(this, 'store').query('immunization-transmission-status', {
            patientPracticeGuid: get(this, 'patientPracticeGuid')
        });
        set(this, 'transmissionStatuses', statuses.toArray());
    }).drop(),
    transmitPatientImmunizations: task(function* () {
        const patientPracticeGuid = get(this, 'patientPracticeGuid');
        try {
            yield ImmunizationRegistryRepository.transmitImmunizationV2(patientPracticeGuid);
            set(this, 'transmissionRequestErrors', null);
            toastr.success('Successfully transmitted patient immunizations');
            this.send('refreshImmunizations');
        } catch (err) {
            let errorMessages = err;
            if (!isArray(errorMessages)) {
                errorMessages = ['Unexpected error transmitting to registry'];
            }
            set(this, 'transmissionRequestErrors', errorMessages);
        }
        get(this, 'loadTransmissionStatuses').perform();
    }).drop(),

    load() {
        set(this, 'isAllowedToEditImmunizations', get(this, 'authorization').isEntitledFor('Chart.Immunizations.Edit'));
        get(this, 'loadAlerts').perform();
        get(this, 'loadFacilities').perform();
        get(this, 'loadProviderList').perform();
        get(this, 'loadRegistries').perform();
        get(this, 'loadRegistryConnections').perform();
        get(this, 'loadPatientPreference').perform();
        get(this, 'loadLookupData').perform();
        get(this, 'loadPatientImmunizations').perform();
        get(this, 'loadTransmissionStatuses').perform();
        this.loadPatientImmunizationsTab();
    },

    loadPatientImmunizationsTab() {
        const patientController = get(this, 'patientController');
        const actions = [{ separatorText: 'For immunizations' }];
        const isNotAllowedToEditImmunizations = !get(this, 'isAllowedToEditImmunizations');

        if (!Modernizr.touch) {
            actions.pushObject({ text: 'Download immunization record', action: 'downloadImmunizationRecord' });
        }

        actions.pushObject({ text: 'Manage vaccine inventory', action: 'manageVaccineInventory', isDisabled: isNotAllowedToEditImmunizations });

        actions.pushObjects([
            { text: 'Print vaccinations', action: 'printVaccinations' },
            { text: 'Print vaccinations with comments', action: 'printVaccinationsWithComments' }
        ]);

        actions.pushObject({ text: 'Transmit to state registry', action: 'transmitToStateRegistry', isDisabled: isNotAllowedToEditImmunizations });

        set(patientController, 'tabActionItems', actions);

        patientController.send('openTab', Object.create({
            label: 'Immunizations',
            route: 'patient.immunizations',
            dismissible: true,
            noIcon: true
        }));
        set(this, 'isRegistrySearchVisible', false);
    },

    preloadVaccinations() {
        setProperties(this, {
            isAddingImmunization: get(this, 'preloadCode') || get(this, 'preloadKeyword'),
            selectedVaccination: null
        });
    },

    reloadImmunizations: observer('model.patientPracticeGuid', function () {
        get(this, 'loadPatientImmunizations').perform();
    }),

    actions: {
        addVaccination() {
            setProperties(this, {
                isAddingImmunization: true,
                selectedVaccination: null
            });
            scrollHelper.scrollToTopOfElement($('.immunizations-bidirectional .scrollable-panel'));
            get(this, 'analytics').track('Add Vaccine', { isSplitViewOpen: get(this, 'isRegistrySearchVisible')});
        },
        closeDetails() {
            setProperties(this, {
                selectedVaccination: null,
                isAddingImmunization: false,
                preloadCode: null,
                preloadKeyword: null
            });
            this.send('refreshImmunizations');
        },
        connectToRegistry() {
            get(this, 'connectToRegistryBySetting').perform();
        },
        deleteVaccination(vaccination) {
            get(this, 'deletePatientVaccination').perform(vaccination);
        },
        downloadImmunizationRecord() {
            set(this, 'isDownloadVisible', true);
        },
        print(withComments) {
            setProperties(this, {
                printRegistryRecord: false,
                printWithComments: withComments,
                isPrintPreviewVisible: true
            });
        },
        printRegistryRecord() {
            set(this, 'printRegistryRecord', true);
        },
        toggleIsRegistryPrintingEnabled(enabled) {
            set(this, 'isPrintRegistryRecordEnabled', enabled);
        },
        refreshImmunizations() {
            get(this, 'store').unloadAll('immunization');
            get(this, 'loadPatientImmunizations').perform();
        },
        searchInRegistry() {
            set(this, 'isRegistrySearchVisible', true);
            get(this, 'analytics').track('Search in Registry');
        },
        transitionToEditProvider(providerGuid) {
            this.transitionToRoute('settings.editUser', providerGuid);
        },
        transmitToStateRegistry() {
            get(this, 'transmitPatientImmunizations').perform();
        },
        vaccineInventory() {
            this.transitionToRoute('settings.vaccineinventory');
        },

        viewImmunizationDetails(vaccinationRow) {
            set(this, 'selectedVaccination', vaccinationRow);
            scrollHelper.scrollToTopOfElement($('.immunizations-bidirectional .scrollable-panel'));
        },
        updatePatientAdContextCvxCodes() {
            const store = get(this, 'store');
            const patientPracticeGuid = get(this, 'patientPracticeGuid');
            const patientAdContext = store.peekRecord('patient-ad-context', patientPracticeGuid);
            if (patientAdContext) {
                const vaccinations = store.peekAll('vaccination');
                const codes = vaccinations.map(vaccination => {
                    if (get(vaccination, 'patientPracticeGuid') !== patientPracticeGuid || get(vaccination, 'source.isRefused')) {
                        return null;
                    }
                    const type = get(vaccination, 'vaccineType');
                    return isPresent(type) ? parseInt(get(type, 'cvxCode'), 10) : null;
                }).compact().uniq();
                set(patientAdContext, 'xc', codes);
                this.send('refreshAd', 'immunization');
            }
        }
    }
});
