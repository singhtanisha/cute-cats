import { scheduleOnce } from '@ember/runloop';
import { isEmpty, isPresent } from '@ember/utils';
import { computed, observer } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';

export default Component.extend({
    attributeBindings: ['data-element'],
    patientService: service('patient'),
    analytics: service(),
    authorization: service(),
    classNames: ['patient-previews', 'patient-pinned-note'],
    popoverConfirmClass: 'pinned-patient-popover popover-with-header',
    popoverPlacement: 'bottom',
    isPopoverVisible: false,
    isDeleteModalVisable: false,
    shouldShowEditPinnedNoteModal: false,
    containsScrollableContent: false,
    model: null,
    location: null,
    patientPracticeGuid: null,
    pinnedNote: alias('model.note'),
    isEntitledToEdit: computed('authorization.entitledFeatures.[]', function () {
        return this.get('authorization').isEntitledFor('Chart.Header.Edit');
    }),
    lastEditedByDateTime: computed('provider', 'model.editedDateTimeUtc', function() {
        return  moment(this.get('model.editedDateTimeUtc')).format('MM/DD/YYYY, h:mm a');
    }),
    learnMoreLink: '',
    _modelObserver: observer('model.editedByUserGuid', function () {
        this.loadPinnedNote();
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
            this.set('lastEditedByProviderName', provider ? provider.get('providerNameWithDegreeAndComma') : '');
        }
    }).drop(),
    init() {
        this._super();
        const updatePinnedNote = () => this.loadPinnedNote();

        this.get('patientService').on('updatePinnedNote', updatePinnedNote);
        this.set('updatePinnedNote', updatePinnedNote);
    },
    willDestroyElement() {
        this._super();
        this.get('patientService').off('updatePinnedNote', this.get('updatePinnedNote'));
    },
    didInsertElement() {
        this._super();
        scheduleOnce('afterRender', () => this.set('popoverTarget', `#${this.get('elementId')} .icon-pushpin`));
    },
    didReceiveAttrs() {
        const patientPracticeGuid = this.get('patientId');
        if (isPresent(patientPracticeGuid) && patientPracticeGuid !== this.get('patientPracticeGuid')) {
            this.set('patientPracticeGuid', patientPracticeGuid);
            this.loadPinnedNote();
        }
    },
    loadPinnedNote() {
        const record = this.get('store').peekRecord('patient-note', this.get('patientPracticeGuid'));
        if (record && !record.get('isDeleted')) {
            this.set('model', record);
        } else {
            this.set('model', null);
        }
        this.get('loadProvider').perform();
    },
    calculateDivHeight: observer('isPopoverVisible', function () {
        scheduleOnce('afterRender', this, () => {
            this.set('containsScrollableContent', $('.pinned-patient-popover .popover-content').height() >= 193);
        });
    }),
    delete: task(function* () {
        const model = this.get('model');

        if (model) {
            try {
                yield model.destroyRecord();
                this.get('store').unloadRecord(model);
                this.get('patientService').updatePinnedNote();
                toastr.success('Note deleted.');
                this.get('analytics').track('Pinned Note - Successful Delete', {
                    'Location Source': this.get('location'),
                    'Delivery Method': 'Popover'
                });
            } catch (e) {
                toastr.error('Could not delete note, try again.');
                return;
            }
        }
    }).drop(),
    actions: {
        toggleProperty(propertyName) {
            this.toggleProperty(propertyName);
            if (propertyName === 'isPopoverVisible') {
                this.get('analytics').track('Pinned Note - Icon Clicked', {
                    'Location Source': this.get('location'),
                    'Note Exists': isPresent(this.get('pinnedNote'))
                });
            }
        },
        delete() {
            this.get('delete').perform();
            this.set('isDeleteModalVisable', false);
            this.set('isPopoverVisible', false);
        },
        edit() {
            this.set('isPopoverVisible', false);
            this.attrs.editPinnedNote();
        },
        toggleDeleteModal(showDeleteModal) {
            this.set('isPopoverVisible', !showDeleteModal);
            this.set('isDeleteModalVisable', showDeleteModal);
        }
    }
});
