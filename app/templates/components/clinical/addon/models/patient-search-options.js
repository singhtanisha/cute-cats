import { alias } from '@ember/object/computed';
import EmberObject, { computed } from '@ember/object';
import dateHelper from 'common/helpers/dates';

var notStartWithDigit = function (value) {
        return /[^\d]/.test(value);
    },
    SEARCH_OPTIONS = [
        // NOTE: This is at the top so it shows up before the name
        EmberObject.extend({
            label: 'DOB',
            property: 'birthDate',
            valuePlaceHolder: computed('value', function () {
                var value = this.get('value'),
                    dateFormat = 'MM/DD/YYYY';
                if (value && dateHelper.isValidDate(value, dateFormat)) {
                    return dateHelper.formatDate(value);
                } else {
                    return value + dateFormat.slice(value.length);
                }
            }),
            matches: computed('value', function () {
                /* jshint -W101 */ /* line too long */
                return /^0[1-9]?$|^0[1-9][\/]$|^0[1-9][\/][0][1-9]?$|^0[1-9][\/][0][1-9][\/]$|^0[1-9][\/][0][1-9][\/]1$|^0[1-9][\/][0][1-9][\/]19\d{0,2}$|^0[1-9][\/][0][1-9][\/]2$|^0[1-9][\/][0][1-9][\/]20\d{0,2}$|^0[1-9][\/][1-2]\d?$|^0[1-9][\/][1-2]\d[\/]$|^0[1-9][\/][1-2]\d[\/]1$|^0[1-9][\/][1-2]\d[\/]19\d{0,2}$|^0[1-9][\/][1-2]\d[\/]2$|^0[1-9][\/][1-2]\d[\/]20\d{0,2}$|^0[1-9][\/][3][0-1]?$|^0[1-9][\/][3][0-1][\/]$|^0[1-9][\/][3][0-1][\/]1$|^0[1-9][\/][3][0-1][\/]19\d{0,2}$|^0[1-9][\/][3][0-1][\/]2$|^0[1-9][\/][3][0-1][\/]20\d{0,2}$|^1[0-2]?$|^1[0-2][\/]$|^1[0-2][\/][0][1-9]?$|^1[0-2][\/][0][1-9][\/]$|^1[0-2][\/][0][1-9][\/]1$|^1[0-2][\/][0][1-9][\/]19\d{0,2}$|^1[0-2][\/][0][1-9][\/]2$|^1[0-2][\/][0][1-9][\/]20\d{0,2}$|^1[0-2][\/][1-2]\d?$|^1[0-2][\/][1-2]\d[\/]$|^1[0-2][\/][1-2]\d[\/]1$|^1[0-2][\/][1-2]\d[\/]19\d{0,2}$|^1[0-2][\/][1-2]\d[\/]2$|^1[0-2][\/][1-2]\d[\/]20\d{0,2}$|^1[0-2][\/][3][0-1]?$|^1[0-2][\/][3][0-1][\/]$|^1[0-2][\/][3][0-1][\/]1$|^1[0-2][\/][3][0-1][\/]19\d{0,2}$|^1[0-2][\/][3][0-1][\/]2$|^1[0-2][\/][3][0-1][\/]20\d{0,2}$/.test(this.get('value'));
                /* jshint +W101 */
            })
        }),
        // TODO: first and lastName didn't work...
        // EmberObject.extend({
        //     label: 'First name',
        //     property: 'firstName',
        //     valuePlaceHolder: alias('value'),
        //     matches: function () {
        //         return notStartWithDigit(this.get('value'));
        //     }.property('value')
        // }),
        // EmberObject.extend({
        //     label: 'Last name',
        //     property: 'lastName',
        //     valuePlaceHolder: alias('value'),
        //     matches: function () {
        //         return notStartWithDigit(this.get('value'));
        //     }.property('value')
        // }),
        // EmberObject.extend({
        //     label: 'Name',
        //     property: 'firstOrLastName',
        //     valuePlaceHolder: alias('value'),
        //     matches: function () {
        //         return notStartWithDigit(this.get('value'));
        //     }.property('value')
        // }),
        EmberObject.extend({
            label: 'Name',
            property: 'namePropertyUsedToWorkaroundBackendLimitations',
            valuePlaceHolder: alias('value'),
            matches: computed('value', function () {
                return notStartWithDigit(this.get('value'));
            })
        }),
        EmberObject.extend({
            label: 'SSN',
            property: 'socialSecurityNumber',
            valuePlaceHolder: alias('value'),
            matches: computed('value', function () {
                return /^\d{1,9}$|^\d{3}-$|^\d{3}-\d{1,6}$|^\d{1,3}-\d{1,2}-$|^\d{1,3}-\d{1,2}-\d{1,4}$|^\d{5}-$|^\d{5}-\d{1,4}$/.test(this.get('value'));
            })
        }),
        EmberObject.extend({
            label: 'PRN',
            property: 'patientRecordNumber',
            valuePlaceHolder: alias('value'),
            matches: computed('value', function () {
                // No validation for PRN since it's free text
                return this.get('value').length;
            })
        })
    ],
    searchOptions = function () {
        return SEARCH_OPTIONS.map(function (Constructor) {
            return Constructor.create();
        });
    };
export default searchOptions;
