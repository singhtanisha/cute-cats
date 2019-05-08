import { moduleFor, test } from 'ember-qunit';
import ImmunizationSearch from 'clinical/models/immunization-search';

moduleFor('model:immunizationSearch', 'Unit - Core - Clinical | Model - ImmunizationSearch', {
    unit: true,
    afterEach() {
        let store = this.container.lookup('service:store');

        if (store) {
            store.destroy = function() {
                // Do nothing because this breaks pre ember-data beta 1.15
            };
        }
    }
});

test('displayName computed property', function(assert) {
    let immunizationSearch = ImmunizationSearch.create({
        name: 'testName',
        isActive: true
    });

    assert.equal(immunizationSearch.get('displayName'), 'testName');

    immunizationSearch.set('isActive', false);

    assert.equal(immunizationSearch.get('displayName'), 'testName (discontinued)');

    immunizationSearch.set('matchedAlternateName', 'testBrandName');

    assert.equal(immunizationSearch.get('displayName'), 'testBrandName / testName (discontinued)');

    immunizationSearch.set('isActive', true);

    assert.equal(immunizationSearch.get('displayName'), 'testBrandName / testName');
});

test('isCustom computed property', function(assert) {
    let immunizationSearch = ImmunizationSearch.create({
        searchTypeCode: 'CustomVaccine'
    });

    assert.equal(immunizationSearch.get('isCustom'), true);
});

test('isFromInventory computed property', function(assert) {
    let immunizationSearch = ImmunizationSearch.create({
        searchTypeCode: 'VaccineInventory'
    });

    assert.equal(immunizationSearch.get('isFromInventory'), true);
});

test('isGroup computed property', function(assert) {
    let immunizationSearch = ImmunizationSearch.create({
        searchTypeCode: 'ImmunizationGroup'
    });

    assert.equal(immunizationSearch.get('isGroup'), true);
});

test('isCustomOrFromInventory computed property', function(assert) {
    let immunizationSearch = ImmunizationSearch.create({
        searchTypeCode: 'CustomVaccine'
    });

    assert.equal(immunizationSearch.get('isCustomOrFromInventory'), true);

    immunizationSearch.set('searchTypeCode', 'VaccineInventory');

    assert.equal(immunizationSearch.get('isCustomOrFromInventory'), true);
});

test('isDynamic computed property', function(assert) {
    let immunizationSearch = ImmunizationSearch.create({
        searchTypeCode: 'DynamicVaccine'
    });

    assert.equal(immunizationSearch.get('isDynamic'), true);
});

test('isInactive computed property', function(assert) {
    let immunizationSearch = ImmunizationSearch.create({
        isActive: false
    });

    assert.equal(immunizationSearch.get('isInactive'), true);
});
