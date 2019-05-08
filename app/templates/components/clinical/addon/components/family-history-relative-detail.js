import Component from '@ember/component';
import { observer, get, getProperties, setProperties } from '@ember/object';
import { and, not } from '@ember/object/computed';
import { merge } from '@ember/polyfills';
import { isPresent } from '@ember/utils';
import fhhRepository from 'clinical/repositories/family-health-history';
import { task } from 'ember-concurrency';

const saveProperties = ['dateOfBirth', 'firstName', 'lastName', 'comment', 'relationshipType', 'isDeceased'];

export default Component.extend({
    classNames: ['family-history-detail'],
    maxDate: moment(new Date()).format('MM/DD/YYYY'),
    notDisabled: not('disabled'),
    showSaveButton: and('relationshipType', 'notDisabled'),
    showDeleteButton: and('relative.relativeGuid', 'notDisabled'),
    init() {
        this._super();
        this.setRelativeFields();
    },
    setRelativeFields: observer('relative', function () {
        const relative = this.get('relative') || {};
        const initialProperties = getProperties(relative, saveProperties);
        if (!get(relative, 'relativeGuid')) {
            this.set('isRelationshipDropdownOpen', true);
        }
        if (isPresent(initialProperties.dateOfBirth)) {
            initialProperties.dateOfBirth = moment.utc(initialProperties.dateOfBirth).format('MM/DD/YYYY');
        }
        this.setProperties(merge({ initialProperties }, initialProperties));
    }),
    save: task(function* () {
        const relative = this.get('relative');
        const data = this.getProperties(saveProperties);
        if (data.relationshipType.serialize) {
            data.relationshipType = data.relationshipType.serialize({
                includeId: true
            });
        }
        if (isPresent(data.dateOfBirth)) {
            data.dateOfBirth = moment(data.dateOfBirth).utc().startOf('day').toISOString();
        }
        setProperties(relative, data);
        try {
            yield fhhRepository.saveRelative(relative);
            this.reload();
            this.close();
        } catch (e) {
            relative.setProperties(this.get('initialProperties'));
        }
    }).drop(),
    delete: task(function* () {
        const relative = this.get('relative');
        yield fhhRepository.deleteRelative(relative);
        this.removeRelative(relative);
        this.close();
    }).drop()
});
