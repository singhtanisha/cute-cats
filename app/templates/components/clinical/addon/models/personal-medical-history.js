import { alias } from '@ember/object/computed';
import { Promise } from 'rsvp';
import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import PastMedicalHistorySection from 'clinical/models/past-medical-history-section';
import config from 'boot/config';
import PFServer from 'boot/util/pf-server';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

const PersonalMedicalHistory = Model.extend({
    patientPracticeGuid: alias('id'),
    events: attr('string'),
    allergies: attr('string'),
    allergiesPmhGuid: attr('string'),
    ongoingMedicalProblems: attr('string'),
    familyHealthHistory: attr('string'),
    preventativeCare: attr('string'),
    socialHistory: attr('string'),
    nutritionHistory: attr('string'),
    developmentalHistory: attr('string'),
    areAllEmpty: computed(
        'events',
        'allergies',
        'ongoingMedicalProblems',
        'familyHealthHistory',
        'preventativeCare',
        'socialHistory',
        'nutritionHistory',
        'developmentalHistory', function() {
            let keys = [
                'events',
                'ongoingMedicalProblems',
                'preventativeCare',
                'developmentalHistory'
            ];

            const properties = this.getProperties(keys);
            return keys.every((key) => {
                return isEmpty(properties[key]);
            });
      }
    ),
    sections: computed(function() {
        return PastMedicalHistorySection.createSections(this);
    })
});

PersonalMedicalHistory.reopenClass({
    find(store, patientPracticeGuid) {
        return new Promise(function(resolve, reject) {
            store.findRecord('personal_medical_history', patientPracticeGuid).then(function(pmh) {
                resolve(pmh);
            }).catch(function(error) {
                var pmh = store.peekRecord('personal_medical_history', patientPracticeGuid);
                if (pmh) {
                    store.unloadRecord(pmh);
                }
                reject(error);
            });
        });
    },
    reload(store, patientPracticeGuid) {
        var pmh = store.peekRecord('personal_medical_history', patientPracticeGuid);
        if (!pmh) {
            return this.find(store, patientPracticeGuid);
        }
        return pmh.reload().then(function () {
            // HACK: make sure we recreate the sections.
            // NOTE: we should move this to the UI so we can use the objects directly without needing this abstraction
            pmh.propertyDidChange('sections');
        });
    },
    deleteAllergies(store, personalMedicalHistory) {
        let patientPracticeGuid = personalMedicalHistory.get('patientPracticeGuid'),
            deleteAllergiesUrl = config.defaultHost + '/' + config.clinicalNamespace_v2 + '/PersonalMedicalHistory/' +
                    patientPracticeGuid + '/' + personalMedicalHistory.get('allergiesPmhGuid');

        return PFServer.promise(deleteAllergiesUrl, 'DELETE')
            .then(() => {
                return PersonalMedicalHistory.reload(store, patientPracticeGuid);
            });
    }
});

export default PersonalMedicalHistory;
