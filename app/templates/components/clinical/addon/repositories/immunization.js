import ObjectProxy from '@ember/object/proxy';
import config from 'boot/config';
import PFServer from 'boot/util/pf-server';
import {
  get,
  set,
  getProperties,
  setProperties
} from '@ember/object';
import { isEmpty, isPresent } from '@ember/utils';

export default {
    getPatientVaccinationsDeprecated (patientImmunizations, providers, registryConnections, registries) {
        var isElectronicTransmission = false,
            vaccinations;

        if (isEmpty(providers) || isEmpty(patientImmunizations)) {
            return [];
        } else {
            if (isPresent(registryConnections)) {
                isElectronicTransmission = registryConnections.isAny('immunizationRegistryConnectionStatus', 'Successfully activated');
            }

            vaccinations = _.flatten(patientImmunizations.filterBy('hasVaccinations').map((immunization) => {
                return immunization.get('vaccinations').map(vaccination => {
                    var administeredByProviderName = this.getAdministeringProviderName(vaccination, providers);

                    vaccination.set('description', this.getSourceDescription(vaccination, administeredByProviderName));

                    return ObjectProxy.create({
                        content: vaccination,
                        administeredByProviderName: administeredByProviderName,
                        hasAllRegistryFields: this.checkRegistryFields(vaccination, providers, isElectronicTransmission),
                        isRegistryPopoverVisible: false,
                        registryDescription: this.getVaccineRegistryDescription(vaccination, registryConnections, registries)
                    });
                });
            }));

            vaccinations = _.unique(vaccinations, (vaccination) => {
                return vaccination.get('vaccinationGuid');
            });

            return vaccinations;
        }
    },

    getPatientVaccinations(patientImmunizations, providers, registryConnections, registries) {
        if (isEmpty(providers) || isEmpty(patientImmunizations)) {
            return [];
        }

        const isElectronicTransmission = isPresent(registryConnections) &&
            registryConnections.isAny('immunizationRegistryConnectionStatus', 'Successfully activated');

        return (patientImmunizations || [])
            .filterBy('hasVaccinations')
            .sortBy('name')
            .map(immunization => {
                set(immunization, 'vaccinations', get(immunization, 'vaccinations').map(vaccination => {
                    const administeredByProviderName = this.getAdministeringProviderName(vaccination, providers);
                    setProperties(vaccination, {
                        administeredByProviderName,
                        description: this.getSourceDescription(vaccination, administeredByProviderName),
                        hasAllRegistryFields: this.checkRegistryFields(vaccination, providers, isElectronicTransmission),
                        registryDescription: this.getVaccineRegistryDescription(vaccination, registryConnections, registries)
                    });
                    return vaccination;
                }).sortBy('vaccinationDate'));
                return immunization;
            });
    },


    getPatientVaccinationAlerts (patientPracticeGuid) {
        const baseUrl = config.cdsAlertsV2Url;
        const collectionKey = 'CDSVaccines';
        const calculationSource = 'vaccines';
        const url = `${baseUrl}${patientPracticeGuid}?collectionKey=${collectionKey}&calculationSource=${calculationSource}`;

        return PFServer.promise(url, 'GET').then(data => {
            return data;
        });
    },

    getTransmittablePatientVaccinations(patientImmunizations, registryConnections) {
        if (isEmpty(patientImmunizations) || isEmpty(registryConnections)) {
            return [];
        }
        const connectedFacilityGuids = registryConnections.filterBy('immunizationRegistryConnectionStatus', 'Successfully activated')
            .mapBy('facilityGuid');
        if (isEmpty(connectedFacilityGuids)) {
            return [];
        }

        return _.flatten(patientImmunizations.filterBy('hasVaccinations').map(immunization => {
            return get(immunization, 'vaccinations').filter(vaccination => {
                return get(vaccination, 'source.sourceType') === 'Historical' || connectedFacilityGuids.includes(get(vaccination, 'facilityGuid'));
            });
        }));
    },

    checkRegistryFields (vaccination, providers, isElectronicTransmission) {
        if (isElectronicTransmission && get(vaccination, 'source.isAdministered')) {
            const administeredByProvider = (providers || []).findBy('providerGuid', get(vaccination, 'administeredByProviderGuid'));
            const administeredByProviderNPI = administeredByProvider ? get(administeredByProvider, 'npi') : null;
            const orderingProvider = (providers || []).findBy('providerGuid', get(vaccination, 'orderingProviderGuid'));
            const orderingProviderNPI = orderingProvider ? get(orderingProvider, 'npi') : null;
            const registryFields = getProperties(vaccination, [
                'immunizationRegistryNotificationPreference',
                'route',
                'site',
                'vfcStatus',
                'visVersionDate',
                'visConceptGuidList'
            ]);

            return (administeredByProviderNPI || orderingProviderNPI) &&
                isPresent(registryFields.route) &&
                isPresent(registryFields.site) &&
                isPresent(registryFields.vfcStatus) &&
                (isPresent(registryFields.visVersionDate) || isPresent(registryFields.visConceptGuidList));
        }
        return true;
    },

    getAdministeringProviderName (vaccination, providers) {
        if (get(vaccination, 'source.isAdministered')) {
            const providerMatch = (providers || []).findBy('providerGuid', get(vaccination, 'administeredByProviderGuid'));
            return providerMatch ? get(providerMatch, 'fullProviderName') : 'Unknown';
        }
        return null;
    },

    getSourceDescription(vaccination, providerName) {
        if (get(vaccination, 'source.isAdministered')) {
            return `Administered by ${providerName}`;
        }
        return get(vaccination, 'source.vaccinationSourceName');
    },

    getVaccineRegistryDescription (vaccination, registryConnections, registries) {
        const facilityGuid = get(vaccination, 'facilityGuid');

        if (isPresent(registryConnections)) {
            if (isPresent(facilityGuid)) {
                const connectionMatch = (registryConnections || []).findBy('facilityGuid', facilityGuid);

                if (isPresent(connectionMatch) && get(connectionMatch, 'immunizationRegistryConnectionStatus') === 'Successfully activated') {
                    if (isPresent(get(vaccination, 'immunizationTransmissionHistorySummary')) && isPresent(registries)) {
                        const registryMatch = registries.findBy('immunizationRegistryGuid', connectionMatch.get('immunizationRegistryGuid'));
                        return registryMatch ? get(registryMatch, 'displayName') : 'Registry not connected';
                    }
                    return 'Ready to transmit';
                }
                return 'Registry not connected';
            }
            return 'Facility unknown';
        }
        return null;
    }
};
