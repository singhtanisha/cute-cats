import { computed } from '@ember/object';
import Component from '@ember/component';
export default Component.extend({
    allOtherQuestions: computed('worksheet.questions', function() {
        return this.get('worksheet.questions').rejectBy('label', 'Patient declined to specify on all questions');
    }),
});
