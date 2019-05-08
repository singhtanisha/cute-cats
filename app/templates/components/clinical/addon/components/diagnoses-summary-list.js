import { computed } from '@ember/object';
import { alias, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import WithDiagnoses from 'clinical/mixins/with-diagnoses';
import WithPatientPrintTitleMixin from 'charting/mixins/with-patient-print-title';

export default Component.extend(WithDiagnoses, WithPatientPrintTitleMixin, {
    routing: service('pf-routing'),
    tunnel: service(),
    classNames: 'diagnoses-summary-list',
    patientSummary: alias('patient'),
    displayName: 'Diagnoses',
    isExpanded: false,

    activeDiagnosesSortProperty: computed(() => ['content.startDate:desc']),
    historicalDiagnosesSortProperty: computed(() => ['content.stopDate:desc']),
    sortedChronicActiveDiagnoses: sort('chronicActivePatientDiagnoses', 'activeDiagnosesSortProperty'),
    sortedChronicHistoricalDiagnoses: sort('chronicHistoricalPatientDiagnoses', 'historicalDiagnosesSortProperty'),
    sortedAcuteActiveDiagnoses: sort('acuteActivePatientDiagnoses', 'activeDiagnosesSortProperty'),
    sortedAcuteHistoricalDiagnoses: sort('acuteHistoricalPatientDiagnoses', 'historicalDiagnosesSortProperty'),
    sortedUnspecifiedActiveDiagnoses: sort('unspecifiedActiveDiagnoses', 'activeDiagnosesSortProperty'),
    allActiveDiagnoses: sort('activePatientDiagnoses', 'activeDiagnosesSortProperty'),
    allHistoricalDiagnoses: sort('historicalPatientDiagnoses', 'historicalDiagnosesSortProperty'),
    patientGuid: alias('patient.patientPracticeGuid'),
    isAllowedToEditDiagnoses: computed('authorization.entitledFeatures.[]', function () {
        return this.get('authorization').isEntitledFor('Chart.Summary.Edit');
    }),
    selectedDiagnosisGuid: computed('selectedItem', {
        get() {
            return this.get('selectedItem');
        },
        set(value) {
            return value;
        }
    }),
    actions: {
        displayChanged(diagnosisDescriptionDisplay) {
            this.set('diagnosisDescriptionDisplay', diagnosisDescriptionDisplay);
            this.get('tunnel').send('patient-summary-mixpanel-event', {
                event: 'Diagnosis Description Display Change',
                properties: { 'Diagnosis Display By':  diagnosisDescriptionDisplay }
            });
        },
        editDiagnosis(diagnosis) {
            if (diagnosis) {
                const diagnosisGuid = diagnosis.get('diagnosisGuid');
                this.get('routing').transitionToRoute('summary.diagnosis', diagnosis.get('patientPracticeGuid'), diagnosisGuid);
                this.attrs.setControllerProperties({
                    selectedItem: diagnosisGuid
                });
            }
        },
        recordDiagnosisOnSummary() {
            this.get('routing').transitionToRoute('summary.diagnosis', 'new');
            this.attrs.setControllerProperties({
                selectedItem: undefined
            });
        },
        toggleIsExpanded() {
            this.toggleProperty('isExpanded');
        },
        refresh() {
            this.reloadDiagnoses();
        }
    }
});
