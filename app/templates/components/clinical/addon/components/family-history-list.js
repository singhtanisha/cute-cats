import Component from '@ember/component';
import { set } from '@ember/object';
import fhhRepository from 'clinical/repositories/family-health-history';

export default Component.extend({
    classNames: ['box-padding-Alg-v2', 'flex-grow', 'family-history__list'],
    actions: {
        unknownConditionChecked(value) {
            const { unknownCondition, patientPracticeGuid } = this.getProperties('unknownCondition', 'patientPracticeGuid');
            set(unknownCondition, 'operation', value ? 'add' : 'delete');
            fhhRepository.saveCondition(unknownCondition, patientPracticeGuid);
        }
    }
});
