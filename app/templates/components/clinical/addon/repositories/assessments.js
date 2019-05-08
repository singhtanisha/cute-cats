import { isPresent } from '@ember/utils';
import { assert } from '@ember/debug';
import Assessment from 'clinical/models/assessment';
import config from 'boot/config';
import pfServer from 'boot/util/pf-server';

export default {
    saveAssessment(assessment) {
        assert(assessment instanceof Assessment, 'You must pass an Assessment instance to the saveAssessment function');
        let method = 'POST',
            guid = assessment.get('worksheetInstanceGuid'),
            url = config.clinicalBaseURL + 'Worksheet';

        if (isPresent(guid)) {
            url += '/' + guid;
            method = 'PUT';
        }
        return pfServer.promise(url, method, assessment.toAssessmentObject()).then(data => {
            assessment.set('worksheetInstanceGuid', data.worksheetInstanceGuid);
            return assessment;
        });
    }
};
