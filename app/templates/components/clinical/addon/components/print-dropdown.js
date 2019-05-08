import { alias } from '@ember/object/computed';
import Component from '@ember/component';
export default Component.extend({
    classNames: ['btn-group', 'print-menu-group'],
    useIcons: false,
    attributeBindings: ['data-element'],
    dataElement: alias('data-element')
});
