import { on } from '@ember/object/evented';
import { sort, filterBy, alias } from '@ember/object/computed';
import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import WithPatientPrintTitle from 'charting/mixins/with-patient-print-title';

export default Component.extend(WithPatientPrintTitle, {
    patientService: service('patient'),
    routing: service('pf-routing'),

    classNames: ['goals-section'],
    sortProperties: computed(() => ['sortableDate']),
    sortedGoals: sort('goals', 'sortProperties'),
    activeGoals: filterBy('sortedGoals', 'isActive', true),
    inactiveGoals: filterBy('sortedGoals', 'isActive', false),
    isLoading: alias('loadGoals.isRunning'),
    includeHeaderAndFooter: true,
    showInactiveGoals: false,
    printActive: false,
    printInactive: false,
    isPrintVisible: false,
    patientSummary: alias('patient'),
    patientPracticeGuid: alias('patient.patientPracticeGuid'),
    displayName: 'Goals',
    printOptions: computed(() => [
        { value: 'all', label: 'All goals' },
        { value: 'active', label: 'Active goals' },
        { value: 'inactive', label: 'Inactive goals' }
    ]),
    init() {
        this._super();
        const onRefreshChart = data => {
            if (data.patientPracticeGuid === this.get('patientPracticeGuid')) {
                this.onLoadedGoals(data.goals ? data.goals.toArray() : []);
            }
        };
        this.get('patientService').on('refreshChart', onRefreshChart);
        this.set('onRefreshChart', onRefreshChart);
    },
    willDestroyElement() {
        this.get('patientService').off('refreshChart', this.get('onRefreshChart'));
    },
    loadPatientGoals: on('init', observer('patientPracticeGuid', function () {
        this.set('errorText', null);
        this.get('loadGoals').perform();
    })),
    loadGoals: task(function* () {
        const patientPracticeGuid = this.get('patientPracticeGuid');
        const store = this.get('store');
        this.set('errorText', null);
        this.set('goals', null);
        try {
            const goals = yield store.query('patient-goal', { patientPracticeGuid });
            this.onLoadedGoals(goals.toArray());
        } catch (e) {
            this.set('errorText', 'Could not load patient goals. Try again later.');
            throw e;
        }
    }).restartable(),
    onLoadedGoals(goals) {
        this.set('goals', goals);
        if (this.attrs.loadedGoals) {
            this.attrs.loadedGoals(goals);
        }
    },
    actions: {
        edit(goal) {
            const goalGuid = goal ? goal.get('id') : 'new';
            const patientPracticeGuid = goal ? goal.get('patientPracticeGuid') : this.get('patientPracticeGuid');
            this.get('routing').transitionToRoute('summary.goal', patientPracticeGuid, goalGuid);
        },
        add() {
            this.get('routing').transitionToRoute('summary.goal', this.get('patientPracticeGuid'), 'new');
        },
        toggleShowInactiveLink() {
            this.toggleProperty('showInactiveGoals');
        },
        print(type) {
            this.get('store').findRecord('patient', this.get('patientPracticeGuid')).then(() => {
                this.sendAction('printAudit', 'PatientGoals');
                this.set('printActive', type === 'all' || type === 'active');
                this.set('printInactive', type === 'all' || type === 'inactive');
                this.set('isPrintVisible', true);
            });
        },
        refreshGoals() {
            const goals = this.get('store').peekAll('patient-goal').filterBy('patientPracticeGuid', this.get('patientPracticeGuid'));

            this.set('goals', goals);
        }
    }
});
