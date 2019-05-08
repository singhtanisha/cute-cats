import { run } from '@ember/runloop';
import { isEmpty } from '@ember/utils';
import { computed, observer, get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import CdsAlertsMixin from 'charting/mixins/cds-alerts-mixin';

export default Component.extend(CdsAlertsMixin, {
    classNames: ['cdsAccordion'],
    tagName: 'section',
    authorization: service(),

    cdsAlerts: null,
    isExpanded: true,
    isLoading: false,
    cdsEndpointError: false,
    shouldCollapseOnScroll: true,

    showActionLinks: computed('authorization.entitledFeatures.[]', function () {
        return this.get('authorization').isEntitledFor('Chart.CDS.Interact');
    }),
    items: computed('cdsAlerts.[]', 'cdsAlerts.@each.isDismissed', function() {
        let list = this.get('cdsAlerts') || [];
        return list.rejectBy('isDismissed');
    }),
    processInfoButtons: observer('cdsAlerts.@each.infobutton', function() {
        const cdsAlerts = this.get('cdsAlerts') || [];
        const alertsWithInfobuttons = cdsAlerts.filterBy('infobutton');

        if (!isEmpty(alertsWithInfobuttons)) {
            this.updateInfobuttonLinks(alertsWithInfobuttons);
        }
    }),
    actions: {
        cdsAlertDismissed(cdsAlert) {
            let cdsAlertToDismiss = this.get('cdsAlerts').findBy('ruleId', get(cdsAlert, 'ruleId'));

            if (cdsAlertToDismiss) {
                set(cdsAlertToDismiss, 'isDismissed', true);
            }
        },

        toggleExpanded() {
            if (this.get('isLoading')) {
                return;
            }
            run(() => {
                // Prevents tests from spazzing
                this.setIsExpanded(!this.get('isExpanded'));
            });
        },
        refreshData() {
            this.setIsExpanded(false);
            this.sendAction('refresh');
            return false;
        },
        bubbleAction(action) {
            this.sendAction('bubbleAction', action.action, action);
        }
    },
    setIsExpanded(value) {
        if (this.get('isExpanded') === value) {
            return;
        }
        this.removeScrollHandler();
        run(() => {
            this.set('isExpanded', value);
        });
        if (value) {
            this.$('.cds-alerts').slideDown(250, this.addScrollHandler.bind(this));
        } else {
            this.$('.cds-alerts').slideUp(250, this.addScrollHandler.bind(this));
        }
    },
    didInsertElement() {
        this.addScrollHandler();
    },
    willDestroyElement() {
        this.removeScrollHandler();
    },
    addScrollHandler() {
        if(this._$container()) {
            this._$container().on('scroll', $.proxy(this, 'onScroll'));
        }
    },
    removeScrollHandler() {
        if(this._$container()) {
            this._$container().off('scroll', $.proxy(this, 'onScroll'));
        }
    },
    onScroll() {
        var scrollTop = this._$container().scrollTop();
        if (scrollTop === 0) {
            this.set('shouldCollapseOnScroll', true);
            if (!this.get('isLoading')) {
                this.setIsExpanded(true);
            }
        } else if (scrollTop > 0 && this.get('shouldCollapseOnScroll')) {
            this.set('shouldCollapseOnScroll', false);
            this.setIsExpanded(false);
        }
    },
    _$container() {
        // HACK: Horrible hack to get to this in both immunizations and encounter. This solution is fragile.
        // We need a better way to find the right container that isn't coupled with the current HTML structure.
        // TODO: Consider moving the scroll-up logic to the (yet to be created) csd-alerts component.
        return this.$() ? this.$().parent() : null;
    }
});
