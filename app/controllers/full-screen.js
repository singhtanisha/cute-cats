import Controller, { inject as controller } from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
    fullUrl: computed('model', function() {
        const model = this.get('model');
        if (model) {
            return `https://i.imgur.com/${model.imageId}.jpg`
        }
        return null;
    })
})
