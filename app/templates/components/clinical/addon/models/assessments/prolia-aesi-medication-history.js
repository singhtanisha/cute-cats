import config from 'boot/config';
import selectOptions from 'clinical/models/assessments/prolia-aesi-select-options';
export default {
    assessmentToken: {
        name: 'proliaAesiMedicationHistory',
        version: 0.01
    },
    nextAssessment: {
        token: {
            name: 'proliaAesiModal',
            version: 0.01
        },
        triggerConditions: [
            {
                property: 'proliaMedicationHistory',
                values: [null, 'PreviousHistory']
            }
        ],
        defaultKeys: [
            'proliaMedicationHistory'
        ]
    },
    proliaMedicationHistory: {
        options: selectOptions,
        value: null,
        selection: null,
        type: 'patientHistory',
        questionToken: 'proliaMedicationHistory',
        popoverContent: `<div>Your participation helps improve the long-term safety of patients on Prolia.</div><a href="${config.proliaLearnMoreUrl}" target="_blank">Learn more</a>`
    }
};
