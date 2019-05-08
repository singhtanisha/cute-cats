import { isPresent } from '@ember/utils';
import { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';
import attr from 'ember-data/attr';

export default Mixin.create({
    patientName: attr('string'),
    patientFirstName: attr('string'),
    patientMiddleName: attr('string'),
    patientLastName: attr('string'),
    dateOfBirth: attr('string'),
    age: attr('string'),
    gender: attr('string'),
    patientRecordNumber: attr('string'),
    patientPhoneNumbers: attr('array'),
    patientAddress: attr('string'),
    patientIsActive: attr('boolean'),
    // TODO: Remove defaultValue once endpoints support this attribute.
    hasPatientImage: attr('boolean', { defaultValue: true }),
    homePhoneNumber: computed('patientPhoneNumbers.[]', function () {
        return this._getPhoneNumber('Home');
    }),
    mobilePhoneNumber: computed('patientPhoneNumbers.[]', function () {
        return this._getPhoneNumber('Mobile');
    }),
    genderString: computed('gender', function () {
        if (this.get('gender') === 'M') {
            return 'Male';
        } else if (this.get('gender') === 'F') {
            return 'Female';
        }
        return 'Unknown';
    }),
    _getPhoneNumber(type) {
        const phoneNumbers = this.get('patientPhoneNumbers');
        const phoneNumber = phoneNumbers ? phoneNumbers.findBy('type', type) : null;
        return phoneNumber ? phoneNumber.phoneNumber : null;
    },
    updateDemographics(patient) {
        const { fullName, firstName, middleName, lastName, birthDate, patientRecordNumber, mobilePhone, homePhone, streetAddress1, streetAddress2, postalCode, city, state, isActive } = patient.getProperties('fullName', 'firstName', 'lastName', 'middleName', 'birthDate', 'patientRecordNumber', 'mobilePhone', 'homePhone', 'streetAddress1', 'streetAddress1', 'streetAddress2', 'postalCode', 'city', 'state', 'isActive');
        const patientPhoneNumbers = [];
        let patientAddress = [streetAddress1, streetAddress2, city, state].filter(item => isPresent(item)).join(', ');
        if (mobilePhone) {
            patientPhoneNumbers.pushObject({ type: 'Mobile', phoneNumber: mobilePhone });
        }
        if (homePhone) {
            patientPhoneNumbers.pushObject({ type: 'Home', phoneNumber: homePhone });
        }
        if (postalCode) {
            patientAddress += ` ${postalCode}`;
        }
        this.setProperties({
            patientName: fullName,
            patientFirstName: firstName,
            patientMiddleName: middleName,
            patientLastName: lastName,
            dateOfBirth: birthDate,
            patientIsActive: isActive,
            gender: patient.get('gender'),
            patientAddress,
            patientRecordNumber,
            patientPhoneNumbers
        });
    }
});
