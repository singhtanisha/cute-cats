import { isPresent } from '@ember/utils';
import { observer } from '@ember/object';
import { on } from '@ember/object/evented';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import SpinnerMixin from 'common/mixins/spinner';
import LoadingMixin from 'clinical/mixins/loading';
import DestroyedMixin from 'tyrion/mixins/destroyed';
import ContactToProfileAdapter from 'clinical/models/contact-to-profile-adapter';

export default Component.extend(SpinnerMixin, LoadingMixin, DestroyedMixin, {
    classNames: ['care-team-list'],
    showSpinner: alias('isLoading'),

    loadCareTeam: on('init', observer('patientPracticeGuid', function () {
        if (this.get('patientPracticeGuid')) {
            this.get('store').findRecord('care-team', this.get('patientPracticeGuid')).then(careTeam => this._unlessDestroyed(() => {
                this.reloadContactsIfNeeded(careTeam);
                this.set('careTeam', careTeam);
            }));
        }
    })),
    reloadContactsIfNeeded(careTeam) {
        const members = careTeam.get('members');
        const membersNeedingReload = members ? members.filter(member => {
            return member.get('isDirectoryContact') && !member.get('directoryContact');
        }) : null;
        if (isPresent(membersNeedingReload)) {
            this.get('store').findAll('directory-contact').then(contacts => {
                membersNeedingReload.forEach(member => {
                    const contact = contacts.findBy('id', member.get('id'));
                    if (contact) {
                        member.set('profile', ContactToProfileAdapter.create({directoryContact: contact}));
                    }
                });
            });
        }
    },
    actions: {
        add() {
            this.sendAction('addProvider');
        },
        edit(member) {
            if (!this.get('disabled')) {
                this.sendAction('selectMember', member);
            }
        },
        delete(member) {
            var careTeam = this.get('careTeam');
            member.get('relationships').clear();
            this._withProgress(member.save().then(function () {
                // TODO: try moving this to the care-team-member serializer. We already have the response payload with all the data, but we're not mapping it back correctly
                careTeam.reload();
            })).errorMessage('Failed to delete the care team member');
        }
    }
});
