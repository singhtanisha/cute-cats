import { resolve } from 'rsvp';
import { isArray } from '@ember/array';
import { isEmpty } from '@ember/utils';
import { later, scheduleOnce, once } from '@ember/runloop';
import { on } from '@ember/object/evented';
import { not, equal, alias } from '@ember/object/computed';
import EmberObject, { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import session from 'boot/models/session';
import LoadingMixin from 'clinical/mixins/loading';
import LGTM from 'common/helpers/validation';
import Validatable from 'ember-lgtm/mixins/validatable';
import DestroyedMixin from 'tyrion/mixins/destroyed';
import SpinnerMixin from 'common/mixins/spinner';

const SAVE_PROPERTIES = ['allergySeverity', 'allergyReactions', 'onsetDate', 'onsetType', 'comments', 'isActive', 'patientPracticeGuid'];

export default Component.extend(LoadingMixin, Validatable, DestroyedMixin, SpinnerMixin, {
    analytics: service(),
    authorization: service(),
    severityOptions: null,
    allergenTypes: null,
    onsetTypes: null,
    allergenType: null,
    allSubstances: null,
    onsetType: null,
    showSpinner: alias('isLoading'),
    contentElement: '.detail-pane-body-wrapper',
    validator: LGTM.validator()
        .validates('allergySeverity')
            .required('Please select a severity.')
        .validates('allergenSelection')
            .required('Please select an allergen.')
        .validates('isOnsetDateValid')
            .required()
                .isTrue('Please correct the onset date')
        .build(),
    isDisabled: computed('isLoading', 'isAllowedToEditAllegies', function () {
          return session.get('isStaff') || !this.get('isAllowedToEditAllegies');
    }),
    title: computed('allergy.type', function () {
        const allergy = this.get('allergy');
        if (!allergy) {
            return 'Record allergy';
        }
        return `Review ${allergy.get('type')} allergy`;
    }),
    isDoneDisabled: computed('isLoading', function () { return this.get('isLoading'); }),
    showAddAnotherButton: computed('allergy', 'isAllowedToEditAllegies', function() {
        return !this.get('allergy') && this.get('isAllowedToEditAllegies');
    }),
    showDeleteButton: computed('allergy', 'isAllowedToEditAllegies', function () {
        return !this.get('isDisabled') && !!this.get('allergy') && this.get('isAllowedToEditAllegies');
    }),
    reactionsValuePath: 'title',
    isAllowedToEditAllegies: computed('authorization.entitledFeatures.[]', function () {
        return this.get('authorization').isEntitledFor('Chart.Allergies.Edit');
    }),
    isNotAllowedToEditAllegies: not('isAllowedToEditAllegies'),
    willDestroy() {
        const allergy = this.get('allergy');
        if (allergy) {
            allergy.set('isSelected', false);
            this.set('allergy', null);
        }
    },
    init() {
        this._super();
        this.setProperties({
            severityOptions: [
                { label: 'Very mild', id: 'Very Mild', class: 'yellow' },
                { label: 'Mild', id: 'Mild', class: 'yellow' },
                { label: 'Moderate', id: 'Moderate', class: 'orange' },
                { label: 'Severe', id: 'Severe', class: 'red' }
            ],
            allergenTypes: [
                { label: 'Drug', id: 'drug' },
                { label: 'Food', id: 'food' },
                { label: 'Environment', id: 'environmental' }
            ],
            onsetTypes: [
                { label: 'Childhood', id: 'Childhood' },
                { label: 'Adulthood', id: 'Adulthood' },
                { label: 'Unknown', id: 'Unknown' }
            ],
            allSubstances: []
        });
    },
    setPropertiesFromAllergy: on('init', observer('allergy', function () {
        const allergy = this.get('allergy');
        const allergenQuery = this.get('prepopulateAllergenQuery');
        if (allergy) {
            this.setProperties({
                allergySeverity: allergy.get('allergySeverity'),
                allergyReactions: allergy.get('allergyReactions').slice(),
                onsetDate: allergy.get('onsetDate'),
                onsetType: allergy.get('onsetType'),
                comments: allergy.get('comments'),
                isActive: allergy.get('isActive')
            });
        } else {
            // For new allergies we need to "disableDirtyTracking" while we set this properties
            this.set('disableDirtyTracking', true);
            this.setProperties({
                allergenType: 'drug',
                allergenSelection: null,
                allergySeverity: null,
                allergyReactions: [],
                onsetDate: null,
                onsetType: null,
                comments: null,
                isActive: true
            });
            this.set('allergenQuery', allergenQuery || '');
        }

        this.set('prepopulateAllergenQuery');

        later(() => {
            this.set('disableDirtyTracking', false);
            // When discontinuing a medication due to allergy and adding a new allergy,
            // set the isDirty flag to force validation on close and require an allergen to be set.
            if (!allergy && allergenQuery) {
                this.set('isDirty', true);
            }
        });
    })),
    loadReactionsAndSubstances: on('init', function () {
        const store = this.get('store');
        if (store) {
            store.findAll('allergy-reaction').then(reactions => this._unlessDestroyed(() => {
                this.set('allReactions', reactions.map(reaction => reaction.getProperties('title', 'reactionGroupTitle', 'displaySequence')));
            }));
            store.findAll('allergy-substance').then(substances => this._unlessDestroyed(() => {
                this.set('allSubstances', substances);
                this.set('allergenSelection', null);
            }));
        }
    }),
    didInsertElement() {
        this._super();
        this.focusOnAllergenSearch(false);
    },
    allergenTypeObserver: observer('allergenType', function () {
        this.focusOnAllergenSearch(true);
        this.set('allergenSelection', null);
    }),
    focusOnAllergenSearch(clearAllergenQuery) {
        if (!this.get('allergy')) {
            if (clearAllergenQuery) {
                this.set('allergenQuery', '');
            }
            scheduleOnce('afterRender', () => {
                if (this.get('_state') === 'inDOM') {
                    this.$('.allergen-search input').focus();
                }
            });
        }
    },
    isDrug: equal('allergenType', 'drug'),
    substances: computed('allSubstances.@each.type', 'allergenType', function () {
        const { allergenType, allSubstances } = this.getProperties('allergenType', 'allSubstances');
        return allSubstances.filterBy('groupTitle', allergenType.capitalize()).rejectBy('isCustom', true);
    }),

    isDirtyObserver: observer(
      'allergenSelection',
      'allergySeverity',
      'allergyReactions.[]',
      'onsetDate',
      'onsetType',
      'comments',
      'isActive',
    function () {
        const { allergy, disableDirtyTracking, isDirty } = this.getProperties('allergy', 'disableDirtyTracking', 'isDirty');
        const oldValue = !!isDirty;
        let newValue = false;
        if (!disableDirtyTracking) {
            newValue = !this.areAllPropertiesEqual(allergy || EmberObject.create({}), this, SAVE_PROPERTIES);
        }
        if (newValue !== oldValue) {
            this.set('isDirty', newValue);
        }
    }),
    areAllPropertiesEqual(x, y, properties) {
        return properties.every(key => {
            const xValue = x.get(key);
            const yValue = y.get(key);

            if (isEmpty(xValue) && isEmpty(yValue)) {
                return true;
            }
            if (xValue === yValue) {
                return true;
            }
            if (isArray(xValue) && isArray(yValue)) {
                if (xValue.length !== yValue.length) {
                    return false;
                }
                return xValue.every((val, index) => val === yValue.objectAt(index));
            }
            return false;
        });
    },
    isOnsetDateValid: true,
    formattedOnsetDate: computed('onsetDate', {
        get() {
            const val = this.get('onsetDate');
            return val ? moment.utc(val).format('MM/DD/YYYY') : null;
        },
        set(key, val) {
            if (val) {
                this.set('onsetType', null);
                this.set('onsetDate', moment(val).toISOString());
            } else {
                this.set('onsetDate', null);
            }
            return val;
        }
    }),
    onsetTypeObserver: observer('onsetType', function () {
        if (this.get('onsetType')) {
            this.set('onsetDate', null);
        }
    }),
    actions: {
        addCustomAllergy(customAllergy) {
            const allergenType = this.get('allergenType');
            this.set('allergenSelection', {
                title: customAllergy,
                groupTitle: allergenType.capitalize(),
                isCustom: true
            });
        },
        save() {
            this.sendAction('close');
        },
        cancel() {
            this._close();
        },
        delete() {
            this._delete().then(() => {
                toastr.success('Allergy successfully deleted');
                this._close();
            }, (error) => {
                toastr.error(error);
            });
        },
        setOnsetToday() {
            this.set('onsetType', null);
            this.set('onsetDate', moment(moment().format('MM/DD/YYYY')).toISOString());
        },
        addAnother() {
            this._saveIfDirtyAndValid().then(() => {
                this.setPropertiesFromAllergy();
                this.focusOnAllergenSearch();
                this.attrs.reloadAllergies();
            });
        }
    },
    _saveIfDirtyAndValid() {
        if (this.get('isDisabled') || !this.get('isDirty')) {
            return resolve(this.get('allergy.content'));
        }

        // For "add" we need to add the substance and allergen to the allergy object
        if (!this.get('allergy')) {
            return this.validate().then((isValid) => {
                if (!isValid) {
                    throw 'invalid';
                }
                return this._save();
            });
        }
        return this._save();
    },
    _save() {
        const properties = this.getProperties(SAVE_PROPERTIES);
        let isNew = false;
        let allergy = this.get('allergy');
        if (allergy) {
            allergy.setProperties(properties);
        } else {
            isNew = true;
            allergy = this.get('store').createRecord('patient-allergy', properties);
            this._addAllergenAndSubstance(allergy);
        }
        this.get('analytics').track('Save Allergy');
        return allergy.save().then(() => {
            this.set('disableDirtyTracking', true);
            if (isNew && this.attrs.allergyAdded) {
                this.attrs.allergyAdded(allergy);
            }
            return allergy;
        }).catch(() => {
            toastr.error('Failed to save the allergy');
            allergy.rollbackAttributes();
        });
    },
    _addAllergenAndSubstance(allergy) {
        const { allergenSelection, allergenType } = this.getProperties('allergenSelection', 'allergenType');
        if (allergenType === 'drug') {
            allergy.setDrugAllergen(allergenSelection);
        } else {
            allergy.setSubstance(allergenSelection, allergenType);
        }
    },
    deleteAllergy(allergy) {
        return allergy.destroyRecord().then(() => this.onAllergyDeleted(allergy));
    },
    _delete() {
        const allergy = this.get('allergy');
        if (!allergy) {
            return resolve();
        }
        return this.deleteAllergy(allergy);
    },
    _close() {
        // We've already saved or don't need to, so force isDirty to false.
        this.set('disableDirtyTracking', true);
        this.set('isDirty', false);
        // This is needed to introduce a delay so the isDirtyBinding is updated
        // back (to the controller) before we retry the transition
        later(this, function () {
            this.sendAction('close');
        });
    },
    _closing: observer('closing', function () {
        once(this, function () {
            if (!this.get('closing')) {
                return;
            }
            this.set('closing', false);
            if (!this.get('disableDirtyTracking')) {
                this._saveIfDirtyAndValid().then(() => this._close());
            }
        });
    }),
    onAllergyDeleted(allergy) {
        if (this.attrs.allergyDeleted) {
            this.attrs.allergyDeleted(allergy);
        }
        return allergy;
    }
});
