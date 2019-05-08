import { resolve } from 'rsvp';
import AuthenticatedBaseRoute from 'boot/routes/authenticated-base';

export default AuthenticatedBaseRoute.extend({
    templateName: 'health-concern',
    model(params) {
        const patientPracticeGuid = this.modelFor('patient').get('patientPracticeGuid');
        const { patientHealthConcernGuid } = params;
        const store = this.get('store');
        if (patientHealthConcernGuid && patientHealthConcernGuid !== 'new') {
            return store.query('patient-health-concern', { patientPracticeGuid }).then(healthConcerns => healthConcerns.findBy('id', patientHealthConcernGuid));
        }
        return this.createNewHealthConcern();
    },
    setupController(controller, model) {
        this._super(controller, model);
        controller.set('errors', {});
    },
    save() {
        const model = this.get('controller.model');
        if (!model || !this.isDirty()) {
            return resolve(false);
        }
        const isNew = model.get('isNew');
        return this.get('controller').validate().then(() => model.save().then(healthConcern => {
            if (isNew) {
                const controller = this.controllerFor(this.get('delegatingController'));
                const healthConcerns = controller.get('healthConcerns');
                const adapter = this.get('store').adapterFor('patient-health-concern');
                adapter.clearNoKnownValue(model.get('patientPracticeGuid'));
                if (healthConcerns) {
                    healthConcerns.pushObject(healthConcern);
                    controller.set('noKnownHealthConcerns', false);
                }
            }
            return true;
        })).catch(e => {
            toastr.error('Failed to save health concern');
            throw e;
        });
    },
    bubbleAfterSave(...args) {
        if (this.isDirty()) {
            this.save().then(() => this.send(...args));
            return false;
        }
        return true;
    },
    createNewHealthConcern() {
        const patientPracticeGuid = this.modelFor('patient').get('patientPracticeGuid');
        return this.get('store').createRecord('patient-health-concern', {
            effectiveDate: moment().format('MM/DD/YYYY'),
            isActive: true,
            patientPracticeGuid
        });
    },
    isDirty() {
        const model = this.get('controller.model');
        return model && model.get('hasDirtyAttributes') && model.get('healthConcernReferenceGuid');
    },
    actions: {
        willTransition(transition) {
            if (this.isDirty()) {
                transition.abort();
                this.save().then(() => transition.retry());
            }
        },
        saveHealthConcern(addAnother) {
            this.save().then(saveOccurred => {
                if (addAnother) {
                    toastr.success('Health concern saved. You can add another.');
                    this.set('controller.model', this.createNewHealthConcern());
                } else {
                    if (saveOccurred) {
                        toastr.success('Health concern saved.');
                    }
                    this.transitionTo(this.get('_defaultTransition'));
                }
            });
        },
        cancelHealthConcern() {
            const model = this.get('controller.model');
            if (model.get('isNew')) {
                this.get('store').unloadRecord(model);
            } else {
                model.rollbackAttributes();
            }
            this.transitionTo(this.get('_defaultTransition'));
        },
        deleteHealthConcern() {
            const model = this.get('controller.model');
            if (model.get('isNew')) {
                this.get('store').unloadRecord(model);
                this.transitionTo(this.get('_defaultTransition'));
            } else {
                model.destroyRecord().then(() => {
                    const healthConcerns = this.controllerFor(this.get('delegatingController')).get('healthConcerns');
                    if (healthConcerns) {
                        healthConcerns.removeObject(model);
                    }
                    toastr.success('Health concern was successfully deleted');
                    this.transitionTo(this.get('_defaultTransition'));
                }).catch(() => toastr.error('Failed to delete health concern'));
            }
        }
    }
});
