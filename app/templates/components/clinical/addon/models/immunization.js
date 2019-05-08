import ObjectProxy from '@ember/object/proxy';
import { isPresent } from '@ember/utils';
import { computed } from '@ember/object';
import { alias, notEmpty, equal, sort } from '@ember/object/computed';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
    immunizationGroupGuid: alias('id'),

    description: attr(),
    isActive: attr('boolean'),
    name: attr(),
    vaccinations: hasMany('vaccination', { async: false }),

    hasVaccinations: notEmpty('sortedVaccinations.[]'),
    isUnknown: equal('name', 'Unknown'),

    lastTransmissionDateUtc: computed('vaccinations.@each.immunizationTransmissionHistorySummary', function () {
        let transmissionHistoryEntries = this.get('vaccinations').map(immunization => {
            const transmissionHistoryEntry = immunization.get('immunizationTransmissionHistorySummary');

            if (isPresent(transmissionHistoryEntry)) {
                return ObjectProxy.create({
                    content: transmissionHistoryEntry,
                    lastTransmissionDateUtc: new Date(transmissionHistoryEntry.lastModifiedDateTimeUtc)
                });
            }
            return null;
        });

        transmissionHistoryEntries = transmissionHistoryEntries.compact();

        if (isPresent(transmissionHistoryEntries)) {
            transmissionHistoryEntries = transmissionHistoryEntries.sortBy('lastTransmissionDateUtc');
            return transmissionHistoryEntries.get('lastObject.lastTransmissionDateUtc');
        }
        return null;
    }),
    sortProperties: computed(() => ['vaccinationDateValue']),
    sortedVaccinations: sort('vaccinations', 'sortProperties')
});
