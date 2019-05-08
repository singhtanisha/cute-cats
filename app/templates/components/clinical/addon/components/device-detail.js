import { resolve } from 'rsvp';
import { on } from '@ember/object/evented';
import { once, later } from '@ember/runloop';
import { isEmpty } from '@ember/utils';
import { not, alias } from '@ember/object/computed';
import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import LGTM from 'common/helpers/validation';
import devicesRepository from 'clinical/repositories/devices';
import LoadingMixin from 'clinical/mixins/loading';
import SpinnerSupport from 'common/mixins/spinner';
import Validatable from 'ember-lgtm/mixins/validatable';
import DestroyedMixin from 'tyrion/mixins/destroyed';

export default Component.extend(SpinnerSupport, LoadingMixin, DestroyedMixin, Validatable, {
    classNames: ['detail-pane', 'col-sm-5', 'summary-details', 'side-fixed'],
    tagName: 'section',

    analytics: service(),
    routing: service('pf-routing'),
    resizables: computed(() => []),
    authorization: service(),
    isAllowedToEditDevices: computed('authorization.entitledFeatures.[]', function () {
        return this.get('authorization').isEntitledFor('Chart.Devices.Edit');
    }),
    isNotAllowedToEditDevices: not('isAllowedToEditDevices'),
    contentElement: '.device-detail .detail-pane-body-wrapper',
    showSpinner: alias('isLoading'),
    showDeleteConfirm: false,
    editedDeviceGuid: '',
    isDirty: false,
    isEditing: false,
    device: {},
    showAdvancedOptions: false,
    deviceName: alias('device.userEnteredInfo.userEnteredDeviceTypeName'),
    implantDate: alias('device.userEnteredInfo.userEnteredImplantDate'),
    udi: alias('device.udiInfo.uniqueDeviceIdentifier'),

    isUdiPopulated: computed('device.udiInfo', function() {
        return !isEmpty(this.get('device.udiInfo.deviceIdentifier')) && !isEmpty(this.get('device.udiInfo.uniqueDeviceIdentifier'));
    }),
    isSaveDisabled: not('isUdiPopulated'),

    manufactureDateDisplay: computed('device.udiInfo.manufacturingDate', function() {
        return this._getDisplayDate(this.get('device.udiInfo.manufacturingDate'));
    }),

    expirationDateDisplay: computed('device.expirationDate', function() {
        return this._getDisplayDate(this.get('device.udiInfo.expirationDate'));
    }),

    validator: LGTM.validator()
        .validates('udi').required('Please enter a Unique Device Identifier')
        .validates('implantDate')
            .optional()
            .isDate('Please enter a valid date')
        .build(),

    disabled: computed('isNotAllowedToEditDevices', function() {
        return !this.get('session.canEditChart') || this.get('isNotAllowedToEditDevices');
    }),

    canDelete: computed('isEditing', 'disabled', function() {
        return this.get('isEditing') && !this.get('disabled');
    }),

    _closing: observer('closing', function () {
        if (!this.get('closing')) {
            return;
        }
        this.set('closing', false);
        if (this.get('isDirty')) {
            once(this, '_saveDevice');
        }
    }),

    loadEditedDevice: on('init', observer('editedDeviceGuid', function() {
        const deviceGuid = this.get('editedDeviceGuid');
        const isEditing = !isEmpty(deviceGuid);

        this.setProperties({
            isEditing: isEditing,
            device: {
                userEnteredInfo: {},
                udiInfo: {
                    snomed: []
                },
                isActive: false,
                patientPracticeGuid: this.get('patientGuid')
            }
        });
        if (isEditing) {
            this._loadDevice();
        }
    })),

    actions: {
        getUdiInfo() {
            const device = this.get('device');
            const patientGuid = this.get('patientGuid');

            if (isEmpty(device.udiInfo.uniqueDeviceIdentifier)) {
                return resolve();
            }
            return this._withProgress(devicesRepository.getUdiData(device, patientGuid).then((data) => {
                if (isEmpty(data)) {
                    this.set('showUdiFailure', true);
                } else if (isEmpty(data.uniqueDeviceIdentifier)) {
                    this.set('showUdiUniqueFailure', true);
                } else {
                    this.set('fetchedUdiInfo', data);
                    this.set('showUdiSuccess', true);
                }
            }));
        },

        confirmUdiInfo() {
            const fetched = this.get('fetchedUdiInfo');
            if (fetched) {
                this.set('device.udiInfo', fetched);
                this.set('deviceName', fetched.gmdnPtName);
                this.set('fetchedUdiInfo', null);
            }
            this.set('showUdiSuccess', false);
        },

        cancelUdiInfo() {
            this.set('showUdiSuccess', false);
            this.set('showUdiFailure', false);
            this.set('showUdiUniqueFailure', false);
        },

        reEnterUdiInfo() {
            this.set('showUdiFailure', false);
            this.set('showUdiUniqueFailure', false);
            // TODO: highlight UDI field
        },

        removeUdiInfo() {
            this.set('device.udiInfo', { snomed: [], uniqueDeviceIdentifier: this.get('device.udiInfo.uniqueDeviceIdentifier') });
        },

        cancel() {
            this.sendAction('updateDirty', false);
            this._close();
        },

        close() {
            this._close();
        },

        save() {
            this._saveDevice(true);
        },

        showDelete() {
            this.set('showDeleteConfirm', true);
        },

        delete() {
            const device = this.get('device');
            this.set('showDeleteConfirm ', false);
            this._withProgress(
                devicesRepository.deleteDevice(device)).then(() => {
                    this.sendAction('updateDirty', false);
                    toastr.success('Implantable device deleted');
                    this._close(device);
                }).catch(() => toastr.error('Failed to delete device'));
        }
    },

    _close(device) {
        later(() => {
            this.sendAction('close', device);
        });
    },

    _loadDevice() {
        const patientGuid = this.get('patientGuid');
        const deviceGuid = this.get('editedDeviceGuid');
        this.set('loadDeviceFailed', false);
        this._withProgress(devicesRepository.loadDevice(patientGuid, deviceGuid)).then((device) => {
            this._unlessDestroyed(() => {
                if (device && device.udiInfo && device.udiInfo.gmdnPtName) {
                    device.userEnteredInfo.userEnteredDeviceTypeName = device.udiInfo.gmdnPtName;
                }
                device.userEnteredInfo.userEnteredImplantDate = this._getDisplayDate(device.userEnteredInfo.userEnteredImplantDate, true);
                this.set('device', device);
            });
        }).errorMessage('The device could not be loaded', { rethrow: true }).catch(() => {
            this._unlessDestroyed(() => {
                this.set('loadDeviceFailed', true);
            });
        });
    },

    _saveDevice(showSuccess) {
        const device = this.get('device');
        const isDeviceNew = isEmpty(this.get('editedDeviceGuid'));

        this.validate().then((isValid) => {
            if (isEmpty(device)) {
                return;
            }

            if (!isValid) {
                return;
            }

            this.get('analytics').track('Save Device');
            this._withProgress(devicesRepository.saveDevice(device).then((result) => {
                this.sendAction('updateDirty', false);
                if(showSuccess) {
                    toastr.success(isDeviceNew ? 'Implantable device added' : 'Implantable device saved');
                }
                this.set('device', result);
                this.set('editedDeviceGuid', result.healthcareDeviceGuid);
                this._close(result);
            }, () => {
                toastr.error('Failed to save device');
            }));
        });
    },

    _getDisplayDate(dateVal, ignoreEmpty) {
        if (!dateVal || !moment(dateVal).isValid()) {
            return ignoreEmpty ? '' : 'Unspecified';
        }
        return moment(dateVal).utc().format('MM/DD/YYYY');
    }
});
