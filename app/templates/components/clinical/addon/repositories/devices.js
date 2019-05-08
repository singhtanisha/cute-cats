import { reject } from 'rsvp';
import config from 'boot/config';
import PFServer from 'boot/util/pf-server';

export default {
    loadDevices(patientGuid) {
        return PFServer.promise(`${config.clinicalBaseURL}patients/${patientGuid}/healthcaredevices`).then((results) => {
            return results;
        });
    },

    loadDevice(patientGuid, deviceGuid) {
        return PFServer.promise(`${config.clinicalBaseURL}patients/${patientGuid}/healthcaredevices/${deviceGuid}`).then((result) => {
            return result;
        });
    },

    saveDevice(device) {
        let url = `${config.clinicalBaseURL}patients/${device.patientPracticeGuid}/healthcaredevices`,
            httpMethod = 'POST';

        if (device.healthcareDeviceGuid) {
            httpMethod = 'PUT';
            url +=  `/${device.healthcareDeviceGuid}`;
        }
        return PFServer.promise(url, httpMethod, device).then((result) => {
            return result;
        });
    },

    deleteDevice(device) {
        if (!device.healthcareDeviceGuid) {
            return reject('No device selected for deletion.');
        }

        return PFServer.promise(`${config.clinicalBaseURL}patients/${device.patientPracticeGuid}/healthcaredevices/${device.healthcareDeviceGuid}`, 'DELETE');
    },

    recordNoDevices(patientGuid, hasNoDevices) {
        const method = hasNoDevices ? 'POST' : 'DELETE';
        return PFServer.promise(
            `${config.clinicalBaseURL}patientConditions/${patientGuid}/NOKNOWNIMPLANTABLEDEVICES`,
            method
        );
    },

    getUdiData(device, patientPracticeGuid) {
        const patientGuid = patientPracticeGuid || device.patientPracticeGuid;

        return PFServer.promise(
            `${config.clinicalBaseURL}patients/${patientGuid}/healthcaredevices/populateUdiInfo`,
            'POST',
            { uniqueDeviceIdentifier: device.udiInfo.uniqueDeviceIdentifier }
        ).then((result) => {
            return result;
        }, () => {
            return null;
        });

    },

    loadDevicesSorted(patientGuid) {
        return this.loadDevices(patientGuid).then(result => {
            return {
                noImplantableDevicesFlag: result.noImplantableDevicesFlag,
                Devices: result.Devices.sortBy('isActive', 'userEnteredInfo.userEnteredImplantDate').reverse()
            };
        });
    }
};
