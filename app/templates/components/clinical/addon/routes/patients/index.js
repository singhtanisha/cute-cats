import AuthenticatedBaseRoute from 'boot/routes/authenticated-base';

export default AuthenticatedBaseRoute.extend({
    beforeModel() {
        this.replaceWith('charts.list');
    },
});
