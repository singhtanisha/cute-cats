import { resolve } from 'rsvp';
import { inject as service } from '@ember/service';
import AuthenticatedBaseRoute from 'boot/routes/authenticated-base';

export default AuthenticatedBaseRoute.extend({
    templateName: 'advance-directive',
    tunnel: service(),
    model(param) {
        const patientPracticeGuid = this.modelFor('patient').get('patientPracticeGuid');
        if (param.id && param.id !== 'new') {
            return this.store.query('advanced-directive', { patientPracticeGuid })
                .then(ads => ads.findBy('id', param.id));
        }
        return this.store.createRecord('advanced-directive', {
            dateOfService: moment().startOf('day').toDate(),
            patientPracticeGuid
        });
    },
    serialize(model) {
        const id = model && !model.get('isNew') ? model.get('id') : 'new';
        return { id };
    },
    setupController(controller, model) {
        this._super(controller, model);
        this.send('refreshAd');
    },
    save() {
        const advanceDirective = this.get('controller.model');
        if (advanceDirective) {
            if (advanceDirective.get('saveDisabled')) {
                this.rollback();
            } else {
                const isNew = advanceDirective.get('isNew');
                return advanceDirective.save().then(() => {
                    if (isNew) {
                        this.get('tunnel').send('advance-directive', { refresh: true });
                    }
                }).catch(error => {
                    toastr.error('Could not save advance directive. Try again later.');
                    throw error;
                });
            }
        }
        return resolve(advanceDirective);
    },
    rollback() {
        const advanceDirective = this.get('controller.model');
        if (advanceDirective) {
            if (advanceDirective.get('isNew')) {
                // Delete the record that was created when we opened the details pane.
                this.get('store').unloadRecord(advanceDirective);
                this.set('isDeleting', true);
            } else {
                advanceDirective.rollbackAttributes();
            }
        }
    },
    actions: {
        save() {
            this.transitionTo('patient.summary');
        },
        delete() {
            const advanceDirective = this.get('controller.model');
            if (this.get('isDeleting')) {
                return;
            }
            this.set('isDeleting', true);
            if (advanceDirective) {
                advanceDirective.deleteRecord();
                advanceDirective.save().then(() => {
                    toastr.success('Advance directive deleted.');
                    this.get('tunnel').send('advance-directive', { refresh: true });
                    this.transitionTo('patient.summary');
                }, () => toastr.error('Could not delete advance directive. Try again later.'));
            } else {
                this.transitionTo('patient.summary');
            }
        },
        cancel() {
            this.rollback();
            this.transitionTo('patient.summary');
        },
        willTransition(transition) {
            if (this.get('isDeleting')) {
                this.set('isDeleting', false);
            } else if (this.get('controller.model.hasDirtyAttributes')) {
                transition.abort();
                this.save().then(() => transition.retry());
                return false;
            }
            return true;
        },
        closeTab(tab) {
            if (this.get('controller.model.hasDirtyAttributes')) {
                this.save().then(() => this.send('closeTab', tab));
                return false;
            }
            // bubble action so this is handled by Navigation
            return true;
        }
    }
});
