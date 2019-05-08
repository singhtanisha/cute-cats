import { hash } from 'rsvp';
import config from 'boot/config';
import LegacyAdapter from 'common/adapters/legacy';

export default LegacyAdapter.extend({
    host: config.defaultHost,
    namespace: config.patientNamespace,
    pathForType() {
        return 'careTeam/provider';
    },
    createRecord(store, type, snapshot) {
        return this.updateRecord(store, type, snapshot);
    },
    updateRecord(store, type, snapshot) {
        const serializer = store.serializerFor(type.modelName);
        const data = serializer.serialize(snapshot);
        const options = { data };
        const patientPracticeGuid = snapshot.attr('patientPracticeGuid');
        const url = this.get('host') + '/' + this.get('namespace') + '/patient/' + patientPracticeGuid + '/' + this.pathForType(type);
        return this.ajax(url, 'PUT', options).then(function (members) {
            // TODO: consider dry'ing with care-team's adapter
            return hash({
                contacts: store.findAll('directory-contact'),
                practiceProviders: store.findAll('provider-profile'),
                specialties: store.findAll('specialty'),
                patientPracticeGuid,
                members
            });
        });
    },
});
