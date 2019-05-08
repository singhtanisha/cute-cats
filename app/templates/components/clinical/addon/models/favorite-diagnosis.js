import { sort, not } from '@ember/object/computed';
import { isEmpty, isPresent } from '@ember/utils';
import EmberObject, { computed } from '@ember/object';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
    name: attr('string'),
    code: attr('string'),
    diagnosisCodes: attr('array'),
    sortIndex: attr('number'),

    displayCodeSystem: 'icd10',

    displayDiagnosisCodes: computed('displayCodeSystem', 'sortedDiagnosisCodes', function () {
        const displayCodeSystem = this.get('displayCodeSystem');

        const filteredDiagnosisCodes = this.get('sortedDiagnosisCodes').filter(function (diagnosis) {
            return diagnosis.codeSystem.toLowerCase() === displayCodeSystem;
        });

        if (!isEmpty(filteredDiagnosisCodes)) {
            return filteredDiagnosisCodes;
        } else {
            return [EmberObject.create({
                description: this.get('name'),
                code: '-'
            })];
        }
    }),
    sortedDiagnosisCodes: sort('diagnosisCodes', function (a, b) {
        if (a.codeSystem === b.codeSystem) {
            return a.code < b.code ? -1 : 1;
        }

        const aType = a.codeSystem.toLowerCase();
        if (aType === 'icd10') {
            return -1;
        }
        if (aType === 'snomed') {
            return 1;
        }
        if (b.codeSystem.toLowerCase() === 'icd10') {
            return 1;
        }
        return -1;
    }),
    icd10SortProperty: computed(() => ['icd10SortOrder']),
    sortableICD10DiagnosisCodes: computed('diagnosisCodes', function() {
        return this.get('diagnosisCodes').map(diagnosisCode => {
            let sortOrder = 0;
            if (diagnosisCode.codeSystem) {
                if (diagnosisCode.codeSystem.toLowerCase() === 'icd10') {
                    sortOrder = -1;
                } else if (diagnosisCode.codeSystem.toLowerCase() === 'icd9') {
                    sortOrder = 1;
                }
            }
            diagnosisCode.icd10SortOrder = sortOrder;
            return diagnosisCode;
        });
    }),
    sortedICD10DiagnosisCodes: sort('sortableICD10DiagnosisCodes', 'icd10SortProperty'),
    preferredIcd10Code: computed('diagnosisCodes', function () {
        return this.get('sortedICD10DiagnosisCodes.firstObject');
    }),
    icd10Code: computed('diagnosisCodes', function() {
        const codes = this.get('diagnosisCodes');
        if (isPresent(codes)) {
            let foundCode = codes.find(code => {
                return code.codeSystem && code.codeSystem.toLowerCase() === 'icd10';
            });
            if (!foundCode) {
                foundCode = codes.find(code => {
                    return code.codeSystem && code.codeSystem.toLowerCase() === 'custom';
                });
            }
            return foundCode || codes.get('firstObject');
        }
        return null;
    }),
    icd10CodesText: computed('icd10Code', function() {
        return this.get('icd10Code.code');
    }),
    term: computed('icd10Code', function() {
        return this.get('icd10Code.description');
    }),
    isSnomedCodeOnly: computed('diagnosisCodes.@each.codeSystem', function() {
        return this.get('diagnosisCodes').isEvery('codeSystem', 'SNOMED');
    }),
    isNotSnomedCodeOnly: not('isSnomedCodeOnly')
});

export function isDuplicate (newDiagnosis, diagnoses) {
    let name = newDiagnosis.get('name'),
        diagnosisCodes = newDiagnosis.get('diagnosisCodes');

    return !!diagnoses.find((item) => {
        if (item.get('name') !== name ||
            item.get('diagnosisCodes.length') !== diagnosisCodes.get('length')) {
            return false;
        }

        for (let i = 0; i < diagnosisCodes.get('length'); i += 1) {
            let dxCode = diagnosisCodes.objectAt(i);

            let foundMatchingDxCode = item.get('diagnosisCodes').find((itemDxCode) => {
                return dxCode.code === itemDxCode.code && dxCode.description === itemDxCode.description && dxCode.codeSystem.toLowerCase() === itemDxCode.codeSystem.toLowerCase();
            });

            if (!foundMatchingDxCode) {
                return false;
            }
        }

        return true;
    });
}
