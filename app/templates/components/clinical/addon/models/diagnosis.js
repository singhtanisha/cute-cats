import { isArray } from '@ember/array';
import { empty, sort, alias } from '@ember/object/computed';
import ObjectProxy from '@ember/object/proxy';
import { isEmpty, isPresent } from '@ember/utils';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import ArrayProxy from '@ember/array/proxy';
import { get, computed, set, observer } from '@ember/object';
import DiagnosesArray from 'clinical/models/diagnoses-array';
import transcriptComments from 'clinical/util/transcript-comments';
import medicationsRepository from 'clinical/repositories/medications';

const PromiseArray = ArrayProxy.extend(PromiseProxyMixin);

function dateToISOString(date) {
    return isEmpty(date) ? null : moment.utc(moment(date).format('MM/DD/YYYY')).startOf('day').toISOString();
}
function getFormattedDate(isoDateString) {
    return isEmpty(isoDateString) ? '' : moment.utc(isoDateString).startOf('day').format('MM/DD/YYYY');
}

const Diagnosis = ObjectProxy.extend({
    isNew: empty('diagnosisGuid'),

    /***
     * Generated key used to compare diagnoses for equivalence. Useful for deduping and identifyign selections
     * @property codesIdentifier
     */
    codesIdentifier: computed('code', 'diagnosisCodes.[]', function () {
        // If we don't have diagnosisCodes, fallsback to diagnosis.code (no codeSystem works)
        let diagnosisCodes = this.get('diagnosisCodes') || [{code: this.get('code')}];
        return _.map(diagnosisCodes, function (codeObject) {
            return codeObject.codeSystem + '-' + codeObject.code;
        }).sort().join('&');
    }),

    // HACK: intermediate property to get nested each to work (ember.js/issues/541)
    eachTranscriptDiagnoses: computed('transcriptDiagnoses.[]', function () {
        return this.get('transcriptDiagnoses');
    }),
    description: computed(
      'icd10Code',
      'icd9Code',
      'snomedCode',
      'customCode',
      'icd10Description',
      'icd9Description',
      'snomedDescription',
      'customDescription',
      'diagnosisCodes.[]',
      function () {
          var hasIcd9AndSnomed =  !!this.get('icd9Code') && this.get('snomedCode'),
              customCode = this.get('customCode') || 'No associated code';
          if (this.get('icd10Description')) {
              return this.get('icd10Description');
          }
          if (hasIcd9AndSnomed) {
              return '(' + this.get('icd9Code') + ') ' + this.get('snomedDescription') + ': ' + this.get('icd9Description');
          }
          if (this.get('icd9Code')) {
              return '(' + this.get('icd9Code') + ') ' + this.get('icd9Description');
          }
          if (this.get('isCustom')) {
              return '(' + customCode + ') ' + this.get('customDescription');
          }

          return this.get('name');
      }
    ),

    needsIcd10Refinement: computed('icd10Codes', 'snomedCodes', 'icd9Codes', 'isCustom', function () {
        if (isEmpty(this.get('icd10Codes')) && this.get('snomedCode') && isEmpty(this.get('icd9Codes'))) {
            return false;
        }
        return !this.get('icd10Code') && !this.get('isCustom');
    }),
    needsIcd9Refinement: computed('icd9Code', 'isCustom', function () {
        return !this.get('icd9Code') && !this.get('isCustom');
    }),

    isHistorical: computed('stopDate', function () {
        const stopDate = this.get('stopDate');
        return !!stopDate && moment(stopDate).isBefore(moment());
    }),
    isCustom: computed('diagnosisCodes.@each.codeSystem', function () {
        const diagnosisCodes = this.getWithDefault('diagnosisCodes', []);
        return !!diagnosisCodes.findBy('codeSystem', 'Custom');
    }),
    customCode: computed('diagnosisCodes.@each.codeSystem', {
        get() {
            const diagnosisCodes = this.getWithDefault('diagnosisCodes', []);
            const customDiagnosisCode = diagnosisCodes.findBy('codeSystem', 'Custom');
            return customDiagnosisCode && get(customDiagnosisCode, 'code');
        },
        set(key, value) {
            const diagnosisCodes = this.getWithDefault('diagnosisCodes', []);
            let customDiagnosisCode = diagnosisCodes.findBy('codeSystem', 'Custom');
            if (customDiagnosisCode) {
                set(customDiagnosisCode, 'code', value);
            } else {
                customDiagnosisCode = { code: value, codeSystem: 'Custom' };
                diagnosisCodes.push(customDiagnosisCode);
            }
            return value;
        }
    }),

    icd9Code: computed('diagnosisCodes.@each.codeSystem', function () {
        return this._getCodeByCodeSystem('Icd9').code;
    }),
    snomedCode: computed('diagnosisCodes.@each.codeSystem', function () {
        return this._getCodeByCodeSystem('Snomed').code;
    }),
    icd10Code: computed('diagnosisCodes.@each.codeSystem', function () {
        return this._getCodeByCodeSystem('Icd10').code;
    }),
    icd9Description: computed('diagnosisCodes.@each.codeSystem', function () {
        return this._getCodeByCodeSystem('Icd9').description;
    }),
    snomedDescription: computed('diagnosisCodes.@each.codeSystem', function () {
        return this._getCodeByCodeSystem('Snomed').description;
    }),
    icd10Description: computed('diagnosisCodes.@each.codeSystem', function () {
        return this._getCodeByCodeSystem('Icd10').description;
    }),
    customDescription: computed('diagnosisCodes.@each.codeSystem', function () {
        return this._getCodeByCodeSystem('Custom').description;
    }),

    icd10OrSnomedCode: computed('icd10Code', 'snomedCode', function () {
        return this.get('icd10Code') || this.get('snomedCode');
    }),
    icd10OrSnomedDescription: computed('icd10description', 'snomedDescription', function () {
        return this.get('icd10Description') || this.get('snomedDescription');
    }),
    ic10orIcd9Code: computed('icd10Code', 'icd9Code', function () {
        const icd10 = this.get('icd10Code');
        const icd9 = this.get('icd9Code');
        if (!icd10 && !icd9) {
            return null;
        }
        return {
            code: isPresent(icd10) ? icd10 : this.get('icd9Code'),
            description: isPresent(icd10) ? this.get('icd10Description') : this.get('icd10Description'),
            codeSet: isPresent(icd10) ? 'icd10' : 'icd9'
        };
    }),
    //End single use

    //Use these to get multiple codes
    icd9Codes: computed('diagnosisCodes', 'diagnosisCodes.[]', function () {
        return this._getCodesByCodeSystem('icd9');
    }),
    icd10Codes: computed('diagnosisCodes', 'diagnosisCodes.[]', function () {
        return this._getCodesByCodeSystem('icd10');
    }),
    snomedCodes: computed('diagnosisCodes', 'diagnosisCodes.[]', function () {
        return this._getCodesByCodeSystem('snomed');
    }),

    /**
     * Returns an Array of objects [{name: '', value: ''}, {...}]
     */
    attributes: computed('_eachDiagnosisCode.facets.[]', function () {
        // TODO: return the facets based on codes.@each.facets
        return _.flatten(this.get('_eachDiagnosisCode').mapBy('attributes'));
    }),
    // HACK: intermediate property to get nested each to work (ember.js/issues/541)
    _eachDiagnosisCode: computed('diagnosisCodes.[]', function () {
        return this.get('diagnosisCodes') || [];
    }),

    isEncounterDiagnosis(transcriptGuid) {
        return transcriptGuid && !!this.getTranscriptDiagnosis(transcriptGuid);
    },

    /**
     * Adds a comment to the TranscriptDiagnosis specified
     * if no transcript diagnosis exists it will create a new one
     * if no transcriptGuid is specified, it will use the default one
     */
    addComment(comment, transcriptGuid) {
        var transcriptDiagnosis = transcriptGuid ?
            this.attachToEncounter(transcriptGuid) :
            this.createDefaultTranscriptDiagnosis();
        set(transcriptDiagnosis, 'comment', comment);
    },
    getTranscriptDiagnosis(transcriptGuid) {
        var transcriptDiagnoses = this.getWithDefault('transcriptDiagnoses', []);
        if (!transcriptGuid) {
            transcriptGuid = null;
        }
        return transcriptDiagnoses.findBy('transcriptGuid', transcriptGuid);
    },
    createDefaultTranscriptDiagnosis() {
        return this._createTranscriptDiagnosis();
    },
    attachToEncounter(transcriptGuid) {
        if (isEmpty(transcriptGuid)) {
            return;
        }
        return this._createTranscriptDiagnosis(transcriptGuid);
    },
    detachFromEncounter(transcriptGuid) {
        // delete the transcriptDiagnosis to detach
        // TODO: Review with Danny how to do this.
        if (isEmpty(transcriptGuid)) {
            return;
        }
        var transcriptDiagnosis = this.getTranscriptDiagnosis(transcriptGuid);
        this.get('transcriptDiagnoses').removeObject(transcriptDiagnosis);
    },

    diagnosisComment: computed('transcriptDiagnoses.@each.transcriptGuid', function () {
        return this.getTranscriptDiagnosis();
    }),
    filteredEncounterComments: computed('transcriptDiagnoses.[]', 'diagnosisComment', function () {
        const diagnosisComment = this.get('diagnosisComment');
        return this.getWithDefault('transcriptDiagnoses', []).reject(transcriptDiagnosis => transcriptDiagnosis === diagnosisComment);
    }),
    encounterCommentsSortProperties: computed(() => ['dateOfService:desc']),
    encounterComments: sort('filteredEncounterComments', 'encounterCommentsSortProperties'),
    encounterCommentsWithComment: computed('encounterComments.@each.comment', function () {
        return this.get('encounterComments').filterBy('comment');
    }),
    diagnosesByDateOfService: sort('transcriptDiagnoses.[]', 'encounterCommentsSortProperties'),

    allExistingComments: computed('diagnosesByDateOfService', 'diagnosisComment', function () {
        return this.getWithDefault('diagnosesByDateOfService', []).filterBy('comment');
    }),

    associateMedication(medication) {
        medication.set('diagnosisGuid', this.get('diagnosisGuid'));
        return medicationsRepository.saveMedication(medication);
    },
    disassociateMedication(medication) {
        medication.set('diagnosisGuid', undefined);
        return medicationsRepository.saveMedication(medication);
    },
    medications: computed('diagnosisGuid', '_allMedications.@each.diagnosisGuid', function () {
        var diagnosisGuid = this.get('diagnosisGuid');
        return this.get('_allMedications').filter(function (medication) {
            return !!diagnosisGuid && medication.get('diagnosisGuid') === diagnosisGuid;
        });
    }),

    _allMedications: computed('patientPracticeGuid', function () {
        const medicationsPromise = medicationsRepository.getMedications(this.get('patientPracticeGuid'));
        return PromiseArray.create({promise: medicationsPromise});
    }),

    _createTranscriptDiagnosis(transcriptGuid) {
        var transcriptDiagnoses = this.getWithDefault('transcriptDiagnoses', []),
            transcriptDiagnosis = this.getTranscriptDiagnosis(transcriptGuid);
        if (!transcriptGuid) {
            // We need to be explicit about null for consistency with what the server is doing (not undefined)
            transcriptGuid = null;
        }
        if (isEmpty(transcriptDiagnosis)) {
            transcriptDiagnosis = {transcriptGuid: transcriptGuid};
            transcriptDiagnoses.pushObject(transcriptDiagnosis);
        }
        this.set('transcriptDiagnoses', transcriptDiagnoses);

        return transcriptDiagnosis;
    },

    isDirty: false,
    _markDirty: observer(
      'customCode',
      'content.startDate',
      'content.stopDate',
      'content.isAcute',
      'content.acuity',
      'content.isTerminal',
      'transcriptDiagnoses.@each.comment',
      'diagnosisCodes.[]',
      function () {
          this.set('isDirty', true);
      }
    ),

    _getCodeByCodeSystem(codeSystem) {
        codeSystem = codeSystem.toLowerCase();
        var diagnosisCodes = this.getWithDefault('diagnosisCodes', []),
            codeObject = diagnosisCodes.find(function (code) {
                return code.codeSystem.toLowerCase() === codeSystem;
            });
        // TODO: add support for combinatory codes by concatenating the codes frmo the same codeSystem
        return codeObject || {};
    },

    _getCodesByCodeSystem(codeSystem) {
        codeSystem = codeSystem.toLowerCase();

        return this.getWithDefault('diagnosisCodes', []).filter(function (dx) {
            return dx.codeSystem.toLowerCase() === codeSystem;
        });
    },

    startDate: computed('content.startDate', {
        get() {
            return getFormattedDate(this.get('content.startDate'));
        },
        set(key, value) {
            this.set('content.startDate', dateToISOString(value));
            return value;
        }
    }),
    stopDate: computed('content.stopDate', {
        get() {
            return getFormattedDate(this.get('content.stopDate'));
        },
        set(key, value) {
            this.set('content.stopDate', dateToISOString(value));
            return value;
        }
    }),
    startDateUtc: alias('content.startDate'),
    stopDateUtc: alias('content.stopDate'),

    addCodesFrom(referenceDiagnosis) {
        this.set('diagnosisCodes', this.get('diagnosisCodes').concat(referenceDiagnosis.get('diagnosisCodes')));
    },

    acuityDisplay: computed('content.acuity', 'content.isAcute', function () {
        const acuity = this.get('content.acuity') || '';
        const diagnosisIsAcute = this.get('content.isAcute');
        if (acuity.toLowerCase() === 'acute' || diagnosisIsAcute) {
            return 'Acute';
        }
        if (acuity.toLowerCase() === 'chronic') {
            return 'Chronic';
        }
        return '';
    })
});

