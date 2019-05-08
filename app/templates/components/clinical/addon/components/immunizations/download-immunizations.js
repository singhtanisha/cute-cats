import { task } from 'ember-concurrency';
import Component from "@ember/component";
import {
  computed,
  get,
  observer,
  set,
  setProperties
} from '@ember/object';
import { isEmpty, isPresent } from '@ember/utils';
import ImmunizationRegistryRepository from 'clinical/repositories/immunization-registry';

export default Component.extend({
    isDownloading: false,
    isVisible: false,

    downloadFileName: computed('patient.fullName', function () {
        return `${get(this, 'patient.fullName')}.IIS`;
    }),

    downloadFile: task(function* () {
        const registry = get(this, 'selectedRegistry');

        const immunizationRecord = yield ImmunizationRegistryRepository.loadImmunizationRecord(registry, get(this, 'patient.patientPracticeGuid'));
        const file = new Blob([immunizationRecord.hl7Document], {
            type: 'text/plain;charset=utf-8'
        });
        if (isPresent(file)) {
            window.saveAs(file, get(this, 'downloadFileName'));
        }

        setProperties(this, {
            isVisible: false,
            selectedRegistry: null,
            isDownloading: false
        });
    }).drop(),

    initDownloadSettings: task(function* () {
        const registries = get(this, 'registries');

        if (isEmpty(get(this, 'content'))) {
            toastr.error('This patient has no immunization record');
        } else if (isEmpty(registries)) {
            toastr.error('Could not load immunization registries');
        } else {
            set(this, 'isVisible', true);

            const preferences = yield ImmunizationRegistryRepository.loadDownloadPreferences(get(this, 'store'));

            if (!isEmpty(preferences.defaultRegistryId) && !isEmpty(registries)) {
                set(this, 'selectedRegistry', registries.findBy('id', preferences.defaultRegistryId));
            }
            if (isPresent(get(this, 'selectedRegistry'))) {
                set(this, 'selectedRegistry.registryProvider', preferences.defaultLogin);
            }
        }
    }).drop(),

    updateRegistries: observer('registries', 'isDownloading', function () {
        if (get(this, 'isDownloading')) {
            get(this, 'initDownloadSettings').perform();
        }
    }),

    init() {
        this._super();
        this.updateRegistries();
    },

    actions: {
        cancel() {
            this.setProperties({
                isVisible: false,
                selectedRegistry: null,
                isDownloading: false
            });
        },
    }
});
