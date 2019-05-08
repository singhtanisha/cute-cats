import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';

export default Component.extend({
    attributeBindings: ['data-guid', 'data-element'],
    'data-element': 'relative-card',
    'data-guid': alias('relative.relativeGuid'),
    relationshipDescription: alias('relative.relationshipType.description'),
    fullName: computed('relative.{firstName,lastName}', function () {
        const firstName = this.get('relative.firstName');
        const lastName = this.get('relative.lastName');
        if (isEmpty(firstName)) {
            if (isEmpty(lastName)) {
                return '';
            }
            return lastName;
        }
        if (isEmpty(lastName)) {
            return firstName;
        }
        return `${firstName} ${lastName}`;
    }),
    title: computed('relationshipDescription', 'fullName', function () {
        const { relationshipDescription, fullName } = this.getProperties('relationshipDescription', 'fullName');
        if (isEmpty(fullName)) {
            return relationshipDescription;
        }
        return `${relationshipDescription} - ${fullName}`;
    })
});
