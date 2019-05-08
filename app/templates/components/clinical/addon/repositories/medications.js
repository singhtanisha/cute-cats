import { merge } from '@ember/polyfills';
import { get, set, setProperties } from '@ember/object';
import { isEmpty, isPresent } from '@ember/utils';
import { resolve, reject, all } from 'rsvp';
import config from 'boot/config';
import PFServer from 'boot/util/pf-server';
import patientsRepository from 'clinical/repositories/patients';
import Medication from 'clinical/models/medication';
import userSessionCache from 'clinical/helpers/user-session-cache';
import session from 'boot/models/session';

/***
 * The MedicationsRepository manages the data access for the domain of
 * medications. This extends to loading active, historical and frequent medications,
 * saving, editing and deleting, updating related patientConditions and interactions.
 */
export default {

    loadMedications(patientGuid, options) {
        return patientsRepository.loadClinicalData(patientGuid, options).then(aggregate => {
            return aggregate.medications;
        });
    },

    loadMedication(patientGuid, medicationGuid) {
        var _this = this,
            medicationsUrl = config.clinicalBaseURL + 'patients/' + patientGuid + '/medications/' + medicationGuid;
        return PFServer.promise(medicationsUrl).then(Medication.wrap).then(function (medication) {
            return _this.getMedications(patientGuid).then(function (medications) {
                medications.replaceMedication(medication);
                return medication;
            });
        });
    },

    loadAssociatedPrograms(medicationList) {
        const url = `${config.clinicalBaseURL_v2}drugs/worksheets`;
        return PFServer.promise(url, 'POST', medicationList).then(data => {
            return data;
        });
    },

    checkMedicationIsValid(ndc) {
        return PFServer.promise(`${config.clinicalBaseURL_v2}drugs/${ndc}/checks/isValid`).then((data) => {
            return data;
        }).catch(() => {
            // if call fails, failure will be logged, but should not prevent
            // the user from entering the order workflow
            return {isValidMedication: true};
        });
    },

    replaceDeprecatedMedication(medication, transcriptGuid, reason) {
        /*
            Save existing medication with an updated reason code to indicate that
            the medications has been deprecated. Then, create a new medication
            object so that the user can be prompted to choose a replacement.
        */
        let oldMedication = Medication.wrap(medication);
        oldMedication.set('stopDateTime', moment(new Date()).format('MM/DD/YYYY'));
        oldMedication.set('medicationDiscontinuedReason', reason || {
            id: 13,
            description: 'Medication no longer available'
        });
        return this.saveMedication(oldMedication, transcriptGuid).then((newMedication) => {
            newMedication.medicationGuid = null;
            newMedication.startDateTime = moment(new Date()).format('MM/DD/YYYY');
            newMedication.stopDateTime = null;
            newMedication.medicationDiscontinuedReason = null;
            return Medication.wrap(newMedication);
        });
    },

    /***
     * Saves the given medication.
     */
    saveMedication(medicationToSave, transcriptGuid) {
        const wrappedMedication = Medication.wrap(medicationToSave);
        if (isEmpty(wrappedMedication.get('transcriptMedications'))) {
            wrappedMedication.createDefaultTranscriptMedication();
        }
        const payload = wrappedMedication.get('content');
        let url = `${config.clinicalBaseURL}patients/${wrappedMedication.get('patientPracticeGuid')}/medications`;
        let httpMethod = 'POST';

        if (wrappedMedication.get('medicationGuid')) {
            httpMethod = 'PUT';
            url += `/${wrappedMedication.get('medicationGuid')}`;
        }
        if (transcriptGuid) {
            url += `?transcriptGuid=${transcriptGuid}`;
        }
        return PFServer.promise(url, httpMethod, payload).then(medication => {
            const medicationCodes = {
                Ndc: get(medication, 'ndc'),
                RxNormCui: get(medication, 'rxNormCui'),
                MedicationGuid: get(medication, 'medicationGuid')
            };
            return this.loadAssociatedPrograms([medicationCodes]).then(programs => {
                if (isPresent(programs)) {
                    programs.forEach(program => {
                        if (isPresent(medication) && get(medication, 'medicationGuid') === program.medicationGuid) {
                            set(medication, 'associatedProgram', program.worksheetTypes);
                        }
                    });
                }
                return resolve(Medication.wrap(medication));
            });
        });
    },
    deleteMedication(medication, transcriptGuid) {
        if (!medication) {
            return reject();
        }
        var url = config.clinicalBaseURL + 'patients/' + medication.get('patientPracticeGuid') + '/medications';
        if (transcriptGuid) {
            if (medication.get('encounterComments.length') > 1) {
                return reject('Can\'t delete a medication with more than one Transcript Medication');
            }
            // Tell the server we want to delete the encountersTranscriptMedication along with the med
            url += '?transcriptGuid=' + transcriptGuid;
        }
        return PFServer.promise(url, 'DELETE', medication.get('content'));
    },

    // TranscriptMedications
    /***
     * Saves a TranscriptMedication
     * If a TranscriptMedication already exists for the given transcriptGuid, it simply updates it and the comment
     * otherwise it creates a new one
     * @param {Medication} medication to be attached
     * @param transcriptGuid optional - leave as null to update the default transcriptMedication
     * @param {string} comment optional
     * @returns {Medication Promise} with updated TranscriptMedications.
     */
    saveTranscriptMedication(medication, transcriptGuid, comment) {
        var patientGuid = medication.get('patientPracticeGuid'),
            medicationGuid = medication.get('medicationGuid'),
            existingTranscriptMedication = medication.getTranscriptMedication(transcriptGuid),
            url = config.clinicalBaseURL + 'patients/' + patientGuid + '/medications/' +
                medicationGuid + '/transcriptMedications',
            data = {transcriptGuid: transcriptGuid, comment: comment},
            method = 'POST';
        if (!medicationGuid) {
            reject('Can\'t attach an un-saved medication to an encounter');
        }
        if (existingTranscriptMedication && existingTranscriptMedication.lastModifiedDateTimeUtc) {
            method = 'PUT';
            if (existingTranscriptMedication.comment === comment) {
                // No need to save if the comment didn't change
                resolve(medication);
            }
        }
        return PFServer.promise(url, method, data).then(function (transcriptMedication) {
            var transcriptMedications = medication.get('transcriptMedications');
            if (existingTranscriptMedication) {
                setProperties(existingTranscriptMedication, transcriptMedication);
            } else {
                transcriptMedications.pushObject(transcriptMedication);
            }
            return medication;
        });
    },

    addMedicationsToEncounter(patientGuid, medicationsToAdd, transcriptGuid) {
        var baseUrl = config.clinicalBaseURL + 'patients/' + patientGuid + '/medications/',
            data = {transcriptGuid: transcriptGuid},
            promises;
        promises = medicationsToAdd.map(function (medication) {
            var url = baseUrl + medication.get('medicationGuid') + '/transcriptMedications';
            return PFServer.promise(url, 'POST', data).then(function (transcriptMedication) {
                return {transcriptMedication: transcriptMedication, medication: medication};
            });
        });
        return all(promises).then(function (array) {
            array.forEach(function (hash) {
                // NOTE: we're doing this after *all* promises are resolved to avoid multiple updates to the objects
                // That cause multiple renders. Need to treat this as a single operation.
                hash.medication.get('transcriptMedications').pushObject(hash.transcriptMedication);
            });
        });
    },

    /***
     * Deletes the TranscriptMedication for the given transcriptGuid
     * @param {Medication} medication to be attached
     * @param transcriptGuid optional - leave as null to delete the default transcriptMedication
     * @returns {Medication Promise} with updated TranscriptMedications.
     */
    deleteTranscriptMedication(medication, transcriptGuid) {
        var patientGuid = medication.get('patientPracticeGuid'),
            medicationGuid = medication.get('medicationGuid'),
            existingTranscriptMedication = medication.getTranscriptMedication(transcriptGuid),
            url = config.clinicalBaseURL + 'patients/' + patientGuid + '/medications/' +
                medicationGuid + '/transcriptMedications/' + transcriptGuid,
            deletePromise = resolve(medication);
        // Only call server if transcriptMedication is persisted.
        if (existingTranscriptMedication && existingTranscriptMedication.lastModifiedDateTimeUtc) {
            deletePromise = PFServer.promise(url, 'DELETE');
        }
        return deletePromise.then(function () {
            var transcriptMedications = medication.get('transcriptMedications');
            transcriptMedications.removeObject(existingTranscriptMedication);
            return medication;
        });
    },

    recordNoKnownMedications(patientGuid, isNoKnownStatus) {
        var methodType = (isNoKnownStatus)? 'POST': 'DELETE',
            patientConditionsUrl = config.clinicalBaseURL + 'PatientConditions/' + patientGuid +
                '/NoKnownMedications';
        return PFServer.promise(patientConditionsUrl, methodType);
    },

    loadFrequentMedications: userSessionCache('frequentMedications', () => {
        const url = `${config.clinicalBaseURL_v2}frequentMedications/`;
        return PFServer.promise(url).then(medications => {
            return (medications || []).map(Medication.wrap);
        });
    }),

    loadMedicationReferenceData(medication, patientGuid, store) {
        // not using getWithDefault to consider empty strings
        const ndc = medication.get('ndc') || 'custom';
        const currentFacility = store.peekRecord('facility', session.get('facilityGuid'));
        const locationCode = currentFacility && currentFacility.get('state');
        const url = `${config.clinicalBaseURL_v2}drugs/${ndc}/${patientGuid}?locationCode=${locationCode}`;

        return PFServer.promise(url).then(result => {
            const medicationDiscontinuedReasons = !config.isRedirectToDrugAllergyOn ?
                result.medicationDiscontinuedReasons.filter(item => (item.id !== 12)) :
                result.medicationDiscontinuedReasons;

            // SIN-2883 - Filter oral, liquid medications so that only mL allowed
            const prescriptionUnits = (medication.get('isOralLiquidMedication')) ?
                result.prescriptionUnits.filter(unit => unit.name === 'Milliliter') :
                result.prescriptionUnits;

            return merge(
                result,
                {
                    prescriptionUnits,
                    medicationDiscontinuedReasons
                }
            );
        });
    },
    /***
     * Gets the patient medications from cache or an empty MedicationsArray
     */
    getMedications(patientGuid) {
        return patientsRepository.getClinicalData(patientGuid).then(function (aggregate) {
            return aggregate.medications;
        });
    }
};
