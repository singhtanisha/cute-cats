import { inject as service } from '@ember/service';
import SummaryRoute from 'clinical/mixins/summary-route';
import AuthenticatedBaseRoute from 'boot/routes/authenticated-base';
import WorksheetsRepository from 'clinical/repositories/worksheets';
import WorksheetResponses from 'clinical/models/worksheet-responses';

export default AuthenticatedBaseRoute.extend(SummaryRoute, {
    templateName: 'behavioral',
    tunnel: service(),
    model(params) {
        const worksheetGuid = params.worksheetGuid;
        const worksheetResponseGuid = params.worksheetResponseGuid;
        const patientPracticeGuid = this.modelFor('patient').get('patientPracticeGuid');

        if (worksheetResponseGuid === 'new') {
            this.set('isNew', true);
            return WorksheetsRepository.loadWorksheet(worksheetGuid).then(worksheet => {
                return WorksheetResponses.createFromWorksheet(worksheet, patientPracticeGuid);
            });
        } else {
            this.set('isNew', false);
            return WorksheetsRepository.loadResponses(worksheetResponseGuid).then(worksheetResponses => {
                return worksheetResponses;
            });
        }
    },
    setupController(controller, model) {
        this._super(controller, model);
        controller.set('isNew', this.get('isNew'));
        this.get('tunnel').send('update-editing-social-history', {
            isEditing: true,
            fieldKey: model.get('socialHistoryKey')
        });
    },
    deactivate() {
        this.get('tunnel').send('update-editing-social-history', {
            isEditing: false
        });
    },
    actions: {
        close() {
            this.transitionTo(this.get('_defaultTransition'));
            this.controllerFor('patient/summary').send('closeDetailPane');
        },
    }
});
