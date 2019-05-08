import { computed } from '@ember/object';
import { alias, equal, not } from '@ember/object/computed';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
    patientGuid: attr('string'),
    practiceGuid: attr('string'),
    providerGuid: belongsTo('provider', { async: false }),
    requestedByProvider: alias('providerGuid'),
    documentGuid: alias('id'),
    createdTimeUtc: attr('string'),
    lastModifiedTimeUtc: attr('string'),
    clinicalDocumentStatus: attr('string'),
    clinicalDocumentTypeCode: attr('string'),
    // Timeline properties
    type: 'clinicaldocuments',
    isComplete: equal('clinicalDocumentStatus', 'Completed'),
    isPending: not('isComplete'),
    clinicalSummaryParams: computed('documentGuid', 'patientGuid', 'clinicalDocumentTypeCode', function () {
        return {
            docGUID: this.get('documentGuid'),
            patientGUID: this.get('patientGuid'),
            fromCCDAlist: false,
            doctype: this.get('clinicalDocumentTypeCode')
        };
    })
});
