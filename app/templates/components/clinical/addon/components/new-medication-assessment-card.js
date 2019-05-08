import { merge } from '@ember/polyfills';
import { on } from '@ember/object/evented';
import { isEmpty, isPresent } from '@ember/utils';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import proliaAesiMedicationHistory from 'clinical/models/assessments/prolia-aesi-medication-history';
import Assessment from 'clinical/models/assessment';

export default Component.extend({
    classNames: ['new-medication-assessment-card', 'panel'],
    analytics: service(),
    layoutName: computed('token', {
        get() {
            const token = this.get('token');
            if (isEmpty(token)) {
                return '';
            }
            return 'assessments/' + token.dasherize();
        }
    }),
    model: computed('token', {
        get() {
            const patientPracticeGuid = this.get('patientPracticeGuid');
            if (this.get('token') === 'proliaAesiMedicationHistory') {
                return Assessment.wrap(proliaAesiMedicationHistory, patientPracticeGuid);
            }
        }
    }),
    trackingType: computed('token', {
        get() {
            if (this.get('token') === 'proliaAesiMedicationHistory') {
                return 'Prolia Adverse Events';
            }
        }
    }),
    _recordWithStatus(status) {
        const model = this.get('model');
        model.set('status', status);
        this.sendAction('recorded', model);
    },
    _trackShown: on('didInsertElement', function() {
        this._track('Medication Card Assessment Displayed');
    }),
    _track(text, details) {
        let trackingType = this.get('trackingType');
        details = details || {};
        if (isPresent(trackingType)) {
            this.get('analytics').track(text, merge(details, {
                'Assessment Type': trackingType,
                'Patient Practice Guid': this.get('patientPracticeGuid')
            }));
        }
    },
    actions: {
        dismiss() {
            this._recordWithStatus('Dismissed');
            this._track('Medication Card Assessment Dismissed');
        },
        recorded() {
            let details = {};
            if (this.get('token') === 'proliaAesiMedicationHistory') {
                details['Assessment Value'] = this.get('model.proliaMedicationHistory.value');
            }
            this._recordWithStatus('Completed');
            this._track('Medication Card Assessment Recorded', details);
        }
    }
});
