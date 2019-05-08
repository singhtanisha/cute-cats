import LGTM from 'common/helpers/validation';
export default {
    validator: LGTM.validator()
        .validates('proliaMedicationHistory')
            .using('proliaMedicationHistory', function(history) {
                return history.selection;
            }, 'Prolia history check is required')
        .validates('proliaAnyAesi')
            .required('Record any of the following adverse events is required')
            .using('proliaAnyAesi.isSelected', 'proliaAesiHypocalcemia.isSelected',
                'proliaAesiOsteonecrosisOfTheJaw.isSelected', 'proliaAesiAtypicalFemoralFractures.isSelected',
                'proliaAesiSeriousInfections.isSelected', 'proliaAesiDermatologicReactions.isSelected',
                function(isAny, hypocalcemia, jaw, femoral, infections, reactions) {
                    return !isAny || (hypocalcemia || jaw || femoral || infections || reactions);
                }, 'At least one adverse event is required')
        .build(),

    getCompletionState: model => {
        let isComplete = model && (!model.get('proliaAnyAesi.isSelected') || model.get('proliaLinkClicked.isSelected')),
            completeMessage = 'Thank you, reporting for Prolia Safety Program complete',
            incompleteMessage = {
                title: 'Adverse event saved',
                heading: 'Adverse events still need to be reported',
                body: 'A task will be saved to your task list to complete later. Please complete this task as soon as possible.'
            };

        return {
            isComplete: isComplete,
            message: isComplete ? completeMessage : incompleteMessage
        };
    },
    enforceChangeLogic: (key, model) => {
        let changedProperty = model.get(key),
            value = changedProperty.type === 'yesNo' ? !changedProperty.isSelected : changedProperty.value,
            changeSettings = [],
            eventsKeys = [
                'proliaAesiHypocalcemia',
                'proliaAesiOsteonecrosisOfTheJaw',
                'proliaAesiAtypicalFemoralFractures',
                'proliaAesiSeriousInfections',
                'proliaAesiDermatologicReactions'
            ];

        if(key === 'proliaMedicationHistory' && value === 'PreviousHistory') {
            changeSettings.push({property:'proliaAnyAesi.isSelected', value: false});
            eventsKeys.forEach(event => {
                changeSettings.push({property:`${event}.isSelected`, value: false});
            });
        }
        if(key === 'proliaAnyAesi' && !value) {
            eventsKeys.forEach(event => {
                changeSettings.push({property:`${event}.isSelected`, value: false});
            });
        }
        if(eventsKeys.indexOf(key) > -1 && value) {
            changeSettings.push({property:'proliaAnyAesi.isSelected', value: true});
        }
        if(key !== 'proliaLinkClicked') {
            let showLink = false;
            eventsKeys.forEach(eventKey => {
                if((key !== eventKey && model.get(`${eventKey}.isSelected`)) || ((key === eventKey) && value)) {
                    showLink = true;
                }
            });
            changeSettings.push({ property: 'proliaLinkClicked.isVisible', value: showLink});
        }

        return changeSettings;
    },
};
