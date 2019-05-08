import { alias } from '@ember/object/computed';
import Component from '@ember/component';
export default Component.extend({
    classNames: ['preview-pane-content', 'encounter'],

    previewContext: null,

    encounter: alias('previewContext.encounter'),
    hasMoreVitals: alias('previewContext.hasMoreVitals'),
    vitals: alias('previewContext.vitals')
});
