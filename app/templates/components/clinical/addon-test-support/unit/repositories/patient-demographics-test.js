import { module, test } from 'qunit';
import { startMirage } from 'boot/initializers/ember-cli-mirage';
import setupStore from 'boot/tests/helpers/store';
import RaceOption from 'clinical/models/race-option';
import EthnicityOption from 'clinical/models/ethnicity-option';
import RaceOptionAdapter from 'clinical/adapters/race-option';
import EthnicityOptionAdapter from 'clinical/adapters/ethnicity-option';
import RaceOptionSerializer from 'clinical/serializers/race-option';
import EthnicityOptionSerializer from 'clinical/serializers/ethnicity-option';
import patientDemographicsRepository from 'clinical/repositories/patient-demographics';
import SubDemographicOption from 'clinical/models/sub-demographic-option';
import SubDemographicOptionSerializer from 'clinical/serializers/sub-demographic-option';

let env, store;

module('Unit - Core - Clinical | SIN | Repository - Patient Demographics', {
    beforeEach() {
        env = setupStore({
            adapters: {
                'race-option': RaceOptionAdapter,
                'ethnicity-option': EthnicityOptionAdapter
            },
            serializers: {
                'race-option': RaceOptionSerializer,
                'ethnicity-option': EthnicityOptionSerializer,
                'sub-demographic-option': SubDemographicOptionSerializer
            },
            models: {
                'race-option': RaceOption,
                'ethnicity-option': EthnicityOption,
                'sub-demographic-option': SubDemographicOption
            }
        });
        store = env.store;
        this.server = startMirage();
    },
    afterEach() {
        this.server.shutdown();
        store = null;
    }
});

test('findPatientEthnicityOptions returns proper results', function(assert) {
    const done = assert.async();
    let patientDemographicEthnicityOptionsCalled = false;

    server.get('/PatientEndpoint/api/v2/patients/ethnicityOptions', function ({ db }) {
        patientDemographicEthnicityOptionsCalled = true;
        return db.ethnicityOptions;
    });

    patientDemographicsRepository.findPatientEthnicityOptions(store).then(ethnicityOptions => {
        const option = ethnicityOptions.toArray()[1];
        const subEthnicityOptions = option.get('subOptions');
        const subEthnicityOption = subEthnicityOptions.get('firstObject');

        assert.ok(patientDemographicEthnicityOptionsCalled, 'The ethnicity options endpoint was called.');
        assert.equal(option.get('optionGuid'), 'd6a37b7c-c763-4695-90e7-097cdb8c2ec7', 'The first ethnicityOption optionGuid was serialized correctly.');
        assert.equal(option.get('description'), 'Hispanic or Latino', 'The first ethnicityOption description was serialized correctly.');

        assert.equal(subEthnicityOptions.get('length'), 2, 'The subEthnicity options length is correct.');
        assert.equal(subEthnicityOption.get('optionGuid'), '5cdf014a-dfef-4193-a1c9-1e6355146599', 'The subEthnicityOption optionGuid was serialized correctly.');
        assert.equal(subEthnicityOption.get('description'), 'Spaniard', 'The subEthnicityOption description was serialized correctly.');

        done();
    });
});

test('findPatientRaceOptions returns proper results', function(assert) {
    const done = assert.async();
    let patientDemographicRaceOptionsCalled = false;

    server.get('/PatientEndpoint/api/v2/patients/raceOptions', function ({ db }) {
        patientDemographicRaceOptionsCalled = true;
        return db.raceOptions;
    });

    patientDemographicsRepository.findPatientRaceOptions(store).then(raceOptions => {
        const option = raceOptions.toArray()[1];
        const subRaceOptions = option.get('subOptions');
        const subRaceOption = subRaceOptions.get('firstObject');

        assert.ok(patientDemographicRaceOptionsCalled, 'The race options endpoint was called.');
        assert.equal(option.get('optionGuid'), '9f94fa9e-18f5-4ba7-90d4-18ffb0d918a4', 'The first raceOption optionGuid was serialized correctly.');
        assert.equal(option.get('description'), 'American Indian or Alaska Native', 'The first raceOption description was serialized correctly.');

        assert.equal(subRaceOptions.get('length'), 2, 'The subRace options length is correct.');
        assert.equal(subRaceOption.get('optionGuid'), 'a4a15b58-dbbc-485d-9f59-598ef6661917', 'The subRace optionGuid was serialized correctly.');
        assert.equal(subRaceOption.get('description'), 'American Indian', 'The subRaceOption description was serialized correctly.');

        done();
    });
});
