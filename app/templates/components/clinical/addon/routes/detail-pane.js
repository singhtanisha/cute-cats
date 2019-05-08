import AuthenticatedBaseRoute from 'boot/routes/authenticated-base';

export default AuthenticatedBaseRoute.extend({
    bubbleAfterSave() {
        if (this.get('controller.isDirty')) {
            this.set('controller.closing', true);
            this.set('attemptedAction', arguments);
            return false;
        }
        return true;
    },
    getDefaultTransitionArgs() {
        const controller = this.controllerFor(this.get('delegatingController'));
        const args = [this.get('_defaultTransition')];
        if (controller) {
            const patientGuid = controller.get('patientGuid');
            args.pushObject(patientGuid);
            args.compact();
        }
        return args;
    },
    actions: {
        // The next 3 actions work together. If we have pending changes abort the transition
        // then resume it when the detail pane calls close.
        willTransition(transition) {
            if (this.get('controller.isDirty')) {
                transition.abort();
                this.set('controller.closing', true);
                this.set('attemptedTransition', transition);
            } else {
                return true;
            }
        },
        // If the item is dirty, we prevent closing the tab,
        // try to save and then close the tab
        closeTab(tab) {
            return this.bubbleAfterSave('closeTab', tab);
        },
        close() {
            const { attemptedAction, attemptedTransition } = this.getProperties('attemptedAction', 'attemptedTransition');
            if (attemptedAction) {
                this.set('attemptedAction', undefined);
                this.send(...attemptedAction);
            } else if (attemptedTransition) {
                this.set('attemptedTransition', undefined);
                attemptedTransition.retry();
            } else {
                this.transitionTo(...this.getDefaultTransitionArgs());
            }
        },
        updateDirty(isDirty) {
            this.set('controller.isDirty', isDirty);
        }
    },
    _defaultTransition: () => {}
});
