import { on } from '@ember/object/evented';
import { computed, observer, get } from '@ember/object';
import { alias, not, or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import WithPatientPrintTitleMixin from 'charting/mixins/with-patient-print-title';
import { task } from 'ember-concurrency';

export default Component.extend(WithPatientPrintTitleMixin, {
    routing: service('pf-routing'),

    patientPracticeGuid: alias('patient.patientPracticeGuid'),
    patientSummary: alias('patient'),
    displayName: 'Advance directives',
    isNotAllowedToEditSummary: not('isAllowedToEditSummary'),
    hideEdit: or('isLoading', 'error', 'isNotAllowedToEditSummary'),

    isLoading: alias('loadAdvanceDirectives.isRunning'),

    defaultMessage: computed('isLoading', 'error', function() {
        if (this.get('isLoading')) {
            return 'Loading advance directives...';
        }

        if (this.get('error')) {
            return 'Could not load advance directives. Try again later.';
        }

        return 'No advance directives recorded';
    }),

    patientDidChange: observer('patientPracticeGuid', on('init', function () {
        const patientPracticeGuid = this.get('patientPracticeGuid');

        if (patientPracticeGuid) {
            this.get('loadAdvanceDirectives').perform(patientPracticeGuid);
        }
    })),

    loadAdvanceDirectives: task(function * (patientPracticeGuid) {
        // Clears current advancedDirectives (in case we were looking at another patient)
        this.setProperties({
            error: false,
            advancedDirectives: null
        });

        try {
            const advanceDirectives = yield this.get('store').query('advanced-directive', { patientPracticeGuid });

            this.setProperties({
                error: false,
                advanceDirectives: advanceDirectives.toArray()
            });
        } catch(e) {
            this.setProperties({
                error: true,
                advanceDirectives: null
            });
        }
    }).restartable(),

    actions: {
        edit(ad) {
            const advanceDirectiveRecord = ad ? ad : this.get('store').createRecord('advanced-directive', {
                dateOfService: moment().startOf('day').toDate(),
                patientPracticeGuid: this.get('patientPracticeGuid')
            });

            this.get('routing').transitionToRoute('summary.advanceDirective', get(advanceDirectiveRecord, 'patientPracticeGuid'), advanceDirectiveRecord);
        },
        print() {
            this.get('store').findRecord('patient', this.get('patientPracticeGuid')).then(() => {
                this.sendAction('printAudit', 'AdvanceDirectives');
                this.set('isPrintPreviewVisible', true);
            });
        },
        refresh() {
            const advancedDirectives = this.get('store').peekAll('advanced-directive');

            this.set('advanceDirectives', advancedDirectives.filterBy('patientPracticeGuid', this.get('patientPracticeGuid')));
        }
    }
});
