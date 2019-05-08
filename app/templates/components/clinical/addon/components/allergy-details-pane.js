import DetailPane from 'tyrion/components/detail-pane';

export default DetailPane.extend({
    classNames: ['side-fixed', 'col-xs-5', 'summary-details', 'allergy-details'],
    footerTemplateName: 'cancel-delete-done-footer',
    deleteTitle: 'Delete allergy',
    deleteMessage: 'This action is final, and will remove this allergy from this patient\'s record.',
    init() {
        this._super();
        this.set('resizables', []);
    },
    actions: {
        closeDetailPaneClicked() {
            this.sendAction('save');
        },
        save() {
            this.sendAction('save');
        },
        addAnother() {
            this.sendAction('addAnother');
        },
        cancel() {
            this.sendAction('cancel');
        },
        delete() {
            this.sendAction('delete');
        }
    },
});
