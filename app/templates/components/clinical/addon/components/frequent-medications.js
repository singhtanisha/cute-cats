import { isEmpty } from '@ember/utils';
import { copy } from '@ember/object/internals';
import { observer } from '@ember/object';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import MedicationsRepository from 'clinical/repositories/medications';
import Medication from 'clinical/models/medication';
import SpinnerMixin from 'common/mixins/spinner';
import { task } from 'ember-concurrency';

export default Component.extend(SpinnerMixin, {
    attributeBindings: ['data-element'],
    'data-element': 'frequent-medications',
    loading: false,
    medicationsFilter: null,
    filteredText: '',
    filteredMedications: null,
    hideFilter: false,
    frequentMedications: null,
    classNames: ['flex-grow', 'flex-column'],

    isLoading: alias('loadFrequentMedications.isRunning'),

    init() {
        this._super();
        this.get('loadFrequentMedications').perform();
    },

    loadFrequentMedications: task(function * (forceReload) {
        this.setProperties({
            frequentMedications: [],
            filteredMedications: []
        });
        this.set('loadFailed', false);
        try {
            const data = yield MedicationsRepository.loadFrequentMedications({ forceReload });
            this.set('frequentMedications', data);
            this.doFilterMedications();
        } catch (e) {
            this.set('loadFailed', true);
        }
    }).drop(),

    doFilterMedications: observer('medicationsFilter', function () {
        var filterText = this.get('medicationsFilter'),
            meds = this.get('frequentMedications'),
            filteredMedications;

        if (isEmpty(filterText)) {
            this.set('filteredMedications', meds);
        } else {
            filteredMedications = meds.filter(function(med) {
                return med.get('drugName').toLowerCase().indexOf(filterText.toLowerCase()) > -1;
            });
            this.set('filteredMedications', filteredMedications);
        }
    }),

    actions: {

        selectMedication(frequentMedication) {
            var deep = true,
                medication = copy(frequentMedication.get('content'), deep);
            medication = Medication.wrap(medication);
            this.sendAction('selectMedication', medication);
        },

        reloadFrequentMedications() {
            this.get('loadFrequentMedications').perform(true);
        },

        cleanUp() {
            this.setProperties({
                'medicationsFilter': null
            });
        }
    }

});
