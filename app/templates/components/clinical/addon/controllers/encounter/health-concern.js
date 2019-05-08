import { alias } from '@ember/object/computed';
import { inject as controller } from '@ember/controller';
import HealthConcernController from 'clinical/controllers/health-concern';

export default HealthConcernController.extend({
    encounter: controller(),
    healthConcerns: alias('encounter.healthConcerns')
});
