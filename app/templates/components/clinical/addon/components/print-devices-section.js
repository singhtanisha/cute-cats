import { sort } from '@ember/object/computed';
import { computed } from '@ember/object';
import Component from '@ember/component';
export default Component.extend({
    classNames: ['table', 'print-devices-section'],
    sortAscending: false,
    sortProperty: 'userEnteredInfo.userEnteredImplantDate',
    users: null,
    init() {
        this._super();
        this.set('users', []);
    },

    devices: computed('data', 'sortProperty', function () {
        if (this.get('sortProperty')) {
            return this.get('sortedData');
        }
        return this.get('data');
    }),

    sortProperties: computed('sortProperty', 'sortAscending', function () {
        const sortProperties = ['isActive', this.get('sortProperty')];
        if (this.get('sortAscending')) {
            return sortProperties;
        }
        return sortProperties.map(property => `${property}:desc`);
    }),
    sortedData: sort('data', 'sortProperties')
});
