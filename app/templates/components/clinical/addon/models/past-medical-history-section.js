import { isPresent } from '@ember/utils';
import EmberObject, { computed } from '@ember/object';
import config from 'boot/config';

const PastMedicalHistorySection = EmberObject.extend({
    pmh: null,
    key: null,
    title: null,
    structuredInstructions: null,
    structuredRoute: null,
    structuredAction: null,
    isFreeTextDisabled: false,
    value: computed({
        get() {
            const key = this.get('key');
            return this.get(`pmh.${key}`);
        },
        set(property, value) {
            const key = this.get('key');
            this.set(`pmh.${key}`, value);
            return value;
        }
    }),
    placeholder: computed('title', function () {
        const title = this.get('title');
        return title ? 'Enter ' + title.toLowerCase() : 'Enter text';
    }),
    isInSummaryV2: false,
    isInSocialAndBehavioralHealth: false
});
PastMedicalHistorySection.definitions = [
    { key: 'events', title: 'Major events', isInSummaryV2: true },
    { key: 'ongoingMedicalProblems', title: 'Ongoing medical problems', isInSummaryV2: true },
    {
        key: 'allergies',
        title: 'Allergies',
        structuredInstructions: 'Use structured allergies to receive interaction alerts',
        showStructuredWarningInSummary: true,
        structuredAction: 'createAllergy',
        isFreeTextDisabled: true,
        isInSummaryV2: true
    },
    {
        key: 'familyHealthHistory',
        title: 'Family health history',
        structuredInstructions: 'Use structured family health history',
        structuredRoute: 'patient.familyhistory'
    },
    { key: 'preventativeCare', title: 'Preventive care', isInSummaryV2: true },
    { key: 'socialHistory', title: 'Social history', isInSummaryV2: true, isInSocialAndBehavioralHealth: true },
    { key: 'nutritionHistory', title: 'Nutrition history', isInSummaryV2: true, isInSocialAndBehavioralHealth: true },
    { key: 'developmentalHistory', title: 'Developmental history', isInSummaryV2: true }
];
PastMedicalHistorySection.reopenClass({
    createSections(pmh) {
        let definitions = PastMedicalHistorySection.definitions;

        return definitions.map((definition) => {
            const isFreeTextDisabled = isPresent(definition.isFreeTextDisabled) ? definition.isFreeTextDisabled : false;

            return PastMedicalHistorySection.create({
                key: definition.key,
                title: definition.title,
                structuredInstructions: definition.structuredInstructions,
                structuredRoute: definition.structuredRoute,
                structuredAction: definition.structuredAction,
                showStructuredWarningInSummary: definition.showStructuredWarningInSummary,
                pmh,
                isFreeTextDisabled,
                isInSummaryV2: definition.isInSummaryV2,
                isInSocialAndBehavioralHealth: definition.isInSocialAndBehavioralHealth
            });
        });
    }
});
export default PastMedicalHistorySection;
