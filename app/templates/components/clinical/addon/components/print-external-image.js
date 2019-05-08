import { on } from '@ember/object/evented';
import Component from '@ember/component';
export default Component.extend({
    listenForImgLoad: on('didInsertElement', function () {
        this.$('img').on('load', function () {
            var parentFrame = $('#print-modal-frame')[0];

            parentFrame = $(parentFrame);
            parentFrame.height(parentFrame.height() + this.height);
        });
    })
});
