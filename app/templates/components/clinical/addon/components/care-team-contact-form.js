import { on } from '@ember/object/evented';
import Component from '@ember/component';
export default Component.extend({
    loadSpecialties: on('init', function () {
        this.set('specialties', this.get('store').findAll('specialty'));
    })
});
