import Component from '@ember/component';
export default Component.extend({
    attributeBindings: ['data-element'],
    diagnosis: null,
    hintTextClass: '',
    click() {
        this._super();
        this.sendAction('editDiagnosis', this.get('diagnosis'));
    }
});
