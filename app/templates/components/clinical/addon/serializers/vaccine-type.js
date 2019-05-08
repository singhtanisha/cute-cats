import RESTSerializer from 'ember-data/serializers/rest';
import DS from 'ember-data';

export default RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
    attrs: {
        immunizationDrugs: { serialize: 'none', deserialize: 'records' },
        manufacturers: { embedded: 'always' },
        vaccineInventories: { serialize: 'none', deserialize: 'records' }
    },
    isNewSerializerAPI: true,
    primaryKey: 'modifiedVaccineTypeGuid',

    normalize(typeClass, hash, prop) {
        hash.modifiedVaccineTypeGuid = hash.modifiedVaccineTypeGuid || hash.vaccineTypeGuid;
        return this._super(typeClass, hash, prop);
    },

    normalizeResponse(store, type, payload, id, requestType) {
        const vaccineType = payload.vaccineType;

        if (vaccineType) {
            if (payload.vaccineInventories) {
                payload.vaccineInventories.forEach((inventory) => {
                    delete inventory.vaccineType;
                });
            }

            vaccineType.providerGuid = payload.providerGuid;
            vaccineType.vaccineInventories = payload.vaccineInventories;
            vaccineType.immunizationDrugs = payload.immunizationDrugs;

            payload = { 'vaccine-type': [ vaccineType ] };
        } else {
            payload = { 'vaccine-type': payload };
        }

        return this._super(store, type, payload, id, requestType);
    }
});
