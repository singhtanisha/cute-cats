import Component from '@ember/component';
import SpinnerSupport from 'common/mixins/spinner';

export default Component.extend(SpinnerSupport, {
    classNames: ['list-immunizations']
});
