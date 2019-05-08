import { isEmpty } from '@ember/utils';
import EmberObject, { get, set } from '@ember/object';
import { makeArray } from '@ember/array';
import config from 'boot/config';
import PFServer from 'boot/util/pf-server';
import medicationsRepository from 'clinical/repositories/medications';

const SEVERITY_SORT_MAP = {
    major: 0,
    severe: 1,
    duplicatetherapy: 1,
    moderate: 2,
    mild: 3,
    'very mild': 4,
    minor: 5,
    unknown: 6
};

export default {
    loadInteractionAlerts(patientGuid, medicationObjectOrArray) {
        const url = `${config.clinicalBaseURL_v2}Interactions/${patientGuid}?duplicateTherapiesCheckEnabled=true`;
        const medicationsArray = makeArray(medicationObjectOrArray);
        const input = { drugInputs: medicationsArray };

        return PFServer.promise(url, 'POST', input).then(interactions => {
            return medicationsRepository.loadMedications(patientGuid).then(medications => {
                interactions.drugInteractionAlerts.forEach(drugInteraction => {
                    drugInteraction.drugsInvolved.forEach(drug => {
                        const medicationGuid = get(drug, 'patientMedicationGuid');
                        const patientMedication = medications.findBy('medicationGuid', medicationGuid);

                        set(drug, 'patientMedication', patientMedication);
                    });
                });

                return interactions;
            });
        });
    },

    loadInteractionAlertsByMedication(patientGuid, medication) {
        return this.loadInteractionAlerts(patientGuid, medication.get('content'))
            .then(response => {
                // We need to fix that data structure since both drug and allergies array is a little different.
                let data = this.fixInteractionData(response);
                data = this.fixDrugsInvolved(data, medication);

                return {
                    interactions: data.drugInteractionAlerts.concat(data.drugAllergyAlerts),
                    drugAlertErrors: data.drugAlertErrors
                };
            }, () => {
                throw new Error('Unable to load interactions.');
            });
    },

    loadInteractionAlertsByOrderItems(patientGuid, orderItems) {
        const medications = orderItems.mapBy('prescription').map(prescription => ({
            ndc: prescription.drugCode,
            rxNormCui: prescription.rxNormCui,
            drugName: prescription.medicationName,
            medicationGuid: prescription.medicationGuid
        }));

        return this.loadInteractionAlerts(patientGuid, medications).then((data) => {
            const orderItemDrugInteractionAlerts = medications.map((medication) => {
                const drugInteractionAlerts = $.extend(true, [], data.drugInteractionAlerts);
                const { ndc, medicationGuid } = medication;

                drugInteractionAlerts.forEach(interaction => {
                    const matchingDrugInvoled = interaction.drugsInvolved.find(drug => {
                        return drug.ndc === ndc || drug.patientMedicationGuid === medicationGuid;
                    });

                    interaction.otherDrugsInvolved = [];

                    if (matchingDrugInvoled) {
                        interaction.matchingDrugInvoled = matchingDrugInvoled;

                        if (interaction.severity.toLowerCase() === 'duplicatetherapy') {
                            interaction.otherDrugsInvolved = this.fixDuplicateTherapyDrugsInvolved(interaction.drugsInvolved, ndc, medicationGuid);
                        } else {
                            interaction.otherDrugsInvolved = interaction.drugsInvolved.reject(drug => {
                                return (drug.ndc === ndc || drug.patientMedicationGuid === medicationGuid);
                            });
                        }
                    }
                });

                return {
                    medicationGuid: medication.medicationGuid,
                    drugInteractionAlerts
                };
            });

            return {
                drugAlertErrors: data.drugAlertErrors,
                drugAllergyAlerts: data.drugAllergyAlerts,
                orderItemDrugInteractionAlerts
            };
        });
    },

    loadInteractionAlertsByRefillRequest(patientGuid, refill) {
        const medication = {
            ndc: refill.get('dispensedMedicationProductCode'),
            drugName: refill.get('dispensedMedicationName'),
            rxNormCui: refill.get('matchedPatientMedication.rxNormCui'),
            medicationGuid: refill.get('matchedPatientMedication.medicationGuid')
        };

        return this.loadInteractionAlerts(patientGuid, medication).then(data => {
            let fixedData = this.fixInteractionData(data);
            fixedData = this.fixDrugsInvolved(fixedData, EmberObject.create(medication));

            return {
                interactions: fixedData.drugInteractionAlerts.concat(fixedData.drugAllergyAlerts),
                drugAlertErrors: fixedData.drugAlertErrors
            };
        });
    },

    loadInteractionAlertsReasonsToOverride() {
        return PFServer.promise(`${config.clinicalBaseURL_v2}Interactions/Reasons`, 'GET');
    },

    resolveInteractionAlertsByOrderItems(patientGuid, orderItems) {
        const interactions = orderItems.map(item => item.get('interactions')).reduce((prev, curr) => {
            return prev.concat(curr);
        });
        return this.resolveInteractionAlerts(patientGuid, interactions);
    },

    resolveInteractionAlertsByRefillRequest(refill) {
        const patientGuid = refill.get('patientPracticeGuid');
        const interactions = refill.get('interactions');
        return this.resolveInteractionAlerts(patientGuid, interactions);
    },

    fixInteractionData(data) {
        // set the type
        data.drugInteractionAlerts.forEach(item => {
            const severityLowerCase = item.severity.toLowerCase();

            item.interactionType = 'Drug';
            item.isDuplicateTherapy = severityLowerCase === 'duplicatetherapy';
            item.severitySort = SEVERITY_SORT_MAP[severityLowerCase];
        });

        data.drugAllergyAlerts.forEach(item => {
            const [involvedAllergy] = item.allergiesInvolved;
            item.interactionType = 'Allergy';
            item.reactions = this.getReactions(involvedAllergy.allergyReactions);
            item.severitySort = SEVERITY_SORT_MAP[involvedAllergy.allergySeverity.title.toLowerCase()];
        });

        return data;
    },

    fixDrugsInvolved(data, medication) {
        const { ndc, medicationGuid } = medication.getProperties('ndc', 'medicationGuid');

        data.drugInteractionAlerts.forEach(item => {
            if (item.severity.toLowerCase() === 'duplicatetherapy') {
                item.drugsInvolved = this.fixDuplicateTherapyDrugsInvolved(item.drugsInvolved, ndc, medicationGuid);
            } else {
                item.drugsInvolved = item.drugsInvolved.reject(drug => {
                    return (drug.ndc === ndc || drug.patientMedicationGuid === medicationGuid);
                });
            }
        });

        // We reject interactions with no drugs involved after the above filtering
        data.drugInteractionAlerts = data.drugInteractionAlerts.rejectBy('drugsInvolved.length', 0);

        return data;
    },

    fixDuplicateTherapyDrugsInvolved(drugsInvolved, currentNdc, currentMedicationGuid) {
        if (drugsInvolved.length > 1) {
            // If all the drugs involved have the same ndc, remove duplicates
            if (drugsInvolved.isEvery('ndc', currentNdc)) {
                drugsInvolved = [drugsInvolved[0]];
            } else {
                // Group duplicate ndcs in the same alert
                const ndcGroups = _.groupBy(drugsInvolved, drug => drug.ndc);

                drugsInvolved = Object.keys(ndcGroups).map(ndc => ndcGroups[ndc][0]);

                // Some of the drugs involved have a different ndc, filter out ndc matches
                drugsInvolved = drugsInvolved.reject(drug => {
                    return (drug.ndc === currentNdc || drug.patientMedicationGuid === currentMedicationGuid);
                });
            }
        }

        return drugsInvolved;
    },
    getReactions(reactions) {
        if (isEmpty(reactions)) {
            return reactions;
        }
        return `(${reactions.mapBy('title').join(', ')})`;
    },

    resolveInteractionAlerts(patientGuid, interactions) {
        const url = `${config.clinicalBaseURL_v2}Interactions/${patientGuid}/Overrides`;
        const drugInteractionAlerts = [];
        const drugAllergyAlerts = [];

        interactions.forEach(interaction => {
            if (!isEmpty(interaction.get('reasonToOverride'))) {
                const interractionType = (interaction.type || interaction.interactionType || '').toLowerCase();
                const inputArray = (interractionType === 'drug') ? drugInteractionAlerts : drugAllergyAlerts;
                inputArray.push(interaction.serialize());
            }
        });

        return PFServer.promise(url, 'POST', {
            drugInteractionAlerts,
            drugAllergyAlerts
        });
    }
};
