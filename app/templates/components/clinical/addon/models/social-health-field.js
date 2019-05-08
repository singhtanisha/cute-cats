import { isPresent, isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import { notEmpty } from '@ember/object/computed';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
    description: attr('string'),
    effectiveDate: attr('string'),
    notes: attr('string'),
    optionGuid: attr('string'),
    supportsEffectiveDate: attr('boolean'),

    isComplete: notEmpty('description'),

    canMarkAsReviewed: computed('effectiveDate', 'hasDirtyAttributes', function() {
        return isPresent(this.get('effectiveDate')) && !this.get('hasDirtyAttributes');
    }),

    showUndo: computed('description', 'descriptionImage', function() {
        const description = (this.get('description') || '').trim();
        const descriptionImage = (this.get('descriptionImage') || '').trim();
        return isPresent(description) && description !== descriptionImage;
    }),
    content: computed('description', 'effectiveDate', function() {
        if (isEmpty(this.get('description'))) {
            return null;
        }

        return this.getProperties([
            'description',
            'effectiveDate'
        ]);
    }),
    setInitValues() {
        this.setProperties({
            'descriptionImage': this.get('description'),
            'optionGuidImage': this.get('optionGuid')
        });
    },
    clear() {
        this.setProperties({
            description: '',
            effectiveDate: '',
            notes: '',
            optionGuid: ''
        });
    },
    undoSelect() {
        this.setProperties({
            'description': this.get('descriptionImage'),
            'optionGuid': this.get('optionGuidImage')
        });
    }
});
