import { resolve } from 'rsvp';
import { isPresent } from '@ember/utils';
import AuthenticatedBaseRoute from 'boot/routes/authenticated-base';
import { task } from 'ember-concurrency';

export default AuthenticatedBaseRoute.extend({
    _defaultTransition: () => {},
    templateName: 'risk-score',
    model() {
        const patientPracticeGuid = this.modelFor('patient').get('patientPracticeGuid');
        return this.store.findRecord('social-history', patientPracticeGuid).then(history => {
            if (!history.get('riskScore')) {
                history.set('riskScore', { dateAssigned: moment().format('MM/DD/YYYY') });
            }
            return history;
        }).catch(() => {
            const historyEmpty = this.store.createRecord('social-history', { riskScore: { dateAssigned: moment().format('MM/DD/YYYY') }, patientPracticeGuid });
            return historyEmpty;
        });
    },
    setupController(controller, model) {
        this._super(controller, model);
        this.send('refreshAd');
        if (this.get('delegatingController') === 'patient/summary') {
            this.controllerFor('patient/summary').set('selectedItem', model.get('riskScore.optionGuid'));
        } else {
            this.controllerFor(this.get('delegatingController')).set('currentDetailsPaneProperty', 'isEditingPatientRiskScore');
        }
        this.store.findAll('social-history-option').then((result) => {
            controller.set('socialHistoryOptions', result.get('firstObject'));
        });
        this.setPersistedRiskScore(model.get('riskScore'));
    },
    setPersistedRiskScore(patientRiskScore) {
        this.set('controller.persistedRiskScore', {
            optionGuid: patientRiskScore.optionGuid,
            dateAssigned: patientRiskScore.dateAssigned,
            riskScore: patientRiskScore.riskScore
        });
    },
    deactivate() {
        const controller = this.controllerFor(this.get('delegatingController'));
        if (controller.get('currentDetailsPaneProperty') === 'isEditingPatientRiskScore') {
            controller.setProperties({
                currentDetailsPaneProperty: null
            });
        }
    },
    save() {
        const patientRiskScore = this.get('controller.model');

        if (patientRiskScore) {
            if (!patientRiskScore.get('saveDisabled')) {
                return patientRiskScore.save().then((payload) => {
                    this.set('controller.model.isDirty', false);
                    toastr.success('Patient risk score saved.');
                    const returnedScore = payload.get('riskScore');
                    const matchingTypeOption = this.get('controller.socialHistoryOptions.riskScoreOptions').findBy('optionGuid', returnedScore.optionGuid);
                    this.setPersistedRiskScore(returnedScore);
                    if (matchingTypeOption) {
                        returnedScore.description = isPresent(matchingTypeOption) ? matchingTypeOption.get('description') : '';
                    }
                }).catch((error) => {
                    toastr.error('Could not save patient risk score. Try again later.');
                    throw error;
                });
            }
        }
        return resolve(patientRiskScore);
    },
    isDirty() {
        const persistedRiskScore = this.get('controller.persistedRiskScore');
        const riskScore = this.get('controller.model.riskScore');
        if (persistedRiskScore.optionGuid && persistedRiskScore.riskScore) {
            return !(persistedRiskScore.optionGuid === riskScore.optionGuid && persistedRiskScore.dateAssigned === riskScore.dateAssigned && persistedRiskScore.riskScore === riskScore.riskScore);
        }
        return false;
    },
    bubbleAfterSave(...args) {
        if (this.isDirty()) {
            this.save().then(() => this.send(...args));
            return false;
        }
        return true;
    },
    deleteRiskScore: task(function* () {
        const patientRiskScore = this.get('controller.model');

        if (patientRiskScore) {
            try {
                yield this.store.adapterFor('social-history').deleteDemographic(patientRiskScore, 'riskScore');
                toastr.success('Patient risk score deleted.');
                this.set('controller.model.riskScore', null);
                this.transitionTo(this.get('_defaultTransition'));
            } catch (err) {
                toastr.error('Could not delete patient risk score. Try again later.');
            }
        }
    }).drop(),

    actions: {
        save() {
            this.set('forceSave', true);
            this.transitionTo(this.get('_defaultTransition'));
        },
        delete() {
            this.get('deleteRiskScore').perform();
        },
        cancel() {
            this.get('controller.model').rollbackAttributes();
            this.set('isCancelled', true);
            this.transitionTo(this.get('_defaultTransition'));
        },
        willTransition(transition) {
            if (this.get('deleteRiskScore.isRunning') || this.get('isCancelled')) {
                this.set('isCancelled', false);
            } else if (this.get('forceSave')) {
                transition.abort();
                this.set('forceSave', false);
                this.save().then(() => {
                    transition.retry();
                });
                return false;
            }
            return true;
        }
    }
});
