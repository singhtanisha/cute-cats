import Controller from '@ember/controller';
export default Controller.extend({
    actions: {
        loginWithEPatientFinder() {
            window.open(this.get('config.ePatientFinderLoginUrl'));
            this._navigateBack();
        },
        navigateBack() {
            this._navigateBack();
        }
    },
    _navigateBack() {
        this.transitionToRoute('practiceDashboard.main');
    }
});
