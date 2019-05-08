import SummaryRoute from 'clinical/mixins/summary-route';
import AuthenticatedBaseRoute from 'boot/routes/authenticated-base';
import WorksheetsRepository from 'clinical/repositories/worksheets';
import config from 'boot/config';
import PFServer from 'boot/util/pf-server';
import TranscriptEvent from 'charting/models/transcript-event';

export default AuthenticatedBaseRoute.extend(SummaryRoute, {
    templateName: 'sia',
    model(params) {
        const transcriptEvent = TranscriptEvent.wrap({});
        const transcriptEventGuid = params.transcriptEventGuid;
        const patientPracticeGuid = this.modelFor('patient').get('patientPracticeGuid');
        // No real model for transcriptEvent, so send a ajax request here
        const url = `${config.chartingURL_v3}patients/${patientPracticeGuid}/transcriptEvents/${transcriptEventGuid}`;
        return PFServer.promise(url, 'GET').then(data => {
            if (data) {
                data = data.transcriptEvent;
                transcriptEvent.set('content', data);
                transcriptEvent.set('patientPracticeGuid', patientPracticeGuid);
                const worksheetGuid = transcriptEvent.get('eventType.worksheetGuid');
                if (worksheetGuid) {
                    WorksheetsRepository.loadResponsesFromTranscriptEncounterEvent(transcriptEvent).then(function(responses) {
                        transcriptEvent.set('worksheetResponses', responses);
                    });
                }
                return transcriptEvent;
            } else {
                toastr.error('Failed to load the assessment');
                this.transitionTo(this.get('_defaultTransition'));
            }
        }).catch(() => {
            toastr.error('Failed to load the assessment');
            this.transitionTo(this.get('_defaultTransition'));
        });
    },
    setupController(controller, model) {
        this._super(controller, model);
        controller.get('loadEncounterText').perform();
    },
    actions: {
        close() {
            this.transitionTo(this.get('_defaultTransition'));
            this.controllerFor('patient/summary').send('closeDetailPane');
        },
        openEncounter(transcriptGuid) {
            this.transitionTo('encounter', transcriptGuid);
            this.controllerFor('patient/summary').send('closeDetailPane');
        }
    }
});
