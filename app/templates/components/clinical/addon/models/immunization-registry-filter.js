import attr from 'ember-data/attr';
import Model from 'ember-data/model';
import { computed, get } from '@ember/object';
import { isPresent } from '@ember/utils';

export default Model.extend({
    address1: attr('string'),
    address2: attr('string'),
    birthOrder: attr('number'),
    city: attr('string'),
    dateOfBirth: attr('string'),
    firstName: attr('string'),
    gender: attr('string'),
    isMultipleBirth: attr('boolean'),
    lastName: attr('string'),
    middleName: attr('string'),
    mothersMaidenName: attr('string'),
    patientRecordNumber: attr('string'),
    phoneNumber: attr('string'),
    postalCode: attr('string'),
    state: attr('string'),

    fullName: computed('firstName', 'middleName', 'lastName', function () {
        const middleName = get(this, 'middleName');
        const middleNameSpace = isPresent(middleName) ? ' ' : '';
        return `${get(this, 'firstName')}${middleNameSpace}${middleName} ${get(this, 'lastName')}`;
    })
});
