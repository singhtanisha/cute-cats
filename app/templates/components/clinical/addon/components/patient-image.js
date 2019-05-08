import { run } from '@ember/runloop';
import { on } from '@ember/object/evented';
import { computed } from '@ember/object';
import Component from '@ember/component';
import config from 'boot/config';
import session from 'boot/models/session';

const defaultImageUrl = 'assets/images/default_profile.png';

export default Component.extend({
    tagName: 'img',
    attributeBindings: ['src'],
    hasPatientImage: false,
    src: computed('hasPatientImage', 'patientImageUrlAuthenticated', function() {
        if (this.get('hasPatientImage')) {
            return this.get('patientImageUrlAuthenticated');
        } else {
            return defaultImageUrl;
        }
    }),
    patientImageUrl: computed('patientPracticeGuid', function() {
        return config.patientImageURL + '/' + this.get('patientPracticeGuid') + '/patientImage';
    }),
    patientImageUrlAuthenticated: computed('patientImageUrl', function () {
        return `${this.get('patientImageUrl')}?authCookie=${session.get('authCookie')}`;
    }),
    _addErrorHandler: on('didInsertElement', function() {
        if (this.get('hasPatientImage')) {
            this.$().on('error', () => run(() => {
                this.set('src', defaultImageUrl);
            }));
        }
    }),
    _removeErrorHandler: on('willDestroyElement', function() {
        this.$().off('error');
    })
});
