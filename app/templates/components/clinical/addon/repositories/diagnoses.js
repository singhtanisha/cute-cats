import { set, setProperties, get, getProperties } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { resolve, reject, all } from 'rsvp';
import config from 'boot/config';
import PFServer from 'boot/util/pf-server';
import patientsRepository from 'clinical/repositories/patients';
import Diagnosis from 'clinical/models/diagnosis';
import DiagnosesArray from 'clinical/models/diagnoses-array';
import session from 'boot/models/session';
import userSessionCache from 'clinical/helpers/user-session-cache';
import DxSearchResult from 'clinical/models/dx-search-result';

/***
 * The DiagnosesRepository manages the data access for the domain of
 * diagnoses. This extends to loading active and historical diagnoses,
 * saving, editing, deleting, updating related patientCondiations
 */
export default {
    loadDiagnoses(patientGuid, options) {
        return patientsRepository.loadClinicalData(patientGuid, options).then(function (aggregate){
            return aggregate.diagnoses;
        });
    },

    loadDiagnosis(patientGuid, diagnosisGuid) {
        var _this = this,
            diagnosesUrl = config.clinicalBaseURL + 'patients/' + patientGuid + '/diagnoses/' + diagnosisGuid;
        return PFServer.promise(diagnosesUrl).then(function (diagnosis) {
            return _this.getDiagnoses(patientGuid).then(function (diagnoses) {
                diagnosis = Diagnosis.wrap(diagnosis);
                diagnosis = diagnoses.replaceDiagnosis(diagnosis);
                diagnosis.set('isDirty', false);
                return diagnosis;
            });
        });
    },

    /**
     * Saves the given diagnosis.
     */
    saveDiagnoses(diagnoses, transcriptGuid) {
        const patientGuid = diagnoses.get('firstObject.patientPracticeGuid');
        const baseUrl = `${config.clinicalBaseURL}patients/${patientGuid}/diagnoses`;

        return this._getNextSortOrder(patientGuid, transcriptGuid).then(nextSortOrder => {
            return all(diagnoses.map(diagnosis => {
                let url = baseUrl;
                let httpMethod = 'POST';

                if (!diagnosis.get('isDirty') && !diagnosis.get('isNew')) {
                    return resolve(diagnosis);
                }

                if (isEmpty(diagnosis.get('transcriptDiagnoses'))) {
                    diagnosis.createDefaultTranscriptDiagnosis();
                }

                if (diagnosis.get('diagnosisGuid')) {
                    httpMethod = 'PUT';
                    url += `/${diagnosis.get('diagnosisGuid')}`;
                }
                if (transcriptGuid) {
                    url += `?transcriptGuid=${transcriptGuid}`;
                }

                const transcriptDiagnosis = diagnosis.getTranscriptDiagnosis(transcriptGuid);
                if (transcriptGuid && transcriptDiagnosis && !transcriptDiagnosis.lastModifiedAt) {
                    // Update the order for *new* transcriptDiagnoses
                    set(transcriptDiagnosis, 'sortOrder', nextSortOrder++);
                }
                return PFServer.promise(url, httpMethod, Diagnosis.unwrapAndRemoveLastModified(diagnosis)).then(savedDiagnosis => {
                    diagnosis.set('content', Diagnosis.unwrap(Diagnosis.wrap(savedDiagnosis)));
                    return this.getDiagnoses(patientGuid).then(allDiagnoses => {
                        allDiagnoses.replaceDiagnosis(savedDiagnosis);
                        diagnosis.set('isDirty', false);
                        return diagnosis;
                    });
                }).catch(err => {
                    diagnosis.set('isDirty', true);
                    throw err;
                });
            }));
        });
    },
    saveDiagnosis(diagnosis, transcriptGuid) {
        return this.saveDiagnoses([diagnosis], transcriptGuid).then(function (diagnoses) {
            return diagnoses.get('firstObject');
        });
    },
    deleteDiagnosis(diagnosis, transcriptGuid) {
        var _this = this,
            patientGuid = diagnosis.get('patientPracticeGuid'),
            diagnosisGuid = diagnosis.get('diagnosisGuid'),
            url = config.clinicalBaseURL + 'patients/' + patientGuid + '/diagnoses/' + diagnosisGuid;

        if (transcriptGuid) {
            if (diagnosis.get('encounterComments.length') > 1) {
                return reject('Can\'t delete a diagnosis with more than one Transcript Diagnosis');
            }
            // Tell the server we want to delete the encountersTranscriptdiagnosis along with the med
            url += '?transcriptGuid=' + transcriptGuid;
        }

        if (!diagnosisGuid) {
            diagnosis.set('isDirty', false);
            // If this isn't saved, then we have nothing to do here.
            return resolve(diagnosis);
        }

        return PFServer.promise(url, 'DELETE').then(function () {
            return _this.getDiagnoses(patientGuid).then(function (diagnoses) {
                diagnosis.set('isDirty', false);
                diagnoses.removeDiagnosis(diagnosis);
            });
        });
    },

    /***
     * Saves a TranscriptDiagnosis
     * If a TranscriptDiagnosis already exists for the given transcriptGuid, it updates the comment
     * only if it's different. Otherwise it won't call the server.
     * @param {Diagnosis} diagnosis to be attached
     * @param transcriptGuid optional - leave as null to update the default transcriptDiagnosis
     * @param {string} comment optional
     * @returns {Diagnosis Promise} with updated TranscriptDiagnoses.
     */
    saveTranscriptDiagnosis(diagnosis, transcriptGuid, comment) {
        var patientGuid = diagnosis.get('patientPracticeGuid');
        return this._getNextSortOrder(patientGuid, transcriptGuid).then(function (nextSortOrder) {
            var diagnosisGuid = diagnosis.get('diagnosisGuid'),
                existingTranscriptDiagnosis = diagnosis.getTranscriptDiagnosis(transcriptGuid),
                url = config.clinicalBaseURL + 'patients/' + patientGuid + '/diagnoses/' +
                    diagnosisGuid + '/transcriptDiagnoses',
                data = { transcriptGuid: transcriptGuid, comment: comment, sortOrder: nextSortOrder },
                method = 'POST';
            if (!diagnosisGuid) {
                reject('Can\'t attach an un-saved diagnosis to an encounter');
            }
            // TODO: consider removing PUT, we either add or remove. Comments are updated as part of the Dx only
            if (existingTranscriptDiagnosis && existingTranscriptDiagnosis.lastModifiedAt) {
                method = 'PUT';
                if (existingTranscriptDiagnosis.comment === comment) {
                    // No need to save if the comment didn't change
                    resolve(diagnosis);
                }
            }
            return PFServer.promise(url, method, data).then(function (transcriptDiagnosis) {
                var transcriptDiagnoses = diagnosis.get('transcriptDiagnoses');
                if (existingTranscriptDiagnosis) {
                    setProperties(existingTranscriptDiagnosis, transcriptDiagnosis);
                } else {
                    transcriptDiagnoses.pushObject(transcriptDiagnosis);
                }
                return diagnosis;
            });
        });
    },

    addDiagnosesToEncounter(patientGuid, diagnosesToAdd, transcriptGuid) {
        return this._getNextSortOrder(patientGuid, transcriptGuid).then(function (nextSortOrder) {
            var baseUrl = config.clinicalBaseURL + 'patients/' + patientGuid + '/diagnoses/',
                data = {transcriptGuid: transcriptGuid},
                promises;
            promises = diagnosesToAdd.map(function (diagnosis) {
                var url = baseUrl + diagnosis.get('diagnosisGuid') + '/transcriptDiagnoses';
                data.sortOrder = nextSortOrder++;
                return PFServer.promise(url, 'POST', data).then(function (transcriptDiagnosis) {
                    return {transcriptDiagnosis: transcriptDiagnosis, diagnosis: diagnosis};
                });
            });
            return all(promises).then(function (array) {
                array.forEach(function (hash) {
                    // NOTE: we're doing this after *all* promises are resolved to avoid multiple updates to the objects
                    // That cause multiple renders. Need to treat this as a single operation.
                    hash.diagnosis.get('transcriptDiagnoses').pushObject(hash.transcriptDiagnosis);
                });
            });
        });
    },

    /***
     * Deletes the TranscriptDiagnosis for the given transcriptGuid
     * @param {Diagnosis} diagnosis to be attached
     * @param transcriptGuid optional - leave as null to delete the default transcriptDiagnosis
     * @returns {Diagnosis Promise} with updated TranscriptDiagnoses.
     */
    deleteTranscriptDiagnosis(diagnosis, transcriptGuid) {
        var patientGuid = diagnosis.get('patientPracticeGuid'),
            diagnosisGuid = diagnosis.get('diagnosisGuid'),
            existingTranscriptDiagnosis = diagnosis.getTranscriptDiagnosis(transcriptGuid),
            url = config.clinicalBaseURL + 'patients/' + patientGuid + '/diagnoses/' +
                diagnosisGuid + '/transcriptDiagnoses/' + transcriptGuid,
            deletePromise = resolve(diagnosis);

        if (diagnosis.get('transcriptDiagnoses').length === 1 && existingTranscriptDiagnosis) {
            return this.deleteDiagnosis(diagnosis, transcriptGuid);
        }
        // Only call server if transcriptDiagnosis is persisted.
        if (existingTranscriptDiagnosis && existingTranscriptDiagnosis.lastModifiedAt) {
            deletePromise = PFServer.promise(url, 'DELETE');
        }
        return deletePromise.then(function () {
            var transcriptDiagnoses = diagnosis.get('transcriptDiagnoses');
            transcriptDiagnoses.removeObject(existingTranscriptDiagnosis);
            return diagnosis;
        });
    },

    reorderTranscriptDiagnosis(transcriptGuid, sortedDiagnoses) {
        var diagnosisGuids = sortedDiagnoses.mapBy('diagnosisGuid'),
            patientGuid = sortedDiagnoses[0].get('patientPracticeGuid'),
            url = config.clinicalBaseURL + 'patients/' + patientGuid + '/encounters/' + transcriptGuid +
                '/diagnoses/order'; // TODO: consider changing for sort instead of order
        return PFServer.promise(url, 'PUT', diagnosisGuids);
    },

    recordNoKnownDiagnoses(patientGuid, isNoKnownStatus) {
        var methodType = (isNoKnownStatus)? 'POST': 'DELETE',
            patientConditionsUrl = config.clinicalBaseURL + 'PatientConditions/' + patientGuid +
                '/NoKnownDiagnoses';
        return PFServer.promise(patientConditionsUrl, methodType);
    },

    loadFrequentDiagnoses: userSessionCache('loadFrequentDiagnoses', function () {
        var url = config.clinicalBaseURL + 'providers/' + session.get('providerGuid') + '/frequentDiagnoses',
            usefulProperties = ['code', 'name', 'diagnosisCodes', 'frequency'];

        return PFServer.promise(url).then(function (data) {
            return data.map(function (frequentDiagnosis) {
                if (isEmpty(frequentDiagnosis.diagnosisCodes)) {
                    // HACK: recreate the diagnosisCodes based on top-level data since the server isn't sending them
                    frequentDiagnosis.codeSystem = 'Icd9';
                    frequentDiagnosis.diagnosisCodes = [{
                        code: frequentDiagnosis.code,
                        codeSystem: frequentDiagnosis.codeSystem,
                        description: frequentDiagnosis.name
                    }];
                }
                frequentDiagnosis = getProperties(frequentDiagnosis, usefulProperties);
                frequentDiagnosis = Diagnosis.wrap(frequentDiagnosis);
                return frequentDiagnosis;
            }).sort(function (a, b) {
                // Sorts in reverse order
                return b.get('frequency') - a.get('frequency');
            });
        });
    }),

    /***
     * Gets the patient diagnoses from cache or an empty DiagnosesArray
     */
    getDiagnoses(patientGuid) {
        return patientsRepository.getClinicalData(patientGuid).then(function (aggregate) {
            return aggregate.diagnoses;
        });
    },

    _getNextSortOrder(patientGuid, transcriptGuid) {
        return this.getDiagnoses(patientGuid).then(diagnoses => {
            const encounterDiagnoses = diagnoses.getEncounterDiagnoses(transcriptGuid);
            const lastTranscriptDx = encounterDiagnoses.sortBy('transcriptDiagnosis.sortOrder').get('lastObject.transcriptDiagnosis');
            const sortOrder = lastTranscriptDx ? lastTranscriptDx.sortOrder + 1 : 0;
            return sortOrder;
        });
    },

    search(filter, requiredsystems, optionalsystems) {
        filter = filter || '';
        requiredsystems = requiredsystems || ['icd9'];
        optionalsystems = optionalsystems || ['icd10', 'snomed'];
        filter = window.encodeURIComponent(filter);

        if (filter.length < 2) {
            return resolve([]);
        }

        let url = `${config.clinicalBaseURL_v3}diagnosis/search?searchTerm=${filter}`; // '&optionalsystem=icd10&requiredsystem=icd9&optionalsystem=snomed';
        requiredsystems.forEach(function (requiredsystem) {
            url += '&requiredsystem=' + requiredsystem;
        });
        optionalsystems.forEach(function (optionalsystem) {
            url += '&optionalsystem=' + optionalsystem;
        });

        return PFServer.promise(url).then(function (result) {
            return result.diagnosesSearch.map(function (dxSearchResult) {
                return DxSearchResult.create(dxSearchResult);
            });
        });
    },

    searchForFamilyHistory(filter = '', relativesList = []) {
        const deepCloneFlag = true;
        const isSortedFlag = false;
        filter = window.encodeURIComponent(filter);
        if (filter.length < 2) {
            return resolve([]);
        }

        const url = `${config.clinicalBaseURL_v3}diagnosis/typeSearch/?searchTerm=${filter}&familyHealthHistorySearch=true`;
        return PFServer.promise(url).then(searchResults => {
            // TODO: add Family diagnosis
            searchResults.forEach(diagnosis => {
                diagnosis.diagnosisType = 'Other diagnosis';
            });
            let familyDiagnoses = relativesList.map(relativeWrapper => {
                const relative = get(relativeWrapper, 'relativeGuid') ? relativeWrapper : get(relativeWrapper, 'relative');
                return (get(relative, 'observations') || []).map(observation => {
                     const clonedDiagnosis = _.clone(observation.diagnosis, deepCloneFlag);
                     clonedDiagnosis.diagnosisType = 'Family diagnosis';
                     return clonedDiagnosis;
                });
            });
            familyDiagnoses = _.flatten(familyDiagnoses);
            // NOTE: I know this is old-school, but it maintains backwards compat with FamilyHealthHistory's pre ICD-10 implementation
            familyDiagnoses = _.unique(familyDiagnoses, isSortedFlag, diagnoses => diagnoses.snomedCode);
            return _.union(familyDiagnoses, searchResults);
        });
    },

    /***
     * Given a diagnosis model it returns a DiagnosesArray of related ICD-10 diagnoses
     * It does a search based on the specificied searchByField (defaults to icd9Description),
     * with icd10 and icd9 as required codes, then filters
     * client side to only use the results that match the icd9 code, extracts the ICD-10s from
     * those results and removes dups.
     **/
    loadIcd10RelatedDiagnoses(diagnosis, searchByField) {
        if (!diagnosis.get('needsIcd10Refinement')) {
            return resolve([]);
        }
        var DEFAULT_SEARCH_BY_FIELD = 'icd9Code',
            searchTerm;
        searchByField = searchByField || DEFAULT_SEARCH_BY_FIELD;
        searchTerm = diagnosis.get(searchByField) || diagnosis.get(DEFAULT_SEARCH_BY_FIELD) ||  diagnosis.get('name');
        return this.search(searchTerm, ['icd10', 'icd9'], []).then(function (searchResults) {
            var shallowFlatFlag = true,
                sortFlag = false,
                icd9Code = diagnosis.get('icd9Code'),
                resultsForThisIcd9 = searchResults,
                diagnosisCodesForThisIcd9, icd10CodesForThisIcd9, uniqueIcd10Codes, icd10Diagnoses, icd10DiagnosesArray;

            if (icd9Code) {
                resultsForThisIcd9 = searchResults.filter(function (searchResult) {
                    // Filter by icd9
                    const list = _.flatten(searchResult.get('icd9Codes')).mapBy('code');
                    if (list.includes(icd9Code)) {
                        return true;
                    }
                    /*
                        Check for trailing zeros where simple string comparison won't work (ex. 60.0 is equal to 60.00)
                        Since ICD-9 codes can start with a V or E we can't just use parseFloat for comparison
                    */
                    for (let i = 0; i < list.length; i++) {
                        const currentCode = list[i];
                        if (currentCode.length !== icd9Code.length && currentCode.indexOf('.') > 0 && icd9Code.indexOf('.') > 0) {
                            const longerCode = currentCode.length > icd9Code.length ? currentCode : icd9Code;
                            const shorterCode = longerCode === currentCode ? icd9Code : currentCode;

                            if (longerCode.match('^' + shorterCode) && parseInt(longerCode.substring(shorterCode.length)) === 0) {
                                return true;
                            }
                        }
                    }
                    return false;
                });
            }
            diagnosisCodesForThisIcd9 =  _.flatten(resultsForThisIcd9.mapBy('diagnosisCodes'), shallowFlatFlag);
            icd10CodesForThisIcd9 = diagnosisCodesForThisIcd9.filter(function (codeObject) {
                return codeObject.isEvery('codeSystem', 'ICD10');
            });
            uniqueIcd10Codes = _.unique(icd10CodesForThisIcd9, sortFlag, function (codes) {
                // Removes dups considering all the sets of combinatory codes as unique
                return codes.mapBy('code').sort().join('&');
            });
            icd10Diagnoses = uniqueIcd10Codes.map(function (diagnosisCodes) {
                return Diagnosis.wrap({
                    diagnosisCodes: diagnosisCodes
                });
            });
            icd10DiagnosesArray = DiagnosesArray.createArray(icd10Diagnoses);
            return icd10DiagnosesArray;
        });
    },

    searchForIcd10Diagnoses(searchTerm) {
        return this.search(searchTerm, ['icd10'], ['snomed']).then(searchResults => {
            const resultsCodes =  _.flatten(searchResults.mapBy('diagnosisCodes'), true);
            const uniqueCodes = _.unique(resultsCodes, false, function (codes) {
                // Removes dups considering all the sets of combinatory codes as unique
                return codes.mapBy('code').sort().join('&');
            });
            const diagnoses = uniqueCodes.map(function (diagnosisCodes) {
                return Diagnosis.wrap({ diagnosisCodes });
            });
            const diagnosesArray = DiagnosesArray.createArray(diagnoses);
            return diagnosesArray;
        });
    },

    mapSaveErrorToAction(error, diagnosis) {
        if (error.status === 404 && error.responseJSON && error.responseJSON.message && error.responseJSON.message.indexOf('Patient diagnosis not found') >= 0) {
            toastr.error('The diagnosis has been deleted');
            if (diagnosis) {
                this.getDiagnoses(diagnosis.get('patientPracticeGuid')).then(diagnoses => diagnoses.removeDiagnosis(diagnosis));
            }
            return 'close';
        }
        return null;
    }
};
