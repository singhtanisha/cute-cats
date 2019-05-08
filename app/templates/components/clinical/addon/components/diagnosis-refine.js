import { computed, observer } from '@ember/object';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import ViewPreferencesMixin from 'boot/mixins/view-preferences';
import SpinnerSupport from 'common/mixins/spinner';
import Loading from 'clinical/mixins/loading';
import DiagnosesRepository from 'clinical/repositories/diagnoses';

export default Component.extend(ViewPreferencesMixin, SpinnerSupport, Loading, {
    classNames: ['diagnosis-refine'],
    facetOffset: '200px 250px',

    // attrs
    diagnosis: null,
    diagnoses: computed(function () {
        return [];
    }),
    showCodes: false,
    shouldShowCode: true,
    showFacets: false,
    isAddingNewDiagnosis: false,
    isAddingCodesFromDiagnosis: true,
    // actions: diagnosisRefined(diagnosisWithOnlyTheNewCodes)

    // Overrides
    // ViewPreferences Overrides
    viewPreferencesKey: 'diagnosis-refine',
    viewPreferenceProperties: computed(() => ['showCodes']),
    // SpinnerSupport Overrides
    showSpinner: alias('isLoading'),

    // properties
    searchByIcd9: true,
    selectedConstraints: computed(function () {
        return [];
    }),

    tetherConstraints: computed(function() {
        return [{
            to: 'window',
            pin: true,
            attachment: 'together'
        }];
    }),

    filteredDiagnoses: computed('diagnoses.[]', function () {
        // If not overriden, just return all diagnoses.
        return this.get('diagnoses');
    }),

    showHideCodesText: computed('showCodes', function () {
        return (this.get('showCodes') ? 'Hide' : 'Show') + ' codes';
    }),


    searchByCodeSystem: 'icd9Code',

    search: observer('searchByCodeSystem', function () {
        var _this = this,
            searchField;
        searchField = this.get('searchByCodeSystem');
        this._withProgress(DiagnosesRepository.loadIcd10RelatedDiagnoses(this.get('diagnosis'), searchField).then(function (icd10Diagnoses) {
            _this.setProperties({
                diagnoses: icd10Diagnoses,
                filteredDiagnoses: icd10Diagnoses
            });
        })).errorMessage('Can\'t load related diagnoses. Try again later.');
    }),

    actions: {
        refineDiagnoses(diagnosis) {
            if (this.get('isAddingCodesFromDiagnosis')) {
                this.get('diagnosis').addCodesFrom(diagnosis);
            }
            this.sendAction('diagnosisRefined', diagnosis);
        },

        toggleProperty(propertyName) {
            this.toggleProperty(propertyName);
        },

        constraintsChanged(filteredDiagnoses) {
            this.set('filteredDiagnoses', filteredDiagnoses);
        }
    }
});
