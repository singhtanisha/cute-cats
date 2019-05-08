import { scheduleOnce } from '@ember/runloop';
import config from 'boot/config';
import PFServer from 'boot/util/pf-server';
import guidHelper from 'boot/util/guid';
import StaticAdapter from 'common/adapters/static';
import session from 'boot/models/session';

export default StaticAdapter.extend({
    buildURL () {
        return `${config.practiceBaseURL}PreferenceDoc/User/${session.get('userGUID')}/favoriteDiagnoses`;
    },

    generateIdForRecord () {
        return guidHelper.generateGuid();
    },

    createRecord (store, type, snapshot) {
        snapshot.record.set('sortIndex', store.peekAll(type.modelName).get('length'));

        this._doUpdate(store);

        return snapshot;
    },

    updateRecord (store, type, record) {
        scheduleOnce('actions', this, '_doUpdate', store);

        return record;
    },

    deleteRecord (store, type, record) {
        store.peekAll('favoriteDiagnosis').rejectBy('id', record.id).sortBy('sortIndex').forEach((dx, index) => {
            dx.set('sortIndex', index + 1);
        });

        return this._doUpdate(store);
    },

    _doUpdate (store) {
        let favoriteDiagnoses = store.peekAll('favoriteDiagnosis').rejectBy('currentState.isDeleted').map((diagnosis) => ({
            id: diagnosis.get('id'),
            name: diagnosis.get('name'),
            code: diagnosis.get('code'),
            sortIndex: diagnosis.get('sortIndex'),
            diagnosisCodes: diagnosis.get('diagnosisCodes').map((diagnosisCode) => ({
                code: diagnosisCode.code,
                codeSystem: diagnosisCode.codeSystem,
                description: diagnosisCode.description
            }))
        }));
        return PFServer.promise(this.buildURL(), 'PUT', {'favoriteDiagnoses': favoriteDiagnoses});
    },

    findAll(store, type, sinceToken){
        return this._super(store, type, sinceToken).then(data => {
            if (!data.favoriteDiagnoses){
                return {'favoriteDiagnoses': []};
            }
            return data;
        });
    }
});
