import { module, test } from 'qunit';
import Allergen from 'clinical/models/allergen';

module('Unit - Core - Clinical | Model - Allergen');

test('Ingredients are classified into the correct group', assert => {
    const allergen = Allergen.create({
        allergenType: 'Class',
        name: 'Amoxicillin',
        rxNormCui: '723',
        score: 0.00336285075,
        probability: 1,
        isIngredient: true
    });

    assert.equal(allergen.get('group.display'), 'Ingredient');
    assert.equal(allergen.get('rxNormCui'), '723');
    assert.equal(allergen.get('name'), 'Amoxicillin');
});

test('Classes are classified into the correct group when IsIngredient is false', assert => {
    const allergen = Allergen.create({
        allergenType: 'Class',
        name: 'Penicillins',
        score: 4.62047625,
        probability: 1,
        isIngredient: false
    });
    assert.equal(allergen.get('group.display'), 'Class');
});

test('Classes are classified into the correct group when IsIngredient is not present', assert => {
    const allergen = Allergen.create({
        allergenType: 'Class',
        name: 'Penicillins',
        score: 4.62047625,
        probability: 1
    });
    assert.equal(allergen.get('group.display'), 'Class');
});

test('Products are classified into the correct group', assert => {
    const allergen = Allergen.create({
        allergenType: 'PackagedDrug',
        name: 'Bicillin L-A',
        rxNormCui: '731572',
        score: 0.00336285075,
        ndc: '60793070210'
    });

    assert.equal(allergen.get('group.display'), 'Product');
    assert.equal(allergen.get('rxNormCui'), '731572');
    assert.equal(allergen.get('name'), 'Bicillin L-A');
    assert.equal(allergen.get('ndc'), '60793070210');
});
