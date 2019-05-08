import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
    patientPracticeGuid: alias('id'),
    alcoholUse: attr(),
    tobaccoUse: attr(),
    physicalActivity: attr(),
    nutritionHistory: attr(),
    stress: attr(),
    socialIsolation: attr(),
    exposureToViolence: attr(),
    worksheetResponsesGuids: computed('alcoholUse', 'physicalActivity', 'stress', 'socialIsolation', 'exposureToViolence', function() {
        return {
            alcoholUseWorksheet: this.get('alcoholUse.content') ? this.get('alcoholUse.content.worksheetResponseGuid') : null,
            physicalActivityWorksheet: this.get('physicalActivity.content') ? this.get('physicalActivity.content.worksheetResponseGuid') : null,
            stressWorksheet: this.get('stress.content') ? this.get('stress.content.worksheetResponseGuid') : null,
            socialIsolationWorksheet: this.get('socialIsolation.content') ? this.get('socialIsolation.content.worksheetResponseGuid') : null,
            exposureToViolenceWorksheet: this.get('exposureToViolence.content') ? this.get('exposureToViolence.content.worksheetResponseGuid') : null,
        };
    }),
});
