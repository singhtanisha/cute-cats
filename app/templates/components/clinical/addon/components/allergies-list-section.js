import { computed } from '@ember/object';
import { empty, equal, and } from '@ember/object/computed';
import Component from '@ember/component';
import  WithComments from 'clinical/mixins/with-comments';

export default Component.extend(WithComments, {
    data: null,
    title: null,
    isAllowedToEditAllegies: true,
    hasNoActiveAllergies: empty('data.active'),
    hasNoAllergies: empty('data'),
    isDrugSection: equal('title', 'Drug'),
    isDrugAllergyCheckboxVisible: and('isDrugSection', 'hasNoActiveAllergies'),
    isInactiveSection: equal('title', 'Inactive'),
    noAllergiesMessage: computed('title', function() {
        return `No ${this.get('title').toLowerCase()} allergies recorded`;
    }),
    sectionClass: computed('title', function() {
        return this.get('title').toLowerCase();
    }),
    actions: {
        toggleProperty(key) {
            this.toggleProperty(key);
        },
        editAllergy(allergy) {
            this.sendAction('editAllergy', allergy);
        }
    }
});
