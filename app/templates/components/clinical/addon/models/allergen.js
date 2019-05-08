import EmberObject, { computed } from '@ember/object';
const ALLERGEN_TYPE_MAP = {
    Class: { display: 'Class', sort: 1 },
    PackagedDrug: { display: 'Product', sort: 4 },
    GenericDrug: { display: 'Generic', sort: 3 },
    MedicalSupply: { display: 'Medical Supply', sort: 5 },
    ingredient: { display: 'Ingredient', sort: 2 }
};

export default EmberObject.extend({
    group: computed('allergenType', 'isIngredient', function () {
        const type = this.get('allergenType');
        if (type === 'Class' && this.get('isIngredient')) {
            return ALLERGEN_TYPE_MAP.ingredient;
        }
        return ALLERGEN_TYPE_MAP[type];
    }),
    id: computed('allergenType', 'isIngredient', 'rxNormCui', 'name', function () {
        const { allergenType, isIngredient, rxNormCui, name } = this.getProperties('allergenType', 'isIngredient', 'rxNormCui', 'name');
        return `${allergenType}-${name}-${isIngredient}-${rxNormCui}`;
    })
});
