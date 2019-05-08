import { run } from '@ember/runloop';
import Medication from 'clinical/models/medication';
import { module, test } from 'qunit';
import wait from 'ember-test-helpers/wait';

module('Unit - Core - Clinical | Model - medication tests');

const today = moment(new Date()).format('MM/DD/YYYY');
const dayAfterNext = moment(new Date()).add(2, 'day').format('MM/DD/YYYY');

test('duplicates don\'t include future medications', assert => {
    assert.expect(6);
    const medicationsArray = Medication.wrap([{
        medicationGuid: 1,  // It's used to exclude the same med from the list of duplicates
        tradeName: 'AlbuRx',
        ndc: '44206031025',
        startDateTime: dayAfterNext
    }, {
        medicationGuid: 2,
        tradeName: 'AlbuRx',
        ndc: '44206031025',
        startDateTime: dayAfterNext
    }]);
    return wait().then(() => {
        assert.equal(medicationsArray.get('firstObject.duplicates.length'), 0);
        assert.equal(medicationsArray.get('lastObject.duplicates.length'), 0);

        medicationsArray.set('firstObject.startDateTime', null);
        return wait().then(() => {
            assert.equal(medicationsArray.get('firstObject.duplicates.length'), 0);
            assert.equal(medicationsArray.get('lastObject.duplicates.length'), 0);
            run(() => {
                medicationsArray.set('lastObject.startDateTime', null);
                return wait().then(() => {
                    assert.equal(medicationsArray.get('firstObject.duplicates.length'), 1);
                    assert.equal(medicationsArray.get('lastObject.duplicates.length'), 1);
                });
            });
        });
    });
});

test('duplicates don\'t include historical medications', function(assert) {
    let medicationsArray;
    run(() => {
        medicationsArray = Medication.wrap([{
            medicationGuid: 1,
            tradeName: 'AlbuRx',
            ndc: '44206031025',
            stopDateTime: today
        }, {
            medicationGuid: 2,
            tradeName: 'AlbuRx',
            ndc: '44206031025',
            stopDateTime: today
        }]);
    });
    return wait().then(() => {
        assert.equal(medicationsArray.get('firstObject.duplicates.length'), 0);
        assert.equal(medicationsArray.get('lastObject.duplicates.length'), 0);

        medicationsArray.set('firstObject.stopDateTime', null);
        return wait().then(() => {
            assert.equal(medicationsArray.get('firstObject.duplicates.length'), 0);
            assert.equal(medicationsArray.get('lastObject.duplicates.length'), 0);

            medicationsArray.set('lastObject.stopDateTime', null);
            return wait().then(() => {
                assert.equal(medicationsArray.get('firstObject.duplicates.length'), 1);
                assert.equal(medicationsArray.get('lastObject.duplicates.length'), 1);
            });
        });
    });
});


test('addComment for a medication with a weird TranscriptGuid should add a new transcriptMed for the encountersGuid', function(assert) {
    var encountersGuid = '760b8d9c-9433-42bb-90e8-4eccfc65fa5b/02-24-2014',
        medication = Medication.wrap({
            transcriptMedications: [{
                transcriptGuid: null,
                comment: '',
                lastModifiedDateTimeUtc: null
            }]
        });

    medication.addComment('this is a comment', encountersGuid);

    assert.equal(medication.get('transcriptMedications').length, 2);
    assert.equal(medication.get('transcriptMedications')[1].transcriptGuid, encountersGuid);
    assert.equal(medication.get('transcriptMedications')[1].comment, 'this is a comment');
});


test('addComment for a transcript with a null TranscriptGuid should add a new transcriptMed for the encountersGuid', function(assert) {
    var encountersGuid = '760b8d9c-9433-42bb-90e8-4eccfc65fa5b/02-24-2014',
        medication = Medication.wrap({
            transcriptMedications: [{
                transcriptGuid: null,
                comment: '',
                lastModifiedDateTimeUtc: null
            }]
        });

    medication.addComment('this is a comment', encountersGuid);

    assert.equal(medication.get('transcriptMedications').length, 2);
    assert.equal(medication.get('transcriptMedications')[1].transcriptGuid, encountersGuid);
    assert.equal(medication.get('transcriptMedications')[1].comment, 'this is a comment');
});

test('addComment for a transcript with no transcriptMedications', function(assert) {
    var encountersGuid = '760b8d9c-9433-42bb-90e8-4eccfc65fa5b/02-24-2014',
        medication = Medication.wrap({});

    medication.addComment('this is a comment', encountersGuid);

    assert.equal(medication.get('transcriptMedications').length, 1);
    assert.equal(medication.get('transcriptMedications')[0].transcriptGuid, encountersGuid);
    assert.equal(medication.get('transcriptMedications')[0].comment, 'this is a comment');
});

test('addComment creates and a default transcript if no encounterGuid is provided', function(assert) {
    var medication = Medication.wrap({
            transcriptMedications: [{
                transcriptGuid: 'irrelevant',
                comment: '',
                lastModifiedDateTimeUtc: null
            }]
        });
    var doTest = function (encounterGuid) {
        medication.addComment('this is a comment', encounterGuid);
        assert.equal(medication.get('transcriptMedications').length, 2);
        assert.equal(medication.get('transcriptMedications')[1].comment, 'this is a comment');
    };
    doTest();
    doTest(undefined);
    doTest(null);
});

test('getTranscriptMedications returns the default one based on the transcriptGuid', function (assert) {
    var medication = Medication.wrap({
        transcriptMedications: [{
            transcriptGuid: null,
            comment: 'comment for default transcript guid',
            lastModifiedDateTimeUtc: null
        }, {
            transcriptGuid: '760b8d9c-9433-42bb-90e8-4eccfc65fa5b/02-24-2014',
            comment: 'comment for default transcript guid',
            lastModifiedDateTimeUtc: null
        }, {
            transcriptGuid: 'irrelevant',
            comment: '',
            lastModifiedDateTimeUtc: null
        }]
    });
    assert.equal(medication.getTranscriptMedication().comment, 'comment for default transcript guid');
    assert.equal(medication.getTranscriptMedication('760b8d9c-9433-42bb-90e8-4eccfc65fa5b/02-24-2014').comment, 'comment for default transcript guid');
});

test('isHistorical should be false if stopDateTime is null', function (assert) {
    var attempts = 10000;
    assert.expect(attempts);
    for (var i = attempts -1; i >= 0; i--) {
        let medication = Medication.wrap({});
        assert.equal(medication.get('isHistorical'), false, 'Medication should not be historical without a stopDateTime');
    }
});
