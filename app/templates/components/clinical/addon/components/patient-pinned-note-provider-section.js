import { scheduleOnce } from '@ember/runloop';
import { on } from '@ember/object/evented';
import { isEmpty } from '@ember/utils';
import { observer, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { or, alias } from '@ember/object/computed';

export default Component.extend({
    analytics: service(),
    classNames: ['pinned-note-section'],
    disabled: false,
    expandedNote: true,
    showViewMoreLink: false,
    pinnedNote: alias('model.note'),
    patientService: service('patient'),
    isDisabledOrNewPatient: or('disabled', 'patient.isNew'),
    _modelObserver: observer('patient', 'model', function () {
        this.loadPinnedNote();
    }),
    lastModifiedDate: computed('model.editedDateTimeUtc', function() {
        return moment(this.get('model.editedDateTimeUtc')).format('MM/DD/YYYY, h:mm a');
    }),
    loadProvider: task(function* () {
        if (this.get('model')) {
            let provider = this.get('store').peekAll('provider-profile').findBy('userGuid', this.get('model.editedByUserGuid'));
            if (isEmpty(provider)) {
                const providersResult = yield this.get('store').findAll('provider-profile');
                provider = providersResult.findBy('userGuid', this.get('model.editedByUserGuid'));
            }
            if (provider && !provider.get('isFullProfileLoaded')) {
                provider = yield this.get('store').findRecord('provider-profile', provider.get('providerGuid'), { reload: true });
            }
            this.set('provider', provider ? provider.get('providerNameWithDegreeAndComma') : '');
        }
    }).drop(),
    calculateDivHeight: on('didInsertElement', observer('model.note', 'expandedNote', function () {
        if (this.get('disabled')) {
            return;
        }
        scheduleOnce('afterRender', this, () => {
            this.set('showViewMoreLink', $('.pinned-note-body').height() >= 140);
        });
    })),
    init() {
        this._super();
        const updatePinnedNote = () => this.loadPinnedNote();

        this.get('patientService').on('updatePinnedNote', updatePinnedNote);
        this.set('updatePinnedNote', updatePinnedNote);
        this.loadPinnedNote();
    },
    willDestroyElement() {
        this._super();
        this.get('patientService').off('updatePinnedNote', this.get('updatePinnedNote'));
    },
    loadPinnedNote() {
        const patientPracticeGuid = this.get('patient.id');
        const record = patientPracticeGuid && this.get('store').peekRecord('patient-note', patientPracticeGuid);
        if (record && !record.get('isDeleted')) {
            this.set('model', record);
        } else {
            this.set('model', null);
        }
        this.get('loadProvider').perform();
    },
    actions: {
        toggleProperty(propertyName) {
            this.toggleProperty(propertyName);

            if (propertyName === 'expandedNote') {
                this.get('analytics').track('Pinned note - Patient profile - Expand/Collapse Clicked', {
                    'Expanded': this.get('expandedNote')
                });
            }
        },
    }
});
