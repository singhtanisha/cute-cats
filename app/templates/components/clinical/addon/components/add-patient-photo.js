import { later } from '@ember/runloop';
import { observer, computed } from '@ember/object';
import { bool } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
    isVisible: false,
    photoUrl: '',
    photoExists: bool('photoUrl'),
    patientGuid: '',
    isUploading: false,
    uploadProgress: 0,
    isUploadError: false,
    errorMessage: '',

    isOpening: observer('isVisible', function () {
        $('img.photo-preview').unbind('error');

        if (this.get('isVisible')) {
            this.set('uploadProgress', 0);
            this.set('isUploading', false);
            this.set('isUploadError', false);
        }
    }),

    uploadUrl: computed('patientGuid', function () {
        return `${this.get('config.patientInfoURL')}${this.get('patientGuid')}/patientImage`;
    }),

    photoUrlAuthenticated: computed('photoUrl', function () {
        let url = `${this.get('photoUrl')}&authCookie=${this.get('session.authCookie')}`;
        $('.photo-preview').show();
        $('.link-change-photo').show();
        if (url.indexOf('?') < 0 && url.indexOf('&') > -1) {
            url = url.replace('&', '?');
        }
        return url;
    }),

    completeUpload(xhr) {
        const response = xhr ? JSON.parse(xhr.response || xhr.responseText) : null;

        this.set('isUploading', false);
        if (xhr.status === 200 && response && response.status === 'OK') {
            later(this, function() {
                const store = this.get('store'),
                    patientPracticeGuid = this.get('patientGuid');
                ['patient-summary', 'patient-search', 'recent-patient'].forEach(type => {
                    let model = store.peekRecord(type, patientPracticeGuid);
                    if (model) {
                        model.set('hasPatientImage', true);
                    }
                });

                this.set('photoUrl', this.get('uploadUrl') + '?ts=' + new Date().getTime());
            }, 800);
            return;
        }
        this.set('isUploadError', true);
        this.set('errorMessage', 'There was an error uploading your file');
        if (response && response.errorMessage) {
            this.set('errorMessage', response.errorMessage);
        }
    },

    actions: {
        done() {
            this.set('isVisible', false);
        },

        onUpload(e) {
            const xhr = e.XMLHttpRequest;
            this.set('isUploading', true);
            this.set('isUploadError', false);
            this.set('uploadProgress', 0);

            xhr.addEventListener('readystatechange', () => {
                switch(xhr.readyState) {
                    case 1:
                        try {
                            xhr.setRequestHeader('Authorization', this.get('session.sessionGUID'));
                        } catch (err) {} //IE 11 actually sets the Authorization header but throws an InvalidStateError for no reason.
                        break;
                    case 2:
                    case 3:
                        this.set('uploadProgress', this.get('uploadProgress') + 25);
                        break;
                    case 4:
                        this.completeUpload(xhr);
                        break;
                }
            });
        },

        /* these actions only apply to async uploads. They are left here for future upgrade purposes

        onUploadProgress: function(e) {
            this.set('uploadProgress', e.percentComplete);
        },

        onUploadSuccess: function(e) {
            this.set('photoUrl', e.response[0].responseURL);
            this.set('isUploading', false);
        },

         */
        onUploadError(e) {
            this.set('isUploading', false);
            this.set('isUploadError', true);
            this.set('errorMessage', 'Could not upload' + e);
            if(e.validation && !e.validation.isValid) {
                this.set('errorMessage', e.validation.message);
            }
        }
    }
});
