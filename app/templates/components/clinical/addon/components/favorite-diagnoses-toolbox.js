import { copy } from '@ember/object/internals';
import { computed, observer } from '@ember/object';
import { alias, equal } from '@ember/object/computed';
import Component from '@ember/component';
import Diagnosis from 'clinical/models/diagnosis';
import favoriteDiagnosesSettings from 'clinical/models/favorite-diagnoses-settings';
import SpinnerSupport from 'common/mixins/spinner';
import ViewPreferences from 'boot/mixins/view-preferences';
import { task } from 'ember-concurrency';

export default Component.extend(SpinnerSupport, ViewPreferences, {
    showSpinner: alias('loadFavoriteDiagnoses.isRunning'),
    didFailToLoad: alias('loadFavoriteDiagnoses.last.isError'),

    classNames: ['favorite-diagnoses-toolbox'],

    // ViewPreferences Overrides
    viewPreferencesKey: 'favorite-diagnoses-toolbox',
    viewPreferenceProperties: computed(() => ['isShowingCodes']),

    diagnoses: null,
    init() {
        this._super();
        this.get('loadFavoriteDiagnoses').perform();
    },
    isShowingCodes: true,
    saveChoiceImmediately: observer('isShowingCodes', function () {
        this.persistUserPreferences();
    }),
    isDisplayCodeSystemTerm: equal('displayCodeSystem', 'term'),
    displayCodeSystem: 'icd10',
    displayCodeSystemLabel: 'ICD-10',
    loadFavoriteDiagnoses: task(function* () {
        const store = this.get('store');
        const displayCodeSystem = this.get('displayCodeSystem');

        const sortOrder = yield favoriteDiagnosesSettings.getSortOrder(store);
        let diagnoses = yield store.findAll('favoriteDiagnosis');

        if (diagnoses.get('length')) {
            diagnoses.forEach(code => code.set('displayCodeSystem', displayCodeSystem));
            diagnoses = diagnoses.sortBy(sortOrder.property);
            if (!sortOrder.sortAscending) {
                diagnoses.reverse();
            }
        }
        this.set('diagnoses', diagnoses);
    }).drop(),
    applyDisplayCodeSystemWhenAddingNewDiagnosis: observer('diagnoses.[]', function () {
        const displayCodeSystem = this.get('displayCodeSystem');

        this.get('diagnoses').forEach((code) => {
            code.set('displayCodeSystem', displayCodeSystem);
        });
    }),
    actions: {
        selectDiagnosis(diagnosis) {
            this.sendAction('diagnosisSelected', Diagnosis.wrap({
                name: diagnosis.get('name'),
                diagnosisCodes: copy(diagnosis.get('diagnosisCodes'), true)
            }));
        },
        retryLoadingData() {
            this.get('loadFavoriteDiagnoses').perform();
        },
        toggleShowCodes() {
            this.toggleProperty('isShowingCodes');
        }
    }
});
