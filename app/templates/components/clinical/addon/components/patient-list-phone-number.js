import Component from '@ember/component';
export default Component.extend({
    classNames: ['phone-number'],
    tagName: 'span',
    attributeBindings: ['value:title']
});
