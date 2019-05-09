import { task } from 'ember-concurrency';
import { computed } from '@ember/object';
import Controller, { inject as controller } from '@ember/controller';

export default Controller.extend({
    ajax: Ember.inject.service(),
    cats: [],
    rows: [],
    lastImageIndex: 0,
    // showLoadingMoreCatsMessage: computed('loadCats.isRunning', 'rows.length', function() {
    //     return this.get('loadCats.isRunning') && this.get('rows.length') > 0;
    // }),
    init() {
        this._super();
        this.get('loadCats').perform();
    },
    loadCats: task(function* () {
        debugger;
        var url = 'http://127.0.0.1:8000/';
        yield $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json'
        }).then((response) => {
            const cats = this.get('cats');
            this.set('cats', cats.pushObjects(response.slice(0,100)));
            this.generateRows();
        }).fail((error) => {
            debugger;
        });
    }),
    generateRows() {
        const cats = this.get('cats');
        const rows = this.get('rows');
        const lastImageIndex = this.get('lastImageIndex');
        let i = lastImageIndex;

        for (i = lastImageIndex; i+10 <= cats.length;) {
            rows.pushObject(cats.slice(i, i+10))
            i = i + 10;
        }
        debugger;
        this.set('rows', rows);
        this.set('lastImageIndex', i);

    },
    fetchMoreRows() {
        const lastImageIndex = this.get('lastImageIndex');
        const cats = this.get('cats');

        if (lastImageIndex+10 > cats.length) {
            this.get('loadCats').perform();
        } else {
            this.generateRows();
        }
    },
    actions: {
        loadMore() {
            this.fetchMoreRows();
        },
        viewFullScreen(url) {
            const imgurId = url.match(/imgur.com\/(.{7})/)[1];
            this.transitionToRoute('full-screen', imgurId);
        }
    }
})
