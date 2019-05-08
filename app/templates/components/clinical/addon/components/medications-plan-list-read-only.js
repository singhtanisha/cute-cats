import { sort } from '@ember/object/computed';
import { computed } from '@ember/object';
import Component from '@ember/component';
import WithMedications from 'clinical/mixins/with-medications';

export default Component.extend(WithMedications, {
    // attrs:
    isSigned: undefined,
    chartNoteMedications: undefined,
    oneline: true,
    firstCommentOneLine: true,
    // NOTE: this flag is meant for the consumer to set it at the component level. It won't override the feature bit configuration.
    // Today is overriden by print to make sure we don't print those warnings there.
    showWarningOnDuplicateMedications: true,

    medicationsSortProperty: computed(() => ['fullGenericName:asc']),
    sortedMedications: sort('encounterMedications.inEncounter', 'medicationsSortProperty'),

    displayChartNoteMedications: computed('isSigned', function () {
        // for sign chartnotes we always show meds from the ChartNote
        return this.get('isSigned');
    })
});
