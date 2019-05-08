import { once } from '@ember/runloop';
import { equal } from '@ember/object/computed';
import { on } from '@ember/object/evented';
import { observer, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import WithPMH from 'clinical/mixins/with-pmh';
import PFBrowser from 'boot/util/pf-browser';
import { task } from 'ember-concurrency';

export default Component.extend(WithPMH, {
    analytics: service(),
    tunnel: service(),
    routing: service('pf-routing'),

    resizables: null,
    dirtyObserver: observer('pastMedicalHistory.hasDirtyAttributes', function () {
        this.set('isDirty', this.get('pastMedicalHistory.hasDirtyAttributes'));
    }),
    autoFocusSectionObserver: on('init', observer('pastMedicalHistory.sections', 'autoFocusSection', function () {
        const key = this.get('autoFocusSection');
        const pmhSections = this.get('pastMedicalHistory.sections');
        const section = key && pmhSections ? pmhSections.findBy('key', key) : null;

        if (pmhSections) {
            pmhSections.setEach('autofocus', false);
        }
        if (section) {
            section.set('autofocus', true);
        }
        this.set('resizables', []);
    })),
    isChrome: computed(() => PFBrowser.isChrome()),
    isOnPatientSummary: equal('routing.currentRouteName', 'summary.pmh'),
    visibleSections: computed('isOnPatientSummary', 'pastMedicalHistory.sections.[]', function() {
        if (this.get('isOnPatientSummary')) {
            return (this.get('pastMedicalHistory.sections') || []).filter((section) => {
                if (section.get('isInSocialAndBehavioralHealth')) {
                    return false;
                }
                
                return section.get('isInSummaryV2');
            });
        }

        return this.get('pastMedicalHistory.sections');
    }),
    save: task(function* () {
        (this.get('pastMedicalHistory.sections') || []).forEach((section) => {
            section.set('value', (section.get('value') || '').trim());
        });
        if (this.get('pastMedicalHistory.hasDirtyAttributes')) {
            this.get('analytics').track('Save PMH');
            try {
                yield this.get('pastMedicalHistory').save();
                this.get('tunnel').send('social-history', this.getProperties('pastMedicalHistory'));
                this._close();
            } catch (e) {
                toastr.error('Failed to save PMH');
            }
        } else {
            this.sendAction('close');
        }
    }).drop(),
    actions: {
        revert() {
            this._close();
        },
        save() {
            this.get('save').perform();
        },
        pmhAction(action) {
            this.sendAction('pmhAction', action);
        }
    },
    _close() {
        const pmh = this.get('pastMedicalHistory');
        if (pmh.get('hasDirtyAttributes')) {
            pmh.rollbackAttributes();
            pmh.notifyPropertyChange('sections');
        }

        this.sendAction('close');
    },
    _closing: observer('closing', function () {
        if (!this.get('closing')) {
            return;
        }
        this.set('closing', false);
        once(this, 'send', 'save');
    })
});
