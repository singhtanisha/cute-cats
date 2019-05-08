import { sort, or } from '@ember/object/computed';
import { computed } from '@ember/object';
import Component from '@ember/component';
export default Component.extend({
    classNames: ['table'],
    medications: computed('data', 'sortProperty', function () {
        if (this.get('sortProperty')) {
            return this.get('sortedData');
        }
        return this.get('data');
    }),
    sortProperties: computed('sortProperty', 'sortAscending', function () {
        const sortProperty = this.get('sortProperty');
        if (this.get('sortAscending')) {
            return [sortProperty];
        }
        return [`${sortProperty}:desc`];
    }),
    sortedData: sort('data', 'sortProperties'),
    anyComments: or('showComments', 'showEncounterComments', 'showScripts', 'sortProperty', 'sortAscending', 'showHistoricalMeds', 'showActiveMeds')
});
