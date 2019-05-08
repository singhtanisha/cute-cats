import { observer } from '@ember/object';
import Controller, { inject as controller } from '@ember/controller';
export default Controller.extend({
    patientController: controller('patient'),
    allowRollback: false,

    allowRollbackObserver: observer('model.hasDirtyAttributes', function () {
        this.set('allowRollback', this.get('model.hasDirtyAttributes'));
    })
});
