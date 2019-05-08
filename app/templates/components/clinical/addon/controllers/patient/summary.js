import { classify } from '@ember/string';
import { computed } from '@ember/object';
import { alias, or, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Controller, { inject as controller } from '@ember/controller';
import WithPatientSummaryDisplaySettings from 'settings/mixins/with-patient-summary-display-settings';

export default Controller.extend(WithPatientSummaryDisplaySettings, {
    analytics: service(),
    authorization: service(),
    patientController: controller('patient'),

    selectedItem: null,
    isDisplaySettingsVisible: false,
    shouldCreateNewEncounter: false,

    cards: alias('displaySettings.cards'),
    isLoading: or('loadDisplaySettings.isRunning', 'saveDisplaySettings.isRunning'),
    patient: alias('patientController.model'),
    patientGuid: alias('patient.patientPracticeGuid'),
    sortedCards: sort('visibleCards', 'cardSortProperties'),
    visibleCards: computed('cards.@each.isVisible', 'cards.@each.isActive', function() {
        return (this.get('cards') || []).filter((card) => {
            return card.get('isVisible') && card.get('isActive');
        });
    }),

    cardColumns: computed('sortedCards.[]', function() {
        return _.groupBy(this.get('sortedCards'), (card) => {
            return card.get('column');
        });
    }),

    cardColumnSizeClass: computed('sortedCards.[]', function() {
        const columnCount = Object.keys(this.get('cardColumns')).length;

        switch (columnCount) {
            case 3:
                return 'col-xs-4';
            case 2:
                return 'col-xs-6';
            case 0:
            case 1:
                return 'col-xs-12';
            default:
                return 'col-xs-4';
        }
    }),

    cardSortProperties: computed(() => [
        'column:asc',
        'row:asc'
    ]),

    goToItems: computed(() => [{
        label: 'Family health history',
        value: 'patient.familyhistory'
    }, {
        label: 'Immunizations',
        value: 'patient.immunizations'
    }, {
        label: 'Growth charts',
        value: 'patient.growth.charts'
    }]),

    isAllowedToEditSettings: computed('authorization.entitledFeatures.[]', function () {
        return this.get('authorization').isEntitledFor('Settings.Edit');
    }),

    isAllowedToEditSummary: computed('authorization.entitledFeatures.[]', function () {
        return this.get('authorization').isEntitledFor('Chart.Summary.Edit');
    }),

    actions: {
        cancelDisplaySettings() {
            this.get('displaySettings').undoChanges();
            this.set('isDisplaySettingsVisible', false);
        },

        closeDetailPane() {
            this.set('selectedItem', null);
        },

        createAllergy() {
            this.transitionToRoute('summary.allergy', this.get('patientGuid'), 'new');
        },

        editMedicationFromDiagnosis(medicationGuid, diagnosisGuid) {
            this.transitionToRoute('summary.medication', medicationGuid, {queryParams: {
                actionType: 'diagnosis',
                diagnosisGuid: diagnosisGuid
            }});
        },

        print() {
            this.send('printChart');
        },

        recordMedicationFromDiagnosis(diagnosisGuid, searchTerm) {
            this.transitionToRoute('summary.medication', 'new', {queryParams: {
                actionType: 'diagnosis',
                diagnosisGuid: diagnosisGuid,
                searchTerm: searchTerm
            }});
        },

        selectGoToItem(item) {
            this.get('analytics').track('Select from Go-to Dropdown', {'Selection': classify(item.label)});
            this.transitionToRoute(item.value);
        },

        sendMessage() {
            const patient = this.get('patientController');

            this.send('openNewMessage', 'new', {
                regardingPatient: {
                    guid: patient.get('patientPracticeGuid'),
                    firstName: patient.get('patient.firstName'),
                    lastName: patient.get('patient.lastName')
                }
            });
        },

        sendSummaryAction(actionName, options) {
            this.send(actionName, options);
        },

        sendPatientSummaryMixpanelEvent({ event, properties }) {
            this.get('analytics').track(event, properties);
        },

        toggleDisplaySettings() {
            this.toggleProperty('isDisplaySettingsVisible');
        },

        updateProperties(properties) {
            this.setProperties(properties);
        }
    },

    reset() {
        this.setProperties({
            displaySettings: null,
            isDisplaySettingsVisible: false
        });
    }
});
