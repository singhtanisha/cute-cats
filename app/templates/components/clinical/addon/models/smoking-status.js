import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import dateHelper from 'common/helpers/dates';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
    patientSmokingStatusGuid: alias('id'),
    patientPracticeGuid: attr('string'),
    smokingStatusId: attr('number'),
    description: attr('string'),
    effectiveDate: attr('date'),
    smokingStatusGuid: attr('string'),

    saveDisabled: computed('smokingStatusIdString', 'effectiveDate', function () {
        const effectiveDate = this.get('effectiveDate');
        return !this.get('smokingStatusIdString') || !dateHelper.isDateInRange(effectiveDate, '1753-01-01', new Date());
    }),
    smokingStatusIdString: alias('smokingStatusGuid'),
    formattedDate: computed('effectiveDate', {
        get() {
            return moment(this.get('effectiveDate')).format('MM/DD/YYYY');
        },
        set(key, value) {
            this.set('effectiveDate', moment(moment(value).format('MM/DD/YYYY')).toDate());
            return value;
        }
    })
});
