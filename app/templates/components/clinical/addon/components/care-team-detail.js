import { scheduleOnce } from '@ember/runloop';
import { hash } from 'rsvp';
import { not, alias } from '@ember/object/computed';
import Component from '@ember/component';
import { isPresent } from '@ember/utils';
import { on } from '@ember/object/evented';
import EmberObject, {
  get,
  observer,
  computed
} from '@ember/object';
import SpinnerSupport from 'common/mixins/spinner';
import Loading from 'clinical/mixins/loading';
import DestroyedMixin from 'tyrion/mixins/destroyed';
import ContactToProfileAdapter from 'clinical/models/contact-to-profile-adapter';
import ProviderProfileToProfileAdapter from 'clinical/models/provider-profile-to-profile-adapter';
import LGTM from 'common/helpers/validation';
import Validatable from 'ember-lgtm/mixins/validatable';

var phoneValidator = function (phone) {
        // At least 10 characters and only parens, dashes, plus, spaces and digits
        return isPresent(phone) && phone.length >= 10 && /^[\d()\-\+\s]*$/.test(phone);
    },
    wrapInAdapters = function (hash) {
        hash.practiceProviders = hash.practiceProviders.map(function (provider) {
            return ProviderProfileToProfileAdapter.create({providerProfile: provider, specialties: hash.specialties});
        });
        hash.directoryContacts = hash.directoryContacts.map(function (contact) {
            return ContactToProfileAdapter.create({directoryContact: contact});
        });
        return hash;
    },
    filterContactsAlreadyInCareTeam = function (careTeam, hash) {
        var idsAlreadyPartOfCareTeam = careTeam.getWithDefault('members', []).mapBy('id');
        hash.practiceProviders = hash.practiceProviders.reject(function (contact) {
            return idsAlreadyPartOfCareTeam.includes(get(contact, 'id'));
        });
        hash.directoryContacts = hash.directoryContacts.reject(function (contact) {
            return idsAlreadyPartOfCareTeam.includes(get(contact, 'id'));
        });
    },
    Contact = EmberObject.extend(Validatable, {
        validator: LGTM.validator()
            .validates('firstName')
                .required('First Name is required.')
                .isName('Name cannot contain any special symbols or numbers')
            .validates('lastName')
                .required('Last Name is required.')
                .isName('Name cannot contain any special symbols or numbers')
            .validates('fax')
                .required('Fax is required.')
                .using(phoneValidator, 'Enter a valid fax number')
            .validates('officePhone')
                .optional()
                .using(phoneValidator, 'Enter a valid phone number')
            .validates('email')
                .optional()
                .email('Must be a valid email address.')
            // .validates('directAddress')
            //     .optional()
            //     .email('Must be a valid email address.')
            .build()
    });

