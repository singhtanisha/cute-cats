import { alias } from '@ember/object/computed';
import Component from '@ember/component';
export default Component.extend({
    classNames: ['preview-pane-content', 'order'],

    previewContext: null,

    order: alias('previewContext.order')
});
