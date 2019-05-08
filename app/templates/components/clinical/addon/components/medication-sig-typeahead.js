import SingleSelect from 'tyrion/components/single-select';

var lowerCased = function (value) {
    return (value || '').toLowerCase();
};

export default SingleSelect.extend({
    clearSearchOnSelect: true,
    includeSearchIcon: true,
    isShorter: true,
    openOnFocus: true,
    optionLabelPath: 'patientDescription',
    optionValuePath: 'professionalDescription',
    placeholder: 'Enter shorthand',
    selectType: 'typeahead',

    matcher(searchText, item) {
        var query = lowerCased(searchText),
            patientDescription = lowerCased(item.patientDescription),
            professionalDescription = lowerCased(item.professionalDescription),
            searchTerm = lowerCased(item.searchTerm);
        return patientDescription.indexOf(query) > -1 ||
            professionalDescription.indexOf(query) > -1 ||
            searchTerm.indexOf(query) > -1;
    }
});
