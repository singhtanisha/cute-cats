
import { hasMany } from 'ember-data/relationships';
import Model from 'ember-data/model';

export default Model.extend({
    immunizationRegistryNotificationOptions: hasMany('immunization-option-notification', { async: false }),
    immunizationRegistryStatusOptions: hasMany('immunization-option-status', { async: false }),
    immunizationRegistryProtectionOptions: hasMany('immunization-option-protection', { async: false })
});
