import EmberObject from '@ember/object';

export default EmberObject.extend({
    relativeGuid: null,
    patientPracticeGuid: null,
    firstName: null,
    lastName: null,
    relationshipType: null,
    dateOfBirth: null,
    isDeceased: false,
    comment: '',
    observation: null
});
