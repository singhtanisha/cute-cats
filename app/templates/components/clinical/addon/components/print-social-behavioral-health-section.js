import { isPresent } from '@ember/utils';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import Component from '@ember/component';
export default Component.extend({
    classNames: ['print-section'],
    includeHeaderAndFooter: true,
    title: computed('patient.fullName', function() {
        return 'Behavioral health for ' + this.get('patient.fullName');
    }),
    alcoholUseWorksheet: alias('content.alcoholUseWorksheet'),
    tobaccoUse: alias('content.tobaccoUse'),
    physicalActivityWorksheet: alias('content.physicalActivityWorksheet'),
    nutritionHistory: alias('content.nutritionHistory'),
    stressWorksheet: alias('content.stressWorksheet'),
    socialIsolationWorksheet: alias('content.socialIsolationWorksheet'),
    exposureToViolenceWorksheet: alias('content.exposureToViolenceWorksheet'),
    socialHealth: alias('content.socialHealth'),
    tobaccoUsePastEntries: computed('tobaccoUse.[]', function() {
        if (isPresent(this.get('tobaccoUse'))) {
            return this.get('tobaccoUse.content').slice(1);
        }
        return [];
    })
});
