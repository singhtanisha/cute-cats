import { get, getProperties } from '@ember/object';
import { hash } from 'rsvp';
import config from 'boot/config';
import PFServer from 'boot/util/pf-server';
import Relative from 'clinical/models/familyhealthhistory/relative';

export default {
    loadRelatives(store, patientPracticeGuid) {
        return store.query('relationshiptype', { id: patientPracticeGuid }).then(function (relationshipTypes) {
            // Now get the Family health history now that you have all the relationshipType loaded.
            return PFServer.promise(this._getBaseUrl(patientPracticeGuid)).then(function (data) {
                return data.relatives.map(function(relative) {
                    var selectedRelativeType = relationshipTypes.findBy('id', '' + relative.relationshipType.id);

                    // Hydrate the relationshipType manually
                    if (selectedRelativeType) {
                        relative.relationshipType = selectedRelativeType.serialize({ includeId: true });
                    }

                    relative.observations = data.observations.filterBy('relative.relativeGuid', relative.relativeGuid).map(function(observation) {
                        observation.diagnosis = data.diagnoses.findBy('diagnosisGuid', observation.diagnosis.diagnosisGuid);
                        return observation;
                    });
                    return Relative.create(relative);
                });
            });
        }.bind(this));
    },
    loadRelativesAndRelationshipTypes(store, patientPracticeGuid) {
        return hash({
            relationshipTypes: store.query('relationshiptype', { id: patientPracticeGuid }),
            data: PFServer.promise(this._getBaseUrl(patientPracticeGuid))
        }).then(({ relationshipTypes, data }) => ({
            relatives: this.processRelativeResponse(data, relationshipTypes),
            relationshipTypes
        }));
    },
    reloadRelatives(patientPracticeGuid, relationshipTypes) {
        return PFServer.promise(this._getBaseUrl(patientPracticeGuid)).then(data => this.processRelativeResponse(data, relationshipTypes));
    },
    processRelativeResponse(data, relationshipTypes) {
        return data.relatives.map(relative => {
            const selectedRelativeType = relationshipTypes.findBy('id', `${relative.relationshipType.id}`);
            // Hydrate the relationshipType manually
            if (selectedRelativeType) {
                relative.relationshipType = selectedRelativeType.serialize({ includeId: true });
            }

            relative.observations = data.observations.filterBy('relative.relativeGuid', relative.relativeGuid).map(observation => {
                observation.diagnosis = data.diagnoses.findBy('diagnosisGuid', observation.diagnosis.diagnosisGuid);
                return observation;
            });
            return Relative.create(relative);
        });
    },
    loadConditions(patientPracticeGuid) {
        return PFServer.promise(`${this._getBaseUrl(patientPracticeGuid)}/conditions`);
    },
    saveCondition(condition, patientPracticeGuid) {
        const url = `${this._getBaseUrl(patientPracticeGuid)}/conditions`;
        return PFServer.promise(url, 'POST', condition);
    },
    _getBaseUrl(patientPracticeGuid) {
        return `${config.clinicalBaseURL}FamilyHealthHistory/${patientPracticeGuid}`;
    },
    saveRelative(relative) {
        const { relativeGuid, patientPracticeGuid } = getProperties(relative, 'relativeGuid', 'patientPracticeGuid');
        const method = relativeGuid ? 'PUT' : 'POST';
        const url = `${this._getBaseUrl(patientPracticeGuid)}/relatives`;
        return PFServer.promise(url, method, relative);
    },
    deleteRelative(relative) {
        const { relativeGuid, patientPracticeGuid } = getProperties(relative, 'relativeGuid', 'patientPracticeGuid');
        const url = `${this._getBaseUrl(patientPracticeGuid)}/relatives/${relativeGuid}`;
        return PFServer.promise(url, 'DELETE', relative);
    },
    saveObservation(observation) {
        const { patientPracticeGuid, observationGuid } = getProperties(observation, 'patientPracticeGuid', 'observationGuid');

        let url = `${this._getBaseUrl(patientPracticeGuid)}/observations`;
        let method = 'POST';

        if (observationGuid) {
            method = 'PUT';
            url += `/${observationGuid}`;
        }

        return PFServer.promise(url, method, observation);
    },
    deleteObservation(observation) {
        const { patientPracticeGuid, observationGuid } = getProperties(observation, 'patientPracticeGuid', 'observationGuid');
        const url = `${this._getBaseUrl(patientPracticeGuid)}/observations/${observationGuid}`;
        return PFServer.promise(url, 'DELETE', observation);
    }
};
