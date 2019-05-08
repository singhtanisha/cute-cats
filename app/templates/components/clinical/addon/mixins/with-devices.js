import { isEmpty } from '@ember/utils';
import { on } from '@ember/object/evented';
import { sort, filterBy, alias } from '@ember/object/computed';
import { computed, get, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import devicesRepository from 'clinical/repositories/devices';
import WithPatientPrintTitleMixin from 'charting/mixins/with-patient-print-title';
import session from 'boot/models/session';
import { task } from 'ember-concurrency';

/**
 * Loads implantable devices on init based on patientGuid properties
 */
export default Mixin.create(WithPatientPrintTitleMixin, {
    routing: service('pf-routing'),
    selectedDeviceGuid: computed('selectedItem', {
        get() {
            return this.get('selectedItem');
        },
        set(value) {
            return value;
        }
    }),
    actions: {
        loadDevices() {
            this.get('_loadDevices').perform();
        },
        editDevice(device) {
            if (device) {
                this.get('routing').transitionToRoute('summary.device', device.patientPracticeGuid, device.healthcareDeviceGuid);
                this.attrs.setControllerProperties({
                    selectedItem: device.healthcareDeviceGuid
                });
            }
        },
        recordDevice() {
            this.get('routing').transitionToRoute('summary.device', 'new');
            this.attrs.setControllerProperties({
                selectedItem: undefined
            });
        },
        toggleInactiveDevices() {
            this.toggleProperty('showInactiveDevices');
        },
        print() {
            // Load the patient info first to ensure that it gets rendered on the print preview
            this.get('store').findRecord('patient', this.get('patientGuid')).then(() => {
                this.sendAction('printAudit', 'Devices');
                this.set('isPrintVisible', true);
            });
        }
    },

    noImplantableDevices: false,
    devices: undefined,
    practiceUsers: null,
    sortProperties: computed(() => ['userEnteredInfo.userEnteredImplantDate:desc']),
    sortedDevices: sort('devices', 'sortProperties'),
    activeDevices: filterBy('sortedDevices', 'isActive', true),
    inactiveDevices: filterBy('sortedDevices', 'isActive', false),
    isLoading: alias('_loadDevices.isRunning'),
    loadDevicesFailed: alias('_loadDevices.last.isError'),

    selectedDevice: computed('selectedDeviceGuid', 'devices.@each.healthcareDeviceGuid', {
        get() {
            return this.getWithDefault('devices', []).findBy('healthcareDeviceGuid', this.get('selectedDeviceGuid'));
        },
        set(key, value) {
            this.set('selectedDeviceGuid', get(value || {}, 'deviceGuid'));
        }
    }),

    canRecordDevice: computed('loadDevicesFailed', 'isLoading', function () {
        return session.get('canEditChart') && !this.get('loadDevicesFailed') && !this.get('isLoading');
    }),

    _loadDevicesOnInit: on('init', observer('patientGuid', function () {
        this.set('practiceUsers', []);
        this.get('_loadDevices').perform();
        this.get('_loadUsers').perform();
    })),

    _loadDevices: task(function* () {
        const patientGuid = this.get('patientGuid');
        if (!patientGuid) {
            if (DEBUG) {
                window.console.error('This is designed to be used with a patientGuid. Are you missing something?');
            }
            return;
        }
        const results = yield devicesRepository.loadDevices(patientGuid);
        this.set('devices', results.Devices);
        this.set('noImplantableDevices', results.noImplantableDevicesFlag);
        this.set('updateDevice', null);
    }).restartable(),

    _loadUsers: task(function* () {
        const data = yield this.store.findAll('provider-profile');
        this.set('practiceUsers', data);
    }).drop(),

    isNoDevicesChecked: computed('noImplantableDevices', {
        get() {
            return !!this.get('noImplantableDevices');
        },
        set(key, value) {
            this.get('setNoDevices').perform(value);
            return value;
        }
    }),
    setNoDevices: task(function* (value) {
        this.set('noImplantableDevices', value);
        try {
            yield devicesRepository.recordNoDevices(this.get('patientGuid'), value);
        } catch (error) {
            toastr.error('Failed to record no implantable devices status');
            // revert to the previous value if we couldn't update it.
            this.set('noImplantableDevices', !value);
        }
    }),

    patientSummary: alias('patient'),
    displayName: 'Implantable device',

    updatingDevice: observer('updateDevice', function () {
        if (!isEmpty(this.get('updateDevice'))) {
            this.get('_loadDevices').perform();
        }
    })
});
