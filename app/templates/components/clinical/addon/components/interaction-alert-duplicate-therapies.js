import ObjectProxy from '@ember/object/proxy';
import { isPresent } from '@ember/utils';
import { computed } from '@ember/object';
import Component from '@ember/component';
export default Component.extend({
    duplicateTherapies: null,
    isDuplicationSummaryExpanded: false,

    duplicateTherapyGroups: computed('duplicateTherapies.[]', function() {
        let duplicateTherapies = this.get('duplicateTherapies'),
            classInteractions = duplicateTherapies.filterBy('className'),
            sameIngredientInteractions = duplicateTherapies.filterBy('className', null),
            duplicateTherapyGroups = [],
            classInteractionsGroups;

        if (isPresent(classInteractions)) {
            classInteractionsGroups = _.groupBy(classInteractions, (interaction) => interaction.className);
            duplicateTherapyGroups.addObjects(Object.keys(classInteractionsGroups).map((className) => {
                return ObjectProxy.create({
                    content: classInteractionsGroups[className][0],
                    alertLabel: `Class: ${className}`,
                    isAlertTextExpanded: false
                });
            }));
        }

        if (isPresent(sameIngredientInteractions)) {
            duplicateTherapyGroups.addObject(ObjectProxy.create({
                content: sameIngredientInteractions[0],
                alertLabel: 'Same Ingredients',
                isAlertTextExpanded: false
            }));
        }

        return duplicateTherapyGroups;
    }),

    duplicateTherapySummaryText: computed('duplicateTherapyGroups.[]', 'isDuplicationSummaryExpanded', function() {
        let expandText = this.get('isDuplicationSummaryExpanded') ? 'Show less...' : 'Show more...',
            duplicationCount = this.get('duplicateTherapyGroups.length');

        if (duplicationCount > 1) {
            return `Severe Interaction: Therapeutic duplications (${duplicationCount}) ${expandText}`;
        }

        return `Severe Interaction: Therapeutic duplication (1) ${expandText}`;
    }),

    actions: {
        toggleExpandDuplications() {
            this.toggleProperty('isDuplicationSummaryExpanded');
        },

        toggleExpandDuplicationAlertText(duplicateTherapyGroup) {
            duplicateTherapyGroup.toggleProperty('isAlertTextExpanded');
        }
    }
});
