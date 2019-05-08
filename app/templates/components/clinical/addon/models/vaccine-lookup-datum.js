import Model from 'ember-data/model';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
    immunizationFundingSources: hasMany('immunization-funding-source', { async: false }),
    notificationPreferences: hasMany('immunization-registry-notification-preference', { async: false }),
    rejectionReasons: hasMany('vaccination-rejection', { async: false }),
    routes: hasMany('vaccination-route', { async: false }),
    sites: hasMany('vaccination-site', { async: false }),
    sources: hasMany('vaccination-source', { async: false }),
    vaccinationAdverseReactions: hasMany('vaccination-reaction', { async: false }),
    vaccinationScheduleSpecialIndications: hasMany('vaccination-indication', { async: false }),
    vaccinationUnits: hasMany('vaccination-unit', { async: false }),
    vfcStatuses: hasMany('vfc-status', { async: false }),
    visConcepts: hasMany('vis-concept', { async: false })
});
