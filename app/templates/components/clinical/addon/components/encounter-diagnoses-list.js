import { computed, observer } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { alias, sort } from '@ember/object/computed';
import Component from '@ember/component';
import WithDiagnoses from 'clinical/mixins/with-diagnoses';
import ViewPreferencesMixin from 'boot/mixins/view-preferences';
import WithPatientPrintTitleMixin from 'charting/mixins/with-patient-print-title';

const SHOW_OPTIONS = [
    { id: 1, label: 'Diagnosis Comment', flagName: 'showDiagnosisComment' },
    { id: 2, label: 'Encounter Comments', flagName: 'showEncounterComment' },
    { id: 3, label: 'Medication', flagName: 'showMedication' }
];
const DEFAULT_SHOW_OPTIONS = [];
const SORT_OPTIONS = [
    { id: 1, label: 'Sort alphabetically', activeField: 'name', historicalField: 'name', sortAscending: true },
    { id: 2, label: 'Sort by start/stop date', activeField: 'startDateUtc', historicalField: 'endDateUtc', sortAscending: false },
];
const DEFAULT_SORT = SORT_OPTIONS[1];

export default Component.extend(WithDiagnoses, ViewPreferencesMixin, WithPatientPrintTitleMixin, {
    // public properties
    patient: null,
    patientGuid: alias('patient.patientPracticeGuid'),
    patientSummary: alias('patient'),
    displayName: 'Diagnoses',

    actions: {
        selectedSortOption(sortOption) {
            this.set('selectedSort', sortOption);
        },
        displayChanged(diagnosisDescriptionDisplay) {
            scheduleOnce('afterRender', this, 'set', 'diagnosisDescriptionDisplay', diagnosisDescriptionDisplay);
        }
    },
    isAllowedToEditDiagnoses: computed('authorization.entitledFeatures.[]', function () {
        return this.get('authorization').isEntitledFor('Chart.Diagnoses.Edit');
    }),
    viewPreferencesKey: 'encounter-diagnoses-list',
    viewPreferenceProperties: computed(() => ['selectedSort', 'selectedShowOptions']),
    sortOptions: computed(function () {
        return SORT_OPTIONS;
    }),
    selectedSort: computed(function () {
        return DEFAULT_SORT;
    }),
    showOptions: computed(function () {
        return SHOW_OPTIONS;
    }),
    selectedShowOptions: computed(function () {
        // Default overriden by preferences
        return DEFAULT_SHOW_OPTIONS;
    }),
    _updateShowOptionFlags: observer('selectedShowOptions', function () {
        var _this = this;
        this.get('showOptions').forEach(function (item) {
            var isSelected = !!_this.get('selectedShowOptions').findBy('id', item.id);
            _this.set(item.flagName, isSelected);
        });
    }),

    sortedChronicActiveDiagnoses: sort('chronicActivePatientDiagnoses', 'activeSortProperties'),
    sortedChronicHistoricalDiagnoses: sort('chronicHistoricalPatientDiagnoses', 'historicalSortProperties'),
    sortedAcuteActiveDiagnoses: sort('acuteActivePatientDiagnoses', 'activeSortProperties'),
    sortedAcuteHistoricalDiagnoses: sort('acuteHistoricalPatientDiagnoses', 'historicalSortProperties'),
    allActiveDiagnoses: sort('activePatientDiagnoses', 'activeSortProperties'),
    allHistoricalDiagnoses: sort('historicalPatientDiagnoses', 'historicalSortProperties'),
    activeSortProperties: computed('selectedSort.activeField', 'selectedSort.sortAscending', function () {
        const property = this.get('selectedSort.activeField');
        return this.get('selectedSort.sortAscending') ? [property] : [`${property}:desc`];
    }),
    historicalSortProperties: computed('selectedSort.historicalField', 'selectedSort.sortAscending', function () {
        const property = this.get('selectedSort.historicalField');
        return this.get('selectedSort.sortAscending') ? [property] : [`${property}:desc`];
    }),
    sortedUnspecifiedActiveDiagnoses: sort('unspecifiedActivePatientDiagnoses', 'activeSortProperties'),
});
