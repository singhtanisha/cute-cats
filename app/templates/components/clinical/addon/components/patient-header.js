import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
    authorization: service(),
    classNames: ['patient-header-component'],
    classNameBindings: ['isExpanded', 'isActive::inactive-patient'],
    patientImageExists: true,
    isExpanded: false,
    isPhrStatusVisible: true,
    isEntitledToEditHeader: computed('authorization.entitledFeatures.[]', function () {
        return this.get('authorization').isEntitledFor('Chart.Header.Edit');
    }),
    gender: computed('patient.genderString', function () {
        var gender = this.get('patient.genderString');
        return (_.isString(gender)) ? gender.charAt(0).toUpperCase() : '';
    }),
    isActive: computed('patient.isActive', function() {
        return !this.get('patient') || this.get('patient.isActive');
    }),
    showPhrStatus: observer('patient', function () {
        this.set('isPhrStatusVisible', true);
    }),
    actions: {
        toggleIsExpanded() {
            this.toggleProperty('isExpanded');
        },
        addPhoto() {
            if (this.get('isEntitledToEditHeader')) {
                this.sendAction('addPhoto');
            }
        },
        openPhrEnrollment() {
            this.sendAction('openPhrEnrollment');
        },
        hidePhrStatus() {
            this.set('isPhrStatusVisible', false);
        }
    }
});
