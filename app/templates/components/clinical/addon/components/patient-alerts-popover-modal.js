import { scheduleOnce } from '@ember/runloop';
import { on } from '@ember/object/evented';
import { alias, gt, notEmpty } from '@ember/object/computed';
import { computed, observer } from '@ember/object';
import Component from '@ember/component';
import SpinnerSupport from 'common/mixins/spinner';
import session from 'boot/models/session';

var PatientAlertsPopoverModalComponent = Component.extend(SpinnerSupport, {
    classNames: [ 'patient-alerts-component'],

    showSpinner: alias('isLoading'),

    contentElement: '.patient-alerts-body',

    isComponentEnabled: notEmpty('patientGuid'),

    isPatientAlertsDisabledByProviderPreference: false,

    isPatientAlertsAllowedForUser: computed(function() {
        return !session.get('isStaff');
    }),

    numAlerts: alias('alerts.length'),

    hasUnresolvedAlerts: gt('numUnresolvedAlerts', 0),

    numUnresolvedAlerts: computed('alerts.@each.status', function() {
        var alerts = this.get('alerts');
        if (alerts) {
            return alerts.filterBy('status', 'Submitted').get('length');
        } else {
            return 0;
        }
    }),

    patientGuid: null,

    alerts: null,

    store: null,

    showAlertsPopover: false,

    hasFetchAlertErrors: false,

    isLoading: false,

    height: 500,

    setPopoverHeight: on('didInsertElement', observer('showAlertsPopover', function () {
        scheduleOnce('afterRender', () => this.set('height', Math.min(500, $(window).height() - 292)));
    })),
    init() {
        this._super();
        this.set('alerts', []);
    },

    actions: {
        togglePopoverModal() {
            this.toggleProperty('showAlertsPopover');
            return false;
        },

        dismissAllAlerts() {
            var unresolvedAlerts = this.get('alerts').filterBy('status', 'Submitted');
            unresolvedAlerts.forEach(function(alert) {
                // If dismiss is an option then do dismiss
                if (alert.get('responseOptions').getEach('value').includes('Dismiss')) {
                    this.send('resolveAlert', alert, 'Dismiss');
                } else {
                    this.get('store').unloadRecord(alert);
                }
            }.bind(this));

            return false;
        },

        refreshAlerts() {
            this._loadCareProgramAlerts();
            return false;
        }
    }
});

export default PatientAlertsPopoverModalComponent;
