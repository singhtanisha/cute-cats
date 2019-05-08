import { next } from '@ember/runloop';
import { hash } from 'rsvp';
import EmberObject from '@ember/object';
import AuthenticatedBaseRoute from 'boot/routes/authenticated-base';
import AuthorizedSettingsRoute from 'settings/mixins/authorized-settings-route';
import favoriteDiagnosesSettings from 'clinical/models/favorite-diagnoses-settings';

const tab = EmberObject.create({
    route: 'settings.favoriteDiagnoses',
    label: 'Diagnoses list',
    dismissible: true
});

export default AuthenticatedBaseRoute.extend(AuthorizedSettingsRoute, {
    model() {
        return hash({
            favoriteDiagnoses: this.store.findAll('favoriteDiagnosis').catch(() => ({ error: true })),
            sortOrder: favoriteDiagnosesSettings.getSortOrder(this.store)
        });
    },

    setupController(controller, model) {
        if (model.favoriteDiagnoses.error) {
            controller.setProperties({
                error: true,
                model: [],
                sortOrder: model.sortOrder.preference
            });
        } else {
            const { sortAscending, property } = model.sortOrder;
            const sortProperties = [sortAscending ? property : `${property}:desc`];
            controller.setProperties({
                error: false,
                model: model.favoriteDiagnoses,
                sortOrder: model.sortOrder.preference,
                sortProperties,
                sortAscending
            });
        }

        this.send('openTab', tab);
    },

    actions: {
        addFavoriteDiagnosis(diagnosis) {
            const newRecord = this.store.createRecord('favoriteDiagnosis', {
                name: diagnosis.get('name'),
                code: diagnosis.get('code'),
                diagnosisCodes: diagnosis.get('diagnosisCodes')
            });

            next(newRecord, 'save');
        },

        removeDiagnosis(favoriteDiagnosis) {
            if (favoriteDiagnosis && !favoriteDiagnosis.get('isDeleted')) {
                favoriteDiagnosis.destroyRecord();
            }
        },

        retryAfterError() {
            this.refresh();
        }
    }
});
