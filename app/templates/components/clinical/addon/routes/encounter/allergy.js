import AllergyRoute from 'clinical/routes/allergy';
import EncounterRoute from 'clinical/mixins/encounter-route';

export default AllergyRoute.extend(EncounterRoute, {
    setupController(controller, model) {
        this.controllerFor(this.get('delegatingController')).setProperties({
            selectedAllergy: model,
            currentDetailsPaneProperty: 'isEditingAllergy'
        });
        this._super(controller, model);
    },
    deactivate() {
        const controller = this.controllerFor(this.get('delegatingController'));
        controller.set('selectedAllergy', null);
        controller.send('closeAllergyPane');
        this._super();
    }
});
