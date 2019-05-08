import { isEmpty } from '@ember/utils';
import { on } from '@ember/object/evented';
import EmberObject, { computed, observer } from '@ember/object';
import Component from '@ember/component';
var PatientAlertComponent = Component.extend({
    /**
     * An patient item that's the model for this component
     * @type CareProgramPatientNotification
     */
    alert: null,

    isResponded: computed('alert.status', function() {
        var status = this.get('alert.status');
        return status && status === 'Responded';
    }),

    resolveOptions: null,

    canDismissOnly: computed('resolveOptions.[]', function() {
        return this.get('resolveOptions.length') === 1 && this.get('resolveOptions')[0].value === 'Dismiss';
    }),

    defaultAction: computed(function() {
        // If there is only dismiss, then defaultAction is dismiss. Otherwise, pick the first non-dismiss action
        if (this.get('canDismissOnly')) {
            return this.get('resolveOptions')[0];
        } else {
            var nonDismissOptions = this.get('resolveOptions').rejectBy('value', 'Dismiss');
            if (nonDismissOptions.get('length') > 0) {
                return nonDismissOptions[0];
            }
        }
    }),

    _loadOptions: observer('alert.responseOptions.[]', on('init', function () {
        var options = [];

        // Add the other options
        this.get('alert.responseOptions').forEach(function(option) {
            var newOption = this._createNewResolveOption(option.get('text'), option.get('value'));
            options.addObject(newOption);
        }.bind(this));

        this.set('resolveOptions', options.compact().sortBy('text'));
    })),

    _createNewResolveOption(text, value) {
        if (text && value) {
            return EmberObject.create({
                text: text,
                value: value
            });
        }
    },

    // UF-349 Hack to get drop down menu button group to open. However, the button group won't
    // go away until user clicks on the chevron again or selects a submit
    didInsertElement() {
        $('.dropdown-toggle').dropdown();
        this._hideActionMenu();
    },

    _hideActionMenu() {
        var btnGroup = this.$('.patient-alert-btn-group');
        if (btnGroup && btnGroup.hasClass('open')) {
            btnGroup.removeClass('open');
        }
    },
    // End of UF-349 hack

    showShortDescription: false,

    showMoreLessDescriptionLinkText: computed('showShortDescription', function() {
        if (this.get('alert.hasBodyOverFlow')) {
            return this.get('showShortDescription') ? 'show more' : 'show less';
        }
    }),

    alertDescription: computed('showShortDescription', function() {
        return this.get('showShortDescription') ? this.get('alert.shortBody') + '...' : this.get('alert.body');
    }),

    _initShowShortDescription: on('init', observer('alert.shortBody', function() {
        this.set('showShortDescription', !isEmpty(this.get('alert.shortBody')));
    })),

    actions: {
        submitResponse(response) {
            Ember.Logger.debug('submit alert response', response);
            this.sendAction('respond', this.get('alert'), response);
            this._hideActionMenu();
            return false;
        },

        toggleShowShortDescription() {
            this.toggleProperty('showShortDescription');
            return false;
        }
    }
});

export default PatientAlertComponent;
