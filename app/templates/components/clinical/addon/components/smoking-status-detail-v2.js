import { isPresent } from '@ember/utils';
import { alias, or } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
export default Component.extend({
    tunnel: service(),
    analytics: service(),

    bigHeaderText: computed('isAllowedToEdit', function() {
        return this.get('isAllowedToEdit') ? 'Record' : 'Review';
    }),
    smallHeaderText: 'Tobacco use',
    maxDate: moment(new Date()).format('MM/DD/YYYY'),
    patientPracticeGuid: alias('smokingStatus.patientPracticeGuid'),
    showUndo: computed('selectedValueImage', 'inActiveSmokingStatusType', 'isDirty', function() {
        // when user change the selection from old options to new options, don't show UNDO
        if (isPresent(this.get('inActiveSmokingStatusType'))) {
            return this.get('isDirty') && this.get('inActiveSmokingStatusType.smokingStatusGuid') !== this.get('selectedValueImage');
        }
        return this.get('isDirty');
    }),
    disableOldOption: computed('isNotAllowedToEdit', 'smokingStatus.smokingStatusGuid', 'inActiveSmokingStatusType', function() {
        if (isPresent(this.get('inActiveSmokingStatusType'))) {
            return this.get('isNotAllowedToEdit') || this.get('smokingStatus.smokingStatusGuid') !== this.get('inActiveSmokingStatusType.smokingStatusGuid');
        }
    }),
    isDirty: computed('smokingStatus.smokingStatusGuid', 'selectedValueImage', function() {
        return this.get('smokingStatus.smokingStatusGuid') !== this.get('selectedValueImage');
    }),
    showSave: or('smokingStatus.isNew', 'isDirty'),
    actions: {
        delete() {
            this.sendAction('delete');
        },
        save() {
            const sectionTitle = 'Tobacco use';
            const event = this.get('showSave') ? 'Social Behavioral Health Saved' : 'Social Behavioral Health Reviewed';
            const properties = this.get('showSave') ?
                { 'Section': sectionTitle, 'Completed Questionnaire': !this.get('smokingStatus.saveDisabled') } :
                { 'Section': sectionTitle };

            this.get('tunnel').send('patient-summary-mixpanel-event', { event, properties });
            this.get('analytics').track('Save Smoking Status');
            this.sendAction('save');
        },
        cancel() {
            this.get('tunnel').send('patient-summary-mixpanel-event', {
                event: 'Social Behavioral Health Cancelled',
                properties: {
                    'Section': 'Tobacco use',
                    'Completed Questionnaire': !this.get('smokingStatus.saveDisabled')
                }
            });
            this.sendAction('cancel');
        },
        undo() {
            this.sendAction('undo');
        },
        closeDetailPane() {
            this.sendAction('cancel');
        }
    }
});
