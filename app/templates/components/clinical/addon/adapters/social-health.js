import { Promise } from 'rsvp';
import { get } from '@ember/object';
import config from 'boot/config';
import RESTAdapter from 'ember-data/adapters/rest';

export default RESTAdapter.extend({
    host: config.defaultHost,

    buildURL(modelName, id, snapshot, requestType, query) {
        if (requestType === 'deleteRecord') {
            let url = `${config.patientBaseURLV3}/patients/${id}/demographics/${query.fieldName}`;

            if (query.optionGuid) {
                url += `/${query.optionGuid}`;
            }

            return url;
        }
        return `${config.patientBaseURLV3}/patients/${id}/socialhealth`;
    },

    findRecord(store, type, id) {
        const url = this.buildURL(type.modelName, id, null, 'findRecord');

        return this.ajax(url, 'GET').then((payload) => {
            payload.id = id;
            return payload;
        });
    },

    updateRecord(store, type, snapshot) {
        const fieldName = get(snapshot, 'adapterOptions.fieldName');
        const isDelete = get(snapshot, 'adapterOptions.isDelete');
        const optionGuid = get(snapshot, 'adapterOptions.optionGuid');
        const data = snapshot.serialize();

        // The social health endpoint doesn't support a PUT, so have to save through other endpoints
        return new Promise((resolve, reject) => {
            if (fieldName === 'socialHistory') {
                return this.updatePersonalMedicalHistoryRecord(store, snapshot, data, resolve, reject);
            } else if (isDelete) {
                return this.deleteDemographicRecord(snapshot, data, fieldName, optionGuid, resolve, reject);
            } else {
                return this.updateDemographicRecord(fieldName, store, snapshot, data, resolve, reject);
            }
        });
    },

    updatePersonalMedicalHistoryRecord(store, snapshot, data, resolve, reject) {
        return store.findRecord('personal-medical-history', snapshot.id).then((pmh) => {
            pmh.set('socialHistory', data.socialHistory);
            return pmh.save().then(() => {
                return resolve(data);
            }, (e) => {
                throw reject(e);
            });
        });
    },

    updateDemographicRecord(fieldName, store, snapshot, data, resolve, reject) {
        return store.findRecord('social-history', snapshot.id).then((socialHistory) => {
            socialHistory.setProperties({
                education: data.education,
                financialResourceStatus: data.financialResourceStatus,
                genderIdentity: data.genderIdentity,
                sexualOrientation: data.sexualOrientation
            });

            return socialHistory.save({ adapterOptions: { fieldName } }).then(() => {
                return resolve(data);
            }, (e) => {
                throw reject(e);
            });
        });
    },

    deleteDemographicRecord(snapshot, data, fieldName, optionGuid, resolve, reject) {
        const record = snapshot.belongsTo(fieldName).record;
        const query = {
            fieldName,
            optionGuid
        };
        const url = this.buildURL(null, snapshot.id, null, 'deleteRecord', query);

        record.clear();

        return this.ajax(url, 'DELETE').then(() => {
            return resolve(data);
        }, (e) => {
            throw reject(e);
        });
    }
});
