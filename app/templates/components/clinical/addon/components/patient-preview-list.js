import { sort, alias } from '@ember/object/computed';
import { scheduleOnce } from '@ember/runloop';
import { isPresent } from '@ember/utils';
import { on } from '@ember/object/evented';
import { computed, observer } from '@ember/object';
import Component from '@ember/component';
import SpinnerSupport from 'common/mixins/spinner';
import PatientPreview from 'clinical/models/patient/preview';
import flowsheetDataRepository from 'flowsheets/repositories/flowsheet-data';

export default Component.extend(SpinnerSupport, {
    classNames: ['preview-list-pane'],
    layoutName: 'components/patient-preview-list',
    showSpinner: alias('loading'),

    contentElement: '.preview-list-pane',
    isVisible: false,
    loading: false,
    patientPracticeGuid: null,
    previews: null,
    previewTypes: computed(() => [
        { label: 'Show all types', value: 'all' },
        { label: 'Encounters', value: 'Encounter' },
        { label: 'Lab orders', value: 'LabOrder' },
        { label: 'Lab results', value: 'LabResult' },
        { label: 'Imaging orders', value: 'ImgOrder' },
        { label: 'Imaging results', value: 'ImgResult' }
    ]),
    previewsModal: null,
    selectedPreviewType: 'all',
    previewSortProperty: computed(() => ['eventDateTimeUtc:desc', 'createdAtDateTime:desc']),
    sortedPreviews: sort('previews', 'previewSortProperty'),
    previewTypeDidChange: on('init', observer('patientPracticeGuid', 'selectedPreviewType', 'isVisible', function () {
        const previewType = this.get('previewTypes').findBy('value', this.get('selectedPreviewType'));
        this.set('previews', []);
        if (this.get('isVisible') && this.get('patientPracticeGuid') && previewType) {
            if (previewType.value === 'all') {
                this.loadPreviews(null, 'previews');
            } else {
                this.loadPreviews(previewType.value, previewType.label.toLowerCase());
            }
        }
    })),

    actions: {
        selectPreview(preview) {
            this.get('previews').setEach('isSelected', false);

            if (isPresent(preview)) {
                preview.set('isSelected', true);
            }

            this.attrs.selectPreview(preview);
        }
    },

    loadPreviews(filterType, previewLabel) {
        this.attrs.clearError();
        this.attrs.selectPreview(null);
        this.attrs.updateHeader(`Loading ${previewLabel}...`);

        this.set('loading', true);

        PatientPreview.findPreviews(this.get('patientPracticeGuid'), filterType)
            .then(previews => {
                this.set('previews', previews);
                if (previews.get('length')) {
                    flowsheetDataRepository.loadIsMetric().then(function(isMetric) {
                        previews.setEach('isMetric', isMetric);
                    }, function() {
                        previews.setEach('isMetric', false);
                    }).finally(function() {
                        this.initializePreview();
                    }.bind(this));
                } else {
                    this.onError(`No ${previewLabel} for this patient`,
                        `There are no ${previewLabel} for this patient`);
                }
            }, () => {
                this.onError(`Error loading ${previewLabel}`, `Could not load ${previewLabel} for this patients. Try again later.`);
            })
            .finally(() => {
                this.set('loading', false);
            });
    },

    initializePreview() {
        var previews = this.get('previews'),
            previewType = this.get('previewTypes').findBy('value', this.get('selectedPreviewType'));

        scheduleOnce('afterRender', this, function() {
            if (previewType.value === 'Encounter' && previews.length > 1) {
                this.send('selectPreview', previews.objectAt(1));
            } else {
                this.send('selectPreview', previews.get('firstObject'));
            }
        });
    },

    onError(title, message) {
        this.attrs.previewError({
            title: title,
            message: message
        });
    }
});
