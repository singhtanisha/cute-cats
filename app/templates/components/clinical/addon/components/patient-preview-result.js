import ObjectProxy from '@ember/object/proxy';
import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';
export default Component.extend({
    classNames: ['preview-pane-content', 'result'],

    isSignersExpanded: false,
    previewContext: null,

    firstSigner: alias('previewContext.result.signers.firstObject'),
    result: alias('previewContext.result'),
    resultItems: alias('result.items'),

    resultItemsWrapper: computed('resultItems.[]', function() {
        let resultItems = this.get('resultItems');

        return isEmpty(resultItems) ? [] : resultItems.map((item) => {
            return ObjectProxy.create({
                content: item,
                isExpanded: false
            });
        });
    }),

    actions: {
        toggleExpansion(resultItem) {
            resultItem.toggleProperty('isExpanded');
        },

        toggleMoreLessSigners() {
            this.toggleProperty('isSignersExpanded');
        }
    }
});
