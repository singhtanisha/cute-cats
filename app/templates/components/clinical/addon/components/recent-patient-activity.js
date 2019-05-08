import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import SpinnerSupport from 'common/mixins/spinner';

export default Component.extend(SpinnerSupport, {
    data: null,
    showSpinner: alias('loadData.isRunning'),
    contentElement: '.recent-activity-content',
    pageIndex: null,
    didInsertElement() {
        this._super();
        this.send('refresh');
    },
    loadData: task(function* () {
        const { store, pageIndex, totalPages } = this.getProperties('store', 'pageIndex', 'totalPages');
        const query = {
            patientPracticeGuid: this.get('patientPracticeGuid'),
            pageIndex: (typeof pageIndex === 'number') ? pageIndex + 1 : 0
        };

        // Only request data if there are more records available
        if (((query.pageIndex === 0 || query.pageIndex < totalPages)) || query.startDate) {
            try {
                const results = yield store.query('patient-activity', query);
                this.get('data').pushObjects(results.toArray());
                this.setProperties(results.get('meta'));
            } catch (error) {
                toastr.error('Could not load recent activity');
                this.set('isVisible', false);
            }
        }
    }).drop(),
    actions: {
        close() {
            this.set('isVisible', false);
        },
        refresh() {
            this.setProperties({
                refreshTime: moment(new Date()).toISOString(),
                data: [],
                pageIndex: null
            });
            this.get('loadData').perform();
        },
        fetchMoreData() {
            this.get('loadData').perform();
        }
    }
});
