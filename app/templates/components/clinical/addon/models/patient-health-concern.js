import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
    patientHealthConcernGuid: alias('id'),
    patientPracticeGuid: attr('string'),
    effectiveDate: attr('formatted-date'),
    /**
     * Indicates whether the health concern (not the clinical item) is active
     */
    isActive: attr('boolean'),
    /**
     * Indicates whether this health concern is an Allergy, Diagnosis, or Note.
     */
    healthConcernType: attr('string'),
    /**
     * The allergyGuid or diagnosisGuid of the clinical item that this health concern points to.
    */
    healthConcernReferenceGuid: attr('string'),
    /**
     * The narrative text for a Note type health concern.
     * Only valid for Note type health concern.
     */
    healthConcernNote: attr('string'),
    /**
     * The clinical item (allergy or dianosis) that the health concern points to
     */
    healthConcernReferenceItem: null,
    title: computed('healthConcernReferenceItem', 'healthConcernType', function () {
        const { healthConcernType, healthConcernReferenceItem } = this.getProperties('healthConcernType', 'healthConcernReferenceItem');
        if (healthConcernReferenceItem) {
            if (healthConcernType === 'Allergy') {
                return healthConcernReferenceItem.get('allergenText');
            }
            return this.getDiagnosisDescription(healthConcernReferenceItem);
        }
        return null;
    }),
    getDiagnosisDescription(diagnosis) {
        const system = diagnosis.get('icd10Code') ? 'icd10' : 'icd9';
        const codes = diagnosis._getCodesByCodeSystem(system);
        if (isEmpty(codes)) {
            return diagnosis.get('name');
        }
        return codes.map(code => `(${code.code}) ${code.description}`).join('\n');
    },
    sortableDate: computed('effectiveDate', function () {
        return new Date(this.get('effectiveDate'));
    })
});