Diagnosis.reopenClass({
    wrap(objectOrArray) {
        if (objectOrArray instanceof Diagnosis) {
            return objectOrArray;
        } else if (isArray(objectOrArray)) {
            objectOrArray = objectOrArray.map(function (item) {
                return Diagnosis.wrap(item);
            });
            return DiagnosesArray.create({content: objectOrArray});
        } else {
            transcriptComments.setTranscriptCommentDates(get(objectOrArray, 'patientPracticeGuid'), get(objectOrArray, 'transcriptDiagnoses') || []);
            set(objectOrArray, 'transcriptDiagnoses', objectOrArray.transcriptDiagnoses || []);
            return Diagnosis.create({ content: objectOrArray });
        }
    },
    unwrap(diagnosis) {
        let deserializedDiagnosis = diagnosis.get('content');
        if (deserializedDiagnosis instanceof Diagnosis) {
            return Diagnosis.unwrap(diagnosis);
        }
        deserializedDiagnosis = JSON.parse(JSON.stringify(deserializedDiagnosis));
        return deserializedDiagnosis;
    },
    unwrapAndRemoveLastModified(diagnosis) {
        const deserializedDiagnosis = Diagnosis.unwrap(diagnosis);
        const { transcriptDiagnoses } = deserializedDiagnosis;
        if (isPresent(transcriptDiagnoses)) {
            transcriptDiagnoses.forEach(transcriptDiagnosis => {
                delete transcriptDiagnosis.lastModifiedByProviderGuid;
            });
        }
        return deserializedDiagnosis;
    }
});

export default Diagnosis;
