import { isEmpty } from '@ember/utils';
import { alias } from '@ember/object/computed';
import { computed, observer } from '@ember/object';
import Component from '@ember/component';
import SiaDateMixin from 'charting/mixins/sia-date';

export default Component.extend(SiaDateMixin, {
    tooltipClass: computed('errors', function() {
        return 'sia-start-date-picker box-margin-Bxs';
    }),
    startDateTimeUtc: alias('responses.startDateTime'),
    endDateTimeUtc: alias('responses.endDateTime'),
    errorChangeObserver: observer('errors', function() {
        // when only startDateTime is entered, errors has empty startDateTimeUtc and endDateTimeUtc properties
        const errors = this.get('errors');
        if (_.isEmpty(errors) || (isEmpty(errors.startDateTimeUtc) && isEmpty(errors.endDateTimeUtc))) {
            this.attrs.setErrors(null);
        } else {
            this.attrs.setErrors(errors);
        }
    }),
});
