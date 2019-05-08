import Component from '@ember/component';
export default Component.extend({
    actions: {
        toggleProperty(key) {
            this.toggleProperty(key);
        }
    }
});
