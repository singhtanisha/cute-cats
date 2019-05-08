import { alias, or } from '@ember/object/computed';
import Model from 'ember-data/model';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
    patientPracticeGuid: alias('id'),
    education: belongsTo('social-health-field', { async: false }),
    financialResourceStatus: belongsTo('social-health-field', { async: false }),
    genderIdentity: belongsTo('social-health-field', { async: false }),
    sexualOrientation: belongsTo('social-health-field', { async: false }),
    socialHistory: belongsTo('social-health-field', { async: false }),

    hasDirtyFields: or('education.hasDirtyAttributes', 'financialResourceStatus.hasDirtyAttributes', 'genderIdentity.hasDirtyAttributes', 'sexualOrientation.hasDirtyAttributes', 'socialHistory.hasDirtyAttributes'),

    undoChanges() {
        this.eachRelationship((fieldName) => {
            this.get(fieldName).rollbackAttributes();
        });
        this.rollbackAttributes();
    }
});
