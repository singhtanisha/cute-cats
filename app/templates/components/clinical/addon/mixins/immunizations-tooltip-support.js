import { observer } from '@ember/object';
import Mixin from '@ember/object/mixin';
export default Mixin.create({
    tooltipMessage: null,

    didInsertElement() {
        this._super();
        this.showTooltip();
    },

    showTooltip: observer('tooltipMessage', function() {
        var message = this.get('tooltipMessage'),
            $group = this.$().parents('.form-group');

        if (message) {
            // Acting on the parents here is not great
            $group.tooltip('destroy');
            $group.tooltip({
                title: message,
                placement: 'top',
                trigger: 'manual'
            });
            $group.tooltip('show');
            $group.addClass('error');
        } else {
            $group.tooltip('destroy');
            $group.removeClass('error');
        }
    })
});
