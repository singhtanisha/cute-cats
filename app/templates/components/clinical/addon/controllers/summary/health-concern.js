import { computed } from '@ember/object';
import { inject as controller } from '@ember/controller';
import HealthConcernController from 'clinical/controllers/health-concern';

export default HealthConcernController.extend({
    // TODO: Remove after standardizing card contract
    summary: controller('patient.summary'),
    healthConcerns: computed('summary.healthConcerns', function () {
        return this.get('summary.healthConcerns');
    })
});
