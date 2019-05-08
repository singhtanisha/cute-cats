import { resolve } from 'rsvp';
import session from 'boot/models/session';

var _userSessionHash = {},
    getSessionCache = function () {
        var userGuid = session.get('userGUID'),
            cache = _userSessionHash[userGuid] = _userSessionHash[userGuid] || {};
        return cache;
    };

export function clearUserSessionCache() {
    _userSessionHash = {};
}

/***
 * Creates a function wrapper that will cache the results from the inner function.
 * This has two overloads userSessionCache(cacheKeyFunction, loadFunction, [defaultFunction])
 * Or userSessionCache(options) where options is an object with a cacheKeyFunction, loadFunction and defaultFunction
 * @param {function} cacheKeyFunction the optional function will take all the arguments called when calling the resulting wrapper
 * @param {function} loadFunction the function will take all the arguments called when calling the resulting wrapper
 *     and it will always contain an options object with an (optional) forceReload flag and a cachedPromise with either the results of
 *     a previous call, the default values (returned by defaultFunction) or undefined
 *     @param {object} options last argument {forceReload: {boolean}, cachedPromise: {RSVP.Promise}}
 * @param {function} defaultFunction the optional function will take all the arguments called when calling the resulting wrapper
 * @returns {function} a function to load the data that is cached aware. The last argument of this function accepts an
 *     options object with a flag to `forceReload` like `loadData(param1, param2, {forceReload: true})`
 */
export default function (options) {
    var configurationArguments = arguments,
        cacheKeyFunction, loadFunction, defaultFunction, cacheWrapper;

    if (arguments.length === 2) {
        cacheKeyFunction = function () {
            return configurationArguments[0];
        };
        loadFunction = arguments[1];
        defaultFunction = arguments[3] || $.noop;
    } else {
        cacheKeyFunction = options.cacheKeyFunction;
        loadFunction = options.loadFunction;
        defaultFunction = options.defaultFunction || $.noop;
    }

    cacheWrapper = function () {
        var cacheKey = cacheKeyFunction.apply(this, arguments),
            cacheHash = getSessionCache(),
            args = Array.prototype.slice.call(arguments),
            currentResult = cacheHash[cacheKey],
            options = arguments[arguments.length-1] || {},
            currentPromise;

        if (!options.hasOwnProperty('forceReload')) {
            options = {};
            args.push(options);
        }
        options.cachedPromise = currentResult || resolve(defaultFunction.apply(this, arguments));
        if (!currentResult || currentResult._willReload || options.forceReload) {
            currentPromise = loadFunction.apply(this, args);
            cacheHash[cacheKey] = currentPromise;
        }
        return resolve(cacheHash[cacheKey]).catch(function (error) {
            if (currentPromise) {
                currentPromise._failed = true;
            }
            // currentResult is either null if it was the first time or the previous successful promise
            cacheHash[cacheKey] = (currentResult && currentResult._failed) ? undefined : currentResult;
            throw error;
        });
    };
    cacheWrapper.expire = function () {
        var cacheKey = cacheKeyFunction.apply(this, arguments),
            cachedPromise = getSessionCache()[cacheKey] || {};
        cachedPromise._willReload = true;
    };
    /***
     * Returns a promise with the cached data or a promise with the default results
     * We make sure the data is reload if someone calls the cacheWrapper directly, but even default
     * results will be cached so we always get the same response
     */
    cacheWrapper.getCachedData = function () {
        var cacheKey = cacheKeyFunction.apply(this, arguments),
            cacheHash = getSessionCache(),
            cachedPromise = cacheHash[cacheKey],
            defaultResult;
        if (cachedPromise) {
            return cachedPromise;
        }

        defaultResult = defaultFunction.apply(this, arguments);
        defaultResult =resolve(defaultResult);
        defaultResult._willReload = true;
        cacheHash[cacheKey] = defaultResult;
        return defaultResult;
    };
    return cacheWrapper;
}
