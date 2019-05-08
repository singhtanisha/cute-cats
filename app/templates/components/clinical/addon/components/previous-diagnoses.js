import Component from '@ember/component';
import diagnosesRepository from 'clinical/repositories/diagnoses';
import WithDiagnoses from 'clinical/mixins/with-diagnoses';
import SpinnerMixin from 'common/mixins/spinner';
import encounterUtils from 'charting/utils/encounter';
import DestroyedMixin from 'tyrion/mixins/destroyed';

export default Component.extend(WithDiagnoses, SpinnerMixin, DestroyedMixin, {
    actions: {
        diagnosisSelected(diagnosis) {
            this._addTranscriptDiagnosis(diagnosis);
        },
        diagnosisDeselected(diagnosis) {
            const transcriptGuid = this.get('transcriptGuid');
            this._withProgress(diagnosesRepository.deleteTranscriptDiagnosis(diagnosis, transcriptGuid))
                .catch(error => this._handleSaveError(error, 'Failed to remove diagnosis', diagnosis));
        },

        addAllDiagnoses() {
            const transcriptGuid = this.get('transcriptGuid');
            const diagnosesToAdd = this.get('diagnoses.active').reject(diagnosis => diagnosis.isEncounterDiagnosis(transcriptGuid));

            this._withProgress(diagnosesRepository.addDiagnosesToEncounter(
                this.get('patientGuid'), diagnosesToAdd, transcriptGuid
            )).catch(error => this._handleSaveError(error, 'Failed to add diagnoses'));
        }
    },
    _addTranscriptDiagnosis(diagnosis) {
        const transcriptGuid = this.get('transcriptGuid');
        this._withProgress(diagnosesRepository.saveTranscriptDiagnosis(diagnosis, transcriptGuid, ''))
            .catch(error => this._handleSaveError(error, 'Failed to save diagnosis', diagnosis));
    },
    _handleSaveError(error, message, diagnosis) {
        let action = diagnosesRepository.mapSaveErrorToAction(error, diagnosis);
        if (action) {
            return;
        }
        action = encounterUtils.mapSaveErrorToAction(error, 403);
        if (action) {
            this._sendActionUnlessDestroyed(action);
        } else {
            toastr.error(message);
        }
    }
});
