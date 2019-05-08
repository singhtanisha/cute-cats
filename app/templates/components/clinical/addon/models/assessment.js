import { isPresent } from '@ember/utils';
import { copy } from '@ember/object/internals';
import { equal } from '@ember/object/computed';
import { on } from '@ember/object/evented';
import ObjectProxy from '@ember/object/proxy';
var Assessment = ObjectProxy.extend({
    status: 'NotStarted',
    source: 'Unspecified',
    questionKeys: null,
    _init: on('init', function() {
        const content = this.get('content');
        this.set('questionKeys', content ? Object.keys(content).removeObject('assessmentToken').removeObject('nextAssessment') : []);
    }),
    isDismissed: equal('status', 'Dismissed'),
    isComplete: equal('status', 'Complete'),

    toAssessmentObject() {
        let obj = this.getProperties('assessmentToken', 'status', 'source', 'patientPracticeGuid', 'transcriptGuid', 'medicationGuid', 'cdsAlertEventGuid');
        obj.responses = this.getResponses();
        return obj;
    },
    getResponses() {
        return this.get('questionKeys').map(key => {
            let response = this.get(key),
                answerToken;

            if (response.type === 'yesNo') {
                answerToken = [ response.isSelected ? 'yes' : 'no' ];
            } else {
                let tokenValue = response.value || (response.selection ? response.selection.value : null);
                answerToken = tokenValue ? [ tokenValue ] : null;
            }

            if (answerToken) {
                return {
                    answerToken: answerToken,
                    questionToken: response.questionToken || key
                };
            }
            return null;
        }).compact();
    },
    getNextAssessment(triggerIfDismissed) {
        let assessment = this.get('content.nextAssessment'),
            conditions = this.get('content.nextAssessment.triggerConditions'),
            defaultKeys = this.get('content.nextAssessment.defaultKeys');

        if(!assessment || !assessment.token) { return null; }

        // Match conditions - multiple conditions are AND, values for each ar OR
        if(!triggerIfDismissed || !this.get('isDismissed')) {
            if(conditions && conditions.length > 0) {
                let meetsConditions = conditions.map(condition => {
                    let triggerProperty = this.get(`content.${condition.property}`),
                        triggerValue = (triggerProperty.type === 'yesNo' ? triggerProperty.isSelected : triggerProperty.value);
                    return condition.values.indexOf(triggerValue) > -1;
                });
                if(!meetsConditions.every(condition => condition)) { return null; }
            }
        }

        return {
            token: assessment.token,
            defaultSettings: defaultKeys.map(key => {
                let response = this.get(key);
                if(!response) { return null; }
                if (response.type === 'yesNo') {
                    return {
                        key: key,
                        property: 'isSelected',
                        value: response.isSelected
                    };
                }
                return {
                    key: key,
                    property: 'value',
                    value: response.value
                };
            }).compact()
        };
    }
});

Assessment.reopenClass({
    wrap(modelTemplate, patientPracticeGuid, defaults) {
        return Assessment.create({
            content: copy(this.setDefaults(modelTemplate, defaults), true),
            patientPracticeGuid: patientPracticeGuid
        });
    },
    setDefaults(model, defaults) {
        if(isPresent(defaults)) {
            defaults.forEach(setting => {
                if(model[setting.key]) {

                    model[setting.key][setting.property] = setting.value;
                    if(setting.property === 'value') {
                        let options = model[setting.key].options;
                        if(options && options.length > 0) {
                            model[setting.key].selection = options.find(option => {
                                return option.value === setting.value;
                            });
                        }
                    }
                }
            });
        }
        return model;
    }
});

export default Assessment;
