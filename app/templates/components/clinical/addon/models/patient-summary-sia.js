import { isPresent } from '@ember/utils';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
    transcriptEventGuid: alias('id'),
    patientPracticeGuid: attr('string'),
    transcriptGuid: attr('string'),
    status: attr('string'),
    resultCode: attr(),
    isNegated: attr('boolean'),
    displayName: computed('resultCode', function() {
        if (isPresent(this.get('resultCode'))) {
            return this.get('resultCode.displayName');
        }
    }),
    displayStatus: computed('status', 'isNegated', function() {
        return this.get('isNegated') ? `Not ${this.get('status')}` : this.get('status');
    }),
    startDateTimeUtc: attr('string'),
    startDate: computed('startDateTimeUtc', function() {
        return this.get('startDateTimeUtc') ? moment.utc(this.get('startDateTimeUtc')).format('MM/DD/YYYY') : '-';
    })
});
