import { hash } from 'rsvp';
import { assert } from '@ember/debug';
import InfrequentAdapter from 'common/adapters/infrequent';
import config from 'boot/config';

export default InfrequentAdapter.extend({
    host: config.defaultHost,
    namespace: config.patientNamespace,
    pathForType() {
        return 'careTeam/members';
    },
    buildURL(type, patientPracticeGuid) {
        assert('We need an id (patientPracticeGuid) to query careTeam', patientPracticeGuid);
        return this.get('host') + '/' + this.get('namespace') + '/patient/' + patientPracticeGuid + '/' + this.pathForType(type);
    },
    findRecord(store, type, patientPracticeGuid) {
        return hash({
            contacts: store.findAll('directory-contact'),
            practiceProviders: store.findAll('provider-profile'),
            members: this._super(store, type, patientPracticeGuid),
            specialties: store.findAll('specialty'),
            patientPracticeGuid
        });
    }
});
