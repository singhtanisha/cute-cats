import { copy } from '@ember/object/internals';
import { on } from '@ember/object/evented';
import Component from '@ember/component';
import diagnosesRepository from 'clinical/repositories/diagnoses';
import Diagnosis from 'clinical/models/diagnosis';
import LoadingMixin from 'clinical/mixins/loading';
import SpinnerMixin from 'common/mixins/spinner';

export default Component.extend(SpinnerMixin, LoadingMixin, {
    loading: false,
    frequentDiagnoses: undefined,
    classNames: ['frequent-diagnoses'],

    loadFrequentDiagnoses: on('init', function(forceReload) {
        var _this = this;
        this.set('frequentDiagnoses', []);
        this.set('loadFailed', false);
        this._withProgress(diagnosesRepository.loadFrequentDiagnoses({forceReload: forceReload})
            .then(function (data) {
                _this.set('frequentDiagnoses', data);
            }).catch(function () {
                _this.set('loadFailed', true);
            }));
    }),

    actions: {
        selectDiagnosis(frequentDiagnosis) {
            var deep = true,
                diagnosis = copy(frequentDiagnosis.get('content'), deep);
            diagnosis = Diagnosis.wrap(diagnosis);
            this.sendAction('diagnosisSelected', diagnosis);
        },
        reloadFrequentDiagnoses() {
            this.loadFrequentDiagnoses(true);
        }
    }
});
