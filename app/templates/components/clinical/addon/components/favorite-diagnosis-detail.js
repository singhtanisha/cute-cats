import DetailPane from 'tyrion/components/detail-pane';

export default DetailPane.extend({
    classNames: ['favorite-diagnosis-detail-panel'],
    isToolBoxVisible: false,
    hasCustomToolbox: false,
    init() {
        this._super();
        this.set('resizables', [{ element: '.detail-pane-body-wrapper', offset: 288 }]);
    }
});
