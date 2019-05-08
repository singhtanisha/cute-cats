import { and, or, alias, not, empty } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, get, observer, set } from '@ember/object';
import { isEmpty, isPresent } from '@ember/utils';

export default Component.extend({
    isElectronicTransmission: computed(() => false),
    errors: computed(() => null),
    facilities: computed(() => []),
    model: computed(() => null),
    providers: computed(() => []),
    reference: computed(() => null),
    selectedAdministeringProvider: null,
    selectedInventoryLot: null,
    selectedOrderingProvider: null,
    selectedUnits: null,
    showExpirationWarning: computed(() => false),

    currentRoute: alias('model.route'),
    isCustom: alias('model.vaccineType.isCustom'),
    isDynamicCustom: alias('model.vaccineType.isDynamic'),
    isElectronicAndAdministered: and('isElectronicTransmission', 'isAdministered'),
    isInventoryFundingSourceDisabled: and('model.vaccineInventory.immunizationFundingSource', 'model.immunizationFundingSource', 'isNotCustom'),
    isInventoryExpirationDisabled: and('model.vaccineInventory.vaccineExpirationDate', 'model.vaccineLotExpirationDate', 'isNotDynamicCustom'),
    isInventoryLotDisabled: and('model.vaccineInventory.vaccineLotNumber', 'model.vaccineLotNumber', 'isNotDynamicCustom'),
    isInventoryManufacturerDisabled: and('model.vaccineInventory.vaccineManufacturer', 'model.manufacturer', 'isNotDynamicCustom'),
    isImmunizationDrugListEmpty: empty('reference.immunizationDrugs'),
    isNotCustom: not('isCustom'),
    isNotDynamicCustom: not('isDynamicCustom'),
    isSiteDisabled: or('disabled', 'currentRoute.isSiteIrrelevant'),
    isVisConceptRequired: and('model.isVisConceptRequired', 'isElectronicAndAdministered'),
    providerHasNpi: or('providerNpiAdministering', 'providerNpiOrdering'),
    providerNpiAdministering: alias('selectedAdministeringProvider.npi'),
    providerNpiOrdering: alias('selectedOrderingProvider.npi'),
    showComments: alias('isAdministered'),
    showSelfPayRestrictionDropdown: and('isAdministered', 'config.isSelfPayRestrictionOn'),

    eligibleProviders: computed('providers.[]', function() {
        return (get(this, 'providers') || []).filter(provider => {
            return (get(provider, 'editLevel') || '0').toString() !== '0' && get(provider, 'isActive');
        });
    }),
    isInventoryMultipleLots: computed('reference.vaccineInventories.[]', function () {
        return (get(this, 'reference.vaccineInventories') || []).length > 1;
    }),
    isNdcDisabled: computed('isCustom', 'model.ndc', 'model.vaccineInventory.ndc', 'isImmunizationDrugListEmpty', function () {
        return get(this, 'isCustom') ||
            (isPresent(get(this, 'model.ndc')) && isPresent(get(this, 'model.vaccineInventory.ndc'))) ||
            get(this, 'isImmunizationDrugListEmpty');
    }),
    isSiteRequired: computed('isSiteDisabled', 'isElectronicTransmission', 'isAdministered', function () {
        return get(this, 'isElectronicTransmission') && !get(this, 'isSiteDisabled') && get(this, 'isAdministered');
    }),
    knownFacilities: computed('facilities', function() {
        return (get(this, 'facilities') || []).rejectBy('name', 'Unknown');
    }),
    vaccinationBodyRoutes: computed('reference.vaccinationBodyRoutes', 'isAdministered', function () {
        const routes = get(this, 'reference.vaccinationBodyRoutes') || [];
        if (get(this, 'isAdministered')) {
            return routes.filterBy('isActive');
        }
        return routes;
    }),
    vaccinationBodySites: computed('reference.vaccinationBodySites', 'isAdministered', function () {
        const sites = get(this, 'reference.vaccinationBodySites') || [];
        return sites.filterBy('isActive');
    }),
    areInventoryFieldsReadonly: computed('model.vaccineInventory', 'isAddingImmunization', function () {
        if (get(this, 'isAddingImmunization')) {
            return false;
        }
        return !!get(this, 'model.vaccineInventory');
    }),

    administeredUnitsChanged: observer('model.administeredUnits', 'reference.vaccinationUnits', function() {
        const administeredUnits = get(this, 'model.administeredUnits') || '';
        const unitsList = get(this, 'reference.vaccinationUnits');
        const selectedUnits = get(this, 'selectedUnits.code');

        if (isPresent(unitsList)) {
            if (isPresent(administeredUnits) && selectedUnits !== administeredUnits) {
                set(this, 'selectedUnits', unitsList.find(unit => {
                    return (get(unit, 'code') || '').toLowerCase() === administeredUnits.toLowerCase();
                }));
            } else if (isEmpty(selectedUnits)) {
                set(this, 'selectedUnits', unitsList.find(unit => {
                    return (get(unit, 'code') || '').toLowerCase() === 'ml';
                }));
                this.send('selectAdministeredUnits', get(this, 'selectedUnits'));
            }
        }
    }),
    administeringProviderGuidChanged: observer('model.administeredByProviderGuid', function() {
        this.setSeletedProvider('administeredByProviderGuid', 'selectedAdministeringProvider', true);
    }),
    facilityGuidChanged: observer('model.facilityGuid', function () {
        const knownFacilities = get(this, 'knownFacilities') || [];
        set(this, 'selectedFacility', knownFacilities.findBy('facilityGuid', get(this, 'model.facilityGuid')));
    }),
    ndcObserver: observer('model.ndc', 'reference.immunizationDrugs', function () {
        const ndc = get(this, 'model.ndc');
        const immunizationDrugs = get(this, 'reference.immunizationDrugs');
        if (ndc && immunizationDrugs) {
            const selectedNdc = immunizationDrugs.findBy('nationalDrugCode', ndc);
            set(this, 'selectedNdc', selectedNdc);
        }
    }),
    inventoryLotChanged: observer('model.vaccineLotNumber', 'reference.vaccineInventories', function () {
        set(this, 'selectedInventoryLot', (get(this, 'reference.vaccineInventories') || []).findBy('vaccineLotNumber', get(this, 'model.vaccineLotNumber')));
    }),
    orderingProviderGuidChanged: observer('model.orderingProviderGuid', function() {
        this.setSeletedProvider('orderingProviderGuid', 'selectedOrderingProvider', true);
    }),
    reactionChanged: observer('model.vaccinationAdverseReactionGuid', 'reference.vaccinationAdverseReactions', function () {
        const reaction = get(this, 'model.vaccinationAdverseReactionGuid');
        const reactions = get(this, 'reference.vaccinationAdverseReactions');
        if (reaction && reactions) {
            const selectedReaction = reactions.findBy('adverseReactionGuid', reaction);
            set(this, 'selectedReaction', selectedReaction);
        }
    }),
    routeChanged: observer('currentRoute.isSiteIrrelevant', function () {
        if (get(this, 'currentRoute.isSiteIrrelevant')) {
            set(this, 'model.site', null);
        }
    }),
    specialIndicationChanged: observer('model.vaccinationScheduleSpecialIndicationGuid', 'reference.vaccinationScheduleSpecialIndications', function () {
        const specialIndication = get(this, 'model.vaccinationScheduleSpecialIndicationGuid');
        const indications = get(this, 'reference.vaccinationScheduleSpecialIndications');
        if (specialIndication && indications) {
            const selectedSpecialIndication = indications.findBy('scheduleSpecialIndicationGuid', specialIndication);
            set(this, 'selectedSpecialIndication', selectedSpecialIndication);
        }
    }),
    vaccineInventoryChanged: observer('model.vaccineInventory', 'isCustom', function() {
        const inventoryFundingSource = get(this, 'model.vaccineInventory.immunizationFundingSource');
        if (isPresent(inventoryFundingSource) && !get(this, 'isCustom') && get(this, 'isAddingImmunization')) {
            set(this, 'model.immunizationFundingSource', inventoryFundingSource);
        }
    }),

    setInventoryWhenCustom(inventoryPropertyName, value) {
        if (get(this, 'isCustom') && isPresent(get(this, 'model.vaccineInventory'))) {
            set(this, `model.vaccineInventory.${inventoryPropertyName}`, value);
        }
    },
    setSeletedProvider(providerGuidPropertyName, selectedProviderPropertyName, forceNullValue) {
        const providerGuid = get(this, 'model.' + providerGuidPropertyName);
        const providers = get(this, 'providers') || [];
        const providerMatch = providers.findBy('providerGuid', providerGuid);
        const isPresentOrForcedNull = !isEmpty(providerMatch) || forceNullValue;

        if (get(this, selectedProviderPropertyName + '.providerGuid') !== providerGuid && isPresentOrForcedNull) {
            set(this, selectedProviderPropertyName, providerMatch);
        }

        this.attrs.providerUpdated(get(this, 'selectedAdministeringProvider.npi'), get(this, 'selectedOrderingProvider.npi'));
    },

    init() {
        this._super();
        this.administeredUnitsChanged();
        this.administeringProviderGuidChanged();
        this.orderingProviderGuidChanged();
        this.vaccineInventoryChanged();
        this.facilityGuidChanged();
        this.ndcObserver();
        this.specialIndicationChanged();
        this.reactionChanged();
        this.inventoryLotChanged();
    },

    actions: {
        selectAdministeredByProvider(provider) {
            set(this, 'model.administeredByProviderGuid', get(provider, 'providerGuid'));
        },
        selectExpirationDate(expirationDate) {
            set(this, 'model.vaccineLotExpirationDate', expirationDate);
            this.setInventoryWhenCustom('vaccineExpirationDate', expirationDate);
        },
        selectFacility(facility) {
            set(this, 'model.facilityGuid', get(facility, 'facilityGuid'));
        },
        selectOrderingProvider(provider) {
            set(this, 'model.orderingProviderGuid', get(provider, 'providerGuid'));
        },
        selectAdministeredUnits(units) {
            if (isPresent(units)) {
                set(this, 'model.administeredUnits', get(units, 'code'));
            }
        },
        selectLotOption(selectedLot) {
            if (isPresent(selectedLot)) {
                set(this, 'model.vaccineInventory', selectedLot);
                set(this, 'model.vaccineLotNumber', get(selectedLot, 'vaccineLotNumber'));
                set(this, 'model.vaccineLotExpirationDate', get(selectedLot, 'vaccineExpirationDate'));
                set(this, 'model.manufacturer', get(selectedLot, 'vaccineManufacturer'));
                set(this, 'model.ndc', get(selectedLot, 'ndc'));
                set(this, 'model.immunizationFundingSource', get(selectedLot, 'immunizationFundingSource'));
            }
            this.attrs.clearExpirationWarningResponse();
        },
        selectManufacturer(selectedManufacturer) {
            this.setInventoryWhenCustom('vaccineManufacturer', selectedManufacturer);
        },
        selectNdc(selectedNdc) {
            if (isPresent(selectedNdc)) {
                set(this, 'model.ndc', get(selectedNdc, 'nationalDrugCode'));

                // default route if there is a matched route indicated in the NDC
                const matchedRoute = (get(this, 'vaccinationBodyRoutes') || []).findBy('name', get(selectedNdc, 'route'));
                if (isPresent(matchedRoute)) {
                    set(this, 'model.route', matchedRoute);
                }
            }
        },
        selectReaction(reaction) {
            if (isPresent(reaction)) {
                set(this, 'model.vaccinationAdverseReactionGuid', get(reaction, 'adverseReactionGuid'));
            }
        },
        selectSpecialIndication(indication) {
            if (isPresent(indication)) {
                set(this, 'model.vaccinationScheduleSpecialIndicationGuid', get(indication, 'scheduleSpecialIndicationGuid'));
            }
        }
    }
});
