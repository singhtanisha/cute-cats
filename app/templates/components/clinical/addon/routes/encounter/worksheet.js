import { isEmpty, isPresent } from '@ember/utils';
import repository from 'clinical/repositories/worksheets';
import AuthenticatedBaseRoute from 'boot/routes/authenticated-base';

export default AuthenticatedBaseRoute.extend({
    model(param) {
        if (isEmpty(param.responsesGuid) || param.responsesGuid === 'new') {
            this.replaceWith('encounter');
            return;
        }
        return repository.loadResponses(param.responsesGuid);
    },

    setupController(controller, model) {
        this._super(controller, model);

        const adSubzone = controller.get('adSubzone');
        const encounterController = this.controllerFor('encounter');
        const encounterDateOfService = encounterController.get('chartNote.dateOfServiceUtc');

        encounterController.set('currentDetailsPaneProperty', 'isEditingWorksheet');
        encounterController.send('scrollToAfterRender', '#dFinalizeEvents');

        controller.set('isDirty', true);
        model.setProperties({
            isSelected: true,
            encounterDateOfService
        });

        if (isPresent(adSubzone)) {
            this.send('refreshAd', {
                subzone: adSubzone
            });
        }
    },

    deactivate() {
        const encounterController = this.controllerFor('encounter');
        if (encounterController.get('currentDetailsPaneProperty') === 'isEditingWorksheet') {
            encounterController.set('currentDetailsPaneProperty', null);
        }
        if (this.get('controller.shouldScrollOnTransition')) {
            this.set('controller.shouldScrollOnTransition', false);
            encounterController.send('scrollToAfterRender', '#dFinalizeEvents');
        }
    },

    serialize(model) {
        return {
            responsesGuid: model.get('responsesGuid') || 'new'
        };
    },

    actions: {
        willTransition(transition) {
            if (this.get('controller.isDirty')) {
                transition.abort();
                this.get('controller').save().then(function() {
                    transition.retry();
                });
            } else {
                this.set('controller.model.isSelected', false);
            }
        },

        closeTab(tab) {
            return this.bubbleAfterSave('closeTab', tab);
        },

        signEncounter() {
            if (this.bubbleAfterSave('signEncounter')) {
                this.replaceWith('encounter');
                return true;
            }
            return false;
        }
    },

    bubbleAfterSave() {
        const actionArgs = arguments;

        if (this.get('controller.isDirty')) {
            this.get('controller').save().then(() => {
                this.send.apply(this, actionArgs);
            });

            return false;
        }

        return true;
    }
});
