import ArrayProxy from '@ember/array/proxy';
import { alias } from '@ember/object/computed';
import EmberObject, {
  set,
  computed,
  observer,
  get
} from '@ember/object';
import Diagnosis from 'clinical/models/diagnosis';

const TranscriptDiagnosis = EmberObject.extend({
    sortOrder: alias('transcriptDiagnosis.sortOrder')
});

/**
 * A proxy array for Diagnosis instances that provides helper functions to modify array
 */
const DiagnosesArray = ArrayProxy.extend({
    /**
     * Replaces the content of the diagnosis matching the diagnosisGuid if it exists, otherwise
     * inserts a new one.
     * This method is useful when saving or loading diagnosis to keep the collection in sync
     */

    replaceDiagnosis(diagnosis) {
        var existingDiagnosis;
        if (diagnosis instanceof Diagnosis) {
            return this.replaceDiagnosis(diagnosis.get('content'));
        }

        existingDiagnosis = this.findBy('diagnosisGuid', diagnosis.diagnosisGuid);
        if (existingDiagnosis) {
            existingDiagnosis.set('content', diagnosis);
            return existingDiagnosis;
        } else {
            diagnosis = Diagnosis.wrap(diagnosis);
            this.pushObject(diagnosis);
            return diagnosis;
        }
    },
    removeDiagnosis(diagnosis) {
        var diagnosisToDelete = this.findBy('diagnosisGuid', diagnosis.get('diagnosisGuid'));
        this.removeObject(diagnosisToDelete);
    },

    getEncounterDiagnoses(transcriptGuid) {
        let zeroSortOrderCount = 0;
        let maxSortOrder = 0;
        let encounterDiagnoses = [];
        if (transcriptGuid) {
            encounterDiagnoses = this.map(diagnosis => {
                // Dummy get to make the observer work.
                diagnosis.get('eachTranscriptDiagnoses');
                const transcriptDiagnosis = diagnosis.getTranscriptDiagnosis(transcriptGuid);
                if (transcriptDiagnosis) {
                    const sortOrder = get(transcriptDiagnosis, 'sortOrder');
                    if (get(transcriptDiagnosis, 'sortOrder') === 0) {
                        zeroSortOrderCount++;
                    } else {
                        maxSortOrder = Math.max(sortOrder, maxSortOrder);
                    }
                    return TranscriptDiagnosis.create({ transcriptDiagnosis, diagnosis });
                }
                return null;
            }).compact();
            // Add temporary fake sort orders to the transcriptDx's with sortOrder === 0.
            if (zeroSortOrderCount > 1) {
                encounterDiagnoses.filterBy('transcriptDiagnosis.sortOrder', 0).forEach(dx => {
                    set(dx.transcriptDiagnosis, 'sortOrder', maxSortOrder++);
                });
            }
        }
        return encounterDiagnoses;
    },

    active: computed('@each.isHistorical', function () {
        return DiagnosesArray.createArray(this.rejectBy('isHistorical'));
    }),
    historical: computed('@each.isHistorical', function () {
        return DiagnosesArray.createArray(this.filterBy('isHistorical'));
    }),

    acute: computed('@each.isAcute', function () {
        return DiagnosesArray.createArray(this.filterBy('isAcute'));
    }),
    chronic: computed('@each.isAcute', function () {
        // In the original logic, both Unspecified and Chronic are considered as Chronic diagnoses
        return DiagnosesArray.createArray(this.filter(diagnosis => diagnosis.content.acuity ? diagnosis.content.acuity.toLowerCase() === 'chronic' : false));
    }),
    unspecified: computed('@each.acuity', function() {
        return DiagnosesArray.createArray(this.filter(diagnosis => diagnosis.content.acuity ? diagnosis.content.acuity.toLowerCase() === 'unspecified' : true));
    }),
    unique: computed('@each.diagnosisCodes.[]', function () {
        const isSortedFlag = false;
        // NOTE: we get the content, since _.isArray doesn't work with Ember's ArrayProxy and it's used by _.unique indirectly
        let uniqueDiagnoses = _.unique(this.get('content'), isSortedFlag, function (diagnosis) {
            return diagnosis.get('codesIdentifier');
        });
        return DiagnosesArray.createArray(uniqueDiagnoses);
    }),

    updateNoKnownDiagnoses: observer('content.[]', function () {
        // If the content of the array changed we reset this back to false
        this.set('noKnownDiagnoses', false);
    }),

    /**
     * Returns an Array of [{group: 'Encounter Type', facets: [{value: 'Initial', diagnoses: DiagnosesArray}, {...}]
     */
    facets: computed('@each.attributes', function () {
        var indexedFacets = {},        // Let's start with an object like {'name': {'value': [dx]}}
            facets = [];   // then we project it into an array to make it easier to consume
        this.forEach(function (diagnosis) {
            diagnosis.get('attributes').forEach(function (diagnosisAttribute) {
                indexedFacets[diagnosisAttribute.name] = indexedFacets[diagnosisAttribute.name] || {};
                indexedFacets[diagnosisAttribute.name][diagnosisAttribute.value] = indexedFacets[diagnosisAttribute.name][diagnosisAttribute.value] || DiagnosesArray.createArray([]);
                indexedFacets[diagnosisAttribute.name][diagnosisAttribute.value].pushObject(diagnosis);
            });
        });
        Object.keys(indexedFacets).forEach(function (facetKey) {
            var group = indexedFacets[facetKey],
                constraints = [];
            Object.keys(group).forEach(function (constraintKey) {
                var diagnoses = group[constraintKey];
                constraints.pushObject({id: facetKey + '-' + constraintKey, name: constraintKey, diagnoses: diagnoses});
            });
            facets.pushObject({id: facetKey, name: facetKey, constraints: constraints});
        });
        return facets;
    })
});

DiagnosesArray.reopenClass({
    createArray(content) {
        return DiagnosesArray.create({ content: content });
    }
});

export default DiagnosesArray;
