import { isEmpty } from '@ember/utils';
import AuthenticatedBaseRoute from 'boot/routes/authenticated-base';

export default AuthenticatedBaseRoute.extend({
    beforeModel(transition) {

        return this.session.getPatientListDefault(this.store).then((patientListDefault) => {
            var transitionRoute;

            switch (patientListDefault) {
                case 'Timeline':
                    transitionRoute = 'timeline';
                    break;

                case 'Profile':
                    transitionRoute = 'patient.profile';
                    break;

                case 'Summary':
                    /* falls through */
                default:
                    transitionRoute = 'patient.summary';
            }

            if (isEmpty(transition.params.patient.patient_guid)) {
                this.transitionTo('charts.list');
            } else {
                this.transitionTo(transitionRoute, transition.params.patient.patient_guid);
            }

        });
    }
});
