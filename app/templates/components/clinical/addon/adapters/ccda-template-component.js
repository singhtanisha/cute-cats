import { resolve } from 'rsvp';
import { copy } from '@ember/object/internals';
import config from 'boot/config';
import LegacyAdapter from 'common/adapters/legacy';

const cachedResponses = {};
export default LegacyAdapter.extend({
    query(store, type, query) {
        const { documentType } = query;
        if (!cachedResponses[documentType]) {
            const baseUrl = config.defaultHost + config.clinicalDocumentBaseURL_v2;
            const url = `${baseUrl}/ccda/templateComponents?documentType=${documentType}`;

            return this.ajax(url, 'GET').then(docTypes => {
                cachedResponses[documentType] = copy(docTypes, true);
                return docTypes;
            });
        }
        return resolve(copy(cachedResponses[documentType], true));
    }
});
