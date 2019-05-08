// Retrieves patient options for race and ethnicity demographics.
import { isEmpty } from '@ember/utils';

export default {
    findPatientRaceOptions(store) {
        return this._findDemographicOptions(store, 'race-option');
    },

    findPatientEthnicityOptions(store) {
        return this._findDemographicOptions(store, 'ethnicity-option');
    },

    _findDemographicOptions(store, type) {
        const cachedDemographicOptions = store.peekAll(type);
        if (isEmpty(cachedDemographicOptions)) {
            return store.findAll(type);
        }
        return cachedDemographicOptions;
    }
};
