import { on } from '@ember/object/evented';
import { alias, and } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
export default Component.extend({
    analytics: service(),
    authorization: service(),
    resizables: computed(() => []),
    showDeleteGenderIdentityConfirm: false,
    showDeleteSexualOrientationConfirm: false,

    selectedGenderIdentity: computed('socialHistory.genderIdentity', {
        get() {
            return this.get('socialHistory.genderIdentity.optionGuid');
        },
        set(key, value) {
            const options = this.get('socialHistoryOptions.genderIdentityOptions');
            if (isEmpty(value) || isEmpty(options)) {
                this.set('socialHistory.genderIdentity', null);
                return true;
            }
            const selected = options.findBy('optionGuid', value);
            this.set('socialHistory.genderIdentity', {
                optionGuid: selected.get('optionGuid'),
                description: selected.get('description'),
                notes: this.get('socialHistory.genderIdentity.notes')
            });
            return true;
        }
    }),
    selectedSexualOrientation: computed('socialHistory.sexualOrientation', {
        get() {
            return this.get('socialHistory.sexualOrientation.optionGuid');
        },
        set(key, value) {
            const options = this.get('socialHistoryOptions.sexualOrientationOptions');
            if (isEmpty(value) || isEmpty(options)) {
                this.set('socialHistory.sexualOrientation', null);
                return true;
            }
            const selected = options.findBy('optionGuid', value);
            this.set('socialHistory.sexualOrientation', {
                optionGuid: selected.get('optionGuid'),
                description: selected.get('description'),
                notes: this.get('socialHistory.sexualOrientation.notes')
            });
            return true;
        }
    }),
    isNoGenderIdentity: computed('socialHistory.genderIdentity', function() {
        const genderIdentity = this.get('socialHistory.genderIdentity');
        return isEmpty(genderIdentity) || isEmpty(genderIdentity.optionGuid);
    }),
    isNoSexualOrientation: computed('socialHistory.sexualOrientation', function() {
        const sexualOrientation = this.get('socialHistory.sexualOrientation');
        return isEmpty(sexualOrientation) || isEmpty(sexualOrientation.optionGuid);
    }),
    isGenderIdentityExpanded: computed('socialHistory.defaultSection', {
        get() {
            return this.get('socialHistory.defaultSection') === 'identity';
        },
        set(key, value) {
            if (value) {
                this.set('socialHistory.defaultSection', 'identity');
            }
            return true;
        }
    }),
    isSexualOrientationExpanded: computed('socialHistory.defaultSection', {
        get() {
            return this.get('socialHistory.defaultSection') === 'orientation';
        },
        set(key, value) {
            if (value) {
                this.set('socialHistory.defaultSection', 'orientation');
            }
            return true;
        }
    }),
    persistedGenderIdentityGuid: alias('persistedHistory.genderIdentity.optionGuid'),
    persistedSexualOrientationGuid: alias('persistedHistory.sexualOrientation.optionGuid'),
    isAllowedToEditSocialHistory: computed('authorization.entitledFeatures.[]', function () {
        return this.get('authorization').isEntitledFor('Chart.SocialHistory.Edit');
    }),
    canDeleteGenderIdentity: and('persistedGenderIdentityGuid', 'isGenderIdentityExpanded', 'isAllowedToEditSocialHistory'),
    canDeleteSexualOrientation: and('persistedSexualOrientationGuid', 'isSexualOrientationExpanded', 'isAllowedToEditSocialHistory'),
    setPersisted: on('init', function () {
        const socialHistory = this.get('socialHistory');
        this.set('persistedHistory', {
            genderIdentity: socialHistory.get('genderIdentity'),
            sexualOrientation: socialHistory.get('sexualOrientation')
        });
    }),
    actions: {
        deleteGenderIdentity() {
            this.send('hideDeleteModals');
            this.sendAction('delete', { name: 'genderIdentity', description: 'Gender identity' });
            this.set('persistedHistory.genderIdentity', null);
        },
        deleteSexualOrientation() {
            this.send('hideDeleteModals');
            this.sendAction('delete', { name: 'sexualOrientation', description: 'Sexual orientation' });
            this.set('persistedHistory.sexualOrientation', null);
        },
        showDelete(section) {
            this.send('hideDeleteModals');
            if (section === 'genderIdentity') {
                this.set('showDeleteGenderIdentityConfirm', true);
            }
            if (section === 'sexualOrientation') {
                this.set('showDeleteSexualOrientationConfirm', true);
            }
        },
        save() {
            this.get('analytics').track('Save Social History');
            this.setPersisted();
            this.sendAction('save');
        },
        cancel() {
            this.sendAction('cancel');
        },
        hideDeleteModals() {
            this.set('showDeleteGenderIdentityConfirm', false);
            this.set('showDeleteSexualOrientationConfirm', false);
        }
    }
});
