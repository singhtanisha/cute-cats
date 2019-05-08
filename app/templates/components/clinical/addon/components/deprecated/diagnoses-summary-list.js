import { computed } from '@ember/object';
import { alias, sort } from '@ember/object/computed';
import Component from '@ember/component';
import WithDiagnoses from 'clinical/mixins/with-diagnoses';
import WithPatientPrintTitleMixin from 'charting/mixins/with-patient-print-title';

export default Component.extend(WithDiagnoses, WithPatientPrintTitleMixin, {
    classNames: 'diagnoses-summary-list',
    patientSummary: alias('patient'),
    displayName: 'Diagnoses',

    activeDiagnosesSortProperty: computed(() => ['content.startDate:desc']),
    historicalDiagnosesSortProperty: computed(() => ['content.stopDate:desc']),
    sortedChronicActiveDiagnoses: sort('chronicActivePatientDiagnoses', 'activeDiagnosesSortProperty'),
    sortedChronicHistoricalDiagnoses: sort('chronicHistoricalPatientDiagnoses', 'historicalDiagnosesSortProperty'),
    sortedAcuteActiveDiagnoses: sort('acuteActivePatientDiagnoses', 'activeDiagnosesSortProperty'),
    sortedAcuteHistoricalDiagnoses: sort('acuteHistoricalPatientDiagnoses', 'historicalDiagnosesSortProperty'),
    allActiveDiagnoses: sort('activePatientDiagnoses', 'activeDiagnosesSortProperty'),
    allHistoricalDiagnoses: sort('historicalPatientDiagnoses', 'historicalDiagnosesSortProperty'),

    patientGuid: alias('patient.patientPracticeGuid'),
    isAllowedToEditDiagnoses: computed('authorization.entitledFeatures.[]', function () {
        return this.get('authorization').isEntitledFor('Chart.Summary.Edit');
    }),
    actions: {
        displayChanged(diagnosisDescriptionDisplay) {
            this.set('diagnosisDescriptionDisplay', diagnosisDescriptionDisplay);
        }
    }
});
