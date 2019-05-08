import EmberObject from '@ember/object';
import { isEmpty } from '@ember/utils';
import DetailPaneRoute from 'clinical/routes/detail-pane';

export default DetailPaneRoute.extend({
    templateName: 'allergy',
    model(param) {
        const { allergyGuid } = param;
        if (isEmpty(allergyGuid) || allergyGuid === 'new') {
            return null;
        }
        const patientPracticeGuid = this.modelFor('patient').get('patientPracticeGuid');
        const store = this.get('store');
        const allergy = store.peekRecord('patient-allergy', allergyGuid);
        if (allergy) {
            if (allergy.get('patientPracticeGuid') !== patientPracticeGuid) {
                throw 'Allergy does not belong to the patient';
            }
            return allergy;
        }
        return store.query('patient-allergy', { patientPracticeGuid }).then(allergies => allergies.findBy('patientAllergyGuid', allergyGuid));
    },
    setupController(controller, allergy) {
        const patientPracticeGuid = this.modelFor('patient').get('patientPracticeGuid');
        const model = EmberObject.create({
            allergy,
            patientPracticeGuid
        });
        this.send('refreshAd', { subzone: 'allergies' });
        this._super(controller, model);
    },
    deactivate() {
        this.send('refreshAd', { reloadAdContext: true });
    },
    actions: {
        reloadCardAllergies() {
            if (this.get('routeName') === 'summary.allergy') {
                this.get('tunnel').send('allergies-list', { reloadFromCache: true });
            }
        }
    }
});
