import { get } from '@ember/object';
import { merge } from '@ember/polyfills';
import { isPresent } from '@ember/utils';
import RESTSerializer from 'ember-data/serializers/rest';

export default RESTSerializer.extend({
    normalizeResponse(store, type, payload, id, requestType) {
        return this._super(store, type, { 'immunization-registry-filter': payload }, id, requestType);
    },
    serialize(snapshot, isAdvanced) {
        const isMultipleBirth = get(snapshot.record, 'isMultipleBirth');
        const isMultipleBirthPresent = isPresent(isMultipleBirth);
        const birthOrder = get(snapshot.record, 'birthOrder');
        const isBirthOrderPresent = isPresent(birthOrder);
        // Set birthOrder to either the user defined value, or 1 if isMultpleBirth is set to false
        const serializedBirthOrder = isBirthOrderPresent ?
            birthOrder :
            (isMultipleBirthPresent && !isMultipleBirth) && 1;

        const basicFilters = {
            dateOfBirth: get(snapshot.record, 'dateOfBirth'),
            firstName: get(snapshot.record, 'firstName'),
            gender: get(snapshot.record, 'gender'),
            lastName: get(snapshot.record, 'lastName'),
            middleName: get(snapshot.record, 'middleName'),
            mothersMaidenName: get(snapshot.record, 'mothersMaidenName'),
        };

        const advancedFilters = {
            address1: get(snapshot.record, 'address1'),
            address2: get(snapshot.record, 'address2'),
            birthOrder: serializedBirthOrder || null,
            city: get(snapshot.record, 'city'),
            isMultipleBirth,
            patientRecordNumber: get(snapshot.record, 'patientRecordNumber'),
            phoneNumber: get(snapshot.record, 'phoneNumber'),
            postalCode: get(snapshot.record, 'postalCode'),
            state: get(snapshot.record, 'state')
        };

        return isAdvanced ? merge(basicFilters, advancedFilters) : basicFilters;
    }
});
