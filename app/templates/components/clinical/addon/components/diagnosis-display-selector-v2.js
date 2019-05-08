import { isEmpty } from '@ember/utils';
import { computed, observer } from '@ember/object';
import Component from '@ember/component';
import ViewPreferencesMixin from 'boot/mixins/view-preferences';

export default Component.extend(ViewPreferencesMixin, {
    classNames: ['display-diagnosis-selector'],
    attributeBindings: ['data-element'],

    viewPreferencesKey: 'icd10-upgrade',
    viewPreferenceProperties: computed(() => ['diagnosisDescriptionDisplay']),

    promptValue: computed('diagnosisDescriptionDisplay', 'diagnosisDescriptionDisplayOptions', function() {
        const value = this.get('diagnosisDescriptionDisplay');
        const display = this.get('diagnosisDescriptionDisplayOptions').findBy('value', value);
        return (display && display.label) ? display.label : 'Show';
    }),

    diagnosisDescriptionDisplay: computed({
        get() {
            const cachedDisplay = this.cacheFor('diagnosisDescriptionDisplay') || 'icd10';
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
    }],
    actions: {
        selectOption(option) {
            this.set('diagnosisDescriptionDisplay', option.value);
        }
    }
});
