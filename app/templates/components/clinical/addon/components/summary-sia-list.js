import { isPresent } from '@ember/utils';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import WithPatientPrintTitleMixin from 'charting/mixins/with-patient-print-title';

export default Component.extend(WithPatientPrintTitleMixin, {
    routing: service('pf-routing'),
    patientPracticeGuid: alias('patient.patientPracticeGuid'),
    isError: false,
    errorText: null,
    isLoading: alias('loadSIA.isRunning'),
    isPrintPreviewVisible: false,
    pageNumber: 0,
    totalItems: 0,
    patientSummarySIAs: computed(() => []),
    printSummarySIAs: computed(() => []),
    restSIAsCount: computed('totalItems', 'patientSummarySIAs.[]', function() {
        return this.get('totalItems') - this.get('patientSummarySIAs').length;
    }),
    showLoadMore: computed('restSIAsCount', function() {
      return this.get('restSIAsCount') > 0;
    }),
    loadSIAs: task(function * () {
        const pageNumber = this.get('pageNumber');
        const patientPracticeGuid = this.get('patientPracticeGuid');
        try {
            const data = yield this.get('store').query('patient-summary-sia', { patientPracticeGuid, pageNumber });
            const patientSummarySIAs = data.toArray() || [];
            this.get('patientSummarySIAs').pushObjects(patientSummarySIAs);
            this.setProperties({
                totalItems: data.get('meta.totalItems'),
                pageNumber: pageNumber + 1,
                isError: false,
                errorText: null,
            });
        } catch(e) {
            this.setProperties({
                isError: true,
                errorText: 'Failed to load screening/interventions/assessments. Try again later.',
            });
        }
    }).drop(),
    init() {
        this._super();
        this.setProperties({
            isError: false,
            errorText: null
        });
        this.get('loadSIAs').perform();
    },
    actions: {
        edit(sia) {
            if (isPresent(sia)) {
                const transcriptEventGuid = sia.get('transcriptEventGuid');
                // TODO: update when the route is complete
                this.get('routing').transitionToRoute('summary.sia', transcriptEventGuid);
                this.attrs.setControllerProperties({
                    selectedItem: transcriptEventGuid
                });
            }
        },
        print() {
            const patientPracticeGuid = this.get('patientPracticeGuid');
            this.get('store').query('patient-summary-sia', { patientPracticeGuid }).then((data) => {
                const printSummarySIAs = data.toArray();
                this.set('printSummarySIAs', printSummarySIAs);
                this.sendAction('printAudit', 'PatientSummarySias');
                this.set('isPrintPreviewVisible', true);
            });
        },
    }
});
