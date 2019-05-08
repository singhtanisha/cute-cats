import { computed } from '@ember/object';
import { inject as controller } from '@ember/controller';
import AllergyController from 'clinical/controllers/allergy';

export default AllergyController.extend({
    // TODO: Remove after standardizing card contract
    summary: controller('patient.summary'),
    allergies: computed('summary.allergies', function () {
        return this.get('summary.allergies');
    })
});
