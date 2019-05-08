import { isPresent } from '@ember/utils';
import { isArray } from '@ember/array';
import { computed, observer } from '@ember/object';
import Component from '@ember/component';
import DestroyedMixin from 'tyrion/mixins/destroyed';
import LoadingMixin from 'clinical/mixins/loading';
import PersonalMedicalHistory from 'clinical/models/personal-medical-history';

export default Component.extend(LoadingMixin, DestroyedMixin, {
    layoutName: 'components/allergy-free-text-message',

    canRecord: false,
    canShowLater: false,
    pastMedicalHistory: null,
    patientPracticeGuid: null,
    scrollableContainer: null,
    shouldShowLater: false,

    freeTextAllergies: computed('pastMedicalHistory.sections', function() {
        var pastMedicalHistorySections = this.get('pastMedicalHistory.sections'),
            allergiesSection, freeTextAllergies;

        if (isArray(pastMedicalHistorySections) && isPresent(pastMedicalHistorySections)) {
            allergiesSection = pastMedicalHistorySections.findBy('key', 'allergies');

            if (allergiesSection) {
                freeTextAllergies = allergiesSection.get('value');
            }
        }

        return freeTextAllergies;
    }),

    isFreeTextAllergiesMessageVisible: computed('freeTextAllergies', 'shouldShowLater', function() {
        return isPresent(this.get('freeTextAllergies')) && !this.get('shouldShowLater');
    }),

    isRecordVisible: computed('session.isStaff', 'canRecord', function() {
        return this.get('canRecord') && !this.get('session.isStaff') && this.get('isAllowedToEditAllegies');
    }),

    loadPMHOnInit: observer('patientPracticeGuid', function() {
        var patientPracticeGuid = this.get('patientPracticeGuid');

        this.set('pastMedicalHistory', null);

        if (isPresent(patientPracticeGuid)) {
            this._withProgress(PersonalMedicalHistory.find(this.get('store'), patientPracticeGuid)
                .then((pmh) => {
                    this._unlessDestroyed(() => {
                        this.set('pastMedicalHistory', pmh);
                    });
                })
                .catch(() => {
                    this._unlessDestroyed(() => {
                        this.set('pastMedicalHistory', null);
                    });
                }));
        }
    }).on('init'),

    didInsertElement() {
        this.addRemoveScrollHandler(true);
    },

    willDestroyElement() {
        this.addRemoveScrollHandler(false);
    },

    actions: {
        createAllergy() {
            this.sendAction('createAllergy');
        },

        deleteFreeTextAllergy() {
            this._withProgress(PersonalMedicalHistory.deleteAllergies(this.get('store'), this.get('pastMedicalHistory'))
                .catch(() => {
                    toastr.error('Unable to delete free text allergies.');
                }));
        },

        showFreeTextAllergiesLater() {
            this.$().slideUp(250);
            this.set('shouldShowLater', true);
        }
    },

    addRemoveScrollHandler (isAdd) {
        var scrollableContainerSelector = this.get('scrollableContainer'),
            scrollableContainer = isPresent(scrollableContainerSelector) ? $(scrollableContainerSelector) : null;

        if (isPresent(scrollableContainer) && scrollableContainer.length) {
            if (isAdd) {
                $(scrollableContainer).on('scroll', { _this: this, scrollableContainer: scrollableContainer }, this.onScroll);
            } else {
                $(scrollableContainer).off('scroll', this.onScroll);
            }
        }
    },

    onScroll (e) {
        var _this = e.data._this,
            scrollableContainer = e.data.scrollableContainer;

        if (scrollableContainer.scrollTop() > 0) {
            _this.$().slideUp(250);
        }
    }
});
