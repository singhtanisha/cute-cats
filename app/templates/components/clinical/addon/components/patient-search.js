/**
 * @class Patient Search
 * @module Unsorted
 */

import { A } from '@ember/array';

import { merge } from '@ember/polyfills';

import { later } from '@ember/runloop';
import { isPresent, isEmpty } from '@ember/utils';
import EmberObject, { computed, observer } from '@ember/object';
import Component from '@ember/component';

import TooltipSupport from 'tyrion/components/mixins/tooltip-support';
import dateHelper from 'common/helpers/dates';
import PFStringUtil from 'boot/util/pf-string-util';
import { task } from 'ember-concurrency';
import patientSearchUtil from 'clinical/util/patient-search';
import Destroyed from 'tyrion/mixins/destroyed';

export default Component.extend(TooltipSupport, Destroyed, {
    init() {
        this._super();

        this.set('searchType', EmberObject.create({
            name: true,
            nameLF: true,
            date: true,
            ssn: true,
            prn: true
        }));

        if (!isEmpty(this.get('searchTerm'))) {
            this.validateSearchTerm();
        }
    },

    isTooltipVisible: true,
    tooltipTrigger: 'manual',
    tooltipPlacement: null,

    layoutName: 'components/patient-search',

    classNames: ['search-term-view', 'patient-search-component'],
    classNameBindings: ['isShorter:is-shorter'],

    showHints: false,
    showResults: false,
    focusOnInsert: true,
    isDisabled: false,
    isShorter: false,
    forceSingleSelectPatient: false,
    hasError: false,

    isSearching: false,
    isValidatingOnLostFocus: true,
    /**
     * The property that the results will be stored in.
     * Consumers of this component should bind to this property.
     *
     * @property results
     * @type (Array}
     */
    results: null,

    /***
     * When true, the results will display in a dropdown. When selected, patients will display as a pill.
     */
    displayResults: false,

    /***
     * When true, the results will display a footer section.
     */
    showFooter: false,

    /**
     * Selected patients that will appear as a pill.
     * Consumers of this component should bind to this property to retrieve the selected patients.
     *
     * @property results
     * @type (Array}
     */
    selectedPatients: null,

    /***
     * Max selectable patients
     */
    maxSelected: 1,

    click() {
        if (isPresent(this.get('tooltipMsg'))) {
            this.set('tooltipMsg', '');
        }
    },

    showInput: computed('selectedPatients.[]', function(){
        return !this.get('selectedPatients') || this.get('selectedPatients').length !== this.get('maxSelected');
    }),

    focusIn(evt) {
        if ($(evt.target).hasClass('filtered-search-input')) {
            this.set('showHints', true);
            this.set('showResults', false);
        }
    },

    focusOut(evt) {
        if (this.get('isValidatingOnLostFocus') && !this.get('isSearching') && !isEmpty(this.get('searchTerm')) && !this.get('showResults')) {
            this.set('tooltipMsg', 'This is not a valid patient.');
        }
        if ($(evt.target).hasClass('filtered-search-input')) {
            later(() => {
                this._setPropertiesUnlessDestroyed({
                    showHints: false,
                    showResults: false
                });
            }, 250);
        }
    },

    keyPress(evt) {
        if ($(evt.target).hasClass('filtered-search-input') && evt.keyCode === 13) {
            this.send('search');
        }
        if (isEmpty(this.get('searchTerm'))) {
            this.set('showHints', true);
        }
    },

    didInsertElement() {
        this._super();
        if(this.get('focusOnInsert')){
            this.$('input').focus();
        }
    },

    actions: {
        /**
         * Handles the search action triggered by view
         * @method search
         */
        search() {
            this.send('searchWithParams', this.buildSearchQuery());
        },

        /**
         * Queries the backend. Searches the patient store for matches. Takes a query object parameter.
         * On return of payload, assigns results
         * to model and flags 'hasSearched'
         *
         * @method searchWithParams
         * @param query
         */
        searchWithParams(query) {
            if (Object.keys(query).length) {
                this.set('isSearching', true);
                this.get('store').query('patient-search', query).then(results => {
                    this.setProperties({
                        results: results.filterBy('isActive'),
                        isSearching: false
                    });
                    this.sendAction('didSearch');

                    if (this.get('displayResults')){
                        this.set('showResults', true);
                        this.set('showHints', false);
                    }
                }).catch(error => {
                    if (!this.get('isDestroyed')) {
                        this.set('isSearching', false);
                        this.sendAction('didSearch', error);
                    }
                });
            }
        },

        selectPatient(patient) {
            // Note: preserving existing logic for multiple selectedPatients
            if (this.attrs.selectPatientResult || (!this.get('forceSingleSelectPatient') && this.get('selectedPatients') && this.get('selectedPatients').length > 0)) {
                if (!this.get('selectedPatients')) {
                    this.set('selectedPatients', A([]));
                }

                if (this.get('selectedPatients').length < this.get('maxSelected')) {
                    this.get('selectedPatients').pushObject(patient);
                }

                this.set('showResults', false);
                this.set('searchTerm', '');

                if (this.attrs.selectPatients) {
                    this.attrs.selectPatients(this.get('selectPatients'));
                }

                if (this.attrs.selectPatientResult) {
                    this.attrs.selectPatientResult(patient);
                }
            } else {
                this.get('getPatientAndSelect').perform(patient);
            }
        },

        removeSelectedPatient(patient) {
            if(!this.get('isDisabled')){
                this.get('selectedPatients').removeObject(patient);
            }
        },

        footerActionLink() {
            this.set('showResults', false);
            this.set('searchTerm', '');
            this.sendAction('footerAction');
        }
    },

    getPatientAndSelect: task(function * (patient) {
        const patientRecord = yield this.get('store').findRecord('patient', patient.get('id'));

        // The scheduler selectedPatient (single) requires the patient data structure, not the patient-summary data structure.
        let selectedPatients = this.get('selectedPatients');

        if (this.get('forceSingleSelectPatient') || !selectedPatients) {
            selectedPatients = [];
        }

        if (selectedPatients.length < this.get('maxSelected')) {
            patientRecord.set('hasPatientImage', patient.get('hasPatientImage'));
            selectedPatients.pushObject(patientRecord);
        }

        this.set('selectedPatients', selectedPatients);
        this.set('showResults', false);
        this.set('searchTerm', '');

        if (this.attrs.selectPatients) {
            this.attrs.selectPatients(selectedPatients);
        }
    }).drop(),

    /**
     * Builds and returns the Search Query
     *
     * @method buildSearchQuery
     *
     *  _Returns: String_
     *
     */
    buildSearchQuery() {
        if (this.get('invalidSearchTerm') || isEmpty(this.get('searchTerm'))) {
            return {};
        }
        const searchTerm = this.get('searchTerm');
        const query = {};

        if (this.get('searchType.date')) {
            if (dateHelper.isValidDate(searchTerm, 'MM/DD/YYYY')) {
                query.birthDate = searchTerm;
            } else {
                this.set('searchType.date', false);
            }
        }
        if (this.get('searchType.ssn')) {
            if (/^\d{3}-?\d{2}-?\d{4}$/.test(searchTerm)) {
                query.socialSecurityNumber = searchTerm;
                this.set('searchTerm', PFStringUtil.formatSSN(this.get('searchTerm')));
            } else {
                this.set('searchType.ssn', false);
            }
        }
        if (this.get('searchType.name')) {
            merge(query, patientSearchUtil.formatNameParameters(searchTerm));
        }
        if (this.get('searchType.prn')) {
            query.patientRecordNumber = searchTerm;
        }
        return query;
    },

    /**
     * Resets searchTypes to all true
     *
     * @method resetSearchType
     */
    resetSearchType() {
        this.set('searchType.name', true);
        this.set('searchType.nameLF', true);
        this.set('searchType.date', true);
        this.set('searchType.ssn', true);
        this.set('searchType.prn', true);
    },

    /**
     * The search type placeholders used in the Search Assist dropdown
     *
     * @property searchTypePlaceholder
     * @type {Object}
     * @static
     * @final
     */
    searchTypePlaceholder: {
        name: 'First Last',
        nameLF: 'Last, First',
        date: 'MM/DD/YYYY',
        ssn: '###-##-####',
        prn: 'AA123456'
    },

    /**
     * Denotes if any of the search terms are invalid, thereby removing them from
     * the Search Assist Dropdown
     *
     * _Returns: Boolean_
     *
     * _Observes: 'searchType.name', 'searchType.date', 'searchType.ssn'_, 'searchType.nameLF'
     *
     * @property invalidSearchTerm
     * @type {ComputedProperty}
     */
    invalidSearchTerm: computed(
      'searchType.name',
      'searchType.date',
      'searchType.ssn',
      'searchType.prn',
      function () {
          return !(this.get('searchType.name') || this.get('searchType.date') ||
              this.get('searchType.ssn') || this.get('searchType.prn'));
      }
    ),

    /**
     * Used in the Search Term template to render the possible name field in
     * the Search Assist Dropdown
     *
     * _Returns: String_
     *
     * _Observes: searchTerm_
     *
     * @property valueName
     * @type {ComputedProperty
     */
    valueName: computed('searchTerm', function () {
        var searchTerm = this.get('searchTerm');

        return searchTerm ? searchTerm : this.get('searchTypePlaceholder').name;
    }),

    /**
     * Used in the Search Term template to render the possible birth date field in
     * the Search Assist Dropdown
     *
     * _Returns: String_
     *
     * _Observes: searchTerm_
     *
     * @property valueDate
     * @type {ComputedProperty
     */
    valueDate: computed('searchTerm', function () {
        if (this.get('searchType.date')) {
            var searchTerm = this.get('searchTerm'),
                dateFormat = this.get('searchTypePlaceholder').date;
            if (searchTerm && dateHelper.isValidDate(searchTerm, dateFormat)) {
                return dateHelper.formatDate(searchTerm);
            } else {
                return searchTerm ? searchTerm + dateFormat.slice(searchTerm.length) : dateFormat;
            }
        }
    }),

    /**
     * Used in the Search Term template to render the possible SSN field in
     * the Search Assist Dropdown
     *
     * _Returns: String_
     *
     * _Observes: searchTerm_
     *
     * @property valueSSN
     * @type {ComputedProperty}
     */
    valueSSN: computed('searchTerm', function () {
        if (this.get('searchType.ssn')) {
            var searchTerm = this.get('searchTerm');

            return searchTerm ? PFStringUtil.formatSSN(searchTerm) : this.get('searchTypePlaceholder').ssn;
        }
    }),

    /**
     * Used in the Search Term template to render the possible PRN field in
     * the Search Assist Dropdown
     *
     * _Returns: String_
     *
     * _Observes: searchTerm_
     *
     * @property valuePRN
     * @type {ComputedProperty}
     */
    valuePRN: computed('searchTerm', function () {
        if (this.get('searchType.prn')) {
            var searchTerm = this.get('searchTerm');

            return searchTerm ? this.get('searchTerm') : this.get('searchTypePlaceholder').prn;
        }
    }),

    /**
     * Validates the current search term and updates the state of searchType
     *
     * _Observes: searchTerm_
     *
     * @method validateSearchTerm
     */
    validateSearchTerm: observer('searchTerm', function () {
        var searchTerm = this.get('searchTerm');

        if (searchTerm) {
            // Validate Name
            // As long as it doesn't start with a digit, we consider it a valid name.
            if (/[^\A\d]/.test(searchTerm)) {
                this.set('searchType.name', true);
            } else {
                this.set('searchType.name', false);
            }

            // Validate Date
            /* jshint -W101 */ /* line too long */
            if (/^0[1-9]?$|^0[1-9][\/]$|^0[1-9][\/][0][1-9]?$|^0[1-9][\/][0][1-9][\/]$|^0[1-9][\/][0][1-9][\/]1$|^0[1-9][\/][0][1-9][\/]19\d{0,2}$|^0[1-9][\/][0][1-9][\/]2$|^0[1-9][\/][0][1-9][\/]20\d{0,2}$|^0[1-9][\/][1-2]\d?$|^0[1-9][\/][1-2]\d[\/]$|^0[1-9][\/][1-2]\d[\/]1$|^0[1-9][\/][1-2]\d[\/]19\d{0,2}$|^0[1-9][\/][1-2]\d[\/]2$|^0[1-9][\/][1-2]\d[\/]20\d{0,2}$|^0[1-9][\/][3][0-1]?$|^0[1-9][\/][3][0-1][\/]$|^0[1-9][\/][3][0-1][\/]1$|^0[1-9][\/][3][0-1][\/]19\d{0,2}$|^0[1-9][\/][3][0-1][\/]2$|^0[1-9][\/][3][0-1][\/]20\d{0,2}$|^1[0-2]?$|^1[0-2][\/]$|^1[0-2][\/][0][1-9]?$|^1[0-2][\/][0][1-9][\/]$|^1[0-2][\/][0][1-9][\/]1$|^1[0-2][\/][0][1-9][\/]19\d{0,2}$|^1[0-2][\/][0][1-9][\/]2$|^1[0-2][\/][0][1-9][\/]20\d{0,2}$|^1[0-2][\/][1-2]\d?$|^1[0-2][\/][1-2]\d[\/]$|^1[0-2][\/][1-2]\d[\/]1$|^1[0-2][\/][1-2]\d[\/]19\d{0,2}$|^1[0-2][\/][1-2]\d[\/]2$|^1[0-2][\/][1-2]\d[\/]20\d{0,2}$|^1[0-2][\/][3][0-1]?$|^1[0-2][\/][3][0-1][\/]$|^1[0-2][\/][3][0-1][\/]1$|^1[0-2][\/][3][0-1][\/]19\d{0,2}$|^1[0-2][\/][3][0-1][\/]2$|^1[0-2][\/][3][0-1][\/]20\d{0,2}$/.test(searchTerm)) {
            /* jshint +W101 */
                this.set('searchType.date', true);
            } else {
                this.set('searchType.date', false);
            }

            // Validate SSN
            if (searchTerm.match(/^\d{1,9}$|^\d{3}-$|^\d{3}-\d{1,6}$|^\d{1,3}-\d{1,2}-$|^\d{1,3}-\d{1,2}-\d{1,4}$|^\d{5}-$|^\d{5}-\d{1,4}$/)) {
                this.set('searchType.ssn', true);
            } else {
                this.set('searchType.ssn', false);
            }

            // Validate PRN
            this.set('searchType.prn', true);
        } else {
            this.resetSearchType();
        }
    })
});
