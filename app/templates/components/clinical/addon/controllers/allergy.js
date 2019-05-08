
import Controller from '@ember/controller';
export default Controller.extend({
    queryParams: ['allergenQuery'],
    actions: {
        allergyDeleted(allergy) {
            this.send('removeHealthConcern', allergy.get('allergyGuid'));
            const allergies = this.get('allergies');
            if (allergies) {
                allergies.removeObject(allergy);
            }
        },
        allergyAdded(allergy) {
            const allergies = this.get('allergies');
            if (allergies) {
                allergies.pushObject(allergy);
            }
        },
        reloadAllergies() {
            this.send('reloadCardAllergies');
        }
    }
});
