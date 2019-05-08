import { isPresent, isEmpty } from '@ember/utils';
import EmberObject, { computed, get } from '@ember/object';
import { alias, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import WithPMH from 'clinical/mixins/with-pmh';
import WithPatientPrintTitleMixin from 'charting/mixins/with-patient-print-title';

export default Component.extend(WithPMH, WithPatientPrintTitleMixin, {
    authorization: service(),
    routing: service('pf-routing'),

    card: null,
    displayName: 'Past medical history',
    fieldBeingEdited: null,
    hideEdit: true,

    patientSummary: alias('patient'),
    sections: alias('pastMedicalHistory.sections'),

    cardFields: computed('card.activeFields.[]', 'sections.[]', 'sections.@each.value', 'fieldBeingEdited', function () {
        const sectionGroups = _.groupBy(this.get('sections') || [], (section) => {
            return get(section, 'key');
        });

        const fieldBeingEdited = this.get('fieldBeingEdited');

        return this.get('card.activeFields').filterBy('isVisible').map((field) => {
            const section = sectionGroups[field.get('key')];
            let value;

            if (section && section[0]) {
                value = get(section[0], 'value');
            }

            return EmberObject.create({
                title: field.get('displayTitle'),
                key: field.get('key'),
                content: isPresent(value) ? [{'description': value, id: field.get('key')}] : [],
                isEditing: field.get('key') === fieldBeingEdited
            });
        }).compact();
    }),
    defaultMessage: computed('isLoading', 'error', 'isEmpty', function() {
        if (!this.get('isEmpty')) {
            return null;
        }

        if (this.get('isLoading')) {
            return 'Loading past medical history...';
        }

        if (this.get('error')) {
            return 'Could not load past medical history. Try again later.';
        }
    }),
    isEditing: computed('routing.currentRouteName', {
        get() {
            const currentRouteName = this.get('routing.currentRouteName');

            return currentRouteName === 'summary.summary-pmh';
        },
        set(key, value) {
            return value;
        }
    }),
    isEmpty: computed('pastMedicalHistory', 'pastMedicalHistory.areAllEmpty', function() {
        return isEmpty(this.get('pastMedicalHistory')) || this.get('pastMedicalHistory.areAllEmpty');
    }),
    isNotAllowedToEditPMH: computed('authorization.entitledFeatures.[]', function () {
        return !this.get('authorization').isEntitledFor('Chart.Encounter.Edit');
    }),
    isAllowedToEdit: not('isNotAllowedToEditPMH'),
    useIcons: computed('routing.currentRouteName', {
        get() {
            return this.get('routing.currentRouteName').indexOf('encounter') === -1;
        },
        set(key, value) {
            return value;
        }
    }),

    actions: {
        edit(field) {
            this.get('routing').transitionToRoute('summary.summary-pmh', field.get('key'));
            this.attrs.setControllerProperties({
                selectedItem: field.get('key')
            });
        },
        create(field) {
            this.get('routing').transitionToRoute('summary.summary-pmh', field.get('key'));
            this.attrs.setControllerProperties({
                selectedItem: null
            });
        },
        pmhAction(action) {
            this.sendAction('pmhAction', action);
        },
        print() {
            // Load the patient info first to ensure that it gets rendered on the print preview
            this.get('store').findRecord('patient', this.get('patientPracticeGuid')).then(() => {
                this.sendAction('printAudit', 'PastMedicalHistory');
                this.set('isPrintPreviewVisible', true);
            });
        },
        setIsEditing(options) {
            if (options.isEditing) {
                this.set('fieldBeingEdited', options.fieldKey);
            } else {
                this.set('fieldBeingEdited', null);
            }
        },
    }
});
