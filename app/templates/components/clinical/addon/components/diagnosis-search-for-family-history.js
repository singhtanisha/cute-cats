import SingleSelect from 'tyrion/components/single-select';
import DiagnosisRepository from 'clinical/repositories/diagnoses';
/***
 * @module Clinical
 * @sub-module Components
 * @class DiagnosisSearchForFamilyHistory
 */
export default SingleSelect.extend({
    classNames: ['diagnosis-search-for-family-history'],
    // attrs
    /***
     * @property relatives
     * @type {Array}
     * A list of relatives in the form :
     * ```
     * [
     *   {relative: { observations: [{diagnosis: {}}]} }
     * ];
     * ```
     */
    relatives: null,
    // actions
    /***
     * @event select
     * @param {Object} an object that represents the selected diagnosis
     */
    select: null,


    // single-select overrides
    // TODO: group stuff
    placeholder: 'Search to add a diagnosis',
    optionLabelPath: 'description',
    selectType: 'typeahead',
    isShorter: true,
    sortLabels: false,
    clearSearchOnFocus: false,
    clearSearchOnSelect: false,
    includeSearchIcon: true,
    filterOnSelection: false,
    minChars: 3,
    openOnFocus: true,
    isRemoteContent: true, // Force it to call queryRemoteContent even though we don't provide a url
    optionGroupPath: 'diagnosisType',

    queryRemoteContent() {
        var query = this.get('query'),
            lastSearch = this.get('lastSearch') || {};
        query = query.trim();
        if (query === lastSearch.query) {
            return lastSearch.promise;
        }
        lastSearch.query = query;
        lastSearch.promise = DiagnosisRepository.searchForFamilyHistory(query, this.get('relatives'));
        this.set('lastSearch', lastSearch);
        return lastSearch.promise;
    }
});
