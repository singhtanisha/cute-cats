
import { resolve } from 'rsvp';
import Observable from '@ember/object/observable';
import EmberObject, { observer } from '@ember/object';
function getPropertyForSortOrder (value) {
    const map = {
        alpha: 'name',
        manual: 'sortIndex'
    };

    return map[value];
}

function buildSortOrderObjectFromValue (preference) {
    const value = preference.get('value');

    if (value.indexOf(':') !== -1) {
        const sortPair = value.split(':');

        return EmberObject.create({
            property: getPropertyForSortOrder(sortPair[0]),
            sortAscending: sortPair[1] === 'asc',
            preference
        });
    } else {
        return EmberObject.create({
            property: getPropertyForSortOrder(value),
            sortAscending: true,
            preference
        });
    }
}

function findPreference(store, key) {
    return store.query('provider-preference', { keys: [key]}).then(result => {
        if (result.get('length') === 1) {
            return result.get('firstObject');
        } else {
            const lowerKey = key.toLowerCase();
            return result.find(preference => {
                const type = preference.get('type');
                return type && type.toLowerCase() === lowerKey;
            });
        }
    });
}

const FavoriteDiagnosesSettings = EmberObject.extend(Observable, {
    getSortOrder(store, forceFetch) {
        let sortOrder = this.get('sortOrder');

        if (sortOrder === undefined || forceFetch) {
            return findPreference(store, 'Charting.FavoriteDiagnosesSortOrder').then(preference => {
                preference.set('autoSave', true);
                sortOrder = buildSortOrderObjectFromValue(preference);
                this.set('sortOrder', sortOrder);
                return sortOrder;
            });
        } else {
            return resolve(sortOrder);
        }
    },

    updateSortOrderObjectWhenValueChanges: observer('sortOrder.preference.value', function () {
        let newSortOrderValues = buildSortOrderObjectFromValue(this.get('sortOrder.preference'));

        this.set('sortOrder.property', newSortOrderValues.get('property'));
        this.set('sortOrder.sortAscending', newSortOrderValues.get('sortAscending'));
    }),

    getDisplayCodeSystem() {
        return resolve('icd10');
    }
});

export default FavoriteDiagnosesSettings.create();
