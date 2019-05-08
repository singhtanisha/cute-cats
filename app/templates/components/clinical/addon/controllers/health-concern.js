import EmberObject from '@ember/object';
import { Promise } from 'rsvp';
import Controller from '@ember/controller';
import LGTM from 'common/helpers/validation';

export default Controller.extend({
    validate() {
        return new Promise((resolve, reject) => {
            this.validator.validate(this.get('model')).then(result => {
                const { errors, valid } = result;
                this.set('errors', EmberObject.create());
                if (valid) {
                    resolve(valid);
                } else {
                    Object.keys(errors).forEach(key => {
                        this.set(`errors.${key}`, errors[key][0]);
                    });
                    reject();
                }
            });
        });
    },
    validator: LGTM.validator()
        .validates('effectiveDate')
            .required('Enter a date')
            .isDate('Please enter a valid date')
            .isDateAfter1753('Before the allowable range')
        .build(),
    actions: {
        cancel() {
            this.send('cancelHealthConcern');
        },
        save(addAnother) {
            this.send('saveHealthConcern', addAnother);
        },
        delete() {
            this.send('deleteHealthConcern');
        }
    }
});
