import { alias } from '@ember/object/computed';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
    nipName: alias('id'),

    isActive: attr('boolean'),
    isExpirable: attr('boolean'),
    nipCodeSystem: attr(),
    nipCode: attr(),
    rejectionReason: attr(),
    rejectionReasonName: attr()
});
