import { isEmpty } from '@ember/utils';
import { equal } from '@ember/object/computed';
import EmberObject, { computed } from '@ember/object';
export default EmberObject.extend({
    display: null,
    type: null,
    isLink: equal('type', 'chartnote'),
    identifier: null,
    route: computed('isLink', function() {
        return this.get('isLink') ? 'encounter' : null;
    }),
    isCurrentRoute: computed('route', 'identifier', function() {
        var hash = window.location.hash,
            route = this.get('route'),
            identifier = this.get('identifier');

        if (isEmpty(route) || isEmpty(identifier)) {
            return false;
        }
        return hash.indexOf(route) !== -1 && hash.indexOf(identifier) !== -1;
    })
});
