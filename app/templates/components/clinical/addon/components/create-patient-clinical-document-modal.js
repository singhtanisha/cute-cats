import { isPresent } from '@ember/utils';
import { on } from '@ember/object/evented';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import LoadingMixin from 'clinical/mixins/loading';
import DestroyedMixin from 'tyrion/mixins/destroyed';
import SpinnerMixin from 'common/mixins/spinner';
import PFServer from 'boot/util/pf-server';

export default Component.extend(DestroyedMixin, LoadingMixin, SpinnerMixin, {
    classNames: ['create-clinical-document-modal', 'patient-ccda-modal'],
    showSpinner: alias('isLoading'),
    contentElement: '.content-modal',
    analytics: service(),

    patientName: null,
    dob: null,
    gender: null,

    sections: null,
    _loadCcdaComponents: on('init', function() {
        this._withProgress(this.store.query('ccda-template-component', { documentType: 'Clinical' }).then(sections => {
            sections.setEach('isChecked', true);
            this._setUnlessDestroyed('sections', sections);
        }));
    }),
    actions: {
        selectAll(value) {
            if (isPresent(this.get('sections'))) {
                const sections = this.get('sections') || [];
                sections.setEach('isChecked', value);
            }
        },
        cancel() {
            this.set('isVisible', false);
        },
        create() {
            if (this.get('isLoading')) {
                return;
            }
            const url = `${this.get('config.clinicalDocumentBaseURL')}/ccda/patient`;
            const data = {
                ccdaGenerationType: 'Clinical',
                patientPracticeGuid: this.get('patientPracticeGuid'),
                requestedCcdaSections: this.get('sections').filterBy('isChecked').mapBy('id')
            };
            this._withProgress(PFServer.promise(url, 'POST', data))
                .then(() => {
                    this.sendAction('create');
                    this.get('analytics').track('Data Portability Patient Generate');
                })
                .catch(() => toastr.error('There was a problem creating the document'))
                .finally(() => {
                    this._unlessDestroyed(() => {
                        this.set('isVisible', false);
                    });
                });
        }
    },
    _getSections() {
        return this.get('sections').map(section => {
            return {
                name: section.get('id'),
                toUse: section.get('isChecked')
            };
        });
    }
});
