import { isEmpty } from '@ember/utils';
import { gt } from '@ember/object/computed';
import EmberObject, { computed } from '@ember/object';
export default EmberObject.extend({
    comment: null,
    items: null,
    labAccessionNumber: null,
    labDisplayName: null,
    medicalDirector: null,
    preview: null,
    requestingProviderName: null,
    resultOrderGuid: null,
    signers: null,
    isSigned: false,

    hasMultipleSigners: gt('signers.length', 1),

    isDiagnostic: computed('preview.filterType', function() {
        var filterType = this.get('preview.filterType');

        return filterType && filterType.toLowerCase() === 'labresult';
    }),

    labDescription: computed('isDiagnostic', function() {
        return this.get('isDiagnostic') ? 'Laboratory' : 'Imaging Center';
    }),

    serviceDescription: computed('isDiagnostic', function() {
        return this.get('isDiagnostic') ? 'Tests' : 'Studies';
    }),

    load() {
        var items = this.get('items'),
            signers = [];

        if (!isEmpty(items)) {
            items.forEach(function(item) {
                if (!isEmpty(item.observations)) {
                    item.observations.forEach(function(observation) {
                        var abnormalFlags = observation.abnormalFlags.rejectBy('code', 'N');

                        if (observation.observationValue) {

                            // Imaging observation values use a tag, \.br\, to indicate where a line break should occur.
                            observation.observationValue = Ember.Handlebars.Utils.escapeExpression(observation.observationValue)
                                .replace(/\\.br\\/g, '<br>');
                        }

                        observation.isAbnormal = false;
                        observation.abnormalFlag = null;

                        if (!isEmpty(abnormalFlags)) {
                            observation.isAbnormal = true;
                            observation.abnormalFlag = abnormalFlags[0].description;
                        }

                        if (!isEmpty(observation.signedByProviderFirstName)) {
                            signers.addObject({
                                signedBy: observation.signedByProviderFirstName + ' ' + observation.signedByProviderLastName,
                                signedOn: moment(new Date(observation.signedAtDateTimeOffset)).format('MM/DD/YYYY hh:mm a')
                            });
                        }
                    });
                    item.isAbnormal = item.observations.isAny('isAbnormal');
                }
            });
        }

        this.set('signers', this.loadSignedInfo(signers));

        return this;
    },

    loadSignedInfo(signers) {
        var uniqueSignedStatusInformation = [];

        if (signers.length) {
            signers.forEach(function(signedInfo) {
                if (!uniqueSignedStatusInformation.any(function(uniqueSignedInfo) {
                    return uniqueSignedInfo.signedBy === signedInfo.signedBy &&
                        uniqueSignedInfo.signedOn === signedInfo.signedOn;
                })) {
                    uniqueSignedStatusInformation.addObject(signedInfo);
                }
            });
        }

        return uniqueSignedStatusInformation;
    }
});
