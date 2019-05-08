import Component from '@ember/component';
import { computed, observer, get, getProperties, set, setProperties } from '@ember/object';
import { and, not } from '@ember/object/computed';
import { merge } from '@ember/polyfills';
import { isPresent } from '@ember/utils';
import { task } from 'ember-concurrency';
import fhhRepository from 'clinical/repositories/family-health-history';
import diagnosesRepository from 'clinical/repositories/diagnoses';

const saveProperties = ['diagnosis', 'onsetDate', 'comment', 'relative'];

export default Component.extend({
    classNames: ['family-history-detail'],
    maxDate: moment(new Date()).format('MM/DD/YYYY'),
    notDisabled: not('disabled'),
    showSaveButton: and('diagnosis', 'notDisabled'),
    showDeleteButton: and('observation.observationGuid', 'notDisabled'),
    relativeDescription: computed('relative', function () {
        const relative = this.get('relative');
        const relationshipType = get(relative, 'relationshipType.description');
        const { firstName, lastName } = getProperties(relative, 'firstName', 'lastName');
        let name;
        if (isPresent(firstName) && isPresent(lastName)) {
            name = `${firstName} ${lastName}`;
        } else if (isPresent(lastName)) {
            name = lastName;
        } else {
            name = firstName;
        }
        if (isPresent(name)) {
            return `${name} - ${relationshipType}`;
        }
        return relationshipType;
    }),
    noResultsText: computed('diagnosisQuery', function () {
        return this.get('diagnosisQuery.length') > 2 ? 'No results' : 'Type at least 3 characters to see results';
    }),
    init() {
        this._super();
        this.setObservationFields();
    },
    didInsertElement() {
        this._super();
        if (!this.get('diagnosis')) {
            this.$('.composable-select__input').focus();
        }
    },
    setObservationFields: observer('observation', function () {
        const observation = this.get('observation') || {};
        const initialProperties = getProperties(observation, saveProperties);
        if (isPresent(initialProperties.onsetDate)) {
            initialProperties.onsetDate = moment.utc(initialProperties.onsetDate).format('MM/DD/YYYY');
        }
        this.setProperties(merge({ initialProperties }, initialProperties));
    }),
    searchDiagnoses: task(function* (query) {
        const searchResults = yield diagnosesRepository.searchForFamilyHistory(query, this.get('relatives'));
        return searchResults;
    }).restartable(),
    save: task(function* () {
        const observation = this.get('observation');
        const data = this.getProperties(saveProperties);
        if (isPresent(data.onsetDate)) {
            data.onsetDate = moment(data.onsetDate).utc().startOf('day').toISOString();
        }
        setProperties(observation, data);
        set(observation, 'relative', {
            relativeGuid: get(observation, 'relative.relativeGuid')
        });
        try {
            yield fhhRepository.saveObservation(observation);
            this.reload();
            this.close();
        } catch (e) {
            setProperties(observation, this.get('initialProperties'));
        }
    }).drop(),
    delete: task(function* () {
        const observation = this.get('observation');
        yield fhhRepository.deleteObservation(observation);
        this.removeObservation(observation);
        this.close();
    }).drop()
});
