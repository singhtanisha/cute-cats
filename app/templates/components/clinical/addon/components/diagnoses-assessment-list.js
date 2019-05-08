import { on } from '@ember/object/evented';
import { alias, notEmpty } from '@ember/object/computed';
import { computed, get, set } from '@ember/object';
import Component from '@ember/component';
import session from 'boot/models/session';
import diagnosesRepository from 'clinical/repositories/diagnoses';
import WithDiagnoses from 'clinical/mixins/with-diagnoses';
import SpinnerMixin from 'common/mixins/spinner';
import encounterUtils from 'charting/utils/encounter';
import { task } from 'ember-concurrency';

export default Component.extend(WithDiagnoses, SpinnerMixin, {
    patientGuid: '',
    transcriptGuid: '',
    classNames: ['diagnoses-assessment-list'],
    classNameBindings: ['hasDiagnoses:with-diagnoses'],
    hasDiagnoses: notEmpty('encounterDiagnoses'),
    canEditDiagnoses: computed(() => !session.get('isStaff')),
    isLoading: alias('removeDiagnosisTask.isRunning'),
    removeDiagnosisTask: task(function* (diagnosis) {
        const transcriptGuid = this.get('transcriptGuid');
        try {
            yield diagnosesRepository.deleteTranscriptDiagnosis(diagnosis, transcriptGuid);
        } catch (error) {
            const action = encounterUtils.mapSaveErrorToAction(error, 403);
            if (action) {
                this.sendAction(action);
            } else {
                toastr.error('Failed to remove diagnosis');
            }
        }
    }),
    actions: {
        removeDiagnosis(diagnosis) {
            this.get('removeDiagnosisTask').perform(diagnosis);
        },
        editDiagnosis(diagnosis) {
            this.sendAction('editDiagnosis', diagnosis.get('diagnosisGuid'));
        },
        refineDiagnosis(diagnosis) {
            this.sendAction('refineDiagnosis', diagnosis.get('diagnosisGuid'));
        },
        moveToTop(encounterDiagnosis) {
            if (encounterDiagnosis === this.get('encounterDiagnoses.firstObject')) {
                return;
            }
            const firstTranscriptDx = this.get('encounterDiagnoses.firstObject.transcriptDiagnosis');
            const sortOrder = firstTranscriptDx ? get(firstTranscriptDx, 'sortOrder') - 1 : 0;
            set(encounterDiagnosis.transcriptDiagnosis, 'sortOrder', sortOrder);
            this.set('didReorder', true);
        },
        moveUp(encounterDiagnosis) {
            if (encounterDiagnosis === this.get('encounterDiagnoses.firstObject')) {
                return;
            }
            const encounterDiagnoses = this.get('encounterDiagnoses');
            const encounterDiagnosisAbove = encounterDiagnoses.objectAt(encounterDiagnoses.indexOf(encounterDiagnosis) - 1);
            const oldSortOrder = get(encounterDiagnosis.transcriptDiagnosis, 'sortOrder');

            // Swap sort orders with the Dx above
            if (encounterDiagnosisAbove) {
                set(encounterDiagnosis.transcriptDiagnosis, 'sortOrder', get(encounterDiagnosisAbove.transcriptDiagnosis, 'sortOrder'));
                set(encounterDiagnosisAbove.transcriptDiagnosis, 'sortOrder', oldSortOrder);
                this.set('didReorder', true);
            }
        }
    },
    _saveDxOrder: on('willDestroyElement', function () {
        if (this.get('didReorder')) {
            diagnosesRepository.reorderTranscriptDiagnosis(this.get('transcriptGuid'), this.get('encounterDiagnoses').mapBy('diagnosis'));
        }
    })
});
