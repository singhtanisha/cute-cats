import { sort, filterBy } from '@ember/object/computed';
import { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';
export default Mixin.create({
    sortProperties: computed(() => ['sortableDate:desc']),
    sortedHealthConcerns: sort('healthConcerns', 'sortProperties'),
    clinicalHealthConcerns: filterBy('sortedHealthConcerns', 'healthConcernReferenceGuid'),
    activeHealthConcerns: filterBy('clinicalHealthConcerns', 'isActive', true),
    inactiveHealthConcerns: filterBy('clinicalHealthConcerns', 'isActive', false),
    healthConcernNote: computed('healthConcerns.@each.healthConcernType', function () {
        const healthConcerns = this.get('healthConcerns') || [];
        return healthConcerns.findBy('healthConcernType', 'Note');
    })
});
