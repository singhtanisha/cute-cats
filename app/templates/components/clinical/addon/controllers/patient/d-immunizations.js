import { Promise } from 'rsvp';
import { scheduleOnce } from '@ember/runloop';
import { isEmpty, isPresent } from '@ember/utils';
import EmberObject, { computed } from '@ember/object';
import { empty, notEmpty, alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller, { inject as controller } from '@ember/controller';
import ImmunizationRepository from 'clinical/repositories/immunization';
import ImmunizationRegistryRepository from 'clinical/repositories/immunization-registry';
import WithPatientPrintTitleMixin from 'charting/mixins/with-patient-print-title';

export default Controller.extend(WithPatientPrintTitleMixin, {
    authorization: service(),
    patientController: controller('patient'),

    cdsAlerts: null,
    displayName: 'Immunizations',
    facilities: null,
    immunizationRegistries: null,
    immunizationTransmitPreference: null,
    isAllowedToEditImmunizations: false,
    isDownloadImmunizationRecordVisible: false,
    isPrintPreviewVisible: false,
    loading: false,
    practiceProvidersList: null,
    preloadCode: null,
    preloadKeyword: null,
    printPreviewWithComments: false,
    registryConnections: null,
    selectedImmunizationRegistry: null,
    selectedSourceType: null,
    selectedVaccination: null,
    selectedVaccinationRow: null,
    showVaccinationDetails: false,
    vaccinationDatum: null,
    vaccinations: null,

    hasNoImmunizations: empty('vaccinationDatum'),
    hasTransmittableVaccinations: notEmpty('transmittableVaccinations'),
    isElectronicTransmission: notEmpty('electronicRegistryConnection'),
    patientPracticeGuid: alias('patientController.guid'),
    patientSummary: alias('patientController.patient'),

    transmitPopOverText: computed('immunizationTransmitPreference', function () {
        if (this.get('immunizationTransmitPreference')) {
            return 'The patient indicated to not transmit and share immunization information. Go to Patient Profile to change immunization registry settings.';
        } else {
            return 'You will transmit all vaccination info including administered, historical and refused vaccination records for this patient.';
        }
    }),

    electronicRegistryConnection: computed('registryConnections.@each.immunizationRegistryConnectionStatus', function() {
        var registryConnections = this.get('registryConnections');

        if (!isEmpty(registryConnections)) {
            return registryConnections.findBy('immunizationRegistryConnectionStatus', 'Successfully activated');
        }

        return null;
    }),

    lastTransmissionDate: computed('model.@each.lastTransmissionDateUtc', function() {
        return ImmunizationRegistryRepository.getLastPatientTransmissionDate(this.get('model'));
    }),

    transmittableVaccinations: computed('registryConnections.@each.immunizationRegistryConnectionStatus',
        'vaccinations.@each.facilityGuid', function() {

        return ImmunizationRepository.getTransmittablePatientVaccinations(this.get('model'), this.get('registryConnections'));
    }),

    actions: {
        addVaccination() {
            var selectedVaccination = this.get('selectedVaccination');

            if (selectedVaccination && !selectedVaccination.get('isNew')) {
                selectedVaccination.rollbackAttributes();

                this.setProperties({
                    selectedSourceType: null,
                    selectedVaccination: null,
                    selectedVaccinationRow: null
                });
            }

            this.set('showVaccinationDetails', true);
        },

        cancelDownloadImmunizationRecord() {
            this.setProperties({
                isDownloadImmunizationRecordVisible: false,
                selectedImmunizationRegistry: null
            });
        },

        closeVaccinationDetails() {
            this.setProperties({
                selectedSourceType: null,
                selectedVaccination: null,
                selectedVaccinationRow: null,
                showVaccinationDetails: false
            });
            this.send('refreshImmunizations');
        },

        connectToRegistry () {
            this.set('loading', true);
            this.get('store').findAll('newSetting')
                .then((data) => {
                    const setting = (data || []).findBy('id', 'IMMUNIZATION-REGISTRY');

                    if (setting) {
                        this.transitionToRoute(setting.get('destinationInCarbon'));
                    }
                })
                .finally(() => {
                    this.set('loading', false);
                });
        },

        deleteVaccination(vaccination) {
            var vaccinationGuid = vaccination.get('vaccinationGuid');

            this.set('loading', true);

            scheduleOnce('afterRender', this, function() {
                this.get('model').forEach(function(immunization) {
                    var vaccinationToDelete = (immunization.get('vaccinations') || []).findBy('vaccinationGuid', vaccinationGuid);

                    if (vaccinationToDelete) {
                        immunization.get('vaccinations').removeObject(vaccinationToDelete);
                    }
                });

                vaccination.deleteRecord();
                vaccination.save()
                    .then(function() {
                        toastr.success('Immunization record deleted');
                        this.send('updatePatientAdContextCvxCodes');
                    }.bind(this))
                    .catch(function() {
                        toastr.error('Failed to delete vaccination.');
                    })
                    .finally(function() {
                        this.set('loading', false);
                        this.send('closeVaccinationDetails');
                    }.bind(this));
            });
        },

        doDownloadImmunizationRecord() {
            var filename = this.get('patientController.patient.fullName') + '.IIS';

            ImmunizationRegistryRepository.loadImmunizationRecord(this.get('selectedImmunizationRegistry'), this.get('patientPracticeGuid'),
                function(response) {
                    var file = new Blob([response], {type: 'text/plain;charset=utf-8'});
                    window.saveAs(file, filename);
                });

            this.setProperties({
                isDownloadImmunizationRecordVisible: false,
                selectedImmunizationRegistry: null
            });
        },

        downloadImmunizationRecord() {
            if (this.get('model.content.length') === 0) {
                toastr.error('This patient has no immunization record');
            } else if (isEmpty(this.get('immunizationRegistries'))) {
                toastr.error('Could not load immunization registries');
            } else {
                this.set('isDownloadImmunizationRecordVisible', true);

                ImmunizationRegistryRepository.loadDownloadPreferences(this.get('store'))
                    .then((response) => {
                        const registries = this.get('immunizationRegistries');

                        if (!isEmpty(response.defaultRegistryId) && !isEmpty(registries)) {
                            this.set('selectedImmunizationRegistry', registries.findBy('id', response.defaultRegistryId));
                        }

                        if (this.get('selectedImmunizationRegistry')) {
                            this.set('selectedImmunizationRegistry.registryProvider', response.defaultLogin);
                        }
                    });
            }
        },

        print(args) {
            this.set('printPreviewWithComments', args.withComments);
            this.set('isPrintPreviewVisible', true);
        },

        printVaccinationsWithComments() {
            this.send('print', {'withComments': true});
        },

        printVaccinations() {
            this.send('print', {'withComments': false});
        },

        refreshImmunizations() {
            const store = this.get('store');

            this.set('loading', true);
            store.unloadAll('immunization');
            this.set('model', []);

            store.query('immunization', { patientPracticeGuid: this.get('patientPracticeGuid') })
                .then(immunizations => scheduleOnce('afterRender', this, 'set', 'model', immunizations))
                .finally(() => scheduleOnce('afterRender', () => {
                    this.loadVaccinations();
                    this.set('loading', false);
                }));
        },

        save() {
            this.saveWithRefresh(true);
        },

        saveInBackground() {
            this.saveWithRefresh(false);
        },

        toggleRegistryPopover (vaccination) {
            var selectedVaccinationRow = (this.get('vaccinationDatum') || []).findBy('id', vaccination.get('id'));

            selectedVaccinationRow.toggleProperty('isRegistryPopoverVisible');
        },

        transitionToEditProvider(providerGuid) {
            this.set('loading', true);
            this.transitionToRoute('settings.editUser', providerGuid);
        },

        transmitPatientImmunizations() {
            var patientPracticeGuid = this.get('patientPracticeGuid'),
                facilityGuid = this.get('transmittableVaccinations.0.facilityGuid');

            this.set('loading', true);

            return ImmunizationRegistryRepository.transmitImmunization(patientPracticeGuid, facilityGuid)
                .then(() => {
                    toastr.success('Successfully transmitted patient immunizations');

                    this.send('refreshImmunizations');
                })
                .catch(() => {
                    toastr.error('Unable to transmit patient immunizations');
                })
                .finally(() => {
                    this.set('loading', false);
                });
        },

        transmitToStateRegistry() {
            if (this.get('model.length') === 0) {
                toastr.error('This patient has no immunization records to transmit');
            } else {
                this.send('transmitPatientImmunizations');
            }
        },

        vaccinationDetailsLoading(loading) {
            this.set('loading', loading);
        },

        vaccineInventory() {
            this.transitionToRoute('settings.vaccineinventory');
        },

        viewVaccinationDetails(vaccinationRow) {
            var sourceType = vaccinationRow.get('source.sourceType');

            this.setProperties({
                loading: true,
                selectedSourceType: null
            });

            scheduleOnce('afterRender', this, function() {
                this.setProperties({
                    selectedSourceType: sourceType,
                    selectedVaccination: vaccinationRow.get('content'),
                    selectedVaccinationRow: vaccinationRow,
                    showVaccinationDetails: true
                });
            });
        },
        updatePatientAdContextCvxCodes() {
            const { store, patientPracticeGuid } = this.getProperties('store', 'patientPracticeGuid');
            const patientAdContext = store.peekRecord('patient-ad-context', patientPracticeGuid);
            if (patientAdContext) {
                const vaccinations = store.peekAll('vaccination');
                const codes = (vaccinations || []).map(vaccination => {
                    if (vaccination.get('patientPracticeGuid') !== patientPracticeGuid || vaccination.get('source.isRefused')) {
                        return null;
                    }
                    const type = vaccination.get('vaccineType');
                    return isPresent(type) ? parseInt(type.get('cvxCode'), 10) : null;
                }).compact().uniq();
                patientAdContext.set('xc', codes);
                this.send('refreshAd', 'immunization');
            }
        }
    },

    load () {
        this.setProperties({
            model: [],
            loading: true,
            vaccinationDatum: [],
            vaccinations: [],
            isAllowedToEditImmunizations: this.get('authorization').isEntitledFor('Chart.Immunizations.Edit')
        });

        // Move outside of promise all because we want to allow the user to use the screen while this is loading
        this.loadAlerts();

        Promise.all([
            this.loadPatientImmunizations(),
            this.loadFacilities(),
            this.loadProviderList(),
            this.loadRegistries(),
            this.loadRegistryConnections(),
            this.loadPatientPreference(),
            this.get('store').findAll('vaccine-lookup-datum')
        ])
        .finally(() => {
            this.loadVaccinations();
            this.loadPatientImmunizationsTab();
            this.set('loading', false);
        });
    },

    loadAlerts (indicateLoading) {
        if (indicateLoading) {
            this.set('loading', true);
        }
        ImmunizationRepository.getPatientVaccinationAlerts(this.get('patientPracticeGuid'))
            .then((data) => {
                this.set('cdsAlerts', data);
            })
            .finally(() => {
                if (indicateLoading) {
                    this.set('loading', false);
                }
            });
    },

    loadFacilities() {
        return this.get('store').findAll('facility')
            .then((facilities) => {
                facilities = facilities.toArray();
                facilities.unshift(EmberObject.create({
                    facilityGuid: '00000000-0000-0000-0000-000000000000',
                    name: 'Unknown'
                }));

                this.set('facilities', facilities);
            });
    },

    loadPatientImmunizations() {
        return this.get('store').query('immunization', { patientPracticeGuid: this.get('patientPracticeGuid') })
            .then((data) => {
                this.set('model', data);
            });
    },

    loadPatientImmunizationsTab () {
        const patientController = this.get('patientController');
        const actions = [
            { separatorText: 'For immunizations' }
        ];
        const isNotAllowedToEditImmunizations = !this.get('isAllowedToEditImmunizations');

        if (!Modernizr.touch) {
            actions.pushObject({ text: 'Download immunization record', action: 'downloadImmunizationRecord' });
        }

        actions.pushObject({ text: 'Manage vaccine inventory', action: 'manageVaccineInventory', isDisabled: isNotAllowedToEditImmunizations });

        actions.pushObjects([
            { text: 'Print vaccinations', action: 'printVaccinations' },
            { text: 'Print vaccinations with comments', action: 'printVaccinationsWithComments' }
        ]);

        if (this.get('hasTransmittableVaccinations')) {
            actions.pushObject({ text: 'Transmit to state registry', action: 'transmitToStateRegistry', isDisabled: isNotAllowedToEditImmunizations });
        }

        patientController.set('tabActionItems', actions);

        patientController.send('openTab', EmberObject.create({
            label: 'Immunizations',
            route: 'patient.immunizations',
            dismissible: true,
            noIcon: true,
        }));
    },

    loadPatientPreference () {
        return this.store.findRecord('patient', this.get('patientPracticeGuid'))
            .then((data) => {
                this.set('immunizationTransmitPreference', data.get('immunizationProtectionTypeId') === 2);
            });
    },

    loadProviderList () {
        this.set('practiceProvidersList', []);

        return this.get('store').findAll('provider-profile')
            .then((providers) => {
                this.set('practiceProvidersList', providers);
            });
    },

    loadRegistries () {
        return ImmunizationRegistryRepository.loadActiveRegistries(this.get('store'))
            .then((registries) => {
                this.set('immunizationRegistries', registries);
            });
    },

    loadRegistryConnections () {
        return ImmunizationRegistryRepository.loadRegistryConnections(this.get('store'))
            .then((registryConnections) => {
                this.set('registryConnections', registryConnections);
            });
    },

    loadVaccinations() {
        this.set('vaccinations', (this.get('model') || []).mapBy('vaccinations'));
        this.set('vaccinationDatum', ImmunizationRepository.getPatientVaccinationsDeprecated(this.get('model'), this.get('practiceProvidersList'),
            this.get('registryConnections'), this.get('immunizationRegistries')));
    },

    preloadVaccinations() {
        if (this.get('showVaccinationDetails')) {
            this.send('closeVaccinationDetails');
        }

        if (this.get('preloadCode') || this.get('preloadKeyword')) {
            this.send('addVaccination');
        }
    },

    saveWithRefresh(shouldRefresh) {
        if (shouldRefresh) {
            this.set('loading', true);
        }

        this.get('selectedVaccination').save()
            .then(function () {
                if (shouldRefresh) {
                    this.set('loading', false);
                    this.send('refreshImmunizations');
                }
            }.bind(this))
            .catch(function () {
                toastr.error('Failed to save vaccination.');
                this.set('loading', false);
            }.bind(this));
    }
});
