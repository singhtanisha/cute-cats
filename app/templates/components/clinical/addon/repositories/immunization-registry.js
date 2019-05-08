import { all } from 'rsvp';
import { isEmpty, isPresent } from '@ember/utils';
import ObjectProxy from '@ember/object/proxy';
import config from 'boot/config';
import PFServer from 'boot/util/pf-server';
import session from 'boot/models/session';
import LGTM from 'common/helpers/validation';
import Validatable from 'ember-lgtm/mixins/validatable';

var downloadPropertyMap = {
    '20': 'defaultRegistryId',
    '21': 'defaultLogin',
    '22': 'defaultRegionCode'
}, validatableRegistryProperty = ObjectProxy.extend(Validatable, {
    validator: LGTM.validator()
        .validates('value')
            .using(function (value, attr, object) {
                if (object.get('isRequired')) {
                    return !isEmpty(value);
                }
                return true;
            }, 'Required')
        .build()
});

/***
 * The ImmunizationRegistryRepository manages the data access for the domain of
 * immunization transmissions. This extends to registries, registryProperties,
 * electronic registrations, user download preferences and transmissions
 */
export default {
    loadRegistries(store) {
        return store.findAll('immunization-registry');
    },
    loadActiveRegistries(store) {
        return this.loadRegistries(store).then((registries) => {
            return registries.filterBy('isActive');
        });
    },
    loadRegistryConnections(store) {
        return store.findAll('immunization-registry-connection');
    },
    /***
     * Loads all the registry properties for a given registryId
     * @param registryId
     * @return a promise array that will get the properties or an empty array
     *      if the registryId isn't provided
     */
    loadRegistryProperties(registryId, store) {
        if (registryId) {
            return store.query('immunization-registry-property', { immunizationRegistryGuid: registryId })
                .then((registryProperties) => {
                    return registryProperties.map(function(registryProperty) {
                        return validatableRegistryProperty.create({ content: registryProperty });
                    });
                });
        }

        return [];
    },

    loadDownloadPreferences(store) {
        var hash = {},
            query = {
                type: 'provider',
                ids: Object.keys(downloadPropertyMap)
            };

        return store.query('individualDetail', query).then(function (data) {
            var promises = data.map(function (item) {
                return item.get('individualValues').then(function (individualValues) {
                    var propertyName = downloadPropertyMap[item.id],
                        value = individualValues.objectAt(0).get('value');
                    hash[propertyName] = value;
                });
            });
            return all(promises).then(function () {
                return hash;
            });
        });
    },

    saveDownloadPreferences(hash) {
        /* TODO: I don't believe there is a global preferences repository, however there should
            be, and this should be there */
        var url = config.practiceBaseURL + 'preferences/provider',
            content = {
            'preferences': {
                'Immunizations.Registry.RegistryId': hash.defaultRegistryId,
                'Immunizations.Registry.Login': hash.defaultLogin
            }
        };
        return PFServer.promise(url, 'POST', content);
    },

    activateConnection(store, connectionGuid) {
        const url = `${config.defaultHost}/${config.immunizationNamespace}/immunizationRegistryConnection/${connectionGuid}/activate`;

        return PFServer.promise(url, 'PUT')
            .then(() => {
                return store.findAll('immunization-registry-connection', { reload: true });
            });
    },
    registerConnection(store, connectionGuid) {
        const url = `${config.defaultHost}/${config.immunizationNamespace}/immunizationRegistryConnection/${connectionGuid}/register`;

        return PFServer.promise(url, 'PUT')
            .then(() => {
                return store.findAll('immunization-registry-connection', { reload: true });
            });
    },

    loadImmunizationRecord(registry, patientPracticeGuid, callback) {
        let url = `${config.defaultHost}/${config.immunizationV2Namespace}/patients/${patientPracticeGuid}/downloadHl7document/${registry.id}/${session.get('facilityGuid')}/`;

        if (!isEmpty(registry.registryProvider)) {
            url += registry.registryProvider;
        }

        // ...HL7 cannot be parsed as JSON, so have to bypass PFServer
        return $.get(url, callback);
    },

    transmitImmunizationV2(patientPracticeGuid) {
        const immunizationTransmissionUrl = `${config.defaultHost}/${config.immunizationV2Namespace}/patients/${patientPracticeGuid}/transmit`;
        return PFServer.promise(immunizationTransmissionUrl, 'POST');
    },

    getTransmissionErrors(patientImmunizations) {
        const groupedTransmissionHistoryErrors = patientImmunizations
            .map(group =>
                (group.get('vaccinations') || [])
                    .filter(vaccination => vaccination.get('immunizationTransmissionHistorySummary.transmissionErrorMessage'))
                    .map(vaccination => ({
                        errorMessage: vaccination.get('immunizationTransmissionHistorySummary.transmissionErrorMessage'),
                        date: moment(vaccination.get('immunizationTransmissionHistorySummary.lastModifiedDateTimeUtc'))
                    }))
                );

        const transmissionHistoryErrors = _.flatten(groupedTransmissionHistoryErrors)
            .sortBy('date');

        return _.groupBy(transmissionHistoryErrors,
                error => error.date.format('MM/DD/YYYY'));
    },

    getLastPatientTransmissionDate(patientImmunizations) {
        const transmissionDates = patientImmunizations.map(immunization => {
            const lastTransmissionDateUtc = immunization.get('lastTransmissionDateUtc');

            return isPresent(lastTransmissionDateUtc) ? {
                transmissionDateUtc: lastTransmissionDateUtc
            } : null;
        }).compact();

        if (isPresent(transmissionDates)) {
            const transmissionDatesSorted = transmissionDates.sortBy('transmissionDateUtc');
            return moment.utc(transmissionDatesSorted.get('lastObject.transmissionDateUtc')).format('MM/DD/YY');
        }
        return null;
    }
};
