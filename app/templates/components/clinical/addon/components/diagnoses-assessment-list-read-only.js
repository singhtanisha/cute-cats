import Component from '@ember/component';
import WithDiagnoses from 'clinical/mixins/with-diagnoses';

export default Component.extend(WithDiagnoses, {
    oneline: true,
    firstCommentOneLine: true
});
