import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import setupStore from 'boot/tests/helpers/store';
import { startMirage } from 'boot/initializers/ember-cli-mirage';
import PatientGoalModel from 'clinical/models/patient-goal';
import PatientGoalAdapter from 'clinical/adapters/patient-goal';
import PatientGoalSerializer from 'clinical/serializers/patient-goal';
import FormattedDateTransform from 'common/transforms/formatted-date';

let env;
let store;

module('Unit - Core - Clinical | Model - Patient Goals', {
    beforeEach() {
        env = setupStore({
            adapters: {
                'patient-goal': PatientGoalAdapter
            },
            serializers: {
                'patient-goal': PatientGoalSerializer
            },
            models: {
                'patient-goal': PatientGoalModel
            },
            transforms: {
                'formatted-date': FormattedDateTransform
            }
        });
        store = env.store;
        this.server = startMirage();
    },
    afterEach() {
        this.server.shutdown();
        store = null;
    }
});

test('Patient goal results are serialized correctly', (assert) => {
    const done = assert.async();
    const patientPracticeGuid = '4fa531c0-12f2-42dc-9419-ddd583272c76';
    let endpointCalled = false;

    server.get('/ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/patientGoals', ({ db }) => {
        endpointCalled = true;
        return db.patientGoals[0];
    });

    store.query('patient-goal', { patientPracticeGuid }).then((results) => {
        const result = results.get('firstObject');
        assert.ok(endpointCalled, 'The patient list endpoint was called when issuing the store.query call');
        assert.ok(result, 'The result was serialized into a model');
        assert.equal(result.get('patientPracticeGuid'), '4fa531c0-12f2-42dc-9419-ddd583272c76', 'IsActive attribute was serialized correctly');
        assert.equal(result.get('isActive'), true, 'IsActive attribute was serialized correctly');
        assert.equal(result.get('effectiveDate'), '07/09/1991', 'EffectiveDate attribute was serialized correctly');
        assert.equal(result.get('description'), 'Some text here', 'Description attribute was serialized correctly');
        done();
    });
});

test('Patient goal POST, PUT, and DELETE are successful', (assert) => {
    const done = assert.async();
    const patientGoalGuid = '3c61bd39-c8e2-4f02-9713-d5d3a166398c';
    let postCalled = false;
    let putCalled = false;
    let deleteCalled = false;

    server.post('/ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/patientGoals', () => {
        postCalled = true;
        return {
    		'patientGoal': {
        		'patientGoalGuid': patientGoalGuid,
        		'patientPracticeGuid': '4fa531c0-12f2-42dc-9419-ddd583272c76',
        		'isActive': true,
        		'effectiveDate': '1991-07-09T00:00:00Z',
        		'description': 'Some text here'
    		}
        };
    });

    server.put('/ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/patientGoals/:patientGoalGuid', () => {
        putCalled = true;
        return {};
    });

    server.delete('/ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/patientGoals/:patientGoalGuid', () => {
        deleteCalled = true;
        return;
    });

    run(() => {
        const goal = store.createRecord('patient-goal', {
            patientPracticeGuid: '4fa531c0-12f2-42dc-9419-ddd583272c76',
            isActive: true,
            effectiveDate: '1991-07-09T00:00:00Z',
            description: 'Patient goal here'
        });

        goal.save().then(() => {
            const savedGoal = store.peekRecord('patient-goal', patientGoalGuid);
            assert.ok(postCalled, 'The patient goal POST call was made');
            assert.ok(savedGoal, 'A new goal appears in the store');
            savedGoal.set('description', 'Some other text here');
            savedGoal.save().then(() => {
                const updatedGoal = store.peekRecord('patient-goal', patientGoalGuid);
                assert.ok(putCalled, 'The patient goal PUT call was made');
                assert.equal(updatedGoal.get('description'), 'Some other text here', 'Patient goal was updated and stored correctly');
                updatedGoal.destroyRecord().then(() => {
                    const deletedGoal = store.peekRecord('patient-goal', patientGoalGuid);
                    assert.ok(deleteCalled, 'The patient goal DELETE call was made');
                    assert.ok(!deletedGoal || deletedGoal.get('isDeleted'), 'Goal no longer exists in store after deleting');
                    done();
                });
            });
        });
    });
});
