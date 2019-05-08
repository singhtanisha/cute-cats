import { Promise } from 'rsvp';
import { computed } from '@ember/object';
import { isEmpty, isPresent } from '@ember/utils';
import Component from '@ember/component';
import config from 'boot/config';
import PFServer from 'boot/util/pf-server';
import { task } from 'ember-concurrency';

export default Component.extend({
    // The code used for the query possible values ndc, icd9, loinc
    codeSet: 'ndc',
    code: '',
    searchString: '',
    useIcon: false,
    patientPracticeGuid: null,
    patientSpecificEducationUrl: '',

    click() {
        const patientSpecificEducationUrl = this.get('patientSpecificEducationUrl');
        this.get('openPatientSpecificEducationLink').perform(patientSpecificEducationUrl);
    },

    openPatientSpecificEducationLink: task(function* (url) {
        let patientSpecificEducationUrl = url;
        if (isEmpty(patientSpecificEducationUrl)) {
            patientSpecificEducationUrl = yield this.get('generatePatientSpecificEducationLink').perform();
        }
        window.open(patientSpecificEducationUrl, '_blank');
        this.get('auditPatientSpecificEducationLink').perform();
    }).drop(),

    patientEducationUrl: computed('config', 'codeSet', 'code', 'searchString', function () {
        let medlinePlusUrl = `${config.labsBaseURL}/PatientEducation`;
        const codeSet = this.get('codeSet');
        const searchString = this.get('searchString');
        const code = this.get('code');

        if (codeSet) {
            medlinePlusUrl += `/${encodeURIComponent(codeSet)}`;
        }

        if (code) {
            medlinePlusUrl += `/${encodeURIComponent(code.replace(/[\/:\+*]/g, ''))}`;
        }

        if (searchString) {
            medlinePlusUrl += `?searchString=${encodeURIComponent(searchString.replace(/[\/:\+.*]/g, ''))}`;
        }

        return medlinePlusUrl;
    }),

    generatePatientSpecificEducationLink: task(function* () {
        const patientPracticeGuid = this.get('patientPracticeGuid');
        if (isEmpty(patientPracticeGuid)) {
            return Promise.resolve();
        }
        const requestUrl = `${config.clinicalBaseURL}patientEducation/${this.get('patientPracticeGuid')}`;
        let patient = yield this.store.peekRecord('patient', this.get('patientPracticeGuid'));
        if (isEmpty(patient)) {
            patient = yield this.store.findRecord('patient', this.get('patientPracticeGuid'));
        }
        const requestBody = {
            patientDateOfBirth: patient.get('birthDate'),
            patientGender: patient.get('gender'),
            code: this.get('code'),
            codeSystem: this.get('codeSet'),
            description: this.get('searchString')
        };

        // Construct patient specific education link
        // Default to old patient education url if error
        const linkBaseUrl = yield this.store.query('practice-preference', { keys: ['Infobutton.BaseUrl'] }).then(preference => {
            return preference.get('firstObject.value') || config.infobuttonDefaultBaseUrl;
        });
        const linkParams = yield PFServer.promise(requestUrl, 'POST', requestBody).catch(() => {
            return null;
        });
        let linkToFollow = this.get('patientEducationUrl');
        if (isPresent(linkParams) && isPresent(linkParams.infobutton) && isPresent(linkBaseUrl)) {
            const linkQueryString = linkParams.infobutton.filterBy('paramName').map(param => {
                return `${param.paramName}=${param.paramValue}`;
            }).join('&');
            linkToFollow = `${linkBaseUrl}?${linkQueryString}`.replace('??', '?');
        }
        return this.set('patientSpecificEducationUrl', linkToFollow);
    }).drop(),

    auditPatientSpecificEducationLink: task(function* () {
        const auditUrl = `${config.clinicalBaseURL}patientEducation/${this.get('patientPracticeGuid')}/audit`;
        const auditBody = {
            code: this.get('code'),
            codeSystem: this.get('codeSet'),
            description: this.get('searchString')
        };
        yield PFServer.promise(auditUrl, 'POST', auditBody);
    }).drop()
});
