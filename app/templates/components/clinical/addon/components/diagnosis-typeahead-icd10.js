import { isEmpty } from '@ember/utils';
import { copy } from '@ember/object/internals';
import { and, or } from '@ember/object/computed';
import { computed, observer } from '@ember/object';
import MultiSourceSelect from 'tyrion/components/multi-source-select';
import DiagnosisRepository from 'clinical/repositories/diagnoses';
import Diagnosis from 'clinical/models/diagnosis';
import DiagnosesArray from 'clinical/models/diagnoses-array';

export default MultiSourceSelect.extend({
    classNames: ['diagnosis-typeahead', 'diagnosis-typeahead-icd10'],
    // attrs
    canAddCustom: true,
    optionalCodeSystems: computed('config.isDiagnosisSnomedAllOn', function () {
        if (this.get('config.isDiagnosisSnomedAllOn')) {
            return ['icd10', 'snomedAll', 'icd9'];
        }
        return ['icd10', 'snomed', 'icd9'];
    }),
    requiredCodeSystems: computed(() => []),
    optionLabelPath: 'term',
    optionDescriptionPath: 'term',
    optionValuePath: 'id',

    // component overrides
    optionComponent: 'diagnosis-typeahead-item-icd10',
    placeholder: 'Search to add diagnosis',
    prompt: 'Add diagnosis',
    isShorter: true,
    sortLabels: false,
    includeSearchIcon: true,
    filterOnSelection: true,
    addCustomItemTemplateText: 'Add custom diagnosis: \"%@\"',
    canAddCustomItem: and('canAddCustom', 'hasMinChars'),
    clearSearchOnFocus: false,
    clearSearchOnSelect: true,
    minChars: 2,
    openOnFocus: true,
    maxSelections: 1,
    isRemoteContent: true, // Force it to call queryRemoteContent even though we don't provide a url
    dropdownEnabled: true,
    includeDropdownFooter: or('selectedTab.customLink', 'canAddCustomItem'),
    hintText: 'Type at least 2 characters to start seeing results',
    isSendSearchActionOnEnterKeyEnabled: false,
    useTether: false,

    queryRemoteContent() {
        var query = this.get('query'),
            lastSearch = this.get('lastSearch') || {};
        query = query.trim();
        if (query === lastSearch.query) {
            return lastSearch.promise;
        }
        lastSearch.query = query;
        lastSearch.promise = DiagnosisRepository.search(query, this.get('requiredCodeSystems'), this.get('optionalCodeSystems')).then((results) => {
            this.setHighlightedIndex(0);
            return results;
        });
        this.set('lastSearch', lastSearch);
        return lastSearch.promise;
    },

    _selectionChanged: observer('selection', function () {
        var selection = this.get('selection'),
            fixedDxCodes = [],
            relatedDxCodes = [],
            diagnosis, relatedDiagnoses;

        if (selection !== null) {
            this.set('tabSelectedDefault', 0);
            if (selection.get('constructor.modelName') === 'favorite-diagnosis') {
                this.sendAction('favoriteSelected', Diagnosis.wrap({
                    name: selection.get('name'),
                    diagnosisCodes: copy(selection.get('diagnosisCodes'), true)
                }));
                this.set('tabSelectedDefault', 1);
            } else if (selection.get('codeToRefine')) {
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
    filteredContent: computed('content.[]', 'selectedTab.content.[]', 'query', 'optionLabelPath', 'sortLabels', function () {
        const content = this.get('selectedTab.isDefault') ? this.get('content') : this.get('selectedTab.content');
        if (isEmpty(content)) {
            return [];
        }
        return content;
    }),
    actions: {
        selectTab(tab) {
            this.selectTab(tab, true);
        },
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
