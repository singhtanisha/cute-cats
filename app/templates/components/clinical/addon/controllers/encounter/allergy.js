import { alias } from '@ember/object/computed';
import { inject as controller } from '@ember/controller';
import AllergyController from 'clinical/controllers/allergy';

export default AllergyController.extend({
    encounter: controller(),
    allergies: alias('encounter.allergies')
});
