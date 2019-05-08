import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import AuthenticatedBaseRoute from 'boot/routes/authenticated-base';

export default AuthenticatedBaseRoute.extend({
    templateName: 'goal',

    tunnel: service(),

    model(params) {
        const patientPracticeGuid = this.modelFor('patient').get('patientPracticeGuid');
        const patientGoalGuid = params.patientGoalGuid;
        if (patientGoalGuid && patientGoalGuid !== 'new') {
            return this.store.query('patient-goal', { patientPracticeGuid }).then(goals => goals.findBy('id', patientGoalGuid ));
        } else {
            return this.get('store').createRecord('patient-goal', {
                effectiveDate: moment().format('MM/DD/YYYY'),
                patientPracticeGuid: patientPracticeGuid,
                isActive: true,
                description: null
            });
        }
    },
    deactivate() {
        this.get('tunnel').send('goals-section-refresh');
    },
    rollback() {
        const store = this.get('store');
        const goal = this.get('controller.model');
        if (goal) {
            if (goal.get('isNew')) {
                store.unloadRecord(goal);
            } else {
                goal.rollbackAttributes();
            }
        }
    },
    save() {
        return this.get('controller').validGoal().then((isValid) => {
            if (isValid) {
                const goal = this.get('controller.model');
                return goal.save().then(() => {
                    return isValid;
                }).catch(() => {
                    toastr.error('Could not save goal. Try again later.');
                    return false;
                });
            }
        });
    },
    addAnotherGoal() {
        const store = this.get('store');

        this.set('controller.model', store.createRecord('patient-goal', {
            effectiveDate: moment().format('MM/DD/YYYY'),
            patientPracticeGuid: this.modelFor('patient').get('patientPracticeGuid'),
            isActive: true,
            description: null
        }));
    },
    delete() {
        const goal = this.get('controller.model');
        
        // TODO: Remove after standardizing card contract
        const summaryController = this.controllerFor('patient/summary');
        goal.deleteRecord();
        return goal.save().then(() => {
            toastr.success('Goal was successfully deleted.');
            const goals = summaryController.get('goals');
            if (goals) {
                goals.removeObject(goal);
            }
            this.transitionTo('patient.summary');
        }).catch(() => {
            toastr.error('Could not delete goal. Try again later.');
        });
    },
    bubbleAfterSave(...args) {
        if (this.isDirty()) {
            this.save().then(() => this.send(...args));
            return false;
        }
        return true;
    },
    isDirty() {
        const model = this.get('controller.model');
        return model && model.get('hasDirtyAttributes') && isPresent(model.get('description'));
    },
    actions: {
        willTransition(transition) {
            if (this.isDirty()) {
                transition.abort();
                this.save().then((saved) => {
                    if (saved) {
                        transition.retry();
                    }
                });
            }
        },
        cancel() {
            this.rollback();
            this.transitionTo('patient.summary');
        },
        save(shouldAddAnother) {
            this.save().then((saved) => {
                if (saved) {
                    if (shouldAddAnother) {
                        toastr.success('Goal added. You can add another.');
                        this.addAnotherGoal();
                    } else {
                        this.transitionTo('patient.summary');
                    }
                }
            });
        },
        delete() {
            this.delete().then(() => {
                this.transitionTo('patient.summary');
            });
        }
    }
});
