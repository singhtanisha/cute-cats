import { empty, not, and } from '@ember/object/computed';
import { task, timeout } from 'ember-concurrency';
import Component from '@ember/component';
import { computed, get, observer, set } from '@ember/object';
import { isEmpty, isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import SpinnerSupport from 'common/mixins/spinner';

export default Component.extend(SpinnerSupport, {
    classNames: ['flex-column', 'box-padding-LRlg-v2', 'registry-search-container'],

    analytics: service(),

    isHistoryVisible: true,
    isSearchVisible: true,
    selectedRegistry: null,
    isAdvancedVisible: false,

    hasNoRegistries: empty('connectedRegistries'),
    isForecastVisible: not('isHistoryVisible'),
    isWaitingMessageVisible: and('queryRegistry.isRunning', 'queryWait.isIdle'),

    connectedRegistries: computed('registries', 'registryConnections', function () {
        const registries = get(this, 'registries');
        const registryConnections = get(this, 'registryConnections') || [];
        return registryConnections.map(connection => {
            return (registries || []).findBy('immunizationRegistryGuid', get(connection, 'immunizationRegistryGuid'));
        });
    }),

    hasMultipleConnectedRegistries: computed('connectedRegistries', function () {
        return (get(this, 'connectedRegistries').toArray() || []).length > 1;
    }),
    showSpinner: computed('queryRegistry.isRunning', 'loadPatientDetails.isRunning', 'isWaitingMessageVisible', function () {
        return get(this, 'loadPatientDetails.isRunning') || (get(this, 'queryRegistry.isRunning') && !get(this, 'isWaitingMessageVisible'));
    }),

    connectedRegistriesChanged: observer('connectedRegistries', function () {
        const connectedRegistries = get(this, 'connectedRegistries');
        const selectedRegistry = get(this, 'selectedRegistry');
        if (isPresent(connectedRegistries) && (isEmpty(selectedRegistry) || isEmpty(connectedRegistries.findBy('immunizationRegistryGuid', get(selectedRegistry, 'immunizationRegistryGuid'))))) {
            set(this, 'selectedRegistry', get(connectedRegistries, 'firstObject'));
        }
    }),
    patientChanged: observer('patient.patientPracticeGuid', function () {
        get(this, 'loadPatientDetails').perform();
    }),

    loadPatientDetails: task(function* () {
        try {
            const patientPracticeGuid = get(this, 'patient.patientPracticeGuid');
            const patientDetails = yield get(this, 'store').findRecord('patient', patientPracticeGuid);
            this.send('clearFilters', patientDetails);
        } catch (err) {
            this.send('clearFilters');
        }
    }).drop(),

    queryRegistry: task(function* () {
        try {
            const results = yield get(this, 'store').queryRecord('immunization-registry-result', {
                facilityGuid: get(this, 'session.facilityGuid'),
                patientFilters: get(this, 'patientFilters'),
                patientPracticeGuid: get(this, 'patient.patientPracticeGuid'),
                registryGuid: get(this, 'selectedRegistry.id'),
                registryName: get(this, 'selectedRegistry.displayName'),
                isAdvancedVisible: get(this, 'isAdvancedVisible')
            });
            set(this, 'searchResults', results);
            this.attrs.toggleIsRegistryPrintingEnabled(true);
            set(this, 'isSearchVisible', false);
        } catch (error) {
            this.attrs.toggleIsRegistryPrintingEnabled(false);
            set(this, 'error', error || { errorMessage: 'There was an error connecting to the registry.' });
        }
    }).drop(),
    queryWait: task(function* () {
        yield timeout(get(this, 'config.longAsyncWarningTimeout') || 10000);
        if (get(this, 'queryRegistry.isRunning')) {
            get(this, 'analytics').track('Loading of Registry Record');
        }
    }).drop(),

    init() {
        this._super();
        this.patientChanged();
        this.connectedRegistriesChanged();
    },

    willDestroyElement() {
        this.attrs.toggleIsRegistryPrintingEnabled(false);
        this._super(...arguments);
    },

    actions: {
        cancelWait() {
            get(this, 'queryRegistry').cancelAll();
            get(this, 'queryWait').cancelAll();
            get(this, 'analytics').track('Cancel Loading of Registry Record');
        },
        clearError() {
            set(this, 'error', null);
        },
        clearFilters(defaultPatient) {
            const defaultSettings = isEmpty(defaultPatient) ? {} : {
                address1: get(defaultPatient, 'streetAddress1'),
                address2: get(defaultPatient, 'streetAddress2'),
                birthOrder: get(defaultPatient, 'birthSequence'),
                city: get(defaultPatient, 'city'),
                dateOfBirth: get(defaultPatient, 'birthDate'),
                firstName: get(defaultPatient, 'firstName'),
                gender: get(defaultPatient, 'gender'),
                isMultipleBirth: get(defaultPatient, 'isMultipleBirth'),
                lastName: get(defaultPatient, 'lastName'),
                middleName: get(defaultPatient, 'middleName'),
                mothersMaidenName: get(defaultPatient, 'mothersMaidenName'),
                patientRecordNumber: get(defaultPatient, 'patientRecordNumber'),
                phoneNumber: get(defaultPatient, 'mobilePhone') || get(defaultPatient, 'homePhone') || get(defaultPatient, 'officePhone'),
                postalCode: get(defaultPatient, 'postalCode'),
                state: get(defaultPatient, 'state')
            };
            set(this, 'patientFilters', get(this, 'store').createRecord('immunization-registry-filter', defaultSettings));
        },
        search() {
            set(this, 'error', null);
            get(this, 'analytics').track('Perform Registry Search', {
                registryName: get(this, 'selectedRegistry.displayName')
            });
            get(this, 'queryRegistry').perform();
            get(this, 'queryWait').perform();
        },
        toggleAdvanced() {
            this.toggleProperty('isAdvancedVisible');
        },
        toggleSearch(showSearch) {
            set(this, 'isSearchVisible', showSearch);
            get(this, 'analytics').track(showSearch ? 'Edit Registry Search' : `View Registry Record ${get(this, 'isHistoryVisible') ? 'History' : 'Forecast'}`);
            this.attrs.toggleIsRegistryPrintingEnabled(!showSearch);
        },
        toggleResultsView(view) {
            set(this, 'isHistoryVisible', view === 'history');
            get(this, 'analytics').track(`View Registry Record ${get(this, 'isHistoryVisible') ? 'History' : 'Forecast'}`);
        }
    }
});
