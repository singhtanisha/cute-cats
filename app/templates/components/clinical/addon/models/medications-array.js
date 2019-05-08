import { on } from '@ember/object/evented';
import { computed, observer } from '@ember/object';
import ArrayProxy from '@ember/array/proxy';
import MedicationEncounter from 'clinical/models/medication-encounter';

/**
 * Wraps every object in a MedicationModel and provides helper functions to modify the array
 */
const MedicationsArray = ArrayProxy.extend({
    /**
     * Replaces the medication if one with the same medicationGuid already exists or adds one if not
     */
    replaceMedication(medication) {
        const content = this.get('content');
        const medicationToReplace = content.findBy('medicationGuid', medication.get('medicationGuid'));
        const medicationToReplaceIndex = content.indexOf(medicationToReplace);

        if (medicationToReplaceIndex !== -1) {
            content.replace(medicationToReplaceIndex, 1, [medication]);
        } else {
            content.pushObject(medication);
        }
    },
    removeMedication(medication) {
        const content = this.get('content');
        const medicationToDelete = content.findBy('medicationGuid', medication.get('medicationGuid'));
        content.removeObject(medicationToDelete);
    },

    encounterMedications(transcriptGuid) {
        return MedicationEncounter.wrap(this, transcriptGuid);
    },
    active: computed('@each.isHistorical', function () {
        return this.rejectBy('isHistorical');
    }),
    historical: computed('@each.isHistorical', function () {
        return this.filterBy('isHistorical');
    }),
    withoutDiagnosis: computed('@each.diagnosisGuid', function () {
        return MedicationsArray.create({content: this.rejectBy('diagnosisGuid')});
    }),

    noKnownMedications: false,
    updateNoKnownMedications: observer('content.[]', function () {
        // If the content of the array changed we reset this back to false
        this.set('noKnownMedications', false);
    }),

    /**
     * Object of groups of current meds keyed by ndc
     */
    currentByNdc: computed('@each.ndc', '@each.isCurrent', function () {
        return _.groupBy(this.filterBy('isCurrent').rejectBy('isCustom'), med => med.get('ndc'));
    }),
    /**
     * Array of array of all the groups with duplicates (more than 1 by NDC)
     */
    groupOfDuplicates: computed('currentByNdc.[]', function () {
        const groupedMedsByNdcObject = this.get('currentByNdc');
        const arrayOfDuplicates = Object.keys(groupedMedsByNdcObject).map(key =>
            // It's only a dup if we have more than 1.
            groupedMedsByNdcObject[key].length > 1 ? groupedMedsByNdcObject[key] : null
        );
        return arrayOfDuplicates.compact();
    }),
    updateDuplicates: on('init', observer('content', 'currentByNdc.[]', function () {
        const currentByNdc = this.get('currentByNdc');
        this.forEach(medication => medication.updateDuplicates(this.getDuplicatesForMedication(medication, currentByNdc)));
    })),
    getDuplicatesForMedication(medication, groupedMedsByNdc) {
        if (medication.get('isCurrent')) {
            const currentByNdc = groupedMedsByNdc || this.get('currentByNdc');
            const sameNdc = currentByNdc[medication.get('ndc')] || [];
            // Removes itself from the list of duplicates.
            return sameNdc.rejectBy('medicationGuid', medication.get('medicationGuid'));
        }
        return [];
    }
});

export default MedicationsArray;
