import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';
export default Mixin.create({
    visibleComments: null,
    init() {
        this._super();
        this.set('visibleComments', []);
    },
    showComments: computed('visibleComments', function() {
        return this.areCommentsVisible('showComments');
    }),
    showEncounterComments: computed('visibleComments', function() {
        return this.areCommentsVisible('showEncounterComments');
    }),
    areCommentsVisible(key) {
        var visibleComments = this.get('visibleComments');
        if (this.get('showAllComments')) {
            return true;
        }
        if (isEmpty(visibleComments)) {
            return false;
        }
        return visibleComments.isAny('key', key);
    },
});
