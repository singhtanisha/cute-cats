import { isPresent, isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import TranscriptEventController from 'charting/controllers/encounter/transcript-event';
import encounterSummariesRepository from 'charting/repositories/encounter-summaries';
import { worksheetEventTypeGuids } from 'clinical/models/worksheet-responses';
import { task } from 'ember-concurrency';

export default TranscriptEventController.extend({
    analytics: service(),
    transcriptGuid: alias('model.transcriptGuid'),
    encounterAndNoteType: '',
    dateOfService: '',
    comments: alias('model.comments'),
    selectedStatus: alias('model.selectedStatus'),
    startDateTimeUtc: computed('model.startDateTimeUtc', function() {
        const startDateTimeUtc = this.get('model.startDateTimeUtc');
        return isPresent(startDateTimeUtc) ? moment.utc(startDateTimeUtc).format('L LT') : null;
    }),
    endDateTimeUtc: computed('model.endDateTimeUtc', function() {
        const endDateTimeUtc = this.get('model.endDateTimeUtc');
        return isPresent(endDateTimeUtc) ? moment.utc(endDateTimeUtc).format('L LT') : null;
    }),
    responses: alias('model.worksheetResponses'),
    siaComponent: computed('eventType.worksheetGuid', 'eventType.eventTypeGuid', function() {
        if (isEmpty(this.get('eventType.worksheetGuid'))) {
            return 'sia-detail';
        }
        switch (this.get('eventType.eventTypeGuid')) {
            case worksheetEventTypeGuids.midasAssessmentWorksheetEventTypeGuid:
                return 'sia-worksheet/migraine-readonly';
            case worksheetEventTypeGuids.depressionPhq2AssessmentWorksheetEventTypeGuid:
                return 'sia-worksheet/depression-phq-2-readonly';
            default:
                return 'sia-worksheet/default-readonly';
        }
    }),
    loadEncounterText: task(function * () {
        const store = this.get('store');
        const transcriptGuid = this.get('transcriptGuid');
        let encounter = store.peekRecord('encounter-summary', transcriptGuid);

        if (isEmpty(encounter)) {
            const encounters = yield encounterSummariesRepository.loadEncounters(store, this.get('model.patientPracticeGuid'));
            encounter = encounters.findBy('transcriptGuid', transcriptGuid);
        }

        if (isPresent(encounter)) {
            this.setProperties({
                'encounterAndNoteType': encounter.get('encounterAndNoteType'),
                'dateOfService': encounter.get('dateOfService')
            });
        }
    }).drop(),
    actions: {
        closeDetailPane() {
            this.send('close');
        },
        openEncounterClicked() {
            this.send('openEncounter', this.get('transcriptGuid'));
            this.get('analytics').track('View Encounter From Summary SIA');
        }
    }
});
