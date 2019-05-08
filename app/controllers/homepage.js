import EmberObject from '@ember/object';
import { observer } from '@ember/object';
import { task } from 'ember-concurrency';
import Controller, { inject as controller } from '@ember/controller';

export default Controller.extend({
    ajax: Ember.inject.service(),
    cats: null,
    init() {
        this._super();
        this.get('loadCats').perform();
    },
    loadCats: task(function* () {
        var url = 'http://127.0.0.1:8000/';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json'
        }).then((res) => {
            this.set('cats', res.slice(1, 11));
        }).fail((error) => {
            debugger;
        });
    })
})
