import Controller, { inject as controller } from '@ember/controller';
import { computed, get } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias, sort, or, not } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import fhhRepository from 'clinical/repositories/family-health-history';
import Relative from 'clinical/models/familyhealthhistory/relative';

export default Controller.extend({
    patient: controller(),
    authorization: service(),

    isPrintVisible: false,
    patientPracticeGuid: alias('patient.patientPracticeGuid'),
    isLoading: or('load.isRunning', 'reload.isRunning'),
    relationshipTypeSortProperties: computed(() => ['displaySequence']),
    sortedRelationshipTypes: sort('relationshipTypes', 'relationshipTypeSortProperties'),
    printTitle: computed('patient.fullName', function () {
        return `Family history for ${this.get('patient.fullName')}`;
    }),
    isEntitledForFHH: computed('authorization.entitledFeatures.[]', function () {
        return this.get('authorization').isEntitledFor('Chart.FHH.Edit');
    }),
    isEntitledAndAllowedToEditFHH: computed('isEntitledForFHH', 'session.isStaff', function () {
        return this.get('isEntitledForFHH') && !this.get('session.isStaff');
    }),
    isNotAllowedToEditFHH: not('isEntitledAndAllowedToEditFHH'),

    load: task(function* (patientPracticeGuid) {
        this.setProperties({
            selectedRelative: null,
            selectedObservation: null
        });
        const store = this.get('store');
        const { relatives, relationshipTypes } = yield fhhRepository.loadRelativesAndRelationshipTypes(store, patientPracticeGuid);
        const condition = yield fhhRepository.loadConditions(patientPracticeGuid);

        this.setProperties({
            condition,
            relatives,
            relationshipTypes
        });
    }),
    reload: task(function* () {
        const { relationshipTypes, patientPracticeGuid } = this.getProperties('relationshipTypes', 'patientPracticeGuid');
        const relatives = yield fhhRepository.reloadRelatives(patientPracticeGuid, relationshipTypes);
        const condition = yield fhhRepository.loadConditions(patientPracticeGuid);
        this.setProperties({
            condition,
            relatives
        });
    }).drop(),
    actions: {
        addDiagnosis(relative) {
            this.setProperties({
                selectedRelative: null,
                selectedObservation: {
                    patientPracticeGuid: this.get('patientPracticeGuid'),
                    relative
                }
            });
        },
        addRelative() {
            this.setProperties({
                selectedObservation: null,
                selectedRelative: Relative.create({
                    patientPracticeGuid: this.get('patientPracticeGuid')
                })
            });
        },
        editDiagnosis(selectedObservation) {
            this.setProperties({
                selectedRelative: null,
                selectedObservation
            });
        },
        editRelative(selectedRelative) {
            this.setProperties({
                selectedObservation: null,
                selectedRelative
            });
        },
        closeRelativeDetails() {
            this.set('selectedRelative', null);
        },
        removeRelative(relative) {
            const relatives = this.get('relatives') || [];
            relatives.removeObject(relative);
        },
        closeObservationDetails() {
            this.set('selectedObservation', null);
        },
        removeObservation(observation) {
            const relativeGuid = get(observation, 'relative.relativeGuid');
            const relative = (this.get('relatives') || []).findBy('relativeGuid', relativeGuid);
            if (relative) {
                (get(relative, 'observations') || []).removeObject(observation);
            }
        }
    }
});
