import { isEmpty, isPresent } from '@ember/utils';
import EmberObject, { computed, get } from '@ember/object';
export default EmberObject.extend({
    getCodesFor(codeSystem) {
        codeSystem = codeSystem.toLowerCase();

        var dxCodes = this.get('diagnosisCodes'),
            codes = [], i;
        // TODO: change to use filter
        for (i = 0; i < dxCodes.length; i += 1) {
            if (dxCodes[i][0].codeSystem.toLowerCase() === codeSystem) {
                codes.push(dxCodes[i]);
            }
        }

        return codes;
    },

    icd9Codes: computed('diagnosisCodes', function () {
        return this.getCodesFor('icd9');
    }),

    icd10Code: computed('icd10Codes.[]', function () {
        const icd10Codes = _.flatten(this.get('icd10Codes') || []);

        if (icd10Codes.length === 1) {
            return get(icd10Codes, 'firstObject');
        }
    }),

    icd10Codes: computed('diagnosisCodes', function () {
        return this.getCodesFor('icd10');
    }),

    snomedCodes: computed('diagnosisCodes', function () {
        return this.getCodesFor('snomed');
    }),

    getCodeTextFor(codeSystem) {
        return this.get(codeSystem + 'Codes').map(function (codes) {
            if (codes.length === 1) {
                return codes[0].code;
            } else {
                return codes.map(function (code) {
                    return code.code;
                }).join('&');
            }
        }).join(',');
    },
    getCondensedCodeText() {
        let multipleIndicator = '';
        let array = this.get('icd10Codes');
        if (isEmpty(array)) {
            array = this.get('snomedCodes');
        }
        const codeArray = array.map(function (codes) {
            if (codes.length > 0) {
                return codes[0].code;
            }
        });
        if (codeArray.length > 1) {
            multipleIndicator = '...';
        }
        return isPresent(codeArray) ? `${codeArray[0]}${multipleIndicator}` : null;
    },
    icd9CodesText: computed('icd9Codes', function () {
        return this.getCodeTextFor('icd9');
    }),

    icd10CodesText: computed('icd10Codes', function () {
        return this.getCondensedCodeText();
    }),

    codeToRefine: computed('icd10Codes', 'icd9Codes', function () {
        const icd9CodeCount = this.get('icd9Codes').length;
        const icd10CodeCount = this.get('icd10Codes').length;

        if (icd10CodeCount === 1) {
            return '';
        }

        if (icd10CodeCount > 1 && icd9CodeCount > 1) {
            return 'both';
        } else if (icd10CodeCount > 1) {
            return 'icd10';
        } else if (icd9CodeCount > 1) {
            return 'icd9';
        } else {
            return '';
        }
    }),

    optionalRefine: computed('diagnosisCodes', function () {
        var icd10Codes = this.get('icd10Codes');

        return icd10Codes.length === 1 && !isEmpty(icd10Codes[0][0].refinementFilter);
    })
});
