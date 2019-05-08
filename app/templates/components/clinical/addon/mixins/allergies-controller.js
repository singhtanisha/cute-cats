import Mixin from '@ember/object/mixin';
export default Mixin.create({
    isEditingAllergy: false,
    showAllergyDetails(allergy) {
        const transcriptGuid = this.get('transcriptGuid');
        const patientPracticeGuid = allergy ? allergy.get('patientPracticeGuid') : this.get('patientGuid');
        const allergyGuid = allergy ? allergy.get('allergyGuid') : 'new';

        if (transcriptGuid) {
            this.transitionToRoute('encounter.allergy', patientPracticeGuid, transcriptGuid, allergyGuid);
        } else {
            this.transitionToRoute('summary.allergy', patientPracticeGuid, allergyGuid);
        }
    },
    actions: {
        createAllergy() {
            this.showAllergyDetails();
        },
        editAllergy(allergy) {
            this.showAllergyDetails(allergy);
        },
        closeAllergyPane() {
            if (this.get('currentDetailsPaneProperty') === 'isEditingAllergy') {
                this.set('currentDetailsPaneProperty', null);
            }
        },
        loadedAllergies(allergies) {
            this.set('allergies', allergies);
        }
    }
});
