import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import Component from '@ember/component';
export default Component.extend({
    attributeBindings: ['data-element'],
    tagName: 'li',
    classNameBindings: ['isSelected:is-active'],
    isSelected: computed('selectedDeviceGuid', 'device.healthcareDeviceGuid', function() {
        return this.get('selectedDeviceGuid') === this.get('device.healthcareDeviceGuid');
    }),

    displayName: alias('device.userEnteredInfo.userEnteredDeviceTypeName'),

    implantDate: computed('device.userEntered.implantDate', function() {
        return this._getDisplayDate(this.get('device.userEnteredInfo.userEnteredImplantDate'));
    }),

    expirationDate: computed('device.expirationDate', function() {
        return this._getDisplayDate(this.get('device.udiInfo.expirationDate'));
    }),

    click() {
        this.attrs.editDevice(this.get('device'));
    },
    _getDisplayDate(dateVal) {
        if (!dateVal || !moment(dateVal).isValid) {
            return 'Unspecified';
        }
        return moment(dateVal).utc().format('MM/DD/YYYY');
    }

});
