export default [
    { property: 'proliaMedicationHistory', group:'Prolia History', label: 'Past and/or current medication', value: 'PreviousHistory', showAdverseEffects: true, launchNextAssessment: true},
    { property: 'proliaMedicationHistory', group:'Prolia History', label: 'New medication for patient', value: 'NoPreviousHistory', statusText: 'No assessment needed. Patient has no Prolia history.' },
    { property: 'proliaMedicationHistory', group:'Other Options', label: 'Patient unsure', value: 'UnsureHistory', statusText: 'No assessment needed. Patient must be sure of Prolia history.' },
    { property: 'proliaMedicationHistory', group:'Other Options', label: 'Provider declined to ask', value: 'HistoryNotAsked', statusText: 'Patient\'s Prolia history is required to complete assessment.' },
    { property: 'proliaMedicationHistory', group:'Other Options', label: 'Historical data present, Prolia never taken', value: 'HistoryInvalid', statusText: 'No assessment needed. Patient has no Prolia history.' }
];
