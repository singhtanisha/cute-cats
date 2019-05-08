import Mixin from '@ember/object/mixin';
export default Mixin.create({
    delegatingController: 'patient/summary',
    _defaultTransition: 'patient.summary',
    actions: {
        validateNewEncounter() {
            return this.bubbleAfterSave('validateNewEncounter');
        }
    }
});
