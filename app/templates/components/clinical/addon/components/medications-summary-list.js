import { computed } from '@ember/object';
import { alias, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import WithErxOrderDrafts from 'erx/mixins/with-erx-order-drafts';
import WithMedications from 'clinical/mixins/with-medications';

export default Component.extend(WithMedications, WithErxOrderDrafts, {
    attributeBindings: ['testElement:data-qatest'],
    classNames: ['medications'],

    routing: service('pf-routing'),

    patient: null,
    testElement: 'dashboardpanel',
    showMedicationsHistorical: true,
    showMedicationsActive: true,
    patientGuid: alias('patient.patientPracticeGuid'),
    activeMedicationsSortProperty: computed(() => ['fullGenericName', 'medicationGuid']),
    sortedActiveMedications: sort('activePatientMedications', 'activeMedicationsSortProperty'),
    historicalMedicationsSortProperty: computed(() => ['fullGenericName', 'medicationGuid']),
    sortedHistoricalMedications: sort('historicalPatientMedications', 'historicalMedicationsSortProperty'),

    actions: {
        openAssessment(info) {
            let modalInfo;

            switch (info) {
            case 'proliaAesiModal':
                modalInfo = {
                    token: { name: 'proliaAesiModal' },
                    source: 'Prolia Permanent Link',
                    patientPracticeGuid: this.get('patientGuid'),
                    defaults: [{ key: 'proliaMedicationHistory', property: 'value', value: 'PreviousHistory' }]
                };
            }
            this.attrs.sendControllerAction('showAssessmentModal', modalInfo);
        },
        editMedicationOnSummary(medication) {
            if (medication) {
                this.get('routing').transitionToRoute('summary.medication', medication.get('patientPracticeGuid'), medication.get('medicationGuid'));
            }
        },
        recordMedicationOnSummary() {
            this.get('routing').transitionToRoute('summary.medication', 'new');
        },
    }
});
