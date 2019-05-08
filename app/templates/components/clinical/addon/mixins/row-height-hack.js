import { scheduleOnce } from '@ember/runloop';
import Mixin from '@ember/object/mixin';
export default Mixin.create({
    // HACK: to fix the row height when its content height changes
    _resizeRowByCell() {
        var cell = this.$().parents('.data-grid-cell');
        scheduleOnce('afterRender', this, function() {
            var index = cell.index() + 1,
                dataGrid = cell.parents('.data-grid'),
                cellsOnSameRow = dataGrid.find('.data-grid-cell:nth-child(' + index + ')'),
                newRowHeight = cell.children().first().outerHeight();
            cellsOnSameRow.height(newRowHeight);
        });
    }
});
