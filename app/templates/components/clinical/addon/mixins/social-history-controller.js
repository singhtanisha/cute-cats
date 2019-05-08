import Mixin from '@ember/object/mixin';
export default Mixin.create({
    scrollToSocialHistory() {
        // Override in the implementing controller if desired.
    },
    actions: {
        editSmokingStatus(status) {
            const transcriptGuid = this.get('transcriptGuid');
            const patientPracticeGuid = status.get('patientPracticeGuid');
            if (transcriptGuid) {
                this.transitionToRoute('encounter.smoking', patientPracticeGuid, transcriptGuid, status);
            } else {
                this.transitionToRoute('summary.smoking', patientPracticeGuid, status);
            }
        },
        editSocialHistory(section) {
            const baseRoute = this.get('transcriptGuid') ? 'encounter' : 'summary';
            this.transitionToRoute(`${baseRoute}.social`, section);
        },
        editPatientRiskScore() {
            const baseRoute = this.get('transcriptGuid') ? 'encounter' : 'summary';
            this.transitionToRoute(`${baseRoute}.risk-score`);
        }
    }
});
