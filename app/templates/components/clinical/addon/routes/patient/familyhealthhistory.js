import AuthenticatedBaseRoute from 'boot/routes/authenticated-base';

export default AuthenticatedBaseRoute.extend({
    redirect() {
        this.replaceWith('patient.familyhistory');
    }
});
