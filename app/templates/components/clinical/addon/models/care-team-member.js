import { alias } from '@ember/object/computed';
import config from 'boot/config';
import PFServer from 'boot/util/pf-server';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
    // FK to parent
    patientPracticeGuid: attr('string'),
    // Used to derive the patient profile
    profileGuid: attr('string'),
    profile: attr('object'),
    relationships: attr('array', { defaultValue() {
        return [];
    } }),

    // Aliases
    isDirectoryContact: alias('profile.isDirectoryContact'),
    isProviderProfile: alias('profile.isProviderProfile'),
    // HACK: Override the ember data save since this api is so wrong to begin with.
    save() {
        const data = this.serialize();
        const patientPracticeGuid = this.get('patientPracticeGuid');
        const url = `${config.defaultHost}/${config.patientNamespace}/patient/${patientPracticeGuid}/careTeam/provider`;
        return PFServer.promise(url, 'PUT', data);
    }
});
