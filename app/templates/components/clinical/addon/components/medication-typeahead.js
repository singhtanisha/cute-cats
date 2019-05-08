
import { isPresent } from '@ember/utils';
import { on } from '@ember/object/evented';
import { computed, observer } from '@ember/object';
import { task } from 'ember-concurrency';
import MultiSourceSelect from 'tyrion/components/multi-source-select';
import MedicationsRepository from 'clinical/repositories/medications';

export default MultiSourceSelect.extend({
    classNames: ['medication-typeahead'],
    // attrs
    canAddCustom: false,
    optionLabelPath: 'drugName',
    optionDescriptionPath: 'drugName',
    optionValuePath: 'ndc',

    // component overrides
    optionComponent: 'medication-typeahead-item',
    prompt: 'Search for medication',
    isShorter: false,
    sortLabels: false,
    includeSearchIcon: true,
    filterOnSelection: false,
    canAddCustomItem: false,
    clearSearchOnFocus: false,
    clearSearchOnSelect: false,
    clearSelectOnFocus: false,
    clearSearchOnBlur: false,
    setSearchOnSelect: true,
    minChars: 2,
    openOnFocus: true,
    maxSelections: 1,
    dropdownEnabled: true,
    includeDropdownFooter: false,
    hintText: 'Type at least 2 characters to start seeing results',
    isSendSearchActionOnEnterKeyEnabled: false,
    useTether: false,
    includeCancelIcon: false,

    currentFacility: computed('session.facilityGuid', function () {
        return this.get('store').peekRecord('facility', this.get('session.facilityGuid'));
    }),

    remoteDataUrl: computed('currentFacility', 'query', function () {
        return `${this.get('config.clinicalBaseURL_v2')}Drugs/Search?locationCode=${this.get('currentFacility.state')}&searchCriteria=`;
    }),

    onInit: on('init', observer('patientGuid', function () {
        this.get('_loadMedicationLists').perform();
    })),

    _loadMedicationLists: task(function* () {
        const patientGuid = this.get('patientGuid');
        const tabSources = [];
        let patientMedications = [];
        let frequentMedications = [];

        if (isPresent(patientGuid)) {
            patientMedications = yield MedicationsRepository.loadMedications(patientGuid).then(data => {
                if (isPresent(data)) {
                    return data.get('content') || [];
                }
                return [];
            });
        }
        tabSources.pushObject({
            category: 'Patient Rx list',
            noResultsMessage: 'No patient medications recorded',
            options: patientMedications
        });

        frequentMedications = yield MedicationsRepository.loadFrequentMedications().then(data => {
            return data || [];
        });

        tabSources.pushObject({
            category: 'Provider Rx list',
            noResultsMessage: 'No frequent medications recorded',
            options: frequentMedications
        });
        this.set('tabSources', tabSources);
    }).drop()
});
