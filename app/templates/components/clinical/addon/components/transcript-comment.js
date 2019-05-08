import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import { or, bool } from '@ember/object/computed';
import Component from '@ember/component';
export default Component.extend({
    attributeBindings: ['data-element'],
    oneline: true,
    isCollapsible: true,
    commentText: or('transcriptComment.comment', 'comment'),
    providerGuid: or('transcriptComment.lastModifiedByProviderGuid',
        'transcriptComment.lastModifiedProviderGuid'),
    lastModified: or('transcriptComment.lastModifiedDateTimeUtc', 'transcriptComment.lastModifiedAt'),
    date: computed(
      'transcriptComment.transcriptGuid',
      'transcriptComment.lastModified',
      'transcriptComment.dateOfService',
      function () {
          if (this.get('transcriptComment.transcriptGuid')) {
              return this.get('transcriptComment.dateOfService');
          }
          return this.get('lastModified');
      }
    ),
    convertToLocalTime: bool('transcriptComment.transcriptGuid'),
    providerName: computed('providerGuid', function () {
        var providerGuid = this.get('providerGuid'),
            provider;
        if (!isEmpty(providerGuid)) {
            provider = this.store.peekRecord('provider', providerGuid);
            if (provider) {
                return provider.get('providerName');
            }
        }
        return null;
    }),
    actions: {
        toggleOneLine() {
            this.toggleProperty('oneline');
        }
    }
});
