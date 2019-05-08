import { and } from '@ember/object/computed';
import { computed, observer } from '@ember/object';
import SingleSelect from 'tyrion/components/single-select';
import DiagnosisRepository from 'clinical/repositories/diagnoses';
import Diagnosis from 'clinical/models/diagnosis';
import DiagnosesArray from 'clinical/models/diagnoses-array';

export default SingleSelect.extend({
    classNames: ['diagnosis-typeahead'],
    classNameBindings: ['showCodes'],
    // attrs
    canAddCustom: true,
    optionalCodeSystems: null,
    requiredCodeSystems: null,
    showCodes: true,

    // actions
    // diagnosisSelected(Diagnosis)
    // customDiagnosisSelected(Diagnosis)
    /***
     * The component sends diagnosisSelected first followed by refineDx (if needed)
     * includes the list of matches from the initial search. This refinement
     * can be to ICD-9 or ICD-10
     */
    // refineDx(DiagnosesArray, DiagnosisToRefin)

    // single-select overrides
    optionComponent: 'diagnosis-typeahead-item',
    dataContext: computed('showCodes', function () {
        const showCodes = this.get('showCodes');
        return { showCodes };
    }),

    placeholder: 'Search to add a diagnosis',
    optionLabelPath: 'term',
    selectType: 'typeahead',
    isShorter: true,
    sortLabels: false,
    clearSearchOnFocus: false,
    clearSearchOnSelect: true,
    includeSearchIcon: true,
    filterOnSelection: false,
    addCustomItemTemplateText: 'Add custom diagnosis for \"%@\"',
    canAddCustomItem: and('canAddCustom', 'hasMinChars'),
    minChars: 3,
    openOnFocus: true,
    isRemoteContent: true, // Force it to call queryRemoteContent even though we don't provide a url
    queryRemoteContent() {
        var query = this.get('query'),
            lastSearch = this.get('lastSearch') || {};
        query = query.trim();
        if (query === lastSearch.query) {
            return lastSearch.promise;
        }
        lastSearch.query = query;
        lastSearch.promise = DiagnosisRepository.search(query, this.get('requiredCodeSystems'), this.get('optionalCodeSystems'));
        this.set('lastSearch', lastSearch);
        return lastSearch.promise;
    },

    _selectionChanged: observer('selection', function () {
        var selection = this.get('selection'),
            fixedDxCodes = [],
            relatedDxCodes = [],
            diagnosis, relatedDiagnoses;

        if (selection !== null) {
            if (selection.get('codeToRefine')) {
                selection.get('diagnosisCodes').forEach(function (codes) {
                    if (codes[0].codeSystem.toLowerCase() === selection.get('codeToRefine')) {
                        // Note using pushObject, since each array represents combinatory for a different diagnosis
                        relatedDxCodes.pushObject(codes);
                    } else if (!(codes[0].codeSystem.toLowerCase() === 'snomed' && selection.get('snomedCodes.length') > 1)) {
                        fixedDxCodes.pushObjects(codes);
                    }
                });

                diagnosis = Diagnosis.wrap({
                    diagnosisCodes: fixedDxCodes,
                    name: selection.get('term')
                });

                relatedDiagnoses = relatedDxCodes.map(function (arrayOfCodes) {
                    return Diagnosis.wrap({
                        diagnosisCodes: arrayOfCodes
                    });
                });
                this.sendAction('diagnosisSelected', diagnosis);
                this.sendAction('refineDx', DiagnosesArray.createArray(relatedDiagnoses), diagnosis);
            } else {
                selection.get('diagnosisCodes').forEach(function (codes) {
                    if (!(codes[0].codeSystem.toLowerCase() === 'snomed' && selection.get('snomedCodes.length') > 1)) {
                        fixedDxCodes.pushObjects(codes);
                    }
                });

                diagnosis = Diagnosis.wrap({
                    diagnosisCodes: fixedDxCodes,
                    name: selection.get('term')
                });

                this.sendAction('diagnosisSelected', diagnosis);
            }

            this.set('selection', null);
        }
    }),
    actions: {
        addCustomItem() {
            this._super.apply(this, arguments);
            var description = this.get('query'),
                customDiagnosis = Diagnosis.wrap({
                    name: description,
                    diagnosisCodes: [{  codeSystem: 'Custom', code: '', description: description}]
                });
            this.sendAction('customDiagnosisSelected', customDiagnosis);
        }
    }
});
