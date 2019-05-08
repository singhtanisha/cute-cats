import { resolve } from 'rsvp';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';
import AuthenticatedBaseRoute from 'boot/routes/authenticated-base';

export default AuthenticatedBaseRoute.extend({
    _defaultTransition: () => {},
    templateName: 'social',
    tunnel: service(),

    model(param) {
        const patientPracticeGuid = this.modelFor('patient').get('patientPracticeGuid');
        return this.store.findRecord('social-history', patientPracticeGuid).then(history => {
            history.set('defaultSection', param.section);
            return history;
        }).catch(() => {
            const historyEmpty = this.store.createRecord('social-history', { patientPracticeGuid });
            historyEmpty.set('defaultSection', param.section);
            return historyEmpty;
        });
    },
    setupController(controller, model) {
        this._super(controller, model);
        this.send('refreshAd');
        this.controllerFor(this.get('delegatingController')).setProperties({
            currentDetailsPaneProperty: 'isEditingSocialHistory'
        });
        this.store.findAll('social-history-option').then((result) => {
            controller.set('socialHistoryOptions', result.get('firstObject'));
        });
    },
    deactivate() {
        const controller = this.controllerFor(this.get('delegatingController'));
        if (controller.get('currentDetailsPaneProperty') === 'isEditingSocialHistory') {
            controller.setProperties({
                currentDetailsPaneProperty: null
            });
        }
    },
    save() {
        const socialHistory = this.get('controller.model');
        const delegatingController = this.get('delegatingController');
        if (socialHistory) {
            if (!socialHistory.get('saveDisabled')) {
                return socialHistory.save().then(() => {
                    toastr.success('Social history saved.');
                    this.set('controller.allowRollback', false);
                    if (delegatingController === 'patient/summary') {
                        if (isPresent(socialHistory)) {
                            this.get('tunnel').send('social-history', {
                                genderIdentity: socialHistory.get('genderIdentity'),
                                sexualOrientation: socialHistory.get('sexualOrientation')
                            });
                        }
                    } else {
                        this.controllerFor(delegatingController).send('updateSocialHistory', socialHistory);
                    }
                }).catch((error) => {
                    toastr.error('Could not save social history. Try again later.');
                    throw error;
                });
            }
        }
        return resolve(socialHistory);
    },
    bubbleAfterSave(...args) {
        if (this.get('controller.model.hasDirtyAttributes')) {
            this.save().then(() => this.send(...args));
            return false;
        }
        return true;
    },
    actions: {
        save() {
            this.set('forceSave', true);
            this.transitionTo(this.get('_defaultTransition'));
        },
        delete(demographic) {
            const socialHistory = this.get('controller.model');
            const delegatingController = this.get('delegatingController');
            if (this.get('isDeleting') || !demographic) {
                return;
            }
            if (socialHistory) {
                this.set('isDeleting', true);
                socialHistory.set('demographicToDelete', demographic.name);
                const adapter = this.store.adapterFor('social-history');
                adapter.deleteDemographic(socialHistory, demographic.name).then(() => {
                    toastr.success(`${demographic.description} deleted.`);
                    this.set(`controller.model.${demographic.name}`, null);
                    if (delegatingController === 'patient/summary') {
                        if (isPresent(this.get('controller.model'))) {
                            this.get('tunnel').send('social-history', {
                                genderIdentity: this.get('controller.model.genderIdentity'),
                                sexualOrientation: this.get('controller.model.sexualOrientation')
                            });
                        }
                    } else {
                        this.controllerFor(delegatingController).send('updateSocialHistory', this.get('controller.model'));
                    }
                    this.set('controller.allowRollback', false);
                }, () => {
                    toastr.error(`Could not delete ${demographic.description}. Try again later.`);
                }).finally(() => {
                    this.set('isDeleting', false);
                });
            }
        },
        cancel() {
            this.set('isCancelled', true);
            this.transitionTo(this.get('_defaultTransition'));
        },
        willTransition(transition) {
            const currentRiskScore = this.get('controller.model.riskScore');
            const allowRollback = this.get('controller.allowRollback');
            if (this.get('isDeleting') || this.get('isCancelled')) {
                this.set('isDeleting', false);
                this.set('isCancelled', false);
            } else if (this.get('forceSave')) {
                transition.abort();
                this.set('forceSave', false);
                this.save().then(() => {
                    transition.retry();
                });
                return false;
            }
            if (allowRollback) {
                this.get('controller.model').rollbackAttributes();
            }
            this.set('controller.model.riskScore', currentRiskScore);
            return true;
        }
    }
});
