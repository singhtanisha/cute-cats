import { resolve } from 'rsvp';
import { isPresent } from '@ember/utils';
import { not } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import AuthenticatedBaseRoute from 'boot/routes/authenticated-base';
import SmokingStatusType from 'clinical/models/smoking-status-type';

export default AuthenticatedBaseRoute.extend({
    _defaultTransition: () => {},
    templateName: 'smoking',
    tunnel: service(),
    authorization: service('authorization'),
    isAllowedToEdit: computed('authorization.entitledFeatures.[]', function () {
        return this.get('authorization').isEntitledFor('Chart.SocialHistory.Edit');
    }),
    isNotAllowedToEdit: not('isAllowedToEdit'),
    model(param) {
        const patientPracticeGuid = this.modelFor('patient').get('patientPracticeGuid');
        if (param.id && param.id !== 'new') {
            return this.store.query('smoking-status', { patientPracticeGuid }).then(statuses => statuses.findBy('id', param.id));
        }
        return this.get('store').createRecord('smoking-status', {
            effectiveDate: moment(moment().format('MM/DD/YYYY')).toDate(),
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
        this.controllerFor(this.get('delegatingController')).setProperties({
            currentDetailsPaneProperty: 'isEditingSmokingStatus'
        });
        this.get('tunnel').send('update-editing-social-history', {
            isEditing: true,
            fieldKey: 'tobaccoUse'
        });
        const smokingStatusGuid = model.get('smokingStatusGuid');
        SmokingStatusType.getTypes(this.store).then(result => {
            const activeResult = result.filterBy('isActive');
            const inActiveOption = result.filter(item => {
                return !item.get('isActive') && item.get('smokingStatusGuid') === smokingStatusGuid;
            });
            controller.setProperties({
                'smokingStatusTypes': activeResult,
                'inActiveSmokingStatusType': inActiveOption.length > 0 ? inActiveOption[0] : null,
                'selectedValueImage': smokingStatusGuid,
                'isAllowedToEdit': this.get('isAllowedToEdit'),
                'isNotAllowedToEdit': this.get('isNotAllowedToEdit')
            });
        });
    },
    deactivate() {
        const controller = this.controllerFor(this.get('delegatingController'));
        const tunnelService = this.get('tunnel');

        tunnelService.send('update-editing-social-history', {
            isEditing: false
        });

        if (controller.get('currentDetailsPaneProperty') === 'isEditingSmokingStatus') {
            controller.setProperties({
                currentDetailsPaneProperty: null
            });
        }
    },
    save() {
        const smokingStatus = this.get('controller.model');
        const patientPracticeGuid = this.modelFor('patient').get('patientPracticeGuid');

        if (smokingStatus) {
            if (smokingStatus.get('saveDisabled')) {
                this.rollback();
            } else {
                const isNew = smokingStatus.get('isNew');
                const smokingStatusTypeGuid = smokingStatus.get('smokingStatusGuid');
                const smokingStatusType = smokingStatusTypeGuid ? this.get('store').peekRecord('smoking-status-type', smokingStatusTypeGuid) : null;
                let version = 2;
                if (smokingStatusType) {
                    smokingStatus.set('description', smokingStatusType.get('description'));
                    if (isPresent(smokingStatusType.get('version'))) {
                        version = smokingStatusType.get('version');
                    }
                }

                return smokingStatus.save({ adapterOptions: { version } }).then(() => {
                    if (isNew) {
                        const smokingStatuses = this.controllerFor(this.get('delegatingController')).get('smokingStatuses');
                        if (smokingStatuses) {
                            smokingStatuses.pushObject(smokingStatus);
                        }
                    }
                    this.get('tunnel').send('behavioral-health-refresh', { patientPracticeGuid, reload: true });
                }).catch(error => {
                    toastr.error(`Could not save tobacco use. Try again later.`);
                    throw error;
                });
            }
        }
        return resolve(smokingStatus);
    },
    rollback() {
        const smokingStatus = this.get('controller.model');
        if (smokingStatus) {
            if (smokingStatus.get('isNew')) {
                // Delete the record that was created when we opened the details pane.
                this.get('store').unloadRecord(smokingStatus);
                this.set('isDeleting', true);
            } else {
                smokingStatus.rollbackAttributes();
            }
        }
    },
    bubbleAfterSave() {
        const actionArgs = arguments;
        if (this.get('controller.model.hasDirtyAttributes')) {
            this.save().then(() => this.send.apply(this, actionArgs));
            return false;
        }
        return true;
    },
    resetSelectedItem() {
        const controller = this.controllerFor(this.get('delegatingController'));
        if (controller === 'patient/summary') {
            controller.send('closeDetailPane');
        }
    },
    actions: {
        save() {
            this.transitionTo(this.get('_defaultTransition'));
            this.resetSelectedItem();
        },
        delete() {
            const smokingStatus = this.get('controller.model');
            const patientPracticeGuid = this.modelFor('patient').get('patientPracticeGuid');
            const title = 'tobacco use';
            const titleCap = 'Tobacco use';

            if (this.get('isDeleting')) {
                return;
            }
            this.set('isDeleting', true);

            if (smokingStatus) {
                const smokingStatusTypeGuid = smokingStatus.get('smokingStatusGuid');
                const smokingStatusType = smokingStatusTypeGuid ? this.get('store').peekRecord('smoking-status-type', smokingStatusTypeGuid) : null;
                let version = 2;
                if (smokingStatusType && isPresent(smokingStatusType.get('version'))) {
                    version = smokingStatusType.get('version');
                }

                smokingStatus.deleteRecord();
                smokingStatus.save({ adapterOptions: { version } }).then(() => {
                    const smokingStatuses = this.controllerFor(this.get('delegatingController')).get('smokingStatuses');
                    if (smokingStatuses) {
                        smokingStatuses.removeObject(smokingStatus);
                    }
                    this.get('tunnel').send('behavioral-health-refresh', { patientPracticeGuid, reload: true });
                    toastr.success(`${titleCap} deleted.`);
                    this.transitionTo(this.get('_defaultTransition'));
                    this.resetSelectedItem();
                }, () => toastr.error(`Could not delete ${title}. Try again later.`));
            } else {
                this.transitionTo(this.get('_defaultTransition'));
                this.resetSelectedItem();
            }
        },
        cancel() {
            this.rollback();
            this.transitionTo(this.get('_defaultTransition'));
            this.resetSelectedItem();
        },
        undo() {
            const smokingStatus = this.get('controller.model');
            if (smokingStatus.get('isNew')) {
                smokingStatus.set('smokingStatusGuid', undefined);
            } else {
                smokingStatus.rollbackAttributes();
            }
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
            return this.bubbleAfterSave('closeTab', tab);
        }
    }
});
