import { task } from 'ember-concurrency';
import Component from '@ember/component';
import { computed, get, observer, set } from '@ember/object';
import SpinnerSupport from 'common/mixins/spinner';
import PhoneHelper from 'common/helpers/phone';

export default Component.extend(SpinnerSupport, {
    classNames: ['box-margin-TBmd-v2', 'registry-search-form'],

    birthOrderOptions: computed(() => [
        {
            display: 'Unspecified',
            value: null
        },
        { display: '1', value: 1 },
        { display: '2', value: 2 },
        { display: '3', value: 3 },
        { display: '4', value: 4 },
        { display: '5', value: 5 },
        { display: '6', value: 6 },
        { display: '7', value: 7 },
        { display: '8', value: 8 },
        { display: '9', value: 9 },
        { display: '10', value: 10 }
    ]),
    gestationOptions: computed(() => [
        { display: 'Yes', value: true },
        { display: 'No', value: false }
    ]),
    isAdvancedVisible: false,

    toggleButtonText: computed('isAdvancedVisible', function () {
        return get(this, 'isAdvancedVisible') ? 'Show less' : 'Advanced search';
    }),
    birthOrderChanged: observer('model.birthOrder', function () {
        this.setSelectedListValue('birthOrder', 'selectedBirthOrder', get(this, 'birthOrderOptions'), 'value');
    }),
    genderChanged: observer('model.gender', function () {
        this.setSelectedListValue('gender', 'selectedGender', get(this, 'genderOptions'), 'gender');
    }),
    gestationChanged: observer('model.isMultipleBirth', function () {
        this.setSelectedListValue('isMultipleBirth', 'selectedGestation', get(this, 'gestationOptions'), 'value');
    }),
    stateChanged: observer('model.state', function () {
        this.setSelectedListValue('state', 'selectedState', get(this, 'stateOptions'), 'state');
    }),
    phoneNumberChanged: observer('model.phoneNumber', function () {
        set(
            this,
            'model.phoneNumber',
            PhoneHelper.formatPhone(get(this, 'model.phoneNumber'))
        );
    }),

    loadFormOptions: task(function* () {
        const genderOptions = yield get(this, 'store').findAll('gender-option');
        set(this, 'genderOptions', genderOptions.toArray());

        const stateOptions = yield this.get('store').findAll('state');
        set(this, 'stateOptions', stateOptions.toArray());
    }).drop(),

    setSelectedListValue(propertyKey, listPropertyKey, list, searchValueKey) {
        const propertyValue = get(this, `model.${propertyKey}`);
        const foundItem = list.findBy(searchValueKey, propertyValue);

        set(this, listPropertyKey, foundItem);
    },

    init() {
        this._super();
        get(this, 'loadFormOptions').perform();
    },

    actions: {
        clearGestation() {
            set(this, 'model.isMultipleBirth', null);
            set(this, 'model.birthOrder', null);
            set(this, 'selectedBirthOrder', null);
            set(this, 'selectedGestation', null);
        },
        clearAddress() {
            set(this, 'model.address1', null);
            set(this, 'model.address2', null);
        },
        clearMaidenName() {
            set(this, 'model.mothersMaidenName', null);
        },
        clearPatientRecordNumber() {
            set(this, 'model.patientRecordNumber', null);
        },
        clearPhoneNumber() {
            set(this, 'model.phoneNumber', null);
        },
        selectBirthOrder(birthOrder) {
            set(this, 'model.birthOrder', birthOrder.value);
        },
        selectGender(gender) {
            set(this, 'model.gender', gender.gender);
        },
        selectGestation(gestation) {
            set(this, 'model.isMultipleBirth', gestation.value);
        },
        selectState(state) {
            set(this, 'model.state', get(state, 'state'));
        }
    }
});
