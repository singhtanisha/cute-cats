import Medication from 'clinical/models/medication';
import { module, test } from 'qunit';

module('Unit - Core - Clinical | Model - medications array tests');

const today = moment(new Date()).format('MM/DD/YYYY');
const dayAfterNext = moment(new Date()).add(2, 'day').format('MM/DD/YYYY');
// Initial state: AlbuRx is duplciated 4 times and Xanax twice. Always active
function medicationsArrayWithDuplicates () {
    return [{
        tradeName: 'AlbuRx',
        ndc: '44206031025',
    }, {
        tradeName: 'AlbuRx',
        ndc: '44206031025',
    }, {
        tradeName: 'AlbuRx',
        ndc: '44206031025',
    }, {
        tradeName: 'AlbuRx',
        ndc: '44206031025'
    }, {
        tradeName: 'Tylenol',
        ndc: '00045050008',
    }, {
        tradeName: 'Xanax',
        ndc: '00009002901',
    }, {
        tradeName: 'Xanax',
        ndc: '00009002901',
    }];
}

test('currentByNdc groups the active meds by ndc', function(assert) {
    let medicationsArray = Medication.wrap(medicationsArrayWithDuplicates());
    assert.equal(medicationsArray.get('currentByNdc')['44206031025'].length, 4);
    medicationsArray.get('firstObject').set('stopDateTime', today);
    assert.equal(medicationsArray.get('currentByNdc')['44206031025'].length, 3);
    assert.equal(medicationsArray.get('currentByNdc')['00009002901'].length, 2);
    assert.equal(medicationsArray.get('currentByNdc')['00045050008'].length, 1);
});

test('groupOfDuplicates returns a list of all the duplicates', function(assert) {
    let medicationsArray = Medication.wrap(medicationsArrayWithDuplicates());
    assert.equal(medicationsArray.get('groupOfDuplicates').length, 2);
});

test('duplicates don\'t include custom (or meds with empty ndcs)', function(assert) {
    const medicationsArray = Medication.wrap([{
            tradeName: 'Custom Med 1',
            ndc: '',
        }, {
            tradeName: 'Custo Med 2',
            ndc: '',
        }]);
    assert.equal(medicationsArray.get('groupOfDuplicates').length, 0);
});

test('duplicates don\'t include future medications', function(assert) {
    const medicationsArray = Medication.wrap([{
            tradeName: 'AlbuRx',
            ndc: '44206031025',
            startDateTime: dayAfterNext
        }, {
            tradeName: 'AlbuRx',
            ndc: '44206031025',
            startDateTime: dayAfterNext
        }]);
    assert.equal(medicationsArray.get('groupOfDuplicates').length, 0);
    medicationsArray.set('firstObject.startDateTime', null);
    assert.equal(medicationsArray.get('groupOfDuplicates').length, 0);
    medicationsArray.set('lastObject.startDateTime', null);
    assert.equal(medicationsArray.get('groupOfDuplicates').length, 1);
});

test('duplicates don\'t include historical medications', function(assert) {
    const medicationsArray = Medication.wrap([{
            tradeName: 'AlbuRx',
            ndc: '44206031025',
            stopDateTime: today
        }, {
            tradeName: 'AlbuRx',
            ndc: '44206031025',
            stopDateTime: today
        }]);
    assert.equal(medicationsArray.get('groupOfDuplicates').length, 0);
    medicationsArray.set('firstObject.stopDateTime', null);
    assert.equal(medicationsArray.get('groupOfDuplicates').length, 0);
    medicationsArray.set('lastObject.stopDateTime', null);
    assert.equal(medicationsArray.get('groupOfDuplicates').length, 1);
});
