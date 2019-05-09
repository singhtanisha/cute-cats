import Controller, { inject as controller } from '@ember/controller';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';
const NUM_ROWS_ON_LOAD_MORE = 20;
const CAT_SERVER_URL = 'http://127.0.0.1:8000/';

export default Controller.extend({
    ajax: Ember.inject.service(),
    cats: [],
    rows: [],
    lastImageIndex: 0,
    rowsToGenerate: NUM_ROWS_ON_LOAD_MORE,
    showLoadingMoreCatsMessage: computed('loadCats.isRunning', 'rows.length', function() {
        return this.get('loadCats.isRunning') && this.get('rows.length') > 0;
    }),
    landingMessage: 'LOADING CUTE CATS...',
    init() {
        this._super();
        this.get('loadCats').perform();
    },
    loadCats: task(function* () {
        var url = CAT_SERVER_URL;
        yield $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json'
        }).then((response) => {
            const cats = this.get('cats');
            this.set('cats', cats.pushObjects(response));
            this.generateRows();
        }).fail((error) => {
            this.set('landingMessage', `OH NO! WE CAN'T FIND THE CATS. TRY REFRESHING THE PAGE.`);
        });
    }),
    generateRows() {
        const cats = this.get('cats');
        const rows = this.get('rows');
        const lastImageIndex = this.get('lastImageIndex');
        let countRows = this.get('rowsToGenerate');
        let i = lastImageIndex;

        for (i = lastImageIndex; countRows > 0 && i+10 <= cats.length;) {
            rows.pushObject(cats.slice(i, i+10))
            i = i + 10;
            countRows = countRows - 1;
        }
        if (countRows === 0) {
            this.set('rowsToGenerate', NUM_ROWS_ON_LOAD_MORE);
        } else {
            this.set('rowsToGenerate', countRows);
            this.get('loadCats').perform();
        }
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
