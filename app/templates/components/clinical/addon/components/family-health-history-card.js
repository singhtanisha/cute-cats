import { computed } from '@ember/object';
import { notEmpty, or, equal, alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import WithPMH from 'clinical/mixins/with-pmh';
import WithPatientPrintTitleMixin from 'charting/mixins/with-patient-print-title';
import { task } from 'ember-concurrency';

export default Component.extend(WithPMH, WithPatientPrintTitleMixin, {
    authorization: service(),
    routing: service('pf-routing'),

    hasRecordedHistory: notEmpty('pastMedicalHistory.familyHealthHistory'),
    hideEdit: or('isLoading', 'error', 'isNotAllowedToEditPMH', 'hasRecordedHistory', 'isEditing'),
    isEditing: equal('routing.currentRouteName', 'summary.family-health-history'),
    patientSummary: alias('patient'),
    isListVisible: or('isEditing', 'hasRecordedHistory'),

    defaultMessage: computed('isLoading', 'isListVisible', function() {
        if (this.get('isListVisible')) {
            return null;
        }

        if (this.get('isLoading')) {
            return 'Loading family health history...';
        }

        return 'No family health history recorded';
    }),
    
    isNotAllowedToEditPMH: computed('authorization.entitledFeatures.[]', function () {
        return !this.get('authorization').isEntitledFor('Chart.Encounter.Edit');
    }),

    actions: {
        edit() {
            this.get('routing').transitionToRoute('summary.family-health-history');
        }
    },

    print: task(function * () {
        // Load the patient info first to ensure that it gets rendered on the print preview
        yield this.get('store').findRecord('patient', this.get('patientPracticeGuid'));

        this.sendAction('printAudit', 'PastMedicalHistory');
        this.set('isPrintPreviewVisible', true);
    }).drop()
});