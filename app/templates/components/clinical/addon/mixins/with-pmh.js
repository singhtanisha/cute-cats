import { on } from '@ember/object/evented';
import { observer } from '@ember/object';
import { alias } from '@ember/object/computed';
import Mixin from '@ember/object/mixin';
import { task } from 'ember-concurrency';

export default Mixin.create({
    patientPracticeGuid: alias('patient.patientPracticeGuid'),
    isLoading: alias('loadPMH.isRunning'),
    onPMHReload: observer('pastMedicalHistory.isReloading', function () {
        if (this.get('pastMedicalHistory.isReloading')) {
            this.set('shouldReloadPMH', true);
        } else if (this.get('shouldReloadPMH')) {
            this.set('shouldReloadPMH', false);
            // Explicitly notify that the sections changed since there
            // is only 1-way binding on the pmhSections -> pastMedicalHistory.
            this.notifyPropertyChange('pmhSections');
        }
    }),
    patientPracticeGuidDidChange: on('init', observer('patientPracticeGuid', function() {
        const patientPracticeGuid = this.get('patientPracticeGuid');
        
        if (patientPracticeGuid) {
            this.get('loadPMH').perform(patientPracticeGuid);
        }
    })),
    loadPMH: task(function * (patientPracticeGuid) {
        const store = this.get('store');
        let pastMedicalHistory;
        
        try {
            pastMedicalHistory = yield store.findRecord('personal-medical-history', patientPracticeGuid);

            this.setProperties({
                error: false,
                pastMedicalHistory
            });
        } catch(e) {
            pastMedicalHistory = store.peekRecord('personal-medical-history', patientPracticeGuid);

            if (pastMedicalHistory) {
                store.unloadRecord(pastMedicalHistory);
            }

            this.setProperties({
                error: false,
                pastMedicalHistory: null
            });
        }
    }).restartable(),
    loadPMHIfEverUndefined: observer('pastMedicalHistory', function () {
        const patientPracticeGuid = this.get('patientPracticeGuid');

        if (this.get('pastMedicalHistory') === undefined && patientPracticeGuid) {
            this.get('loadPMH').perform(patientPracticeGuid);
        }
    })
});
