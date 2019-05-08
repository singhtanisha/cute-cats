import { computed } from '@ember/object';
import Component from '@ember/component';
export default Component.extend({
    classNames: ['diagnosis-codes', 'clearfix'],
    excludeSelectedCode: false,
    icd10Codes: computed('diagnosis', 'diagnosis.icd10Codes','excludeSelectedCode', function() {
        const codes = this.get('diagnosis.icd10Codes');
        const selectedCode = this.get('diagnosis.icd10OrSnomedCode');
        if (this.get('excludeSelectedCode') && selectedCode) {
            return codes.rejectBy('code', selectedCode);
        }
        return codes;
    })
});
