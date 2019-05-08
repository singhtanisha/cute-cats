import { isEmpty, isPresent } from '@ember/utils';
import { observer, computed } from '@ember/object';
import { on } from '@ember/object/evented';
import { alias, or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import DestroyedMixin from 'tyrion/mixins/destroyed';
import AllergiesArray from 'clinical/models/allergies-array';
import { task } from 'ember-concurrency';

/***
 * Loads allergies on init based on patientPracticeGuid and transcriptGuid properties
 * Sets allergies (see clinical/models/allergy).
 */
export default Mixin.create(DestroyedMixin, {
    tunnel: service(),

    allergies: null,
    loadAllergiesFailed: false,
    patientPracticeGuidMismatch: false,
    isLoading: alias('loadAllergies.isRunning'),
    allergiesError: or('loadAllergiesFailed', 'patientPracticeGuidMismatch'),
    noKnownAllergies: alias('allergies.noKnownAllergies'),
    _loadAllergiesOnInit: on('init', observer('patientPracticeGuid', function () {
        this.get('loadAllergies').perform();
    })),
    drugAllergies: computed('allergies.drug.[]', 'patientPracticeGuid', function () {
        return this.filterPatientAllergies(this.get('allergies.drug'));
    }),
    foodAllergies: computed('allergies.food.[]', 'patientPracticeGuid', function () {
        return this.filterPatientAllergies(this.get('allergies.food'));
    }),
    environmentalAllergies: computed('allergies.environmental.[]', 'patientPracticeGuid', function () {
        return this.filterPatientAllergies(this.get('allergies.environmental'));
    }),
    inactiveAllergies: computed('allergies.inactive.[]', 'patientPracticeGuid', function () {
        return this.filterPatientAllergies(this.get('allergies.inactive'));
    }),
    filterPatientAllergies(allergies) {
        const patientPracticeGuid = this.get('patientPracticeGuid');
        if (isEmpty(patientPracticeGuid) || isEmpty(allergies)) {
            return [];
        }
        return AllergiesArray.create({
            content: allergies.filterBy('patientPracticeGuid', patientPracticeGuid)
        });
    },
    loadAllergies: task(function * (forceReload) {
        const patientPracticeGuid = this.get('patientPracticeGuid');

        if (!patientPracticeGuid) {
            return;
        }

        this.setProperties({
            loadAllergiesFailed: false,
            allergies: AllergiesArray.create({ content: [] })
        });

        const data = yield this.get('store').query('patient-allergy', { patientPracticeGuid, forceReload });

        this.setAllergies(patientPracticeGuid, AllergiesArray.create({
            content: data.toArray(),
            noKnownAllergies: data.get('meta.noKnownAllergies')
        }));
    }).restartable(),
    setAllergies(patientPracticeGuid, allergies) {
        if (this.get('patientPracticeGuid') === patientPracticeGuid) {
            this._unlessDestroyed(() => {
                this.setProperties({
                    patientPracticeGuidMismatch: isPresent(allergies) && allergies.every(allergy => allergy.get('patientPracticeGuid') !== patientPracticeGuid),
                    allergies
                });
                if (this.attrs.loadedAllergies) {
                    this.attrs.loadedAllergies(allergies);
                }
                this.get('tunnel').send('allergies-list', allergies);
            });
        }
    }
});
