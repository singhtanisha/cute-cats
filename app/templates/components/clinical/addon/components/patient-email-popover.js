import { not } from '@ember/object/computed';
import EmberObject, { observer } from '@ember/object';
import Component from '@ember/component';
import repository from 'clinical/repositories/patient';

var PatientEmailPopover = Component.extend({
    classNames: ['patient-email-popover'],
    layoutName: 'components/patient-email-popover',
    patientInfo: null,
    isPopoverVisible: false,
    errorMessage: null,
    patientEmailInfo: EmberObject.create(),
    patientHasEmail: not('patientInfo.isUserOfEmail'),
    emailAddress: null,
    isEmailInputDisabled: false,
    allowDuplicatePatientIdentifier: false,
    checkEmailInput: observer('patientEmailAddress', function(value) {
        if (value.patientEmailAddress.length > 0) {
            this.set('patientInfo.isUserOfEmail', false);
        } else {
            this.set('patientInfo.isUserOfEmail', true);
        }
    }),
    savePatient() {
        var _this = this,
            patientGuid = _this.get('patientInfo.guid'),
            patientEmailAddress = _this.get('patientEmailAddress'),
            allowDuplicatePatientIdentifier = _this.get('allowDuplicatePatientIdentifier');

        this.get('patientEmailInfo').setProperties({
            isUserOfEmail: !_this.get('patientInfo.isUserOfEmail'),
            emailAddress: patientEmailAddress,
            allowDuplicatePatientIdentifier: allowDuplicatePatientIdentifier
        });

        repository.updatePatientEmail(_this.get('patientEmailInfo'), patientGuid).then(function() {
            _this.onPatientEmailUpdateSuccess();
        }).catch(function(err) {
            if (err.status === 409 && _this.get('allowDuplicatePatientIdentifier') === false) {
                if (window.confirm('Duplicate Patient Record Number. Save anyway?')) {
                    _this.set('allowDuplicatePatientIdentifier', true);
                    _this.savePatient();
                } else {
                    toastr.error('Failed to update email address');
                }
            } else if (err.status === 400 && _this.get('patientInfo.isUserOfEmail')) {
                _this.set('errorMessage', 'Please enter a valid email.');
                _this.set('errorClass', 'error');
            } else if (err.status === 200) {
                _this.onPatientEmailUpdateSuccess();
            } else {
                toastr.error('Failed to update email address');
            }
        });
    },
    onPatientEmailUpdateSuccess() {
        var patientEmailAddress = this.get('patientEmailAddress');
        this.set('isPopoverVisible', false);
        this.set('patientInfo.emailAddress', patientEmailAddress);
        toastr.success('Email updated successfully.');
    },
    clearEmailFieldErrors: observer('patientEmailAddress', 'patientInfo.isUserOfEmail', function() {
        this.set('errorMessage', null);
        this.set('errorClass', null);
    }),
    isValidEmail(s) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(s);
    },
    actions: {
        toggleEmailPopover() {
            var isPopoverVisible = this.get('isPopoverVisible');
            if (isPopoverVisible) {
                this.set('isPopoverVisible', false);
            } else {
                this.set('isPopoverVisible', true);
                this.set('errorMessage', null);
                this.set('errorClass', null);
                this.set('patientInfo.isUserOfEmail', true);
                this.set('patientEmailAddress', '');
            }
        },
        onSavePatient() {
            var email = this.get('patientEmailAddress');

            if (this.get('patientInfo.isUserOfEmail') === true) {
                this.set('isPopoverVisible', false);
            }
            if (this.isValidEmail(email) && this.get('patientHasEmail')) {
                //If validEmail Address, save patient.
                this.savePatient();
            } else {
                this.set('errorMessage', 'Please enter a valid email.');
                this.set('errorClass', 'error');
            }
        },
        onCheckboxSelect() {
            // Tyrion's Popover-modal component prevents default
            // on all child elements this is a temporary workaround
            // to get the checkbox working.
            var checkboxElement = $('#patientEmailHasAddress');
            if (!this.get('patientInfo.isUserOfEmail')) {
                this.set('isEmailInputDisabled', false);
                this.set('patientInfo.isUserOfEmail', true);
                checkboxElement.removeAttr('checked');
            } else {
                this.set('isEmailInputDisabled', true);
                this.set('patientInfo.isUserOfEmail', false);
                checkboxElement.attr('checked', 'checked');
            }
        }
    }
});

export default PatientEmailPopover;
