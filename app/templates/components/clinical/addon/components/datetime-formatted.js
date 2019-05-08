import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import Component from '@ember/component';
const nullableMoment = { format: $.noop };
export default Component.extend({
    tagName: 'time',
    datetime: null,
    format: 'MM/DD/YY',
    titleFormat: 'dddd MMMM Do YYYY',
    attributeBindings: ['datetime', 'title', 'data-element'],
    isSourceInUtc: true,
    title: computed('moment', function() {
        return this.get('moment').format(this.get('titleFormat'));
    }),
    humanize: false,
    formattedDate: computed('moment', 'humanize', 'format', function () {
        if (this.get('humanize')) {
            return this.get('moment').fromNow();
        }
        return this.get('moment').format(this.get('format'));
    }),
    moment: computed('datetime', function () {
        if (isEmpty(this.get('datetime'))) {
            return nullableMoment;
        }
        var value;
        if (this.get('isSourceInUtc')) {
            value = moment.utc(this.get('datetime'));
        } else {
            value = moment(this.get('datetime'));
        }
        return value;
    })
});
