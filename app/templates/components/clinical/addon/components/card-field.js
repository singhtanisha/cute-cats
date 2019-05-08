import { isArray } from '@ember/array';
import { isPresent } from '@ember/utils';
import { computed, get } from '@ember/object';
import { gt } from '@ember/object/computed';
import Component from '@ember/component';
export default Component.extend({
    attributeBindings: ['data-element'],

    content: null,
    fieldValuePath: '',
    isAllowedToEdit: true,
    isEditing: false,
    isError: false,
    isLoading: false,
    isShowingAll: false,
    title: '',
    canHaveMultipleRecord: false,

    hasMultipleItems: gt('content.length', 1),

    canEdit: computed('fieldValuePath', 'isAllowedToEdit', 'isLoading', 'isError', 'isEditing', 'canHaveMultipleRecord', function() {
        const fieldValuePath = this.get('fieldValuePath');
        const fieldValue = fieldValuePath ? this.get(`content.${fieldValuePath}`) : this.get('content');

        if (!this.get('isAllowedToEdit') || (isPresent(fieldValue) && !this.get('canHaveMultipleRecord')) || this.get('isLoading') || this.get('isError') || this.get('isEditing')) {
            return false;
        }

        return true;
    }),

    contentArray: computed('content', 'content.[]', 'isShowingAll', function() {
        const content = this.get('content');

        if (isArray(content)) {
            return this.get('isShowingAll') ? content : [get(content, 'firstObject')].compact();
        }

        return [content].compact();
    }),

    historicalContentCount: computed('contentArray', function() {
        return (this.get('content') || []).length - this.get('contentArray').length;
    }),

    placeholderText: computed('fieldValuePath', 'isLoading', 'isError', 'title', 'isEditing', 'content.[]', function() {
        const fieldValuePath = this.get('fieldValuePath');
        const fieldValue = fieldValuePath ? this.get(`content.${fieldValuePath}`) : this.get('content');
        const fieldLabel = this.get('title').toLowerCase();

        if (isPresent(fieldValue) || this.get('isEditing')) {
            return null;
        }

        if (this.get('isLoading')) {
            return `Loading ${fieldLabel}...`;
        }

        if (this.get('error')) {
            return `Could not load ${fieldLabel}. Try again later.`;
        }

        return `No ${fieldLabel} recorded`;
    }),

    recordingText: computed('title', function() {
        return `Record ${this.get('title').toLowerCase()}`;
    }),

    actions: {
        toggleShowAll() {
            this.toggleProperty('isShowingAll');
        }
    }
});
