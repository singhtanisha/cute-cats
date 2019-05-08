import { observer } from '@ember/object';
import { on } from '@ember/object/evented';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import WithPatientPrintTitleMixin from 'charting/mixins/with-patient-print-title';
import { task } from 'ember-concurrency';

export default Component.extend(WithPatientPrintTitleMixin, {
    routing: service('pf-routing'),
    showAll: false,
    isPrintPreviewVisible: false,
    patientPracticeGuid: alias('patient.patientPracticeGuid'),
    patientSummary: alias('patient'),
    displayName: 'Patient risk score',
    isLoading: alias('loadSocialHistory.isRunning'),

    loadSocialHistory: task(function * () {
        const store = this.get('store');
        const patientPracticeGuid = this.get('patientPracticeGuid');
        try {
            const socialHistory = yield store.findRecord('social-history', patientPracticeGuid);

            this.setProperties({
                patientRiskScore: socialHistory.get('riskScore') || {},
                error: false
            });
        } catch (err) {
            this.setProperties({
                patientRiskScore: null,
                error: true
            });
        }
    }).restartable(),

    loadPatientInfo: on('init', observer('patientPracticeGuid', function () {
        this.get('loadSocialHistory').perform();
    })),

    actions: {
        toggleProperty(key) {
            this.toggleProperty(key);
        },
        print() {
            // Load the patient info first to ensure that it gets rendered on the print preview
            this.get('store').findRecord('patient', this.get('patientPracticeGuid')).then(() => {
                this.sendAction('printAudit', 'PatientRiskScore');
                this.set('isPrintPreviewVisible', true);
            });
        },
        edit() {
            const baseRoute = this.get('transcriptGuid') ? 'encounter' : 'summary';
            this.get('routing').transitionToRoute(`${baseRoute}.risk-score`);
        },
    }
});
