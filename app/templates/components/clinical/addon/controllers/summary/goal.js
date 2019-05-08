import EmberObject from '@ember/object';
import Controller from '@ember/controller';
import LGTM from 'common/helpers/validation';
import Validatable from 'ember-lgtm/mixins/validatable';

export default Controller.extend(Validatable, {
    isValid: true,
    validGoal() {
        const goal = this.get('model');

        return this.validator.validate(goal).then(result => {
            const { errors, valid } = result;
            let error;

            this.set('errors', EmberObject.create());
            if(!valid) {
                for (error in errors) {
                    if (errors[error].length) {
                        this.get('errors').set(error, errors[error][0]);
                    }
                }
            }
            this.set('isValid', valid);
            return valid;
        });
    },

    validator: LGTM.validator()
        .validates('description')
            .required('Enter a goal')
        .validates('effectiveDate')
            .required('Enter a date')
            .isDate('Please enter a valid date')
            .isDateAfter1753('Before the allowable range')
        .build()
});
