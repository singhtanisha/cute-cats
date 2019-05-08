/**
 * A proxy array for Allergies instances that provies helper functions to modify array
 */
import { isPresent } from '@ember/utils';
import { computed, observer } from '@ember/object';
import ArrayProxy from '@ember/array/proxy';

const AllergyArray = ArrayProxy.extend({
    active: computed('@each.isActive', function() {
        return AllergyArray.create({
            content: this.filterBy('isActive')
        });
    }),
    inactive: computed('@each.isActive', function() {
        return AllergyArray.create({
            content: this.rejectBy('isActive')
        });
    }),
    drug: computed('@each.type', function() {
        return AllergyArray.create({
            content: this.filterBy('type', 'drug')
        });
    }),
    environmental: computed('@each.type', function() {
        return AllergyArray.create({
            content: this.filterBy('type', 'environmental')
        });
    }),
    food: computed('@each.type', function() {
        return AllergyArray.create({
            content: this.filterBy('type', 'food')
        });
    }),
    severitySorted: computed('@each.severitySortOrder', function() {
        return AllergyArray.create({
            content: this.sortBy('severitySortOrder', 'allergenText')
        });
    }),
    noKnownAllergies: false,
    updateNoKnownAllergies: observer('drug.@each.isActive', function () {
        // If the content of the array changed we reset this back to false
        if (isPresent(this.get('drug.active'))) {
            this.set('noKnownAllergies', false);
        }
    }),
    /**
     * Replaces the allergy if one with the same allergyGuid already exists or adds one if not
     */
    replaceAllergy(allergy) {
        var content = this.get('content'),
            allergyToReplace = content.findBy('allergyGuid', allergy.get('allergyGuid')),
            allergyToReplaceIndex = content.indexOf(allergyToReplace);

        if (allergyToReplaceIndex !== -1) {
            allergyToReplace.set('content', allergy.get('content'));
        } else {
            content.pushObject(allergy);
        }
    },
    removeAllergy(allergy) {
        var content = this.get('content'),
            allergyToDelete = content.findBy('allergyGuid', allergy.get('allergyGuid'));
        content.removeObject(allergyToDelete);
    }
});

export default AllergyArray;
