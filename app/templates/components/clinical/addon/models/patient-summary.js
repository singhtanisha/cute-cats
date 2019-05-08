import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
    patientPracticeGuid: alias('id'),

    patientId: attr(),

    firstName: attr('string'),
    middleName: attr('string'),
    lastName: attr('string'),
    nickname: attr('string'),

    fullName: computed('firstName', 'middleName', 'lastName', function () {
        const names = [];
        if (this.get('firstName')) {
            names.push(this.get('firstName'));
        }
        if (this.get('middleName')) {
            names.push(this.get('middleName'));
        }
        if (this.get('lastName')) {
            names.push(this.get('lastName'));
        }
        return names.join(' ');
    }),

    birthDate: attr(),
    genderString: attr(),
    emailAddress: attr(),
    isUserOfEmail: attr(),
    homePhone: attr(),
    mobilePhone: attr(),
    workPhone: attr(),
    workPhoneExtension: attr(),
    practiceGuid: attr(),
    patientRecordNumber: attr(),
    age: attr(), // 27 years
    imageUrl: attr(),
    suffix: attr(),
    gender: attr('number'),
    genderOption: belongsTo('gender-option', { async: true }),
    genderDescription: alias('genderOption.gender'),
    officePhone: attr(),
    officePhoneExtension: attr(),
    hasPatientImage: attr('boolean'),
    primaryInsurancePlan: attr('object'),
    isActive: attr('boolean'),
    displayName: computed('fullName', 'isActive', function () {
        const name = this.get('fullName');
        if (this.get('isActive')) {
            return name;
        }
        return `(Inactive) ${name}`;
    }),
    pinnedPatientNote: belongsTo('patient-note', { async: false })
});
