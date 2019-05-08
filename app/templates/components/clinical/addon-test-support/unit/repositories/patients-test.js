import { get } from '@ember/object';
import { resolve, reject, all } from 'rsvp';
import { module, test } from 'qunit';
import sinon from 'sinon';
import repository from 'clinical/repositories/patients';
import PFServer from 'boot/util/pf-server';

function fail(assert, error) {
    assert.ok(false, error);
    throw error;
}

module('Unit - Core - Clinical | Repository - patients', {
    beforeEach: function() {
        sinon.stub(PFServer, 'promise').returns(resolve({diagnoses: [], medications: []}));
    },
    afterEach: function() {
        repository.loadClinicalData.expire('patientGuid');
        PFServer.promise.restore();
    }
});

test('loadClinicalData caches data', function(assert) {
    let done = assert.async();
    assert.equal(PFServer.promise.calledOnce, false);
    repository.loadClinicalData('patientGuid').then(function() {
        assert.ok(PFServer.promise.calledOnce);

        return repository.loadClinicalData('patientGuid').then(function() {
            assert.ok(PFServer.promise.calledOnce);

            return repository.loadClinicalData('patientGuid', {forceReload: true}).then(function() {
                assert.ok(PFServer.promise.calledTwice);

                return repository.loadClinicalData('patientGuid').then(function() {
                    assert.ok(PFServer.promise.calledTwice);

                    // Different parameters haver their own cache
                    return repository.loadClinicalData('differentPatientGuid').then(function() {
                        assert.ok(PFServer.promise.calledThrice);
                        repository.loadClinicalData('differentPatientGuid').then(function() {
                            assert.ok(PFServer.promise.calledThrice);

                            repository.loadClinicalData.expire('patientGuid');
                            repository.loadClinicalData('patientGuid');
                            assert.equal(PFServer.promise.callCount, 4);
                        });
                    });
                });
            });
        });
    }).catch(fail).finally(done);
});

test('loadClinicalData if the promise fails, it should retry if we call loadClinicalData again', function(assert) {
    let done = assert.async();

    PFServer.promise.returns(reject('rejected by sinon'));
    repository.loadClinicalData('patientGuid').catch(() => true).finally(function() {
        assert.ok(PFServer.promise.calledOnce);
        var fakedData = {diagnoses: [], medications: []};
        PFServer.promise.returns(resolve(fakedData));
        return repository.loadClinicalData('patientGuid').then(function (returnedData) {
            var diagnosesCount = get(returnedData, 'diagnoses.length'),
                medicationsCount = get(returnedData, 'medications.length');
            assert.ok(PFServer.promise.calledTwice);
            assert.equal(diagnosesCount, 0);
            assert.equal(medicationsCount, 0);
        }).catch(error => fail(assert, error)).finally(done);
    });
});

test('loadClinicalData forceReload should update the original arrays and return the same instance', function(assert) {
    let done = assert.async();

    repository.loadClinicalData('patientGuid').then(function (data) {
        return repository.loadClinicalData('patientGuid', {forceReload: true}).then(function (newData) {
            assert.ok(data.diagnoses === newData.diagnoses);
            assert.ok(data.medications === newData.medications);
        });
    }).catch(error => fail(assert, error)).finally(done);
});

test('expiring something thats not cached shouldnt crash', function(assert) {
    assert.expect(0);
    repository.loadClinicalData.expire('fakePatientGuidThatDoesntExist');
});

test('getClinicalData returns what we have in the cache if anything', function(assert) {
    let done = assert.async();
    repository.getClinicalData('patientGuid').then(function (firstAttempt) {
        assert.equal(PFServer.promise.callCount, 0);

        return repository.loadClinicalData('patientGuid').then(function (loadResult) {
            assert.equal(PFServer.promise.callCount, 1);
            return repository.getClinicalData('patientGuid').then(function (getResult) {
                assert.equal(PFServer.promise.callCount, 1);
                assert.ok(loadResult === getResult);
                assert.ok(firstAttempt.diagnoses === loadResult.diagnoses);
                assert.ok(firstAttempt.medications === loadResult.medications);
            });
        });
    }).catch(error => fail(assert, error)).finally(done);
});

test('parallel calls to loadClinicalData should be coalesced as a single call', function(assert) {
    let done = assert.async(),
        promises = [ repository.loadClinicalData('patientGuid'), repository.loadClinicalData('patientGuid') ];
    return all(promises).then(function() {
        assert.equal(PFServer.promise.callCount, 1);
    }).catch(error => fail(assert, error)).finally(done);
});

test('parallel failed calls to loadClinicalData should not leave a failed promise in the cache', function(assert) {
    let done = assert.async();
    PFServer.promise.returns(reject('rejected by sinon'));
    var promises = [repository.loadClinicalData('patientGuid'),
        repository.loadClinicalData('patientGuid')];
    return all(promises).catch(function() {
        assert.equal(PFServer.promise.callCount, 1);
        var fakedData = {diagnoses: [], medications: []};
        PFServer.promise.returns(resolve(fakedData));
        return repository.loadClinicalData('patientGuid').then(function() {
            assert.equal(PFServer.promise.callCount, 2);
            assert.ok('The second call succeeded instead of re-using the failed promise');
        });
    }).catch(error => fail(assert, error)).finally(done);
});

test('parallel failed calls to loadClinicalData should not leave a failed promise in the cache and won\'t be used by getClinicalData', function(assert) {
    let done = assert.async();
    PFServer.promise.returns(reject('rejected by sinon'));
    var promises = [repository.loadClinicalData('patientGuid'),
        repository.loadClinicalData('patientGuid')];
    return all(promises).catch(function() {
        assert.equal(PFServer.promise.callCount, 1);
        return repository.getClinicalData('patientGuid').then(function() {
            assert.equal(PFServer.promise.callCount, 1);
            assert.ok('The second call succeeded instead of re-using the failed promise');
        });
    }).catch(error => fail(assert, error)).finally(done);
});

test('getClinicalData returns the same instance if called multiple times', function(assert) {
    let done = assert.async();
    repository.getClinicalData('patientGuid').then(function (firstResult) {
        assert.equal(PFServer.promise.callCount, 0);

        return repository.getClinicalData('patientGuid').then(function (secondResult) {
            assert.equal(PFServer.promise.callCount, 0);
            assert.ok(firstResult === secondResult);
        });
    }).catch(error => fail(assert, error)).finally(done);
});
