import { resolve, hash } from 'rsvp';
import config from 'boot/config';
import PFServer from 'boot/util/pf-server';
import Diagnosis from 'clinical/models/diagnosis';
import DiagnosesArray from 'clinical/models/diagnoses-array';
import Medication from 'clinical/models/medication';
import MedicationsArray from 'clinical/models/medications-array';
import userSessionCache from 'clinical/helpers/user-session-cache';

var clinicalDataCache = userSessionCache({
    cacheKeyFunction(patientGuid) {
        return config.clinicalBaseURL + 'patients/' + patientGuid + '/aggregate';
    },
    loadFunction(patientGuid, options) {
        var _this = this,
            aggregateUrl = config.clinicalBaseURL + 'patients/' + patientGuid + '/aggregate';

        return hash({
            freshData: PFServer.promise(aggregateUrl),
            cachedData: (options || {}).cachedPromise || resolve({})
        }).then(function (hash) {
            var diagnoses = _this._mapDiagnosesResponse(hash.freshData.diagnoses, hash.cachedData.diagnoses),
                medications = _this._mapMedicationsResponse(hash.freshData.medications, hash.cachedData.medications);
            return { diagnoses: diagnoses, medications: medications };
        });
    },
    defaultFunction() {
        return {
            diagnoses: DiagnosesArray.create({content: []}),
            medications: MedicationsArray.create({content: []})
        };
    }
});


/***
 * The PatientRepository manages clinical data for a patient.
 * For specific resources see allergies, diagnoses and medications repositories.
 */
export default {
    /***
     * Loads diagnoses and medications in bulk for a patient
     */
    loadClinicalData: clinicalDataCache,

    // TODO: consider moving this support to the cache object to DRY this
    /***
     * Gets the patient clinical data from cache or empty Arrays if the cache is empty
     */
    getClinicalData: clinicalDataCache.getCachedData,

    _mapDiagnosesResponse(diagnosesResponse, diagnosesArray) {
        var mappedDiagnoses = (diagnosesResponse.patientDiagnoses || []).map(Diagnosis.wrap);
        diagnosesArray = diagnosesArray || DiagnosesArray.create();
        diagnosesArray.set('content', mappedDiagnoses);
        diagnosesArray.set('noKnownDiagnoses', !!diagnosesResponse.noKnownDiagnoses);
        return diagnosesArray;
    },

    _mapMedicationsResponse(medicationsResponse, medicationsArray) {
        var mappedMedications = (medicationsResponse.patientMedications || []).map(Medication.wrap);
        medicationsArray = medicationsArray || MedicationsArray.create();
        medicationsArray.set('content', mappedMedications);
        medicationsArray.set('noKnownMedications', !!medicationsResponse.noKnownMedications);
        return medicationsArray;
    }
};
