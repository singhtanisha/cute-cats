import { sort } from '@ember/object/computed';
import { computed } from '@ember/object';
import Component from '@ember/component';
import WithHealthConcerns from 'clinical/mixins/with-health-concerns';

export default Component.extend(WithHealthConcerns, {
    attributeBindings: ['data-element'],
    'data-element': 'print-health-concerns-content',
    sortProperties: computed(() => ['sortableDate:desc']),
    sortedActiveHealthConcerns: sort('activeHealthConcerns', 'sortProperties'),
    sortedInactiveHealthConcerns: sort('inactiveHealthConcerns', 'sortProperties')
});
