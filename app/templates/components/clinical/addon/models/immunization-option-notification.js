import { alias } from '@ember/object/computed';
import attr from 'ember-data/attr';
import Model from 'ember-data/model';
import { computed, get } from '@ember/object';

export default Model.extend({
    notificationPreferenceCode: alias('id'),

    codingSystem: attr('string'),
    codingSystemDescription: attr('string'),
    immunizationRegistryNotificationPreferenceDescription: attr('string'),
    isActive: attr('boolean'),

    immunizationRegistryNotificationPreferenceId: computed('notificationPreferenceCode', function () {
        return parseInt(get(this, 'notificationPreferenceCode'));
    })
});
