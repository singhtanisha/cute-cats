import { isArray } from '@ember/array';
import { scheduleOnce } from '@ember/runloop';
import { isEmpty } from '@ember/utils';
import { empty, sort } from '@ember/object/computed';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import ObjectProxy from '@ember/object/proxy';
import { get, computed, set } from '@ember/object';
import MedicationsArray from 'clinical/models/medications-array';
import transcriptComments from 'clinical/util/transcript-comments';
import diagnosesRepository from 'clinical/repositories/diagnoses';

const LIQUID_DOSE_FORMS = [
    'Liquid',
    'Solution',
    'Elixir',
    'Syrup',
    'Suspension',
    'Controlled Release Liquid',
    'Extended Release Liquid',
    'Pediatric Liquid',
    'Sustained Release Oral Liquid',
    'Oral Solution',
    'Solution for Reconstitution',
    'Reconstituted Oral Solution',
    'Extended Release Suspension',
    'Oral Reconstituted Suspension',
    'Oral Suspension',
    'Oral Suspension Final',
    'Suspension 12 Hour Sustained Release',
    'Suspension for Reconstitution',
    'Suspension Reconstituted',
    'Reconstituted Suspension'
];

const PromiseObject = ObjectProxy.extend(PromiseProxyMixin);

const Medication = ObjectProxy.extend({
    isHistorical: computed('stopDateTime', function () {
        const stopDate = this.get('stopDateTime');
        return !!stopDate && moment(stopDate).isBefore(moment());
    }),
    isFuture: computed('startDateTime', function () {
        const startDate = this.get('startDateTime');
        return !!startDate && moment(startDate).isAfter(moment());
    }),
    isCurrent: computed('isHistorical', 'isFuture', function () {
        return !this.get('isHistorical') && !this.get('isFuture');
    }),

    isCustom: empty('ndc'),

    hasProliaPermanentPlacelink: computed('associatedProgram', function () {
        const associatedProgram = this.get('associatedProgram');
        if (associatedProgram && associatedProgram.findBy('name', 'proliaAesiMedicationHistory')) {
            return true;
        }
        return false;
    }),
    /**
     * Adds a comment to the TranscriptMedication specified
     * if no transcript medication exists it will create a new one
     * if no transcriptGuid is specified, it will use the default one
     */
    addComment(comment, transcriptGuid) {
        const transcriptMedication = transcriptGuid ?
            this.attachToEncounter(transcriptGuid) :
            this.createDefaultTranscriptMedication();
        set(transcriptMedication, 'comment', comment);
    },
    getTranscriptMedication(transcriptGuid) {
        const transcriptMedications = this.getWithDefault('transcriptMedications', []);

        if (!transcriptGuid) {
            return transcriptMedications.find(transcriptMedication => {
                const guid = get(transcriptMedication, 'transcriptGuid');
                return guid === null || guid === undefined;
            });
        }
        return transcriptMedications.findBy('transcriptGuid', transcriptGuid);
    },
    attachToEncounter(transcriptGuid) {
        if (isEmpty(transcriptGuid)) {
            return;
        }
        return this._createTranscriptMedication(transcriptGuid);
    },
    createDefaultTranscriptMedication() {
        return this._createTranscriptMedication();
    },
    detachFromEncounter(transcriptGuid) {
        // delete the transcriptMedication to detach
        // TODO: Review with Danny how to do this.
        if (isEmpty(transcriptGuid)) {
            return;
        }
        const transcriptMedication = this.getTranscriptMedication(transcriptGuid);
        this.get('transcriptMedications').removeObject(transcriptMedication);
    },

    isEncounterMed(transcriptGuid) {
        return this.get('transcriptMedications').isAny('transcriptGuid', transcriptGuid);
    },

    medicationComment: computed('transcriptMedications.@each.transcriptGuid', function () {
        return this.getTranscriptMedication();
    }),
    filteredEncounterComments: computed('transcriptMedications.[]', 'medicationComment', function () {
        const medicationComment = this.get('medicationComment');
        return this.getWithDefault('transcriptMedications', []).reject(transcriptMedication => transcriptMedication === medicationComment);
    }),
    encounterCommentsSortProperties: computed(() => ['dateOfService:desc']),
    encounterComments: sort('filteredEncounterComments', 'encounterCommentsSortProperties'),
    encounterCommentsWithComment: computed('encounterComments.@each.comment', function () {
        return this.get('encounterComments').filterBy('comment');
    }),

    /**
     * Consider using fullGenericName instead. Only use this if you need to fomat differently the name and the individual
     * components (strength, route, dose).
     * Returns GenericName (TradeName)
     */
    genericAndTradeName: computed('tradeName', 'genericName', 'isGeneric', 'isMedicalSupply', function () {
        const tradeName = this.get('tradeName');
        const genericName = this.get('genericName');
        if (this.get('isGeneric') || this.get('isMedicalSupply') || !genericName || genericName === tradeName) {
            return tradeName;
        }
        return `${genericName} (${tradeName})`;
    }),

    fullGenericName: computed('tradeName', 'productStrength', 'route', 'doseForm', function () {
        return [this.get('genericAndTradeName'), this.get('productStrength'), this.get('route'), this.get('doseForm')].join(' ');
    }),

    // SIN-2883 - Filter oral, liquid medications so that only mL allowed
    isOralLiquidMedication: computed('route', 'doseForm', function () {
        const routeIsOral = this.get('route') && this.get('route').toLowerCase() === 'oral';
        const doseForm = this.get('doseForm');
        const doseFormIsLiquid = LIQUID_DOSE_FORMS.some(form => doseForm === form);
        return routeIsOral && doseFormIsLiquid;
    }),

    _createTranscriptMedication(transcriptGuid) {
        const transcriptMedications = this.getWithDefault('transcriptMedications', []);
        let transcriptMedication = this.getTranscriptMedication(transcriptGuid);
        if (isEmpty(transcriptMedication)) {
            transcriptMedication = { transcriptGuid };
            transcriptMedications.pushObject(transcriptMedication);
        }
        this.set('transcriptMedications', transcriptMedications);

        return transcriptMedication;
    },

    diagnosis: computed('diagnosisGuid', function () {
        const diagnosisGuid = this.get('diagnosisGuid');
        const diagnosisPromise = diagnosesRepository.getDiagnoses(this.get('patientPracticeGuid'))
                .then(diagnoses => diagnoses.findBy('diagnosisGuid', diagnosisGuid));

        return PromiseObject.create({ promise: diagnosisPromise });
    }),

    duplicates: computed(() => []),
    updateDuplicates(duplicates) {
        const oldDuplicates = this.get('duplicates');
        if (isEmpty(oldDuplicates) && isEmpty(duplicates)) {
            return;
        }
        this.set('duplicates', duplicates);
    }
});

Medication.reopenClass({
    wrap(objectOrArray) {
        if (objectOrArray instanceof Medication) {
            return objectOrArray;
        } else if (isArray(objectOrArray)) {
            objectOrArray = objectOrArray.map(item => Medication.wrap(item));
            return MedicationsArray.create({ content: objectOrArray });
        } else {
            transcriptComments.setTranscriptCommentDates(get(objectOrArray, 'patientPracticeGuid'), get(objectOrArray, 'transcriptMedications') || []);
            set(objectOrArray, 'transcriptMedications', objectOrArray.transcriptMedications || []);
            return Medication.create({ content: objectOrArray });
        }
    }
});

export default Medication;
