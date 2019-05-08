import MedicationRoute from 'clinical/routes/medication';
import EncounterRoute from 'clinical/mixins/encounter-route';

export default MedicationRoute.extend(EncounterRoute, {
    // hooks
    afterModel(resolvedModel) {

        //Because the model hook of the MedicationRoute sets medicationGuid to null if it is a new record
        resolvedModel.isAddingNewMedicationFromEncounter = !resolvedModel.medicationGuid;

        return resolvedModel;
    },

    activate() {
        this._super.apply(this, arguments);
        this.controllerFor(this.get('delegatingController')).set('isCollapsed', true);
    },
    deactivate() {
        this._super.apply(this, arguments);
        this.controllerFor(this.get('delegatingController')).set('isCollapsed', false);
    },

    _diagnosisRouteName: 'encounter.diagnosis',

    actions: {
        createOrder(medicationGuid, quantity, unit, daysSupply) {
            this.set('didTransitionToOrder', true);
            this.controllerFor(this.get('delegatingController')).send('createOrder', medicationGuid, this.get('isRecordedFromPlan'), quantity, unit, daysSupply);
        }
    }
});
