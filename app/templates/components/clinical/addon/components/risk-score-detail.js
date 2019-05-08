import { isEmpty } from '@ember/utils';
import { alias, notEmpty } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import LGTM from 'common/helpers/validation';
import Validatable from 'ember-lgtm/mixins/validatable';
import forumLinks from 'boot/util/forum-links';

export default Component.extend(Validatable, {
    analytics: service(),
    resizables: computed(() => []),

    riskScore: alias('patientRiskScore.riskScore.riskScore'),
    riskScoreType: alias('patientRiskScore.riskScore.optionGuid'),
    dateAssigned: alias('patientRiskScore.riskScore.dateAssigned'),
    dateMax: moment(new Date()).format('MM/DD/YYYY'),
    canDelete: notEmpty('persistedRiskScore.optionGuid'),
    riskScoreHelpHtml: `Document patient risk score for six common risk score types or enter practice-specific risk scores. <a href="${forumLinks.getHelpUrlForPath('pf.charts.patients.summary.risk-score')}" target="_blank">Learn more</a>`,
    showDeleteConfirm: false,
    validator: LGTM.validator()
        .validates('riskScoreType').required('Please select a risk score type')
        .validates('riskScore')
            .required('Please enter a numeric risk score')
            .using((value) => {
                return /^\d{1,3}(\.\d{0,3})?$/.test(value);
            }, 'Scores are limited to positive numbers below 1000 with up to 3 decimal places')
        .validates('dateAssigned')
            .required('Date assigned is required')
            .isDate('Please enter a valid date')
            .using((value) => {
                return moment(value) <= moment();
            }, 'Cannot select a future date')
        .build(),

    actions: {
        delete() {
            this.set('showDeleteConfirm', true);
            this.sendAction('delete');
        },
        showDelete() {
            this.set('showDeleteConfirm', true);
        },
        save() {
            const patientRiskScore = this.get('patientRiskScore');
            this.validate().then((isValid) => {
                if (isEmpty(patientRiskScore) || !isValid) {
                    return;
                }
                this.get('analytics').track('Save Patient Risk Score');
                this.sendAction('save');
            });
        },
        cancel() {
            this.sendAction('cancel');
        },
        closeDeleteConfirm() {
            this.set('showDeleteConfirm', false);
        }
    }
});
