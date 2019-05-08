import { alias } from '@ember/object/computed';
import { computed, get } from '@ember/object';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
    code: alias('id'),

    description: attr(),
    isActive: attr('boolean'),
    name: attr(),

    isSiteIrrelevant: computed('code', function () {
        const routeCode = (get(this, 'code') || '').toLowerCase();
        return routeCode === 'po' || routeCode === 'ns';
    })
});
