import { isEmpty } from '@ember/utils';
import { hash, resolve, all } from 'rsvp';
import EmberObject, { observer } from '@ember/object';
import { on } from '@ember/object/evented';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import SpinnerSupport from 'common/mixins/spinner';
import PatientPreview from 'clinical/models/patient/preview';

const codeToVitalMap = {
    '3141-9': 'Weight',
    '8302-2': 'Height',
    '39156-5': 'BMI',
    '55284-4': 'BP',
    '8310-5': 'Temp',
    '8867-4': 'Pulse',
    '9279-1': 'RR',
    '59408-5': 'O2 Sat',
    '72514-3': 'Pain',
    '9843-4': 'Head circ'
};

export default Component.extend(SpinnerSupport, {
    classNames: ['preview-pane'],
    layoutName: 'components/patient-preview',
    showSpinner: alias('loading'),

    contentElement: '.preview-pane',
    currentPreview: null,
    errorMessage: '',
    headerTitle: null,
    isAbnormal: false,
    isLocked: false,
    loading: false,
    loadingPromise: null,
    patient: null,
    previewContext: null,

    currentPreviewChanged: on('init', observer('currentPreview', function() {
        var currentPreview = this.get('currentPreview');

        if (currentPreview) {
            switch (currentPreview.get('filterType').toLowerCase()) {
                case 'encounter':
                    this.set('loadingPromise', this.setEncounterContext(currentPreview));
                    break;
                case 'laborder':
                case 'imgorder':
                    this.set('loadingPromise', this.setOrderContext(currentPreview));
                    break;
                case 'labresult':
                case 'imgresult':
                    this.set('loadingPromise', this.setResultContext(currentPreview));
                    break;
            }
        }
    })),

    actions: {
        closePreviews() {
            this.attrs.togglePreviews();
        },

        openPreview() {
            this.attrs.openPreview();
        }
    },

    setEncounterContext(preview) {
        this.set('loading', true);

        var patient = this.get('patient'),
            transcriptGuid = preview.get('identifyingGuid'),
            store = this.get('store'),
            hasMoreVitals = false,
            query = { patientPracticeGuid: patient.get('patientPracticeGuid'), transcriptGuid: transcriptGuid },
            promiseHash = {
                vitalSets: store.query('encounter-vital-set', query),
                encounter: store.query('chart-note', query).then(encounters => this._loadEncounterSnapshots(encounters.get('firstObject')))
            };

        return hash(promiseHash).then(hash => {
            var encounter = hash.encounter,
                dateOfService = encounter.get('dateOfServiceUtc'),
                vitals = hash.vitalSets.get('firstObject.filteredVitals') || [],
                vitalCodes = Object.keys(codeToVitalMap),
                isMetric = preview.get('isMetric');

            encounter.set('ageOnDOS', patient.getAgeOnDate(dateOfService));
            vitals.setEach('isMetric', isMetric);

            // Remove the head circ vital if the patient is older than 36 months old.
            if (moment(dateOfService).diff(patient.get('patient.birthDate'), 'months') > 36) {
                vitalCodes.removeObject('9843-4');
            }
            if (hash.vitalSets.get('length') > 1) {
                hasMoreVitals = true;
            } else {
                hasMoreVitals = vitals.any(function(observation) {
                    var code = observation.get('code');
                    return !vitalCodes.includes(code);
                });
            }
            vitals = vitalCodes.map(function(code) {
                return {
                    display: codeToVitalMap[code],
                    observation: vitals.findBy('code', code)
                };
            });

            this.set('previewContext', EmberObject.create({
                componentName: 'patient-preview-encounter',
                encounter: encounter,
                vitals: vitals,
                hasMoreVitals: hasMoreVitals
            }));

            if (encounter.get('isSigned')) {
                return store.query('encounter-addendum', query).then(function(addenda) {
                    encounter.set('addenda', addenda);
                });
            }
        }).catch(() => {
            this.attrs.previewError({
                title: `${preview.get('displayDate')} - ${preview.get('displayText')}`,
                message: 'Error loading encounter preview'
            });
        }).finally(() => {
            this.set('loading', false);
        });
    },
    _loadEncounterSnapshots(encounter) {
        let promises = encounter.getLoadSnapshotPromises(['seenByProviderSnapshot', 'signedByProviderSnapshot']);
        if (isEmpty(promises)) {
            return resolve(encounter);
        }
        return all(promises).then(() => encounter);
    },

    setOrderContext(preview) {
        var patientPracticeGuid = this.get('patient.patientPracticeGuid');

        this.set('loading', true);

        return PatientPreview.findPreview(patientPracticeGuid, preview, 'order')
            .then((orderPreview) => {
                this.set('previewContext', EmberObject.create({
                    componentName: 'patient-preview-order',
                    order: orderPreview
                }));
            })
            .catch((e) => {
                this.attrs.previewError({
                    title: `${preview.get('displayDate')} - ${preview.get('displayText')}`,
                    message: e.message
                });
            })
            .finally(() => {
                this.set('loading', false);
            });
    },

    setResultContext(preview) {
        var patientPracticeGuid = this.get('patient.patientPracticeGuid');

        this.set('loading', true);

        return PatientPreview.findPreview(patientPracticeGuid, preview, 'result')
            .then((resultPreview) => {
                resultPreview.set('isSigned', preview.get('isSigned'));

                this.set('previewContext', EmberObject.create({
                    componentName: 'patient-preview-result',
                    result: resultPreview,
                }));
            })
            .catch((e) => {
                this.attrs.previewError({
                    title: `${preview.get('displayDate')} - ${preview.get('displayText')}`,
                    message: e.message
                });
            })
            .finally(() => {
                this.set('loading', false);
            });
    }
});
