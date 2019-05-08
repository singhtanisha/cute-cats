import Component from '@ember/component';
export default Component.extend({
    actions: {
        editDiagnosis(diagnosis) {
            this.sendAction('editDiagnosis', diagnosis);
        },
        toggleProperty(key) {
            this.toggleProperty(key);
        }
    }
});
