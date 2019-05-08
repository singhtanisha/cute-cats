import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import Component from '@ember/component';
export default Component.extend({
    classNames: ['print-device-section'],

    activeDisplay: computed('device.isActive', function() {
        return this.get('device.isActive') ? 'Active' : 'Inactive';
    }),

    notesDisplay: computed('device.userEnteredInfo.userEnteredNotes', function () {
        return this.get('device.userEnteredInfo.userEnteredNotes') || 'None';
    }),

    manufactureDateDisplay: computed('device.udiInfo.manufactureDate', function () {
        return this._getDisplayDate(this.get('device.udiInfo.manufactureDate'));
    }),

    expirationDateDisplay: computed('device.expirationDate', function () {
        return this._getDisplayDate(this.get('device.udiInfo.expirationDate'));
    }),

    implantDateDisplay: computed('device.expirationDate', function () {
        return this._getDisplayDate(this.get('device.userEnteredInfo.userEnteredImplantDate'));
    }),

    lastModifiedDisplay: computed('device.lastModifiedByUserGuid', 'device.lastModifiedDate', 'users', function () {
        const users = this.get('users');
        const user = users.findBy('userGuid', this.get('device.lastModifiedByUserGuid'));
        const lastModified = this.get('device.lastModifiedDateTimeUtc');

        let formatted = 'Recorded';
        if (!isEmpty(user)) {
            formatted = `${formatted} by ${user.get('providerNameWithDegree')}`;
        }
        if (!isEmpty(lastModified)) {
            formatted = `${formatted} on ${this._getDisplayDate(lastModified, true)}`;
        }
        return formatted;
    }),

    _getDisplayDate(dateVal, isUtc) {
        const dateObj = isUtc ? moment.utc(dateVal) : moment(dateVal);
        if (!dateVal || !dateObj.isValid()) {
            return 'Unspecified';
        }

        return dateObj.format('MM/DD/YYYY');
    }
});
