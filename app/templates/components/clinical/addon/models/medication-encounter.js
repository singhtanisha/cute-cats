import { isArray } from '@ember/array';
import { on } from '@ember/object/evented';
import ArrayProxy from '@ember/array/proxy';
import { computed } from '@ember/object';
import ObjectProxy from '@ember/object/proxy';
const MedicationEncounter = ObjectProxy.extend({
    transcriptGuid: '',
    isEncounterMed: computed('content.transcriptMedications.[]', function () {
        const transcriptGuid = this.get('transcriptGuid');
        return this.get('transcriptMedications').isAny('transcriptGuid', transcriptGuid);
    })
});

const MedicationEncounterArray = ArrayProxy.extend({
    // TODO: consider patching ember to fix issue with ArrayProxy or override replaceContent
    // objectAtContent: function (idx) {
    //     var medication = this.get('content').objectAt(idx);
    //     return MedicationEncounter.wrap(medication, this.get('transcriptGuid'));
    // },
    // replaceContent: function (idx, amt, objects) {
    //     objects = objects ? objects.mapBy('content') : objects;
    //     this.get('content').replace(idx, amt, objects);
    // },
    inEncounter: computed('@each.isEncounterMed', function () {
        return MedicationEncounter.wrap(this.filterBy('isEncounterMed'));
    }),
    notInEncounter: computed('@each.isEncounterMed', function () {
        return MedicationEncounter.wrap(this.rejectBy('isEncounterMed'));
    }),
    active: computed('@each.isHistorical', function () {
        return MedicationEncounter.wrap(this.rejectBy('isHistorical'));
    }),

    historical: computed('@each.isHistorical', function () {
        return MedicationEncounter.wrap(this.filterBy('isHistorical'));
    }),

    _refreshContent: on('init', function () {
        const originalContent = this.get('originalContent') || [];
        const transcriptGuid = this.get('transcriptGuid');
        this.set('content', originalContent.map(medication => MedicationEncounter.wrap(medication, transcriptGuid)));
    }).observes('originalContent.[]')
});

MedicationEncounter.reopenClass({
    wrap(objectOrArray, transcriptGuid) {
        if (objectOrArray instanceof MedicationEncounter) {
            return objectOrArray;
        } else if (isArray(objectOrArray)) {
            return MedicationEncounterArray.create({
                content: [],
                originalContent: objectOrArray,
                transcriptGuid
            });
        }
        return MedicationEncounter.create({ content: objectOrArray, transcriptGuid });
    }
});

export default MedicationEncounter;

