import { computed } from '@ember/object';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
    patientPracticeGuid: attr('string'),
    dateOfService: attr('date'),
    comments: attr('string'),

    saveDisabled: computed('comments', 'dateOfService', function () {
        return !this.get('comments.length') || !moment(this.get('dateOfService')).isValid();
    }),

    formattedDate: computed('dateOfService', {
        get() {
            return moment.utc(this.get('dateOfService')).format('MM/DD/YYYY');
        },
        set(key, value) {
            this.set('dateOfService', moment(value).toDate());
            return value;
        }
    })
});
