import { get, set } from '@ember/object';
import encounterSummariesRepo from 'charting/repositories/encounter-summaries';

export default {
    // Injected via the inject-store-repositories instance initializer for now
    store: null,

    setTranscriptCommentDates(patientPracticeGuid, transcriptComments) {
        if (!patientPracticeGuid) {
            return;
        }
        transcriptComments.forEach(transcriptComment => {
            const transcriptGuid = get(transcriptComment, 'transcriptGuid');
            if (!transcriptGuid) {
                return;
            }
            encounterSummariesRepo.findEncounter(this.store, patientPracticeGuid, transcriptGuid).then(encounterSummary => {
                if (encounterSummary) {
                    set(transcriptComment, 'dateOfService', encounterSummary.get('dateOfService'));
                }
            });
        });
    }
};
