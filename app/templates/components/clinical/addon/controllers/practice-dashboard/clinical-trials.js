import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
export default Controller.extend({
    analytics: service(),

    isRegistrationModalVisible: false,
    isLearnMoreModalVisible: false,

    actions: {
        toggleProperty(name) {
            this.toggleProperty(name);
        },
        confirmSignup() {
            this.get('analytics').track('Scenario - Clinical Trials', {'Scenario Step': 'clickedSignUpOrLearnMore'});
            this.set('isRegistrationModalVisible', true);
        },
        confirmLearnMore() {
            this.get('analytics').track('Scenario - Clinical Trials', {'Scenario Step': 'clickedSignUpOrLearnMore'});
            this.set('isLearnMoreModalVisible', true);
        },
        openRegisterUrl() {
            this.get('analytics').track('Scenario - Clinical Trials', {'Scenario Step': 'visitedExternalSite'});
            this.set('isRegistrationModalVisible', false);
            window.open(this.get('config.ePatientFinderRegisterUrl'));
        },
        openLearnMoreUrl() {
            this.get('analytics').track('Scenario - Clinical Trials', {'Scenario Step': 'visitedExternalSite'});
            this.set('isLearnMoreModalVisible', false);
            window.open(this.get('config.ePatientFinderLearnMore'));
        }
    }
});
