import { on } from '@ember/object/evented';
import { computed } from '@ember/object';
import { or, alias, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import WithAllergies from 'clinical/mixins/with-allergies';
import ViewPreferencesMixin from 'boot/mixins/view-preferences';
import WithPatientPrintTitleMixin from 'charting/mixins/with-patient-print-title';
import AllergiesArray from 'clinical/models/allergies-array';

export default Component.extend(WithAllergies, ViewPreferencesMixin, WithPatientPrintTitleMixin, {
    patientService: service('patient'),
    authorization: service('authorization'),
    routing: service('pf-routing'),
    classNames: ['allergies'],
    allergies: null,
    selectedItem: null,
    transcriptGuid: null,
    viewPreferencesKey: 'allergies-list',
    hideEditControls: or('isLoadingOrIsError', 'session.isStaff'),
    isLoadingOrIsError: or('isLoading', 'allergiesError'),
    patientSummary: alias('patient'),
    displayName: 'Allergies',
    showCommentsOptions: computed(() => [
        { id: 0, label: 'Comments', key: 'showComments' },
        { id: 1, label: 'Encounter comments', key: 'showEncounterComments' }
    ]),
    isAllowedToEditAllegies: computed('authorization.entitledFeatures.[]', function () {
        return this.get('authorization').isEntitledFor('Chart.Allergies.Edit');
    }),
    isNotAllowedToEditAllegies: not('isAllowedToEditAllegies'),
    isEditing: computed('routing.currentRouteName', {
        get() {
            const currentRouteName = this.get('routing.currentRouteName');

            return currentRouteName === 'summary.allergy' || currentRouteName === 'encounter.allergy';
        },
        set(key, value) {
            return value;
        }
    }),
    selectedAllergy: computed('selectedItem', {
        get() {
            return this.get('selectedItem');
        },
        set(key, value) {
            return value;
        }
    }),
    useIcons: computed('routing.currentRouteName', {
        get() {
            return this.get('routing.currentRouteName').indexOf('encounter') === -1;
        },
        set(key, value) {
            return value;
        }
    }),
    onInit: on('init', function () {
        if (this.get('useIcons')) {
            this.set('viewPreferenceProperties', []);
        } else {
            this.set('viewPreferenceProperties', ['selectedCommentsOptions']);
        }
        const onRefreshChart = data => this.setAllergies(data.patientPracticeGuid, AllergiesArray.create({
            content: data.allergies.toArray(),
            noKnownAllergies: data.allergies.get('meta.noKnownAllergies')
        }));
        this.get('patientService').on('refreshChart', onRefreshChart);
        this.set('onRefreshChart', onRefreshChart);
    }),
    willDestroyElement() {
        this._super();
        const onRefreshChart = this.get('onRefreshChart');
        if (onRefreshChart) {
            this.get('patientService').off('refreshChart', onRefreshChart);
        }
    },
    patientPracticeGuid: alias('patient.patientPracticeGuid'),
    saveNoKnownValue(value) {
        const patientPracticeGuid = this.get('patientPracticeGuid');
        const adapter = this.get('store').adapterFor('patient-allergy');
        return adapter.saveNoKnownValue(patientPracticeGuid, value);
    },
    isNoKnownChecked: computed('noKnownAllergies', {
        get() {
            return this.get('noKnownAllergies');
        },
        set(key, value) {
            this.setProperties({
                noKnownAllergies: value,
                isLoadingNoKnown: true
            });
            this.saveNoKnownValue(value).catch(() => {
                this._setUnlessDestroyed('noKnownAllergies', !value);
                toastr.error('Failed to record no active allergies status');
            }).finally(() => this._setUnlessDestroyed('isLoadingNoKnown', false));
            return value;
        }
    }),
    actions: {
        toggleProperty(key) {
            this.toggleProperty(key);
        },
        editAllergy(allergy) {
            const transcriptGuid = this.get('transcriptGuid');

            if (transcriptGuid) {
                this.get('routing').transitionToRoute('encounter.allergy', allergy.get('patientPracticeGuid'), transcriptGuid, allergy.get('allergyGuid'));
            } else {
                this.get('routing').transitionToRoute('summary.allergy', allergy.get('patientPracticeGuid'), allergy.get('allergyGuid'));
            }
        },
        createAllergy() {
            const transcriptGuid = this.get('transcriptGuid');

            if (transcriptGuid) {
                this.get('routing').transitionToRoute('encounter.allergy', this.get('patientPracticeGuid'), transcriptGuid, 'new');
            } else {
                this.get('routing').transitionToRoute('summary.allergy', this.get('patientPracticeGuid'), 'new');
            }
        },
        reloadAllergies() {
            this.get('loadAllergies').perform(true);
        },
        print() {
            // Load the patient info first to ensure that it gets rendered on the print preview
            this.get('store').findRecord('patient', this.get('patientPracticeGuid')).then(() => {
                this.sendAction('printAudit', 'Allergies');
                this.set('isPrintVisible', true);
            });
        },
        updateAllergies(options) {
            if (options.allergies) {
                this.set('allergies', options.allergies);
            }
            if (options.reloadFromCache) {
                const patientPracticeGuid = this.get('patientPracticeGuid');
                const allergies = this.get('store').peekAll('patient-allergy');
                const allergiesArray = AllergiesArray.create({
                    content: allergies.filterBy('patientPracticeGuid', patientPracticeGuid),
                    noKnownAllergies: this.get('allergies.noKnownAllergies')
                });

                this.setAllergies(patientPracticeGuid, allergiesArray);
            }
        }
    }
});
