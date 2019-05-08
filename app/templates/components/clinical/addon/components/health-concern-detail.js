import { isEmpty } from '@ember/utils';
import { on } from '@ember/object/evented';
import { computed, observer } from '@ember/object';
import Component from '@ember/component';
import { task, all } from 'ember-concurrency';
import diagnosesRepository from 'clinical/repositories/diagnoses';
import DestroyedMixin from 'tyrion/mixins/destroyed';

export default Component.extend(DestroyedMixin, {
    useTether: computed(() => !window.runningTests),
    tabSelectedDefault: 0,
    categories: computed('diagnosesCategory', 'allergiesCategory', function () {
        return [this.get('diagnosesCategory'), this.get('allergiesCategory')];
    }),
    diagnosesCategory: computed(function () {
        return {
            category: 'Diagnoses',
            noResultsMessage: 'Patient does not have any recorded diagnoses.',
            options: []
        };
    }),
    allergiesCategory: computed(function () {
        return {
            category: 'Allergies',
            noResultsMessage: 'Patient does not have any recorded allergies.',
            options: []
        };
    }),
    loadCategories: on('init', observer('model', function () {
        this.setProperties({
            resizables: [],
            'allergiesCategory.options': [],
            'diagnosesCategory.options': []
        });
        const healthConcernReferenceGuid = this.get('model.healthConcernReferenceGuid');
        if (healthConcernReferenceGuid) {
            if (!this.get('model.healthConcernReferenceItem')) {
                this.get('loadReferenceItem').perform(healthConcernReferenceGuid, this.get('model.healthConcernType'));
            }
        } else {
            this.get('loadClinicalData').perform();
        }
    })),
    loadClinicalData: task(function* () {
        const patientPracticeGuid = this.get('model.patientPracticeGuid');
        const existingHealthConcerns = yield this.get('store').query('patient-health-concern', { patientPracticeGuid });
        yield all([
            this.get('loadAllergiesCategory').perform(patientPracticeGuid, existingHealthConcerns),
            this.get('loadDiagnosesCategory').perform(patientPracticeGuid, existingHealthConcerns)
        ]);
    }).drop(),
    loadAllergiesCategory: task(function* (patientPracticeGuid, existingHealthConcerns) {
        const allergies = yield this.loadAllergies(patientPracticeGuid);
        this.set('allergiesCategory.options', allergies.map(allergy => {
            const healthConcernReferenceGuid = allergy.get('allergyGuid');
            if (allergy.get('isCustom') || existingHealthConcerns.findBy('healthConcernReferenceGuid', healthConcernReferenceGuid)) {
                return null;
            }
            return {
                label: allergy.get('allergenText'),
                healthConcernReferenceGuid
            };
        }).compact().sortBy('label'));
    }),
    loadAllergies(patientPracticeGuid) {
        return this.get('store').query('patient-allergy', { patientPracticeGuid });
    },
    loadDiagnosesCategory: task(function* (patientPracticeGuid, existingHealthConcerns) {
        const diagnoses = yield diagnosesRepository.loadDiagnoses(patientPracticeGuid);
        this.set('diagnosesCategory.options', diagnoses.map(diagnosis => {
            const healthConcernReferenceGuid = diagnosis.get('diagnosisGuid');
            const isCustom = isEmpty(diagnosis.get('diagnosisCodes')) || diagnosis.get('isCustom');
            if (isCustom || existingHealthConcerns.findBy('healthConcernReferenceGuid', healthConcernReferenceGuid)) {
                return null;
            }
            let label = diagnosis.get('icd10Code');
            let isIcd10 = true;
            if (!label) {
                label = diagnosis.get('icd9Code');
                isIcd10 = false;
            }
            return {
                healthConcernReferenceGuid,
                description: this.getDiagnosisDescription(diagnosis, isIcd10),
                label
            };
        }).compact().sortBy('description'));
    }),
    getDiagnosisDescription(diagnosis, isIcd10) {
        const system = isIcd10 ? 'icd10' : 'icd9';
        const codes = diagnosis._getCodesByCodeSystem(system);
        if (isEmpty(codes)) {
            return diagnosis.get('name');
        }
        return codes.map((code, index) => {
            if (index === 0) {
                return code.description;
            }
            return `(${code.code}) ${code.description}`;
        }).join(', ');
    },
    loadReferenceItem: task(function* (healthConcernReferenceGuid, healthConcernType) {
        const patientPracticeGuid = this.get('model.patientPracticeGuid');
        if (healthConcernType === 'Allergy') {
            const allergies = yield this.loadAllergies(patientPracticeGuid);
            const allergy = allergies.findBy('allergyGuid', healthConcernReferenceGuid);
            this.set('model.healthConcernReferenceItem', allergy);
        } else {
            const diagnoses = yield diagnosesRepository.loadDiagnoses(patientPracticeGuid);
            const diagnosis = diagnoses.findBy('diagnosisGuid', healthConcernReferenceGuid);
            this.set('model.healthConcernReferenceItem', diagnosis);
        }
    }).restartable(),
    actions: {
        selectClinicalItem(item) {
            const healthConcernType = item.description ? 'Diagnosis' : 'Allergy';
            const { healthConcernReferenceGuid } = item;
            this.get('model').setProperties({
                healthConcernReferenceGuid,
                healthConcernType
            });
            this.set('model.healthConcernReferenceGuid', healthConcernReferenceGuid);
            this.get('loadReferenceItem').perform(healthConcernReferenceGuid, healthConcernType);
        },
        clearClinicalItem() {
            const model = this.get('model');
            const healthConcernType = model.get('healthConcernType');
            this.set('tabSelectedDefault', healthConcernType === 'Allergy' ? 1 : 0);
            model.setProperties({
                healthConcernReferenceGuid: null,
                healthConcernType: null,
                healthConcernReferenceItem: null
            });
        },
        save() {
            this.attrs.save(false);
        },
        saveAndAddAnother() {
            this.attrs.save(true);
        }
    }
});
