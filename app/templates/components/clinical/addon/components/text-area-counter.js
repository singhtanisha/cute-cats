import { computed } from '@ember/object';
import PFTextarea from 'common/components/d-text-area';

export default PFTextarea.extend({
    dataElement: 'text-area-counter',
    canShowCounter: false,
    isDisabled: false,
    charactersRemaining: computed('maxlength', 'textlength', function() {
        return Math.max(0, this.get('maxlength')-this.get('textlength'));
    }),
    // http://stackoverflow.com/questions/10030921/chrome-counts-characters-wrong-in-textarea-with-maxlength-attribute
    // Chrome and FF count new lines as 2 characters (\r\n) for the maxlength attribute.
    textlength: computed('value', function() {
        var value = this.get('value'),
            newLines,
            addition;
        if (value) {
            newLines = value.match(/(\r\n|\n|\r)/g);
            addition = newLines ? newLines.length : 0;
            return value.length + addition;
        }
        return 0;
    }),
    didInsertElement() {
        this._super();
        
        var _this = this;

        this.$('textarea').focus(function () {
            _this.set('canShowCounter', true);
        });

        this.$('textarea').blur(function(){
            _this.set('canShowCounter', false);
        });
    },
    willDestroyElement() {
        //Remove all event handlers.
        this.$('textarea').off();
    }
});
