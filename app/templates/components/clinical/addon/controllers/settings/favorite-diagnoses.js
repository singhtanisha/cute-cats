import { later } from '@ember/runloop';
import { isEmpty, isPresent } from '@ember/utils';
import { computed } from '@ember/object';
import { sort, equal } from '@ember/object/computed';
import Controller from '@ember/controller';
import diagnosesRepository from 'clinical/repositories/diagnoses';
import { isDuplicate } from 'clinical/models/favorite-diagnosis';

export default Controller.extend({

    // Set in route as a Provider Preference object
    sortOrder: null,
    sortedModel: sort('model', 'sortProperties'),
    isRefiningDiagnois: false,

    showByOptions: computed(() => [
        {
            label: 'TERM',
            value: 'term'
        },
        {
            label: 'ICD-9',
            value: 'icd9'
        },
        {
            label: 'ICD-10',
            value: 'icd10'
        },
        {
            label: 'SNOMED CT',
            value: 'snomed'
        }
    ]),

    isManuallySorted: equal('sortOrder.value', 'manual'),

    anyItemsCollapsed: computed('model.@each.isExpanded', function () {
        return !this.get('model').isEvery('isExpanded');
    }),

    showInlineAddDiagnosis: computed('isAddingInlineDiagnosis', 'model', function () {
        return isEmpty(this.get('model')) || this.get('isAddingInlineDiagnosis');
    }),

    actions: {
        sortAlphabetically() {
            this.set('sortProperties', ['name']);
            this.set('sortAscending', true);
            this.set('sortOrder.value', 'alpha:asc');
        },

        sortDescending() {
            this.set('sortAscending', false);
            this.set('sortProperties', ['name:desc']);
            this.set('sortOrder.value', 'alpha:desc');
        },

        sortAscending() {
            this.set('sortAscending', true);
            this.set('sortProperties', ['name']);
            this.set('sortOrder.value', 'alpha:asc');
        },

        reorderItems(group) {
            group.forEach((diagnosis, index) => {
                this.store.findRecord('favoriteDiagnosis', diagnosis.get('id'))
                    .then((diagnosis) => {
                        diagnosis.set('sortIndex', index + 1);
                        diagnosis.save();
                    });
            });
            this.set('sortProperties', ['sortIndex']);
            this.set('sortAscending', true);
            this.set('sortOrder.value', 'manual');
        },

        addFavoriteDiagnosis(diagnosis) {
            if (isDuplicate(diagnosis, this.get('model'))) {
                toastr.error('This diagnosis has already been added to your diagnoses list.');

                return false;
            } else {
                this.setProperties({
                    diagnosis: null,
                    query: '',
                    addQuery: ''
                });

                //Bubble up to the route's addFavoriteDiagnosis handler to save the new diagnosis
                return true;
            }
        },
        addNewDiagnosisInline() {
            this.set('isAddingInlineDiagnosis', true);
            later(() => {
                const scrollElement = $('.my-list-icd10');
                if (scrollElement) {
                    scrollElement.scrollTop(scrollElement[0].scrollHeight + 30);
                }
                $('[data-element="diagnosis-search-input"]').focus();
            }, 200);
        },
        addFavoriteDiagnosisInline(diagnosis) {
            this.set('isAddingInlineDiagnosis', false);
            this.set('relatedDiagnoses', []);
            this.set('isRefiningDiagnosis', false);
            this.set('showRefineFacets', false);
            if (diagnosis.get('needsIcd10Refinement')) {
                diagnosesRepository.loadIcd10RelatedDiagnoses(diagnosis).then(icd10Diagnoses => {
                    this.set('relatedDiagnoses', icd10Diagnoses);
                }).errorMessage('Can\'t load related diagnoses. Try again later.');
                this.set('isRefiningDiagnosis', true);
                this.set('showRefineFacets', true);
                this.set('diagnosisToRefine', diagnosis);
            } else {
                if (isPresent(diagnosis) && isEmpty(diagnosis.get('name'))) {
                    diagnosis.set('name', this.get('diagnosisToRefine.name'));
                }
                this.set('diagnosisToRefine', null);
                this.send('addFavoriteDiagnosis', diagnosis);
            }
        },
        cancelAddInline() {
            this.set('isAddingInlineDiagnosis', false);
            this.set('relatedDiagnoses', []);
            this.set('isRefiningDiagnosis', false);
            this.set('showRefineFacets', false);
        },
        toggleExpand(item) {
            item.toggleProperty('isExpanded');
        },
        toggleExpandAll(newValue) {
            this.get('model').forEach(item => {
                item.set('isExpanded', newValue);
            });
        }
    }
});
