import selectOptions from 'clinical/models/assessments/prolia-aesi-select-options';
export default {
    assessmentToken: {
        name: 'proliaAesiModal',
        version: 0.01
    },
    proliaMedicationHistory: {
        options: selectOptions,
        value: null,
        selection: null,
        type: 'patientHistory',
        questionToken: 'proliaMedicationHistory'
    },
    proliaAnyAesi: {
        isSelected: false,
        type: 'yesNo',
        questionToken: 'proliaAnyAesi'
    },
    proliaAesiHypocalcemia: {
        isSelected: false,
        type: 'yesNo',
        questionToken: 'proliaAesiHypocalcemia'
    },
    proliaAesiOsteonecrosisOfTheJaw: {
        isSelected: false,
        type: 'yesNo',
        questionToken: 'proliaAesiOsteonecrosisOfTheJaw'
    },
    proliaAesiAtypicalFemoralFractures: {
        isSelected: false,
        type: 'yesNo',
        questionToken: 'proliaAesiAtypicalFemoralFractures'
    },
    proliaAesiSeriousInfections: {
        isSelected: false,
        type: 'yesNo',
        questionToken: 'proliaAesiSeriousInfections'
    },
    proliaAesiDermatologicReactions: {
        isSelected: false,
        type: 'yesNo',
        questionToken: 'proliaAesiDermatologicReactions'
    },
    proliaLinkClicked: {
        isSelected: false,
        type: 'yesNo',
        questionToken: 'proliaLinkClicked',
        isVisible: false
    }
};
