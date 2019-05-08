import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import config from 'boot/config';
import SingleSelect from 'tyrion/components/single-select';

export default SingleSelect.extend({
    includeSearchIcon: true,
    minChars: 2,
    openOnFocus: true,
    optionLabelPath: 'drugName',
    optionValuePath: 'ndc',
    placeholder: 'Search for medications',
    selectType: 'typeahead',
    sortLabels: false,

    session: service(),

    currentFacility: computed('session.facilityGuid', function() {
        return this.get('store').peekRecord('facility', this.get('session.facilityGuid'));
    }),

    remoteDataUrl: computed(function() {
        return `${config.clinicalBaseURL_v2}Drugs/Search`;
    }),

    buildUrl() {
        return `${this.get('remoteDataUrl')}?searchCriteria=${this.get('query')}&locationCode=${this.get('currentFacility.state')}`;
    }
});
