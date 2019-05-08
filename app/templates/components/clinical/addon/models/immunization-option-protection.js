import attr from 'ember-data/attr';
import Model from 'ember-data/model';
import { computed, get } from '@ember/object';

export default Model.extend({
    immunizationProtectionTypeCode: attr('string'),
    immunizationProtectionTypeDescription: attr('string'),
    isActive: attr('boolean'),

    displayOrder: computed('immunizationProtectionTypeId', function () {
        const typeId = get(this, 'immunizationProtectionTypeId') || '1000';
        const idOrder = parseInt(typeId);
        if (idOrder === 1) { return 10; }
        return idOrder;
    }),
    immunizationProtectionTypeId: computed('id', function () {
        return parseInt(get(this, 'id'));
    })
});
