import Service, { inject as service } from '@ember/service';
import transcriptComments from 'clinical/util/transcript-comments';

// TODO: Move all the util to the service.
export default Service.extend({
    store: service(),
    init() {
        transcriptComments.store = this.get('store');
    }
});
