import attr from 'ember-data/attr';
import Model from 'ember-data/model';
import { alias } from '@ember/object/computed';
import { computed, getProperties } from '@ember/object';

export default Model.extend({
    editionDate: attr('string'),
    hl7Code: attr('string'),
    isActive: attr('boolean'),
    visConceptCode: attr('string'),
    visConceptGuid: alias('id'),
    visConceptName: attr('string'),
    label: computed('editionDate', 'visConceptName', function () {
        const { editionDate, visConceptName } = getProperties(this, 'editionDate', 'visConceptName');
        return `${moment.utc(editionDate).format('MM/DD/YYYY')} - ${visConceptName}`;
    })
});
