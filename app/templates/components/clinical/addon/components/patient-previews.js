import { empty, alias } from '@ember/object/computed';
import { isPresent } from '@ember/utils';
import { scheduleOnce } from '@ember/runloop';
import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import SpinnerSupport from 'common/mixins/spinner';

export default Component.extend(SpinnerSupport, {
    analytics: service(),

    classNames: ['patient-previews'],
    showSpinner: alias('loading'),

    arePreviewsVisible: false,
    contentElement: '.patient-previews .popover-content',
    currentPreview: null,
    headerTitle: 'Loading previews ...',
    loading: false,
    patient: null,
    previewErrorMessage: '',
    showHeaderAbnormal: false,
    showHeaderLock: false,

    noPreviewSelected: empty('currentPreview'),
    patientPracticeGuid: alias('patient.patientPracticeGuid'),

    openPreviewText: computed('currentPreview.displayTextLower', 'currentPreview.filterType', function () {
        var filterType = this.get('currentPreview.filterType').toLowerCase();

        if (filterType === 'encounter') {
            return `Open this ${filterType}`;
        } else {
            return `Open this ${this.get('currentPreview.displayTextLower')}`;
        }
    }),
    didInsertElement() {
        this._super();
        scheduleOnce('afterRender', this, 'setPopoverHeight');
    },
    setPopoverHeight: observer('arePreviewsVisible', function() {
        this.set('height', Math.min(500, $(window).height() - 292));
    }),

    actions: {
        clearError() {
            this.set('previewErrorMessage', null);
        },

        openPreview() {
            var currentPreview = this.get('currentPreview');

            if (currentPreview) {
                switch (currentPreview.get('filterType').toLowerCase()) {
                    case 'encounter':
                        this.transitionToEncounter(currentPreview);
                        break;
                    case 'laborder':
                    case 'imgorder':
                        this.transitionToOrder(currentPreview);
                        break;
                    case 'labresult':
                    case 'imgresult':
                        this.transitionToResult(currentPreview);
                        break;
                }
            }
        },

        previewError(errorMessage) {
            this.setProperties({
                headerTitle: errorMessage.title,
                previewErrorMessage: errorMessage.message,
                showHeaderLock: false,
                showHeaderAbnormal: false,
            });
        },

        selectPreview(preview) {
            if (isPresent(preview)) {
                this.setProperties({
                    headerTitle: `${preview.get('displayDate')} - ${preview.get('displayText')}`,
                    currentPreview: preview,
                    previewErrorMessage: null,
                    showHeaderLock: preview.get('isSigned'),
                    showHeaderAbnormal: preview.get('isAbnormal'),
                });
            } else {
                this.setProperties({
                    headerTitle: '',
                    currentPreview: null,
                    previewErrorMessage: null,
                    showHeaderLock: false,
                    showHeaderAbnormal: false
                });
            }
        },

        togglePreviews() {
            this.get('analytics').track('Open Patient Preview');
            this.toggleProperty('arePreviewsVisible');
            // Unload cached encounters to ensure the latest are fetched each time the preview modal is opened.
            if (this.get('arePreviewsVisible')) {
                var store = this.get('store');
                store.unloadAll('chart-note');
                store.unloadAll('encounter-addendum');
                store.unloadAll('encounter-vital');
                store.unloadAll('encounter-vital-set');
            }
        },

        updateHeader(headerTitle) {
            this.setProperties({
                headerTitle: headerTitle,
                showHeaderLock: false,
                showHeaderAbnormal: false
            });
        }
    },

    transitionToEncounter(preview) {
        this.send('togglePreviews');
        this.get('patient').transitionToRoute('encounter', preview.get('identifyingGuid'));
    },

    transitionToOrder(preview) {
        this.send('togglePreviews');
        this.get('patient').transitionToRoute('order', this.get('patientPracticeGuid'),
            preview.get('identifyingGuid'));
    },

    transitionToResult(preview) {
        this.send('togglePreviews');
        this.get('patient').transitionToRoute('result', this.get('patientPracticeGuid'),
            preview.get('identifyingGuid'));
    }
});
