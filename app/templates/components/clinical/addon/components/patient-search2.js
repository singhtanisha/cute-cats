import { merge } from '@ember/polyfills';
import { next, later } from '@ember/runloop';
import { isEmpty } from '@ember/utils';
import { on } from '@ember/object/evented';
import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import patientSearchOptions from 'clinical/models/patient-search-options';
import patientSearchUtil from 'clinical/util/patient-search';

export default Component.extend({
    classNames: ['patient-search2'],

    prompt: 'Search',

    // Bound to template
    searchQuery: '',
    /***
     * Filters selects from multi-select
     */
    searchFilters: null,

    analytics: service(),

    optionComponent: 'patient-search2-item',
    selectionItemComponent: 'patient-search2-selected-item',

    init() {
        this._super();
        if (!this.get('searchFilters')) {
            this.set('searchFilters', []);
        }
    },

    allSearchOptions: computed(function () {
        return patientSearchOptions();
    }),

    _updateOptions() {
        var searchFilters = this.get('searchFilters') || [],
            remainingOptions = this.get('allSearchOptions').reject(function (searchOption) {
                return searchFilters.includes(searchOption);
            }),
            availableOptions;
        remainingOptions.setEach('value', this.get('searchQuery'));

        if (!this.get('searchQuery')) {
            // No search query, means we should show all the options.
            availableOptions = remainingOptions;
        } else {
            availableOptions = remainingOptions.filterBy('matches');
        }
        this.set('searchOptions', availableOptions);
    },
    _searchQueryChanged: observer('searchQuery', 'searchFilters.[]', on('init', function() {
        // When selecting an item, the multi-select sets the query to '' before the item is added to the selections. Therefore, we'll delay to the next run
        // loop to ensure that the selections array has been updated before clearing out the value on each item.
        if (isEmpty(this.get('searchQuery'))) {
            next(() => this._updateOptions());
        } else {
            this._updateOptions();
        }
    })),

    _searchFilterChanged: observer('searchFilters.[]', function () {
        var searchFilters = this.get('searchFilters'),
            newSearchCriteria = {};
        if (this._removeDataIfIsPartialToWorkaroundBackendLimitations(searchFilters)) {
            return;
        }
        if (searchFilters.length === 0) {
            if (isEmpty(this.get('searchQuery'))) {
                this.sendAction('search', null);
            }
            return;
        }

        searchFilters.forEach(function (filter) {
            newSearchCriteria[filter.property] = filter.value;
        });
        newSearchCriteria = this._adjustNameSearchToWorkaroundBackendLimitations(newSearchCriteria);
        this.patientSearchMixpanelEvent('Patient List Search', searchFilters.length, newSearchCriteria);
        this.sendAction('search', newSearchCriteria);
    }),

    patientSearchMixpanelEvent(trackedEvent, numFilters, newSearchCriteria) {
        this.get('analytics').track(trackedEvent,
            {
                'Patient Search Criteria Count' : numFilters,
                'Patient Search By PRN': newSearchCriteria.hasOwnProperty('patientRecordNumber')
            }
        );
    },

    _removeDataIfIsPartialToWorkaroundBackendLimitations(searchFilters) {
        var dateFilter = searchFilters.findBy('property', 'birthDate'),
            requiredLength = 'dd/mm/yyyy'.length;
        if (dateFilter && dateFilter.value.length !== requiredLength) {
            later(function () {
                // This needs to be re-scheduled to avoid rendering issues with multi-select
                searchFilters.removeObject(dateFilter);
            });
            toastr.warning('The DOB is incomplete so it was ignored');
            return true;
        }
        return false;
    },

    _adjustNameSearchToWorkaroundBackendLimitations(searchCriteria) {
        const name = searchCriteria.namePropertyUsedToWorkaroundBackendLimitations;
        if (!name) {
            return searchCriteria;
        }
        // The server doesn't expect 'name' so this will simply be ignored
        searchCriteria.namePropertyUsedToWorkaroundBackendLimitations = undefined;

        merge(searchCriteria, patientSearchUtil.formatNameParameters(name));
        return searchCriteria;
    }
});
