import { alias } from '@ember/object/computed';
import Component from '@ember/component';
export default Component.extend({
    classNames: ['duplicate-medication-alert'],

    isEditing: false,
    newMedicationFromSearchResult: null,

    medicationDuplicates: alias('newMedicationFromSearchResult.duplicates')
});
