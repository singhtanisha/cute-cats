import { observer } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { scheduleOnce } from '@ember/runloop';
import { notEmpty } from '@ember/object/computed';
import Mixin from '@ember/object/mixin';
export default Mixin.create({
    classNames: ['vaccination-form'],

    facilities: null,
    selectedFacility: null,
    errors: null,
    isNotAllowedToEditImmunizations: true,
    isVaccinationPersisted: false,
    patientPracticeGuid: null,
    providers: null,
    vaccination: null,
    vaccineInventories: null,
    vaccineManufacturers: null,
    vaccineSearchQuery: null,

    isVaccineLoaded: notEmpty('vaccination.vaccineType'),

    init() {
        this._super();

        scheduleOnce('afterRender', this, () => {
            this.set('errors', null);

            if (isEmpty(this.get('vaccination.vaccinationGuid'))) {
                this.sendAction('createVaccinationRecord');
            } else {
                this.loadVaccinationDetails();
            }
        });
    },

    willDestroyElement() {
        var vaccination = this.get('vaccination');

        if (vaccination && vaccination.get('isNew')) {
            this.sendAction('deleteVaccination', true);
        }

        this.set('errors', null);
    },

    onFacilityGuidChanged: observer('vaccination.facilityGuid', function() {
        var facilityGuid = this.get('vaccination.facilityGuid'),
            facilities = this.get('facilities') || [],
            facilityMatch = facilities.findBy('facilityGuid', facilityGuid);

        if (this.get('selectedFacility.facilityGuid') !== facilityGuid && !isEmpty(facilityMatch)) {
            this.set('selectedFacility', facilityMatch);
        }
    }).on('init'),

    actions: {
        selectFacility(facility) {
            this.set('vaccination.facilityGuid', facility.get('facilityGuid'));
        },

        selectVaccine(immunizationSearchResult) {
            var searchQuery = {
                    searchGuid: immunizationSearchResult.get('searchGuid'),
                    searchTypeCode: immunizationSearchResult.get('searchTypeCode')
                },
                searchResultName = immunizationSearchResult.get('name'),
                vaccineInventory;

            this.sendAction('vaccinationFormLoading', true);

            this.set('errors', null);
            this.get('store').queryRecord('vaccine-type', searchQuery)
                .then((vaccineType) => {
                    if (vaccineType) {
                        if (vaccineType.get('isCustom')) {
                            vaccineType.set('name', searchResultName);

                            if (vaccineType.get('sortedVaccineInventories.length') > 0) {
                                vaccineType.get('sortedVaccineInventories.firstObject').setProperties({
                                    customVaccinationTypeName: searchResultName,
                                    isHidden: true,
                                    isDeleted: false
                                });
                            }
                        }

                        if (vaccineType.get('sortedVaccineInventories.length')) {
                            vaccineInventory = vaccineType.get('sortedVaccineInventories.firstObject');

                            this.set('vaccination.vaccineInventory', vaccineInventory);
                            this.set('vaccination.immunizationFundingSource', vaccineInventory.get('immunizationFundingSource'));
                        }

                        this.setProperties({
                            'vaccination.administeredByProviderGuid': vaccineType.get('providerGuid'),
                            'vaccination.orderingProviderGuid': vaccineType.get('providerGuid'),
                            'vaccination.vaccineType': vaccineType,
                            'vaccineInventories': vaccineType.get('sortedVaccineInventories'),
                            'vaccineManufacturers': vaccineType.get('manufacturers')
                        });
                    }
                }, () => {
                    toastr.error('Failed to load vaccination details.');

                    this.sendAction('closeVaccinationDetails');
                })
            .finally(() => {
                this.sendAction('vaccinationFormLoading', false);
            });
        }
    },

    loadVaccinationDetails() {
        var vaccination = this.get('vaccination'),
            searchQuery = {
                searchGuid: vaccination.get('vaccineType.vaccineTypeGuid'),
                searchTypeCode: 'vaccineType'
            };

        this.set('errors', null);

        this.get('store').query('vaccineType', searchQuery)
            .then(function(vaccineType) {
                vaccineType = vaccineType.get('firstObject');

                this.setProperties({
                    vaccineInventories: vaccineType.get('sortedVaccineInventories'),
                    vaccineManufacturers: vaccineType.get('manufacturers')
                });
            }.bind(this), function() {
                toastr.error('Failed to load vaccination details.');

                this.sendAction('closeVaccinationDetails');
            }.bind(this))
        .finally(function() {
            this.sendAction('vaccinationFormLoading', false);
        }.bind(this));
    }
});
