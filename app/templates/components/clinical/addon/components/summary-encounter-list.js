import { observer, computed } from '@ember/object';
import { alias, gt } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import encounterSummariesRepository from 'charting/repositories/encounter-summaries';

export default Component.extend({
    patientService: service('patient'),
    routing: service('pf-routing'),
    classNames: ['encounter-list'],
    isLoading: alias('loadEncountersTask.isRunning'),

    patient: null,
    patientPracticeGuid: alias('patient.patientPracticeGuid'),

    init() {
        this._super();
        const onRefreshChart = () => this.get('loadEncountersTask').perform();
        this.get('patientService').on('refreshChart', onRefreshChart);
        this.set('onRefreshChart', onRefreshChart);
        this.get('loadEncountersTask').perform();
    },
    willDestroyElement() {
        this._super();
        const onRefreshChart = this.get('onRefreshChart');
        if (onRefreshChart) {
            this.get('patientService').off('refreshChart', onRefreshChart);
        }
    },
    loadEncounters: observer('patientPracticeGuid', function () {
        this.get('loadEncountersTask').perform();
    }),
    loadEncountersTask: task(function* () {
        try {
            const encounters = yield encounterSummariesRepository.loadEncounters(this.get('store'), this.get('patientPracticeGuid'));
            this.set('error', false);
            this.set('encounters', encounters);
        } catch (e) {
            this.set('error', true);
            this.set('encounters', null);
        }
    }).restartable(),
    visibleEncounters: computed('encounters', function () {
        const encounters = this.get('encounters');
        if (!encounters) {
            return null;
        }
        return encounters.get('length') > 5 ? encounters.slice(0, 5) : encounters;
    }),
    hasMoreEncounters: gt('encounters.length', 5),
    actions: {
        openEncounter(encounter) {
            this.get('routing').transitionToRoute('encounter', encounter.get('transcriptGuid'));
        }
    }
});
