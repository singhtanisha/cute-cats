import { run } from '@ember/runloop';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import setupStore from 'boot/tests/helpers/store';
import { startMirage } from 'boot/initializers/ember-cli-mirage';
import PatientGoal from 'clinical/models/patient-goal';
import PatientGoalAdapter from 'clinical/adapters/patient-goal';
import PatientGoalSerializer from 'clinical/serializers/patient-goal';
import wait from 'ember-test-helpers/wait';
import de from 'boot/tests/helpers/data-element';
import Service from '@ember/service';



moduleForComponent('goals-section', 'Integration - Core - Clinical | Component - goals-section', {
    integration: true,
    beforeEach() {
        const env = setupStore({
            adapters: {
                'patient-goal': PatientGoalAdapter
            },
            serializers: {
                'patient-goal': PatientGoalSerializer
            },
            models: {
                'patient-goal': PatientGoal
            }
        });
        this.set('store', env.store);
        this.server = startMirage();
    },
    afterEach() {
        this.server.shutdown();
        this.set('store');
    }
});

test('validate component rendering', function (assert) {
    server.get('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/patientGoals', () => ({
        patientGoals: [
            {
                description: 'Some text here',
                patientPracticeGuid: '530bdcc7-0616-4701-8ff3-94082b082313',
                patientGoalGuid: '530bdcc7-0616-4701-8ff3-94082b082311',
                isActive: true,
                effectiveDate: '07/19/2017'
            }, {
                description: 'Some text here too',
                patientPracticeGuid: '530bdcc7-0616-4701-8ff3-94082b082313',
                patientGoalGuid: '530bdcc7-0616-4701-8ff3-94082b082313',
                isActive: false,
                effectiveDate: '07/21/2017'
            }
        ]
    }));

    assert.expect(11);

    const routingStub = Service.extend({
        transitionToRoute() {
            assert.ok('Transition to next screen when add icon is clicked');
        }
    });
    this.register('service:pf-routing', routingStub);

    const showHideToggle = '.show-hide-toggle';
    const addIcon = '.icon-add';

    run(() => {
        this.render(hbs`{{goals-section isAllowedToEditSummary=true edit="edit" store=store}}`);
    });

    return wait().then(() => {
        assert.dom(de('goals-section-header')).exists('Goal header was rendered correctly');
        assert.dom(`${de('active-goal-0')} ${de('goal-description')}`).hasText('Some text here', 'Active goal description was rendered correctly');
        assert.dom(`${de('active-goal-0')} ${de('goal-effective-date')}`).hasText('since 07/19/2017', 'Active goal date was rendered correctly');
        assert.dom(showHideToggle).hasText('Show inactive (1)', 'Show inactive link was rendered correctly');
        assert.dom(addIcon).exists('Add goal icon renders correctly');

        run(() => {
            this.$(showHideToggle).click();
        });

        return wait().then(() => {
            assert.dom(de('inactive-goals-header')).exists('Inactive header was rendered correctly');
            assert.dom(`${de('inactive-goal-0')} ${de('goal-description')}`).hasText('Some text here too', 'Inactive goal description was rendered correctly');
            assert.dom(`${de('inactive-goal-0')} ${de('goal-effective-date')}`).hasText('since 07/21/2017', 'Inactive goal date was rendered correctly');
            assert.dom(showHideToggle).hasText('Hide inactive', 'Hide inactive link renders correctly');

            run(() => {
                this.$(showHideToggle).click();
            });

            return wait().then(() => {
                assert.dom(de('inactive-goals-header')).doesNotExist('Inactive goals are hidden');

                run(() => {
                    this.$(addIcon).click();
                });
            });
        });
    });
});
