import Mixin from '@ember/object/mixin';
export default Mixin.create({
    delegatingController: 'encounter',
    _defaultTransition: 'encounter',
    getDefaultTransitionArgs() {
        const controller = this.controllerFor(this.get('delegatingController'));
        const args = [this.get('_defaultTransition')];
        if (controller) {
            const { patientGuid, transcriptGuid } = controller.getProperties('patientGuid', 'transcriptGuid');
            args.pushObjects([patientGuid, transcriptGuid]);
            args.compact();
        }
        return args;
    },
    actions: {
        saveEncounter() {
            return this.bubbleAfterSave('saveEncounter');
        },
        signEncounter() {
            if (this.bubbleAfterSave('signEncounter')) {
                this.replaceWith(...this.getDefaultTransitionArgs());
                return true;
            }
            return false;
        },
        refreshChartWithoutSave() {
            this.replaceWith(...this.getDefaultTransitionArgs());
            this.send('refreshChart');
        }
    }
});
