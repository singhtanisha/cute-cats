import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import Component from '@ember/component';
import ViewPreferencesMixin from 'boot/mixins/view-preferences';

export default Component.extend(ViewPreferencesMixin, {
    viewPreferencesKey: 'icd10-upgrade',
    viewPreferenceProperties: computed(() => ['diagnosisDescriptionDisplay']),

    persistUserPreferences: () => {},
    diagnosisDescriptionDisplay: computed({
        get() {
            let cachedDisplay = this.cacheFor('diagnosisDescriptionDisplay') || 'icd10';
            if (cachedDisplay !== 'icd10') {
                return 'term';
            }
            return cachedDisplay;
        },
        set(key, value) {
            if (isEmpty(value)) {
                return this.cacheFor('diagnosisDescriptionDisplay') || 'term';
            }
            return value;
        }
    }),

    descriptions: computed('diagnosisDescriptionDisplay', 'diagnosis', 'diagnosis.diagnosisCodes.[]', 'isIcd10Display', function () {
        var display = this.get('diagnosisDescriptionDisplay'),
            diagnosis = this.get('diagnosis'),
            diagnosisCodes;

        if (diagnosis.get('isCustom')) {
            return [(diagnosis.get('customCode')? '(' + diagnosis.get('customCode') + ') ' : '') + diagnosis.get('customDescription')];
        }
        else if (display === 'icd9' || display === 'icd10') {
            diagnosisCodes = diagnosis._getCodesByCodeSystem(display);

            if (diagnosisCodes.length > 0) {
                return diagnosisCodes.map(function (diagnosis) {
                    return (diagnosis.code ? '(' + diagnosis.code + ') ' : '') + diagnosis.description;
                }, this);
            } else {
                return [diagnosis.get('name')];
            }
        }
        else {
            if(this.get('isIcd10Display')) {
                return [diagnosis.get('name')];
            }
            return [(diagnosis.get('code') ? '(' + diagnosis.get('code') + ') ' : '') + diagnosis.get('name')];
        }
    })
});
