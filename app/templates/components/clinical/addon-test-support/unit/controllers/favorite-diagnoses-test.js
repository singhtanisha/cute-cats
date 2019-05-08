import EmberObject from '@ember/object';
import ArrayProxy from '@ember/array/proxy';
import { run } from '@ember/runloop';
import { moduleFor, test } from 'ember-qunit';
import { isDuplicate } from 'clinical/models/favorite-diagnosis';

moduleFor('controller:settings.favoriteDiagnoses', 'Unit - Core - Clinical | Controller - Favorite Diagnoses', {
    unit: true,
    beforeEach () {
        run(() => {
            this.subject().set('model', ArrayProxy.create({
                content: [
                    EmberObject.create({
                        id: '716289e1-e3df-09c0-ef31-2fbc2c963996',
                        name: 'Disorder of head',
                        sortIndex: 1,
                        diagnosisCodes: [{
                            code: '729.99',
                            codeSystem: 'ICD9',
                            description: 'Other disorders of soft tissue'
                        }, {
                            code: '118934005',
                            codeSystem: 'SNOMED',
                            description: 'Disorder of head'
                        }]
                    }),
                    EmberObject.create({
                        id: '163d5681-778c-bdf4-77bb-c89cfbf84bc0',
                        name: 'Toe fracture',
                        sortIndex: 0,
                        diagnosisCodes: [{
                            code: '826.0',
                            codeSystem: 'ICD9',
                            description: 'Closed fracture of one or more phalanges of foot'
                        }, {
                            code: '21351003',
                            codeSystem: 'SNOMED',
                            description: 'Fracture of phalanx of foot'
                        }, {
                            code: 'S92.911A',
                            codeSystem: 'ICD10',
                            description: 'Unspecified fracture of right toe(s), initial encounter for closed fracture'
                        }]
                    })
                ]
            }));
        });
    },
    afterEach() {
        const store = this.container.lookup('service:store');
        if (store) {
            store.destroy = function() {
                // Do nothing because this breaks pre ember-data beta 1.15
            };
        }
    }
});

test('Verify logic of isDuplicate', function(assert) {

    const controller = this.subject();

    run(function() {

        let diagnosis = EmberObject.create({
            name: 'Toe fracture',
            'diagnosisCodes': [{
                code: '826.0',
                codeSystem: 'ICD9',
                description: 'Closed fracture of one or more phalanges of foot'
            }, {
                code: '21351003',
                codeSystem: 'SNOMED',
                description: 'Fracture of phalanx of foot'
            }]
        });

        assert.notOk(isDuplicate(diagnosis, controller.get('model')), 'a unique diagnosis should not be marked as a duplicate');

        diagnosis = EmberObject.create({
            name: 'Disorder of head',
            diagnosisCodes: [{
                code: '729.99',
                codeSystem: 'ICD9',
                description: 'Other disorders of soft tissue'
            }, {
                code: '118934005',
                codeSystem: 'SNOMED',
                description: 'Disorder of head'
            }]
        });

        assert.ok(isDuplicate(diagnosis, controller.get('model')), 'a duplicate diagnosis should be marked as a duplicate');

        diagnosis = EmberObject.create({
            name: 'Toe fracture',
            diagnosisCodes: [{
                code: '826.0',
                codeSystem: 'ICD9',
                description: 'Closed fracture of one or more phalanges of foot'
            }, {
                code: '21351003',
                codeSystem: 'SNOMED',
                description: 'Fracture of phalanx of foot'
            }]
        });

        assert.notOk(isDuplicate(diagnosis, controller.get('model')), 'a very similar diagnosis should not be marked as duplicate');
    });
});
