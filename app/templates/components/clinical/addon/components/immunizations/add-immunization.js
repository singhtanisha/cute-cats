import { task } from 'ember-concurrency';
import PFServer from 'boot/util/pf-server';
import SpinnerSupport from 'common/mixins/spinner';
import Component from '@ember/component';
import Object, { computed, get, getProperties, set, setProperties, observer } from '@ember/object';
import { not, equal, or, alias, empty } from '@ember/object/computed';
import { isPresent, isEmpty } from '@ember/utils';
import { scheduleOnce } from '@ember/runloop';
import LGTM from 'common/helpers/validation';
import dateHelper from 'common/helpers/dates';
import { inject as service } from '@ember/service';

export default Component.extend(SpinnerSupport, {
    classNames: ['type-v2', 'stacked-column', 'allow-shrink'],

    analytics: service(),

    classNameBindings: ['isVisible:visible:hidden'],
    hasApprovedExpirationWarning: false,
    isDetailsVisible: false,
    isEditingVaccine: true,
    isSearching: false,
    isVisible: false,
    preloadKeyword: null,
    providerHasNpi: false,
    sourceType: null,
    vaccination: null,
    vaccineQuery: '',

    disableSave: not('canSave'),
    isAdministered: equal('sourceType', 'Administered'),
    isHistorical: equal('sourceType', 'Historical'),
    isImmunizationDrugListEmpty: empty('referenceData.immunizationDrugs'),
    isNdcNotRequired: or('isHistorical', 'isVaccineCustom', 'isInventoryWithoutNdc'),
    isRefused: equal('sourceType', 'Refused'),
    isVaccineCustom: alias('vaccination.vaccineType.isCustom'),
    isVaccineQueryEmpty: empty('vaccineQuery'),
    showSpinner: or('createVaccination.isRunning', 'loadReferenceData.isRunning'),
    isNotAllowedToEditImmunizations: not('isAllowedToEditImmunizations'),
    vaccineInventory: alias('vaccination.vaccineInventory'),

    isInventoryWithoutNdc: computed('vaccineInventory', 'vaccineInventory.ndc', 'referenceData.immunizationDrugs', function () {
        return isPresent(get(this, 'vaccineInventory')) &&
            isEmpty(get(this, 'referenceData.immunizationDrugs')) &&
            isEmpty(get(this, 'vaccineInventory.ndc'));
    }),

    canSave: computed('isAllowedToEditImmunizations', 'isAdministered', 'vaccination.vaccineType', 'vaccination.vaccinationDate', 'vaccination.vaccinationTime', 'vaccination.administeredByProviderGuid', 'vaccination.orderingProviderGuid', 'vaccination.facilityGuid', function () {
        const vaccineType = get(this, 'vaccination.vaccineType');
        const { isAdministered, isAllowedToEditImmunizations } = getProperties(this, 'isAdministered', 'isAllowedToEditImmunizations');
        if (!isAllowedToEditImmunizations) {
            return false;
        }
        if (isAdministered) {
            return isPresent(vaccineType) &&
                isPresent(get(this, 'vaccination.vaccinationDate')) &&
                isPresent(get(this, 'vaccination.vaccinationTime')) &&
                isPresent(get(this, 'vaccination.administeredByProviderGuid')) &&
                isPresent(get(this, 'vaccination.orderingProviderGuid')) &&
                isPresent(get(this, 'vaccination.facilityGuid'));
        }
        return isPresent(vaccineType);
    }),
    doseCountRemainingText: computed('vaccineInventory.remainingDoseCount', function () {
        const doseCount = get(this, 'vaccineInventory.remainingDoseCount');
        if (doseCount < 1) {
            return 'No doses remaining';
        }
        if (doseCount === 1) {
            return '1 Dose remaining';
        }
        return `${doseCount} Doses remaining`;
    }),
    isVaccineSelected: computed('vaccination', 'isAddingImmunization', 'isEditingVaccine', 'selectedVaccine', function () {
        const { isEditingVaccine, selectedVaccine, vaccination, isAddingImmunization } = getProperties(this, 'vaccination', 'isAddingImmunization', 'isEditingVaccine', 'selectedVaccine');
        if (vaccination && !isAddingImmunization) {
            return true;
        }
        if (isEditingVaccine) {
            return false;
        }
        return isPresent(selectedVaccine);
    }),
    validationRules: computed('isAdministered', 'isHistorical', 'isRefused', function () {
        if (get(this, 'isHistorical')) { return this.validatorHistorical; }
        if (get(this, 'isRefused')) { return this.validatorRefused; }
        return this.validatorAdministered;
    }),

    createVaccination: task(function* (previouslySelected) {
        const isAdministered = get(this, 'isAdministered');
        const isHistorical = get(this, 'isHistorical');
        const source = (get(this, 'referenceData.vaccinationSources') || []).findBy('sourceType', get(this, 'sourceType'));

        set(this, 'errors', null);
        if (isPresent(source)) {
            const vaccination = yield get(this, 'store').createRecord('vaccination', {
                dosesFromInventory: get(this, 'isAdministered') ? 1 : null,
                patientPracticeGuid: get(this, 'patient.patientPracticeGuid'),
                practiceGuid: get(this, 'session.practiceGuid'),
                vaccinationDate: isHistorical ? null : moment().format('MM/DD/YYYY'),
                vaccinationTime: isAdministered ? moment().format('hh:mm A') : null,
                facilityGuid: isHistorical ? null : get(this, 'session.facilityGuid'),
                source
            });
            set(this, 'vaccination', vaccination);
            set(this, 'isDetailsVisible', isAdministered);
        }
        if(isPresent(previouslySelected)) {
            get(this, 'loadSelectedVaccineData').perform(previouslySelected, true);
        }
    }).drop(),
    loadReferenceData: task(function* () {
        const referenceData = yield this.get('store').findAll('vaccine-lookup-datum');
        const lookupDatum = get(referenceData, 'firstObject');
        set(this, 'referenceData', Object.create({
            immunizationFundingSources: get(lookupDatum, 'immunizationFundingSources').toArray(),
            notificationPreferences: get(lookupDatum, 'notificationPreferences').toArray(),
            rejectionReasons: get(lookupDatum, 'rejectionReasons').toArray(),
            vaccinationAdverseReactions: get(lookupDatum, 'vaccinationAdverseReactions').toArray(),
            vaccinationBodyRoutes: get(lookupDatum, 'routes').toArray(),
            vaccinationBodySites: get(lookupDatum, 'sites').toArray(),
            vaccinationScheduleSpecialIndications: get(lookupDatum, 'vaccinationScheduleSpecialIndications').toArray(),
            vaccinationSources: get(lookupDatum, 'sources').toArray(),
            vaccinationUnits: get(lookupDatum, 'vaccinationUnits').toArray(),
            vfcStatuses: get(lookupDatum, 'vfcStatuses').toArray(),
            visConcepts: get(lookupDatum, 'visConcepts').toArray()
        }));
    }).drop(),
    loadSelectedVaccineData: task(function* (selectedResult, setVaccineDetails) {
        const searchResultName = get(selectedResult, 'name');
        const isAdministered = get(this, 'isAdministered');
        const searchQuery = {
            searchGuid: get(selectedResult, 'searchGuid') || get(selectedResult, 'vaccineTypeGuid'),
            searchTypeCode: get(selectedResult, 'searchTypeCode') || 'VaccineType'
        };

        set(this, 'errors', null);
        try {
            const vaccineType = yield get(this, 'store').queryRecord('vaccine-type', searchQuery);
            if (isPresent(vaccineType)) {
                const existingInventoryGuid = get(this, 'vaccination.vaccineInventory.vaccineInventoryGuid');
                set(this, 'vaccination.vaccineInventory', null);

                const inventories = get(vaccineType, 'sortedVaccineInventories');
                const vaccineInventory = existingInventoryGuid ? inventories.findBy('vaccineInventoryGuid', existingInventoryGuid) : get(inventories, 'firstObject');
                const isCustom = get(vaccineType, 'isCustom');
                const isDynamic = isCustom && (get(selectedResult, 'searchTypeCode') || '').toLowerCase() === 'dynamicvaccine';
                set(vaccineType, 'isDynamic', isDynamic);
                if (isCustom) {
                    set(vaccineType, 'name', searchResultName);
                    if (isPresent(inventories)) {
                        setProperties(vaccineInventory, {
                            customVaccinationTypeName: searchResultName,
                            isHidden: true,
                            isDeleted: false
                        });
                    }
                }
                if (isPresent(inventories) && (isAdministered || isCustom)) {
                    set(this, 'vaccination.vaccineInventory', vaccineInventory);
                }

                setProperties(this, {
                    'referenceData.vaccineInventories': isAdministered ? inventories.toArray() : [],
                    'referenceData.vaccineManufacturers': get(vaccineType, 'manufacturers').toArray(),
                    'referenceData.immunizationDrugs': get(vaccineType, 'sortedImmunizationDrugs').toArray()
                });
                if (setVaccineDetails) {
                    setProperties(get(this, 'vaccination'), {
                        administeredByProviderGuid: isAdministered ? get(vaccineType, 'providerGuid') : null,
                        orderingProviderGuid: isAdministered ? get(vaccineType, 'providerGuid') : null,
                        vaccineType
                    });
                    if (isPresent(vaccineInventory) && isAdministered && !isDynamic) {
                        setProperties(get(this, 'vaccination'), {
                            immunizationFundingSource: get(vaccineInventory, 'immunizationFundingSource'),
                            manufacturer: get(vaccineInventory, 'vaccineManufacturer'),
                            ndc: get(vaccineInventory, 'ndc'),
                            vaccineLotExpirationDate: get(vaccineInventory, 'vaccineExpirationDate'),
                            vaccineLotNumber: get(vaccineInventory, 'vaccineLotNumber')
                        });
                    } else {
                        setProperties(get(this, 'vaccination'), {
                            immunizationFundingSource: null,
                            manufacturer: null,
                            ndc: null,
                            vaccineLotExpirationDate: null,
                            vaccineLotNumber: null
                        });
                    }
                }
            }
        } catch (err) {
            toastr.error('Failed to load vaccination details.');
        }
    }).drop(),
    saveVaccination: task(function* () {
        try {
            set(this, 'errors', null);
            const validator = get(this, 'validationRules');
            const { errors, valid } = yield validator.validate(this);

            if (valid) {
                yield get(this, 'vaccination').save();
                toastr.success('Immunization record saved');
                if (this.updatePatientAdContextCvxCodes) {
                    this.updatePatientAdContextCvxCodes();
                }
                yield get(this, 'savePatientPrivacyConsent').perform();
                this.close();
            } else {
                const resultantErrors = {};
                for (let field in errors) {
                    if (errors.hasOwnProperty(field) && isPresent(errors[field])) {
                        resultantErrors[field.split('.').join('')] = errors[field][0];
                    }
                }
                if (resultantErrors['vaccinationdosesFromInventory'] === 'Insufficient doses remaining') {
                    resultantErrors['vaccinationdosesFromInventory'] = get(this, 'doseCountRemainingText') || 'Insufficient doses remaining';
                }
                set(this, 'errors', Object.create(resultantErrors));
            }
        } catch (err) {
            toastr.error('Failed to save vaccination.');
        }
    }).drop(),
    searchVaccines: task(function* (query) {
        const sourceType = (get(this, 'sourceType') || 'historical').toLowerCase();
        const url = `${get(this, 'config.defaultHost')}/${get(this, 'config.immunizationNamespace')}/vaccines/advancedSearch`;
        query = query || '';

        if (query.lastIndexOf('.') === query.length - 1) {
            query = query.substring(0, query.length - 1);
        }
        if (query.indexOf('/') > -1) {
            query = query.substring(0, query.indexOf('/'));
        }

        const results = yield PFServer.promise(`${url}/${sourceType}/${encodeURIComponent(query.trim())}`);
        set(this, 'vaccineSearchResults', (results || []).map(result => {
            const resultTypeCode = (result.searchTypeCode || '').toLowerCase();
            const showAsInventory = ['vaccineinventory', 'customvaccine'].includes(resultTypeCode);
            result.groupTitle = showAsInventory ? 'From your inventory' : 'Additional search results';
            result.groupOrder = showAsInventory ? 0 : 1;
            return result;
        }).sortBy('groupOrder'));
    }).drop(),
    savePatientPrivacyConsent: task(function* () {
        const privacyConsentOption = get(this, 'privacyConsentOption');
        if (privacyConsentOption) {
            const entityGuid = get(this, 'vaccination.vaccinationGuid');
            const store = get(this, 'store');
            const optionCode = get(privacyConsentOption, 'code');
            let privacyConsentRecord = store.peekRecord('patient-privacy-consent', entityGuid);
            if (privacyConsentRecord) {
                set(privacyConsentRecord, 'optionCode', optionCode);
            } else {
                const patientPracticeGuid = get(this, 'vaccination.patientPracticeGuid');
                privacyConsentRecord = store.createRecord('patient-privacy-consent', {
                    id: entityGuid,
                    entityTypeCode: 'immz',
                    patientPracticeGuid,
                    optionCode
                });
            }
            yield privacyConsentRecord.save();
        }
    }),

    init() {
        this._super();
        get(this, 'loadReferenceData').perform();
    },
    validatorAdministered: LGTM.validator()
        .validates('vaccination.vaccineType')
            .required('A vaccine is required')
        .validates('vaccination.vaccinationDate')
            .required('An administered date is required')
        .validates('vaccination.vaccinationTime')
            .isTimeValid('An administered time is required')
        .validates('vaccination.administeredByProviderGuid')
            .required('An administering provider is required')
        .validates('vaccination.orderingProviderGuid')
            .required('An ordering provider is required')
        .validates('vaccination.facilityGuid')
            .required('An administered facility is required')
        .validates('vaccination.manufacturer')
            .using('vaccination.manufacturer', 'vaccination.vaccineInventory.vaccineManufacturer.vaccineManufacturerGuid',
                'vaccination.vaccineInventory.customVaccineManufacturerName',
                (vaccineManufacturer, inventoryManufacturerId, customVaccineManufacturerName) => {
                    return isPresent(vaccineManufacturer) ||
                        isPresent(inventoryManufacturerId) ||
                        isPresent(customVaccineManufacturerName);
                }, 'A manufacturer is required')
        .validates('vaccination.vaccineLotNumber')
            .using('vaccination.vaccineLotNumber', 'vaccination.vaccineInventory', (lotNumber, inventory) => {
                    return !isEmpty(lotNumber) || !isEmpty(inventory);
                }, 'A lot is required')
        .validates('vaccination.dosesFromInventory')
            .using('vaccination.dosesFromInventory', quantity => !isEmpty(quantity) && quantity > 0, 'A vaccine quantity is required')
            .using('vaccination.dosesFromInventory', 'vaccineInventory.remainingDoseCount', (quantity, inventoryRemaining) => {
                if (isEmpty(inventoryRemaining)) { return true; }
                const dosesToRemain = inventoryRemaining - quantity;
                return dosesToRemain >= 0;
            }, 'Insufficient doses remaining')
        .validates('vaccination.administeredAmount')
            .using('vaccination.administeredAmount', amount => !isEmpty(amount), 'An administered amount is required')
        .validates('vaccination.administeredUnits')
            .using('vaccination.administeredUnits', units => !isEmpty(units), 'Administered units are required')
        .validates('vaccination.vaccineLotExpirationDate')
            .using('vaccination.vaccineLotExpirationDate', 'vaccination.vaccineInventory.vaccineExpirationDate',
                (lotExpirationDate, vaccineExpirationDate) => {
                    return (isPresent(lotExpirationDate) && dateHelper.isValidDate(lotExpirationDate) && moment(lotExpirationDate).format('MM/DD/YYYY') === lotExpirationDate) ||
                        (isPresent(vaccineExpirationDate) && dateHelper.isValidDate(vaccineExpirationDate) && moment(vaccineExpirationDate).format('MM/DD/YYYY') === vaccineExpirationDate);
                }, 'A valid vaccine expiration date is required')
        .validates('vaccination.site')
            .when('isElectronicTransmission', 'vaccination.route', (isElectronicTransmission, route) => {
                return isElectronicTransmission && (!route || !get(route, 'isSiteIrrelevant'));
            })
            .required('A vaccination body site is required')
        .validates('vaccination.route')
            .when('isElectronicTransmission', isElectronicTransmission => isElectronicTransmission)
            .required('A vaccination route is required')
        .validates('vaccination.visConceptGuidList')
            .when('isElectronicTransmission', isElectronicTransmission => isElectronicTransmission)
            .using('vaccination.visConceptGuidList', 'vaccination.isVisConceptRequired', (list, isRequired) => {
                return !isRequired || (list || []).length >= 1;
            }, 'Vis edition is required')
        .validates('vaccination.vfcStatus')
            .when('isElectronicTransmission', isElectronicTransmission => isElectronicTransmission)
            .required('VFC financial class is required')
        .validates('providerHasNpi')
            .when('isElectronicTransmission', isElectronicTransmission => isElectronicTransmission)
            .using('providerHasNpi', providerHasNpi => {
                    return providerHasNpi === true;
                }, 'At least one provider needs an NPI to complete this immunization. ' +
                'Add the NPI using a link below or select a different administering or ordering provider.')
        .validates('vaccination.ndc')
            .when('isNdcNotRequired', isNdcNotRequired => !isNdcNotRequired)
            .required('An NDC is required')
        .build(),

        validatorHistorical: LGTM.validator()
        .validates('vaccination.vaccineType')
            .required('A vaccine is required')
        .validates('vaccination.source')
            .required('A source for information is required')
        .build(),

        validatorRefused: LGTM.validator()
        .validates('vaccination.vaccineType')
            .required('A vaccine is required')
        .validates('vaccination.rejectionReason')
            .required('A refusal reason is required')
        .build(),

    actions: {
        cancel() {
            const vaccinationGuid = get(this, 'vaccination.vaccinationGuid');
            if (vaccinationGuid) {
                const privacyConsentRecord = get(this, 'store').peekRecord('patient-privacy-consent', vaccinationGuid);
                if (privacyConsentRecord) {
                    privacyConsentRecord.rollbackAttributes();
                }
            }

            if (this.close) {
                this.close();
            }
        },
        clearExpirationWarningResponse() {
            set(this, 'showExpirationWarning', false);
            set(this, 'hasApprovedExpirationWarning', false);
        },
        confirmSave() {
            set(this, 'showExpirationWarning', false);
            set(this, 'hasApprovedExpirationWarning', true);
            get(this, 'saveVaccination').perform();
            get(this, 'analytics').track('Save Vaccine', {
                type: get(this, 'sourceType')
            });
        },
        delete() {

        },
        editVaccine() {
            set(this, 'isEditingVaccine', true);
            get(this, 'analytics').track('Edit Vaccine');
        },
        providerUpdated(administeredNpi, orderedNpi) {
            set(this, 'providerHasNpi', isPresent(administeredNpi) || isPresent(orderedNpi));
        },
        selectSourceType(sourceType) {
            set(this, 'sourceType', sourceType);
            set(this, 'vaccineQuery', '');
            set(this, 'vaccineSearchResults', []);
            set(this, 'selectedVaccine', null);
            get(this, 'createVaccination').perform();
            scheduleOnce('afterRender', this, () => {
                const $input = this.$('.composable-select__typeahead input');
                if ($input) {
                    $input.focus();
                }
            });
        },
        save() {
            if (get(this, 'vaccination.isVaccineLotExpired') && get(this, 'isAddingImmunization') && !get(this, 'hasApprovedExpirationWarning')) {
                set(this, 'showExpirationWarning', true);
            } else {
                this.send('confirmSave');
            }
        },
        selectVaccine(selectedVaccine) {
            set(this, 'isEditingVaccine', false);
            get(this, 'loadSelectedVaccineData').perform(selectedVaccine, true);
        },
        toggleDetails() {
            this.toggleProperty('isDetailsVisible');
        },
        selectPatientPrivacyConsent(privacyConsentOption) {
            set(this, 'privacyConsentOption', privacyConsentOption);
        }
    },
    setEditVaccinationProperties: observer('vaccination', 'isAddingImmunization', function () {
        const { vaccination, isAddingImmunization, preloadKeyword } = getProperties(this, 'vaccination', 'isAddingImmunization', 'preloadKeyword');
        if (vaccination) {
            if (!isAddingImmunization) {
                const sourceType = get(vaccination, 'source.sourceType');
                const selectedVaccine = get(vaccination, 'vaccineType');
                if (get(selectedVaccine, 'isCustom')) {
                    set(selectedVaccine, 'name', get(this, 'vaccination.vaccineName'));
                }
                setProperties(this, {
                    isDetailsVisible: sourceType === 'Administered',
                    privacyConsentOption: null,
                    selectedVaccine,
                    sourceType
                });
                get(this, 'loadSelectedVaccineData').perform(selectedVaccine);
            }
        } else {
            setProperties(this, {
                selectedVaccine: null,
                privacyConsentOption: null,
                vaccineQuery: preloadKeyword,
                preloadKeyword: null
            });
            if (isEmpty(preloadKeyword)) {
                set(this, 'sourceType', null);
            } else {
                this.send('selectSourceType', 'Administered');
            }
        }
    })
});
