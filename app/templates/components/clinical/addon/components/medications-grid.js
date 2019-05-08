import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { computed, observer } from '@ember/object';
import Component from '@ember/component';
import ViewPreferencesMixin from 'boot/mixins/view-preferences';
import WithErxOrderDrafts from 'erx/mixins/with-erx-order-drafts';
import WithMedications from 'clinical/mixins/with-medications';

var DEFAULT_MEDICATION_COLUMNS = [{
    id: 1,
    label: 'Medication Comments',
    flagName: 'showMedicationComments'
}, {
    id: 2,
    label: 'Encounter Comments',
    flagName: 'showEncounterComments'
}, {
    id: 3,
    label: 'Diagnoses',
    flagName: 'showDiagnosis'
}, {
    id: 4,
    label: 'Prescriptions',
    flagName: 'showPrescriptions'
}];

export default Component.extend(ViewPreferencesMixin, WithMedications, WithErxOrderDrafts, {
    // TODO: Consider deriving this from the component's name.
    viewPreferencesKey: 'medications-grid',
    viewPreferenceProperties: computed(() => ['activeGridPreferences', 'historicalGridPreferences',
        'medicationColumnItemsSelection'
    ]),

    analytics: service(),

    actions: {
        openAssessment(program) {
            this.attrs.openAssessment(program);
        },
        selectPrintOption(value) {
            if (!value) {
                return;
            }
            switch (value) {
                case 'active':
                    this.set('showActiveMeds', true);
                    this.set('showHistoricalMeds', false);
                    break;
                case 'historical':
                    this.set('showHistoricalMeds', true);
                    this.set('showActiveMeds', false);
                    break;
                case 'all':
                    this.set('showActiveMeds', true);
                    this.set('showHistoricalMeds', true);
                    break;
            }
            this.set('isPrintVisible', true);
        }
    },

    activeGridPreferences: computed(function() {
        return {
            sortProperty: 'fullGenericName',
            sortAscending: true
        };
    }),
    historicalGridPreferences: computed(function() {
        return {
            sortProperty: 'fullGenericName',
            sortAscending: true
        };
    }),

    showOptions: computed(function() {
        return DEFAULT_MEDICATION_COLUMNS;
    }),
    medicationColumnItemsSelection: computed(function() {
        return DEFAULT_MEDICATION_COLUMNS.filterBy('flagName', 'showPrescriptions');
    }),
    onMedicationColumnItemsSelection: observer('medicationColumnItemsSelection', function() {
        var _this = this;
        this.get('showOptions').forEach(function(item) {
            var medicationColumnItemsSelection = _this.get('medicationColumnItemsSelection') || [],
                isSelected = !!medicationColumnItemsSelection.findBy('id', item.id);
            _this.set(item.flagName, isSelected);
        });
    }),
    showMedicationComments: false,
    showEncounterComments: false,
    showDiagnosis: false,
    showPrescriptions: true,
    showHistoricalMeds: true,
    showActiveMeds: true,

    patientGuid: null,
    historicalMedicationsVisible: false,

    printSortProperty: alias('activeGridPreferences.sortProperty'),
    printSortAscending: computed('activeGridPreferences.sortAscending', function() {
        return this.get('activeGridPreferences.sortAscending') !== false;
    })
});
