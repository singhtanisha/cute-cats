import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import { alias, equal } from '@ember/object/computed';
import Component from '@ember/component';
import Medication from 'clinical/models/medication';

export default Component.extend({
    drug: null,
    drugIndex: null,
    interaction: null,
    interactionIndex: null,
    showMore: false,
    allergiesInvolved: alias('interaction.allergiesInvolved'),
    firstAllergy: alias('interaction.allergiesInvolved.firstObject'),
    isDrug: equal('type', 'Drug'),
    type: alias('interaction.interactionType'),

    drugOrAllergenText: computed('isDrug', 'firstAllergy', function() {
        if (this.get('isDrug')) {
            return Medication.wrap(this.get('drug')).get('genericAndTradeName');
        }
        var name = this.get('firstAllergy.allergen.name');
        return isEmpty(name) ? this.get('firstAllergy.allergen.allergySubstance.title') : name;
    }),

    inteactionTypeText: computed('interaction.interactionType', function() {
        return this.get('interaction.interactionType') === 'Drug' ? 'Interaction': this.get('interaction.interactionType');
    }),

    severityClassName: computed('type', 'firstAllergy', function() {
        return this.getCssClassNameBySeverity(this.getSeverity());
    }),

    severityText: computed('type', 'firstAllergy', function() {
        return this.getTitleBySeverity(this.getSeverity());
    }),

    getSeverity() {
        return this.get('isDrug') ?
            (this.get('interaction.severity') || ''):
            (this.get('firstAllergy.allergySeverity.title') || '');
    },

    getCssClassNameBySeverity(severity) {
        var classMapping = {
            'major': 'severitySevere',
            'severe': 'severitySevere',
            'duplicatetherapy': 'severitySevere',
            'moderate': 'severityModerate',
            'very mild': 'severityMild',
            'mild': 'severityMild',
            'minor': 'severityMild',
            'unknown': 'severityUnknown'
        };
        return classMapping[severity.toLowerCase()];
    },

    getTitleBySeverity(severity) {
        var nameMapping = {
            'major': 'Severe',
            'severe': 'Severe',
            'duplicatetherapy': 'Severe',
            'moderate': 'Moderate',
            'very mild': 'Very Mild',
            'mild': 'Mild',
            'minor': 'Mild',
            'unknown': 'Unknown'
        };
        return nameMapping[severity.toLowerCase()];
    },

    actions: {
        toggleShowSummary() {
            this.toggleProperty('showSummary');
        },

        toggleShowDetail() {
            this.toggleProperty('showDetail');
        }
    }
});
