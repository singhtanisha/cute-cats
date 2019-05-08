import { empty } from '@ember/object/computed';
import Component from '@ember/component';
import { computed } from '@ember/object';
import SpinnerSupport from 'common/mixins/spinner';

export default Component.extend(SpinnerSupport, {
    classNames: ['registry-query-results-pane'],

    hasNoResults: empty('model'),
    actions: {
    }
});
