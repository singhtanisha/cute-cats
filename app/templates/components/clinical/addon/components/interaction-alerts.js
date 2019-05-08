import { isEmpty } from '@ember/utils';
import { observer, computed } from '@ember/object';
import { on } from '@ember/object/evented';
import Component from '@ember/component';
import repository from 'clinical/repositories/interaction-alerts';
import Loading from 'clinical/mixins/loading';
import DestroyedMixin from 'tyrion/mixins/destroyed';

const CUSTOM_DRUG_ERROR_CODE = 'CUSTOM_DRUG';

export default Component.extend(Loading, DestroyedMixin, {
    classNames: ['interaction-alerts'],

    drugAlertErrors: null,
    duplicateTherapies: null,
    interactions: null,
    loadInteractionsFailed: false,
    medication: null,
    patientGuid: null,

    loadInteractions: on('init', observer('medication', 'patientGuid', function() {
        let patientGuid = this.get('patientGuid'),
            medication = this.get('medication');

        if (isEmpty(medication)) {

            //We don't do anything if we don't have a medication
            return;
        }
        if (isEmpty(patientGuid)) {

            // Nothing to load. Clear the interactions
            this.set('interactions', []);
        }

        this.set('loadInteractionsFailed', false);

        this._withProgress(
            repository.loadInteractionAlertsByMedication(patientGuid, medication).then((data) => {
                this._setPropertiesUnlessDestroyed({
                    interactions: data.interactions.rejectBy('isDuplicateTherapy').sortBy('severitySort'),
                    duplicateTherapies: data.interactions.filterBy('isDuplicateTherapy'),
                    drugAlertErrors: data.drugAlertErrors
                });
            }).catch(() => {
                this._setUnlessDestroyed('loadInteractionsFailed', true);
            })
        );
    })),

    hasNoInteraction: computed('interactions', 'drugAlertErrors', function() {
        let interactions = this.get('interactions'),
            duplicateTherapies = this.get('duplicateTherapies'),
            drugAlertErrors = this.get('drugAlertErrors') || [],
            customDrugErrors;

        if (isEmpty(interactions) && isEmpty(drugAlertErrors) && isEmpty(duplicateTherapies)) {
            return true;
        } else if (!isEmpty(drugAlertErrors)) {
            customDrugErrors = drugAlertErrors.filterBy('errorCode', CUSTOM_DRUG_ERROR_CODE) || [];
            return isEmpty(interactions) && isEmpty(duplicateTherapies) && (customDrugErrors.length === drugAlertErrors.length);
        }

        return false;
    })
});
