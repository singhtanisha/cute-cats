import { inject as service } from '@ember/service';
import DeviceRoute from 'clinical/routes/device';
import SummaryRoute from 'clinical/mixins/summary-route';

export default DeviceRoute.extend(SummaryRoute, {
    tunnel: service(),
    closeAction: null,
    setupController(controller, model) {
        this._super(controller, model);
        this.send('refreshAd');
    },
    deactivate() {
        this._super.apply(this, arguments);
        
        this.controllerFor('patient/summary').send('closeDetailPane');
        this.get('tunnel').send('summary-devices-list');
    }
});
