import { computed } from '@ember/object';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
    administeredByProviderGuid: attr('string'),
    administeredDateTime: attr('date'),
    comment: attr('string'),
    dosesFromInventory: attr('number'),
    patientEmailAddress: attr('string'),
    patientFirstName: attr('string'),
    patientGuid: attr('string'),
    patientLastName: attr('string'),
    patientPhoneNumber: attr('string'),
    patientPracticeGuid: attr('string'),
    practiceGuid: attr('string'),
    vaccinationDate: attr('string'),
    vaccinationGuid: attr('string'),

    formattedDate: computed('administeredDateTime', {
        get() {
            return moment.utc(this.get('administeredDateTime')).format('MM/DD/YYYY');
        },
        set(key, value) {
            this.set('administeredDateTime', moment(value).toDate());
            return value;
        }
    })
});
