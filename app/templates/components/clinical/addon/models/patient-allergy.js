import { isEmpty } from '@ember/utils';
import { computed, getProperties } from '@ember/object';
import { alias } from '@ember/object/computed';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

const SEVERITY_SORT_MAP = {
    Severe: 0,
    Moderate: 1,
    Mild: 2,
    'Very Mild': 3
};

export default Model.extend({
    patientAllergyGuid: alias('id'),
    allergyGuid: alias('id'),
    patientPracticeGuid: attr('string'),
    allergySeverityTitle: attr('string'),
    allergenSubstanceType: attr('string'),
    onsetDate: attr('string'),
    onsetType: attr('string'),
    comments: attr('string'),
    isActive: attr('boolean'),
    drugInteractionAlert: attr('boolean'),
    allergyReactions: attr('array'),
    substance: attr('object'),
    medication: attr('object'),
    class: attr('object'),
    isCustom: alias('substance.isCustom'),
    allergySeverity: alias('allergySeverityTitle'),
    severityText: alias('allergySeverityTitle'),
    severityClass: computed('allergySeverityTitle', function () {
        const severity = this.get('allergySeverityTitle');

        switch (severity) {
            case 'Severe':
                return 'icon-color-error';
            case 'Moderate':
                return 'icon-color-warning';
            default:
                return 'icon-color-mild';
        }
    }),
    severitySortOrder: computed('allergySeverityTitle', function () {
        return SEVERITY_SORT_MAP[this.get('allergySeverityTitle')];
    }),
    allergenText: computed('medication.name', 'substance.title', 'class.title', function () {
        return this.get('medication.name') || this.get('substance.title') || this.get('class.title');
    }),
    reactionsText: computed('allergyReactions.[]', function () {
        return this.get('allergyReactions').mapBy('title').join(', ');
    }),
    onsetText: computed('onsetDate', 'onsetType', function () {
        const { onsetType, onsetDate } = this.getProperties('onsetType', 'onsetDate');
        if (!isEmpty(onsetType)) {
            return onsetType;
        }
        return onsetDate ? moment.utc(onsetDate).format('MM/DD/YYYY') : '-';
    }),
    type: computed('allergenSubstanceType', 'substance.groupTitle', function () {
        const allergenSubstanceType = this.get('allergenSubstanceType');
        if (allergenSubstanceType === 'Medication' || allergenSubstanceType === 'Class') {
            return 'drug';
        }
        const groupTitle = this.get('substance.groupTitle') || '';
        return groupTitle.toLowerCase();
    }),
    setDrugAllergen(allergen) {
        const allergenType = allergen.get('allergenType');
        if (allergenType === 'Class') {
            this.setProperties({
                allergenSubstanceType: 'Class',
                class: {
                    title: allergen.get('name'),
                    isIngredient: allergen.get('isIngredient'),
                    rxNormCui: allergen.get('rxNormCui')
                },
                medication: undefined,
                substance: undefined
            });
        } else {
            this.setProperties({
                allergenSubstanceType: 'Medication',
                class: undefined,
                medication: allergen.getProperties('name', 'ndc', 'rxNormCui', 'rollupRxNormCui'),
                substance: undefined
            });
        }
    },
    setSubstance(substance) {
        this.setProperties({
            allergenSubstanceType: 'Substance',
            class: undefined,
            medication: undefined,
            substance: getProperties(substance, 'title', 'groupTitle', 'isCustom')
        });
    }
});
