import { isEmpty } from '@ember/utils';
import { computed, observer } from '@ember/object';
import Component from '@ember/component';
import ViewPreferencesMixin from 'boot/mixins/view-preferences';

export default Component.extend(ViewPreferencesMixin, {
    tagName: 'span',
    classNames: ['display-diagnosis-selector'],
    attributeBindings: ['data-element'],

    isShorter: false,

    viewPreferencesKey: 'icd10-upgrade',
    viewPreferenceProperties: computed(() => ['diagnosisDescriptionDisplay']),

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

    persistToViewPreferencesOnSelectionChange: observer('diagnosisDescriptionDisplay', function () {
        this.persistUserPreferences();
        this.sendAction('displayChanged', this.get('diagnosisDescriptionDisplay'));
    }),

    diagnosisDescriptionDisplayOptions: [{
        value: 'icd10',
        label: 'ICD-10'
    }, {
        value: 'term',
        label: 'Term'
    }]
});
