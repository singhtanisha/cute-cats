import { equal } from '@ember/object/computed';
import EmberObject, { computed } from '@ember/object';
import config from 'boot/config';
import PFServer from 'boot/util/pf-server';
import PatientOrderPreview from 'clinical/models/patient/order-preview';
import PatientResultPreview from 'clinical/models/patient/result-preview';

var PatientPreview = EmberObject.extend({
        eventDateTimeUtc: null,
        filterType: null,
        identifyingGuid: null,
        isAbnormal: false,
        isMetric: false,
        isSelected: false,
        isSigned: false,
        primaryEventType: null,
        secondaryEventType: null,
        isEncounter: equal('filterType', 'Encounter'),

        displayDate: computed('eventDateTimeUtc', 'isEncounter', function() {
            if (this.get('isEncounter')) {
                return moment.utc(this.get('eventDateTimeUtc')).format('MM/DD/YYYY');
            } else {
                return moment.utc(this.get('eventDateTimeUtc')).local().format('MM/DD/YYYY');
            }
        }),

        displayText: computed('primaryEventType', 'secondaryEventType', function() {
            var primaryEventType = this.get('primaryEventType');

            return primaryEventType ? primaryEventType : this.get('secondaryEventType');
        }),

        displayTextLower: computed('displayText', function() {
            return this.get('displayText').toLowerCase();
        })
    });

PatientPreview.reopenClass({
    findPreviews(patientPracticeGuid, filterType) {
        var url = [
            config.patientPreviewBaseURL,
            '/patientEvents/',
            patientPracticeGuid
        ];

        if (filterType) {
            url.push('/' + filterType);
        }

        return PFServer.promise(url.join(''), 'GET').then(function(previews) {
            return previews.map(function(preview) {
                return PatientPreview.create(preview);
            });
        });
    },

    findPreview(patientPracticeGuid, preview, previewType) {
        var previewModel = null,
            url = [
                config.labsBaseURL,
                '/patientPreview/',
                patientPracticeGuid,
                '/',
                previewType,
                '/',
                preview.get('identifyingGuid')
            ].join('');

        return PFServer.promise(url, 'GET').then(
            function(previewData) {
                previewData.preview = preview;

                if (previewType === 'order') {
                    previewModel = PatientOrderPreview.create(previewData).load();
                } else if (previewType === 'result') {
                    previewModel = PatientResultPreview.create(previewData).load();
                }

                return previewModel;
            }, function() {
                throw new Error(`Unable to open ${previewType} preview`);
            });
    }
});

export default PatientPreview;
