import { equal, alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import Component from '@ember/component';
import diagnosesRepository from 'clinical/repositories/diagnoses';
import SpinnerMixin from 'common/mixins/spinner';
import Loading from 'clinical/mixins/loading';
import ViewPreferences from 'boot/mixins/view-preferences';
import encounterUtils from 'charting/utils/encounter';
import DestroyedMixin from 'tyrion/mixins/destroyed';

export default Component.extend(SpinnerMixin, Loading, ViewPreferences, DestroyedMixin, {
    classNames: 'diagnoses-flyout',

    viewPreferencesKey: 'diagnoses-flyout',
    viewPreferenceProperties: computed(() => ['currentTab']),

    currentTab: computed({
        get() {
            return 'favorite';
        },
        set(key, value) {
            if (value === 'frequent') {
                return 'favorite';
            }
            return value;
        }
    }),

    previousSelected: equal('currentTab', 'previous'),
    favoriteSelected: equal('currentTab', 'favorite'),

    showSpinner: alias('isLoading'),
    patientGuid: '',

    actions: {
        setCurrentTab(tab) {
            this.set('currentTab', tab);
        },
        recordDiagnoses() {
            this.sendAction('recordDiagnoses');
        },
        frequentDiagnosisSelected(selectedDiagnosis) {
            const transcriptGuid = this.get('transcriptGuid');
            selectedDiagnosis.set('patientPracticeGuid', this.get('patientGuid'));
            selectedDiagnosis.attachToEncounter(transcriptGuid);
            this._withProgress(diagnosesRepository.saveDiagnosis(selectedDiagnosis, transcriptGuid).catch((error) => {
                const action = encounterUtils.mapSaveErrorToAction(error, 403);
                if (action) {
                    this._sendActionUnlessDestroyed(action);
                } else {
                    toastr.error('Failed to save diagnosis');
                }
            }));
        },
        refreshChart() {
            this.sendAction('refreshChart');
        },
        closeEncounterTab() {
            this.sendAction('closeEncounterTab');
        }
    }
});
