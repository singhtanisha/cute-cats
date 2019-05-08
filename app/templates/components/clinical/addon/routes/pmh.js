import DetailPaneRoute from 'clinical/routes/detail-pane';

export default DetailPaneRoute.extend({
    templateName: 'pmh',
    model(param) {
        return {
            section: param.section
        };
    },
    setupController(controller, model) {
        this._super(controller, model);
        this.send('refreshAd');
    },
    actions: {
        pmhAction(action) {
            this.controllerFor(this.get('delegatingController')).send(action);
        }
    }
});
