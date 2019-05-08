import { next } from '@ember/runloop';
import { inject as service } from '@ember/service';
import FlowsheetDefinition from 'flowsheets/models/flowsheet-definition';
import SchedulerDialogRouteSupport from 'scheduler/mixins/scheduler-dialog-route-support';
import AuthenticatedBaseRoute from 'boot/routes/authenticated-base';
import Encounter from 'charting/models/encounter';
import EmberObject, { get, set } from '@ember/object';
import { isPresent } from '@ember/utils';

export default AuthenticatedBaseRoute.extend(SchedulerDialogRouteSupport, {
    adBanner: service(),
    attemptedTransition: null,

    model() {
        return {};
    },
    setupController(controller, model) {
        this._super(controller, model);
        
        // Clears the cards
        controller.reset();

        // When switching between patients, cards need to reload to avoid the wrong patient info from appearing
        next(() => {
            get(controller, 'loadDisplaySettings').perform();
        });

        this.ensurePatientTabIsPresent();
        set(this.controllerFor('patient'), 'tabActionItems', null);
        this.refreshAd();
    },
    deactivate() {
        this.controller.reset();
    },
    refreshAd(subzone) {
        const patientPracticeGuid = get(this.controllerFor('patient'), 'patientPracticeGuid');
        get(this, 'adBanner').updateAdUrl({
            currentPatientGuid: patientPracticeGuid,
            zone: 'charts',
            subzone
        });
    },
    ensurePatientTabIsPresent() {
        const chartsMenuItems = get(this.controllerFor('charts'), 'menuItems');
        const patient = this.modelFor('patient');

        if (isPresent(patient) && !chartsMenuItems.isAny('arg1', get(patient, 'patientPracticeGuid'))) {
            chartsMenuItems.addObject(EmberObject.create({
                label: get(patient, 'displayName'),
                route: 'patient',
                arg1: get(patient, 'patientPracticeGuid'),
                dismissible: true,
                dupeOk: true
            }));
        }
    },
    actions: {
        refreshAd(options) {
            var patientPracticeGuid = get(this.controllerFor('patient'), 'patientPracticeGuid'),
                adContext = this.store.peekRecord('patient_ad_context', patientPracticeGuid);
            options = options || {};
            if (options.reloadAdContext && adContext) {
                // Reload the ad context to get any updates to the med or dx list
                adContext.reload().finally(function () {
                    this.refreshAd(options.subzone);
                }.bind(this));
            } else {
                this.refreshAd(options.subzone);
            }
        },
        viewFlowsheet(createNew) {
            this.transitionTo('patient.flowsheets', { queryParams: { createNew: !!createNew } });
        },
        createPracticeFlowsheet() {
            this.transitionTo('settings.flowsheets.edit', FlowsheetDefinition.wrap({}, get(this, 'store')));
        },
        validateNewEncounter() {
            set(this.controllerFor('patient/summary'), 'shouldCreateNewEncounter', true);
        },
        newEncounter(noteTypeId) {
            const patientPracticeGuid = get(this.controllerFor('patient'), 'patientPracticeGuid');
            Encounter.createNewEncounter(get(this, 'store'), patientPracticeGuid, {
                chartNoteTypeId: parseInt(noteTypeId, 0)
            }).then(function (encounter) {
                this.transitionTo('encounter', patientPracticeGuid, encounter);
            }.bind(this), function () {
                toastr.error('Error creating new encounter');
            });
        },
        removeHealthConcern(healthConcernReferenceGuid) {
            const store = get(this, 'store');
            const adapter = store.adapterFor('patient-health-concern');

            if (adapter) {
                adapter.removeHealthConcernByReferenceGuid(store, healthConcernReferenceGuid, get(this.controllerFor('patient/summary'), 'healthConcerns'));
            }
        },
        retryTransition() {
            const attemptedTransition = get(this, 'attemptedTransition');

            if (isPresent(attemptedTransition)) {
                attemptedTransition.retry();
            }
        },
        willTransition(transition) {
            const controller = get(this, 'controller');

            const displaySettings = get(controller, 'displaySettings');

            if (isPresent(displaySettings)) {
                if (displaySettings.isModelDirty()) {
                    if (transition.targetName !== 'lock.index') {
                        transition.abort();
                        controller.send('showUnsavedDisplaySettingChangesModal');
                        set(this, 'attemptedTransition', transition);
                    } else {
                        displaySettings.undoChanges();
                        return true;
                    }
                } else {
                    return true;
                }
            }
        }
    }
});
