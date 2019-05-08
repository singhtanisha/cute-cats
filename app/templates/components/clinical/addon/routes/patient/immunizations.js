import AuthenticatedBaseRoute from 'boot/routes/authenticated-base';
import { get, setProperties } from '@ember/object';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default AuthenticatedBaseRoute.extend({
    adBanner: service(),
    model(params, transition, queryParams) {
        const patientPracticeGuid = get(this.modelFor('patient'), 'id');
        queryParams = params.queryParams || transition.queryParams || queryParams || {};

        if (patientPracticeGuid) {
            return RSVP.hash({
                preloadCode: queryParams.preloadCode,
                preloadKeyword: queryParams.preloadKeyword,
                patientPracticeGuid
            });
        }
    },

    setupController(controller, model) {
        const preloadCode = model.preloadCode;
        const preloadKeyword = model.preloadKeyword;

        this._super(controller, model);
        controller.load();
        this.preloadVaccinations(controller, preloadCode, preloadKeyword);
        this.refreshAd();
    },

    actions: {
        connectToRegistry() {
            this.getController().send('connectToRegistry');
        },

        cdsAction(actionName, options) {
            if (actionName === 'preloadPatientImmunizations' || actionName === 'addVaccine') {
                this.preloadVaccinations(this.getController(), options.preloadCode, options.preloadKeyword);
            }
        },

        downloadImmunizationRecord() {
            this.getController().send('downloadImmunizationRecord');
        },

        error() {
            toastr.error('Failed to load patient immunization list.');
        },

        manageVaccineInventory() {
            this.getController().send('vaccineInventory');
        },

        printVaccinationsWithComments() {
            this.getController().send('print', { withComments: true });
        },

        printVaccinations() {
            this.getController().send('print', { withComments: false });
        },

        refreshCdsAlerts() {
            const controller = this.getController();
            get(controller, 'loadAlerts').perform();
        },

        transmitToStateRegistry() {
            this.getController().send('transmitToStateRegistry');
        }
    },

    preloadVaccinations(controller, preloadCode, preloadKeyword) {
        setProperties(controller, {
            preloadCode,
            preloadKeyword
        });

        controller.preloadVaccinations();
    },

    refreshAd() {
        get(this, 'adBanner').updateAdUrl({
            currentPatientGuid: this.modelFor('patient').get('id'),
            zone: 'charts',
            subzone: 'immunization'
        });
    },
    getController() {
        return get(this, 'controller');
    }
});
