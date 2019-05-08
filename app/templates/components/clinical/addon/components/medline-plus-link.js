import { computed } from '@ember/object';
import Component from '@ember/component';
import config from 'boot/config';
import PFServer from 'boot/util/pf-server';

export default Component.extend({
    name: null,
    useIcon: false,
    patientPracticeGuid: null,

    click() {
        var url = [
            config.labsBaseURL,
            '/Patients/',
            this.get('patientPracticeGuid'),
            '/PatientEducation/Audit?searchString=',
            encodeURIComponent(this.get('name'))
        ].join('');

        if(this.get('patientPracticeGuid')) {
            PFServer.promise(url, 'POST');
        }
    },

    medlinePlusUrl: computed('name', function() {
        var link = '',
            name = this.get('name');
        if (name) {
            link = 'http://vsearch.nlm.nih.gov/vivisimo/cgi-bin/query-meta?v%3Aproject=medlineplus&query=' +
                encodeURIComponent(name);
        }
        return link;
    })
});