export default Component.extend(SpinnerSupport, Loading, DestroyedMixin, Validatable, {
    classNames: ['care-team-detail', 'col-xs-5'],

    // SpinnerSupport overrides
    contentElement: '.well.right-module',
    showSpinner: alias('isLoading'),
    bigHeaderText: computed(function () {
        return this.get('isNew') ?
            'Add provider' :
            'Edit provider';
    }),
    isAddingNew: not('member'),
    cantBePreferred: computed('contact.isProviderProfile', 'isBackup', function () {
        return !this.get('contact.isProviderProfile') ||
            this.get('isBackup');
    }),
    cantBeBackup: computed('contact.isProviderProfile', 'isPreferred', function () {
        return !this.get('contact.isProviderProfile') ||
            this.get('isPreferred');
    }),

    // Confirm change properties
    confirmChangeTitle: computed('changingPreferredProvider', 'changingPrimaryProvider', function () {
        if (this.get('changingPreferredProvider') && this.get('changingPrimaryProvider')) {
            return 'Update preferred and primary care provider (PCP)';
        }
        else if (this.get('changingPreferredProvider')) {
            return 'Update preferred provider';
        } else if (this.get('changingPrimaryProvider')) {
            return 'Update primary care provider (PCP)';
        }
    }),
    confirmChangeDescription: computed('changingPreferredProvider', 'changingPrimaryProvider', function () {
        if (this.get('changingPreferredProvider') && this.get('changingPrimaryProvider')) {
            return 'Preferred and primary care providers (PCP) are already assigned for this patient. The preferred and primary care provider(s) (PCP) will be removed from this patient\'s care team unless the previously assigned provider(s) have another relationship to this patient.';
        }
        else if (this.get('changingPreferredProvider')) {
            return 'A preferred provider is already assigned for this patient. That preferred provider will be removed from this patient\'s care team unless that provider has another relationship to patient.';
        } else if (this.get('changingPrimaryProvider')) {
            return 'A primary care provider (PCP) is already assigned for this patient. That primary care provider (PCP) will be removed from this patient\'s care team unless that provider has another relationship to patient.';
        }
    }),
    needsToConfirmProviderChange: computed('isProviderChangeConfirmed', 'changingPreferredProvider', 'changingPrimaryProvider', function () {
        if (this.get('isProviderChangeConfirmed')) {
            // The user already confirmed they want to do it.
            return false;
        }
        return this.get('changingPreferredProvider') || this.get('changingPrimaryProvider');
    }),
    changingPreferredProvider: computed('isPreferred', 'member', 'careTeam.preferredProvider', function () {
        return this.get('isPreferred') &&
            this.get('careTeam.preferredProvider') &&
            this.get('careTeam.preferredProvider') !== this.get('member');
    }),
    changingPrimaryProvider: computed('isPrimary', 'member', 'careTeam.primaryProvider', function () {
        return this.get('isPrimary') &&
            this.get('careTeam.primaryProvider') &&
            this.get('careTeam.primaryProvider') !== this.get('member');
    }),
    init() {
        this._super();
        this.set('resizables', []);
    },
    initializeProperties: observer('member', on('init', function () {
        if (!this.get('member')) {
            // if we don't have a member, reset all the properties to their default values
            // This won't be needed if we were using routes since we would have clean transitions
            this.setProperties({
                isPreferred: false,
                isBackup: false,
                isPrimary: false,
                isReferring: false,
                isOther: false,
                otherDescription: '',
                contact: null
            });
            this._loadDirectoryAndProviders();
            return;
        }
        var member = this.get('member'),
            profile = member.get('profile'),
            relationships = member.get('relationships'),
            otherRelationship = relationships.findBy('careTeamMemberType', 'Other');
        this.setProperties({
            isPreferred: relationships.isAny('careTeamMemberType', 'PreferredProvider'),
            isBackup: relationships.isAny('careTeamMemberType', 'BackupProvider'),
            isPrimary: relationships.isAny('careTeamMemberType', 'PrimaryCareProvider'),
            isReferring: relationships.isAny('careTeamMemberType', 'ReferringProvider'),
            isOther: !!otherRelationship,
            otherDescription: otherRelationship ? get(otherRelationship, 'description') : ''
        });
        this._withProgress(this.get('store').findRecord('care-team', this.get('patientPracticeGuid')).then((careTeam)=>{
            this.set('careTeam', careTeam);
        }));
        this._setContact(profile);
    })),

    // provided entity. Only modified on save.
    member: null,
    selectOptions: null,

    // Copies of original values
    isPreferred: false,
    isBackup: false,
    isPrimary: false,
    isReferring: false,
    isOther: false,
    otherDescription: '',
    cantEditOtherDescription: not('isOther'),
    contact: null, // TODO: rename to profile, since this is the abstraction (sometimes practiceProvider not only the contact)

    validator: LGTM.validator()
        .validates('contact')
            .when(function (contact) {
                // Only validate the contact if it's a directoryContact. We don't edit practiceProviders
                return get(contact, 'isDirectoryContact');
            })
            .isValid()
        .validates('relationships')
            .using(function (value, key, validatableObject) {
                return validatableObject.get('isPreferred') ||
                    validatableObject.get('isBackup') ||
                    validatableObject.get('isPrimary') ||
                    validatableObject.get('isReferring') ||
                    validatableObject.get('isOther');
            }, 'You need to select at least one relationship')
        .build(),

    actions: {
        cancel() {
            this.sendAction('close');
        },
        confirmProviderChange() {
            // window.alert('confirmed!!');
            this.set('isProviderChangeConfirmed', true);
            this.set('isConfirmingProviderChange', false);
            this.send('save');
        },
        save() {
            var _this = this,
                member = this.get('member') || this.get('store').createRecord('care-team-member', {patientPracticeGuid: this.get('patientPracticeGuid')}),
                relationships = member.get('relationships'),
                doSave = function () {
                    return member.save().then(function () {
                        // TODO: try moving this to the care-team-member serializer. We already have the response payload with all the data, but we're not mapping it back correctly
                        return _this.get('careTeam').reload().then(function () {
                            _this.sendAction('close');
                        });
                    }).errorMessage('Had problems saving');
                };

            if (this.get('isAddingNew') && !this.get('contact')) {
                // Nothing to do here. They just opened it, didn't select anyone and clicked X
                this.sendAction('close');
                return;
            }

            this._withProgress(this.validate().then(function (isValid) {
                var errorMessage = _this.get('errors.relationships') || 'Please review the errors and try again.';
                if (!isValid) {
                    toastr.error(errorMessage);
                    return;
                }
                if (_this.get('needsToConfirmProviderChange')) {
                    _this.set('isConfirmingProviderChange', true);
                    return;
                }

                relationships.clear();
                if (_this.get('isAddingNew')) {
                    member.set('profile', _this.get('selectedProfile'));
                    member.set('id', member.get('profile.id'));
                }
                if (_this.get('isPreferred')) {
                    relationships.pushObject({careTeamMemberType: 'PreferredProvider'});
                }
                if (_this.get('isBackup')) {
                    relationships.pushObject({careTeamMemberType: 'BackupProvider'});
                }
                if (_this.get('isPrimary')) {
                    relationships.pushObject({careTeamMemberType: 'PrimaryCareProvider'});
                }
                if (_this.get('isReferring')) {
                    relationships.pushObject({careTeamMemberType: 'ReferringProvider'});
                }
                if (_this.get('isOther')) {
                    relationships.pushObject({careTeamMemberType: 'Other', description: _this.get('otherDescription')});
                }
                if (_this.get('contact.isDirectoryContact')) {
                    // TODO: consider adding dirty tracking to the profile
                    member.get('profile').setProperties(_this.get('contact'));
                    return member.get('profile.directoryContact').save().then(function () {
                        member.set('id', member.get('profile.id'));
                        doSave();
                    });
                } else {
                    return doSave();
                }
            }));
        },
        profileSelected(selectedOption) {
            var profile = get(selectedOption, 'profile');
            this.set('selectedProfile', profile);
            this._setContact(profile);
        },
        createContact() {
            var profile = ContactToProfileAdapter.create({
                directoryContact: this.get('store').createRecord('directory-contact')
            });
            this.set('selectedProfile', profile);
            this._setContact(profile);
        }
    },

    _loadDirectoryAndProviders() {
        // TODO: consider moving all the mapping logic to a repo or its own adasermol
        var selectOptions = [];
        if (!this.get('selectOptions')) {
            // Set this early to avoid trying to load twice since ED doesn't do a good job at this
            this.set('selectOptions', selectOptions);
            this._withProgress(hash({
                practiceProviders: this.get('store').findAll('provider-profile'),
                directoryContacts: this.get('store').findAll('directory-contact'),
                specialties: this.get('store').findAll('specialty'),
                careTeam: this.get('store').findRecord('care-team', this.get('patientPracticeGuid'))
            }).then(wrapInAdapters).then((hash)=> {
                this.set('careTeam', hash.careTeam);
                filterContactsAlreadyInCareTeam(hash.careTeam, hash);
                selectOptions.pushObjects(hash.practiceProviders.map(function (provider) {
                    return {
                        groupKey: 1,
                        group: 'Your practice',
                        profile: provider
                    };
                }));
                selectOptions.pushObjects(hash.directoryContacts.map(function (contact) {
                    return {
                        groupKey: 2,
                        group: 'Your connections',
                        profile: contact
                    };
                }));
                // selectOptions.pushObject({
                //     groupKey: 3,
                //     group: 'Practice fusion directory',
                //     // TODO: add selectOptionItem to override the template, grey this out and disable it
                //     fullProviderName: 'Search to see providers in the directory'
                // });
            }));
        }
    },

    _setContact(profile) {
        var properties = profile.getProperties('firstName', 'lastName', 'specialtyId', 'specialty', 'officePhone', 'fax', 'email', 'isDirectoryContact', 'isProviderProfile'),
            contact = Contact.create(properties);
        this.set('contact', contact);
    },

    _focusOnFirstSelect: on('didInsertElement', function() {
        this.$('input').first().focus();
    }),
    _focusOnSecondInput: observer('selectedProfile', function () {
        var _this = this;
        scheduleOnce('afterRender', function () {
            var inputs = _this.$('input:enabled'),
                secondInput = $(inputs[1]);
            secondInput.focus();
        });
    }),
});
