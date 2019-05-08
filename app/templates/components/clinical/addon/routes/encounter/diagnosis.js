
import { set } from '@ember/object';
import DiagnosisRoute from 'clinical/routes/diagnosis';
import EncounterRoute from 'clinical/mixins/encounter-route';

export default DiagnosisRoute.extend(EncounterRoute, {
    isRecordedFromAssessment: false,
    model(params, transition, queryParams) {
        queryParams = params.queryParams || transition.queryParams || queryParams || {};
        var model = this._super.apply(this, arguments),
            isRecordedFromAssessment = (queryParams.actionType === 'assessment');

        this.set('isRecordedFromAssessment', isRecordedFromAssessment);
        set(model, 'isRecordedFromAssessment', isRecordedFromAssessment);
        return model;
    },
    activate() {
        this._super.apply(this, arguments);
        this.controllerFor(this.get('delegatingController')).set('isCollapsed', true);
    },
    deactivate() {
        this._super.apply(this, arguments);
        this.controllerFor(this.get('delegatingController')).set('isCollapsed', false);
    }
});
