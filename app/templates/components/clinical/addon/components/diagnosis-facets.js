import { isEmpty } from '@ember/utils';
import Component from '@ember/component';
import { get, computed } from '@ember/object';
import DiagnosesArray from 'clinical/models/diagnoses-array';

export default Component.extend({
    classNames: ['diagnosis-facets-popover', 'popover', 'left', 'popover-modal'],

    // attrs
    diagnoses: computed(function () {
        return [];
    }),
    selectedConstraints: computed('diagnoses', function () {
        return [];
    }),
    // actions: constraintsChanged(filteredDiagnoses)

    selectedConstraintIds: computed('selectedConstraints.@each.id', function () {
        return this.get('selectedConstraints').mapBy('id');
    }),
    filteredDiagnoses: computed('selectedConstraints.[]', 'diagnoses.[]', function () {
        var constraints = this.get('selectedConstraints'),
            diagnoses = this.get('diagnoses');
        if (isEmpty(constraints)) {
            return diagnoses;   // No need to filter
        }
        // NOTE: we get the content, since _.isArray doesn't work with Ember's ArrayProxy and it's used by interesection
        diagnoses = constraints.mapBy('diagnoses.content');
        // Diagnoses is an array of arrays, so we need to apply when getting the intersection
        diagnoses = _.intersection.apply(null, diagnoses);
        diagnoses = _.unique(diagnoses);
        return DiagnosesArray.createArray(diagnoses);
    }),

    actions: {
        constraintClicked(isChecked, constraint) {
            var constraints = this.get('selectedConstraints');
            if (isChecked) {
                constraints.pushObject(constraint);
            } else {
                constraints.removeObject(constraints.findBy('id', get(constraint, 'id')));
            }
            this.sendAction('constraintsChanged', this.get('filteredDiagnoses'));
        }
    }
});
