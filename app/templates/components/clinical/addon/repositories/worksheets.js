import { isEmpty } from '@ember/utils';
import { merge } from '@ember/polyfills';
import { resolve, hash } from 'rsvp';
import config from 'boot/config';
import PFServer from 'boot/util/pf-server';
import session from 'boot/models/session';
import WorksheetResponses from 'clinical/models/worksheet-responses';
import transcriptEventsRepository from 'charting/repositories/transcript-events';

// TODO: Consider abstracting away for other repos to use (e.g. like the store)
// NOTE: Consider overriding service:store with this with current store as a fallback, so default routes work
const _userSessionHash = {};
function getSessionCache() {
    const userGuid = session.get('userGUID');
    const cache = _userSessionHash[userGuid] || {};
    return cache;
}
function customResolve(data) {
    const promise = resolve(data);
    promise._successful = true;
    return promise;
}

export default {
    _loadData(url, options, mapResponseFunction) {
        options = options || {};
        var cacheHash = getSessionCache(),
            cachedPromise = cacheHash[url];

        if (!options.forceReload && cachedPromise && cachedPromise._successful) {
            return cachedPromise;
        }
        cachedPromise = PFServer.promise(url).then(function(data) {
            cachedPromise._successful = true;
            return data;
        }).then(mapResponseFunction);
        cacheHash[url] = cachedPromise;
        return cachedPromise;
    },
    loadWorksheet(worksheetGuid, options) {
        return this._loadData(config.chartingURL + 'Worksheets/' + worksheetGuid, options);
    },
    loadResponses(responsesGuid, options) {
        return this._loadData(config.chartingURL + 'WorksheetResponses/' + responsesGuid, options, function(data) {
            return WorksheetResponses.wrap(data);
        });
    },
    clearResponsesCache() {
        const cacheHash = getSessionCache();
        const baseWorksheetUrl = config.chartingURL + 'Worksheets/';
        Object.keys(cacheHash).forEach(key => {
            if (key.indexOf(baseWorksheetUrl) < 0) {
                cacheHash[key] = null;
            }
        });
    },
    loadResponsesFromTranscriptEncounterEvent(transcriptEvent, options) {
        return this._loadData(config.chartingURL + 'WorksheetResponses?transcriptEncounterEventGuid=' + transcriptEvent.get('transcriptEventGuid'), options, function(data) {
            return WorksheetResponses.wrap(data);
        });
    },
    saveResponses(patientPracticeGuid, responses, options) {
        responses = WorksheetResponses.wrap(responses);

        let responsesGuid = responses.get('responsesGuid');
        let url = config.chartingURL + 'WorksheetResponses';
        let method = 'POST';
        let promiseHash = {};
        let data;

        if (!options || options.isEncounterRelated) {
            responses.set('transcriptEncounterEvent.resultValue', responses.get('score'));
            responses.set('transcriptEncounterEvent.resultCode', responses.get('resultCode'));
        }

        data = merge({}, responses.get('content'));
        data.endDateTimeUtc = responses.get('endDateTimeUtc');
        data.startDateTimeUtc = responses.get('startDateTimeUtc');

        if (responsesGuid) {
            method = 'PUT';
            url += '/' + responsesGuid;
        } else if (responses.get('transcriptEncounterEvent.transcriptEventGuid')) {
            // We are not including the transcriptEncounterEvents in the POST so that services will not create duplicates.
            data.transcriptEncounterEvents = [];

            // Special case where the provider selected 'not performed'.
            if (responses.get('transcriptEncounterEvent.isNegated')) {
                promiseHash.transcriptEvent = transcriptEventsRepository.saveEvent(patientPracticeGuid, responses.get('transcriptEncounterEvent'));
            }
        } else {
            data.transcriptEncounterEventGuids = [];
        }

        delete data.worksheet;

        promiseHash.responses = PFServer.promise(url, method, data).then((data) => {
            responses.set('content', data);

            responsesGuid = responses.get('responsesGuid');

            const cacheHash = getSessionCache();
            const cacheKey = config.chartingURL + 'WorksheetResponses/' + responsesGuid;

            cacheHash[cacheKey] = customResolve(responses);

            return responses;
        });

        return hash(promiseHash).then(function(hash) {
            return hash.responses;
        });
    },
    deleteResponses(patientPracticeGuid, responses) {
        responses = WorksheetResponses.wrap(responses);
        var responsesGuid = responses.get('responsesGuid'),
            url = config.chartingURL + 'WorksheetResponses/' + responsesGuid,
            transcriptEventGuid = responses.get('transcriptEncounterEvents.firstObject.transcriptEventGuid');

        // Delete the transcript event if the responsesGuid is empty
        if (isEmpty(responsesGuid)) {
            if (isEmpty(transcriptEventGuid)) {
                return customResolve();
            }
            return transcriptEventsRepository.deleteEvent(patientPracticeGuid, responses.get('transcriptEncounterEvent'));
        }
        if (!isEmpty(transcriptEventGuid)) {
            url += '?transcriptEncounterEventGuid=' + transcriptEventGuid;
        }
        return PFServer.promise(url, 'DELETE');
    }
};
