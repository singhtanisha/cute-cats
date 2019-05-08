import { resolve } from 'rsvp';
import { isEmpty } from '@ember/utils';
import { inject as controller } from '@ember/controller';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import TranscriptEventController from 'charting/controllers/encounter/transcript-event';
import encounterUtils from 'charting/utils/encounter';
import repository from 'clinical/repositories/worksheets';
import { worksheetEventTypeGuids } from 'clinical/models/worksheet-responses';

export default TranscriptEventController.extend({
    isDirty: false,
    worksheetClassNames: computed('disabled', function() {
        return this.get('disabled') ? 'side-fixed col-xs-5 type-v2' : 'side-fixed col-xs-6 type-v2';
    }),
    eventType: alias('transcriptEncounterEvent.eventType'),
    isNegated: alias('transcriptEncounterEvent.isNegated'),
    reasonCode: alias('transcriptEncounterEvent.reasonCode'),
    selectedStatus: alias('transcriptEncounterEvent.selectedStatus'),
    status: alias('transcriptEncounterEvent.status'),
    transcriptEncounterEvent: alias('model.transcriptEncounterEvent'),

    patientController: controller('patient'),

    // Maps worksheets to ad sub-zones
    adSubzone: computed('eventType.eventTypeGuid', function() {
        switch (this.get('eventType.eventTypeGuid')) {
            case worksheetEventTypeGuids.adultAsthmaControlTestEventTypeGuid:
                return 'asthmascr';
            default:
                return '';
        }
    }),

    // Maps worksheets to Ember components
    worksheetComponent: computed('eventType.eventTypeGuid', function() {
        switch (this.get('eventType.eventTypeGuid')) {
            case worksheetEventTypeGuids.midasAssessmentWorksheetEventTypeGuid:
                return 'sia-worksheet/migraine';
            case worksheetEventTypeGuids.depressionPhq2AssessmentWorksheetEventTypeGuid:
                return 'sia-worksheet/depression-phq-2';
            default:
                return 'sia-worksheet/default';
        }
    }),
    isSaveDisabled: computed('model.isIncomplete', 'model.isNegated', 'model.isQuestionnaireComplete', 'errors', 'hasRangeErrors', function() {
        if (this.get('eventType.eventTypeGuid') === worksheetEventTypeGuids.depressionPhq2AssessmentWorksheetEventTypeGuid) {
            return !(this.get('model.isNegated') || this.get('model.isQuestionnaireComplete')) || !_.isEmpty(this.get('errors')) || this.get('hasRangeErrors');
        }
        return this.get('model.isIncomplete') || !_.isEmpty(this.get('errors')) || this.get('hasRangeErrors');
    }),
    errors: null,
    hasRangeErrors: alias('model.hasRangeErrors'),
    actions: {
        setErrors(errors) {
            this.set('errors', errors);
        },
        cancelWorksheet() {
            if(this.get('isEntitledToEditEncounter')) {
                const model = this.get('model');

                if (model) {
                    if (isEmpty(model.get('responsesGuid'))) {

                        // This will delete the transcriptEncounterEvent in the cancel 'add new' case
                        this.deleteResponses();
                    } else {
                        model.revert();
                    }
                }
            }

            this.set('isDirty', false);
            this.transitionToRoute('encounter');
        },

        closeWorksheet() {
            if(this.get('isEntitledToEditEncounter')) {
                this.save().finally(() => {
                    this.setProperties({
                        isDirty: false,
                        shouldScrollOnTransition: true
                    });
                    this.transitionToRoute('encounter');
                });
            } else {
                this.setProperties({
                    isDirty: false,
                    shouldScrollOnTransition: true
                });
                this.transitionToRoute('encounter');
            }
        },

        deleteWorksheet() {
            this.deleteResponses()
                .then(() => {
                    this.set('isDirty', false);
                    this.get('encounter').getCdsAlerts();
                    this.transitionToRoute('encounter');
                }, () => {
                    toastr.error('Failed to delete assessment');
                });
        },

        saveWorksheet() {
            this.set('shouldScrollOnTransition', true);
            this.transitionToRoute('encounter');
        },

        selectWorksheetReason(reason) {
            this.set('reason', reason);
        },

        selectWorksheetStatus(status) {
            this.set('selectStatus', status);
        }
    },

    captureAlreadySignedError(error) {
        const action = encounterUtils.mapSaveErrorToAction(error);

        if (action) {
            this.set('isDirty', false);

            if (action === 'refreshChart') {
                this.replaceRoute('encounter');
            }

            this.send(action);

            return true;
        }

        return false;
    },

    deleteResponses() {
        const patientPracticeGuid = this.get('patientController.id');
        const responses = this.get('model');
        const transcriptEvents = this.get('encounter.model.events');

        return repository.deleteResponses(patientPracticeGuid, responses)
            .then(function() {
                responses.get('transcriptEncounterEvents').forEach(transcriptEvents.removeEvent.bind(transcriptEvents));
            },
                this.captureAlreadySignedError.bind(this)
            );
    },

    save() {
        const patientPracticeGuid = this.get('patientController.id');
        const responses = this.get('model');
        const isNew = isEmpty(responses.get('responsesGuid'));
        const encounterController = this.get('encounter');
        const transcriptEvents = encounterController.get('model.events');

        if (this.get('disabled')) {
            this.set('isDirty', false);
            return resolve();
        }

        // Persist the values to the responses object before saving to server.
        responses.save();

        return repository.saveResponses(patientPracticeGuid, responses).then((savedResponses) => {
            this.set('isDirty', false);
            if (isNew) {
                if (savedResponses.get('isComplete')) {
                    encounterController.getCdsAlerts();
                }
                savedResponses.get('transcriptEncounterEvents').forEach(transcriptEvents.addEvent.bind(transcriptEvents));
            }
        }, (error) => {
            if (!this.captureAlreadySignedError(error)) {
                toastr.error('Failed to save assessment');
            }
            throw error;
        });
    }
});
