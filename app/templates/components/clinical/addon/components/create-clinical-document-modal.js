import { on } from '@ember/object/evented';
import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';
import { equal, filterBy, alias } from '@ember/object/computed';
import Component from '@ember/component';
import LoadingMixin from 'clinical/mixins/loading';
import DestroyedMixin from 'tyrion/mixins/destroyed';
import SpinnerMixin from 'common/mixins/spinner';
import PFServer from 'boot/util/pf-server';

export default Component.extend(DestroyedMixin, LoadingMixin, SpinnerMixin, {
    classNames: ['create-clinical-document-modal'],
    showSpinner: alias('isLoading'),
    contentElement: '.content-modal',
    isSelectionDisabled: equal('selectedType', 'Referral Summary'),
    analytics: service(),
    title: computed('patientName', function() {
        return `Export patient record for ${this.get('patientName')}`;
    }),
    _loadDocumentTypes: on('init', function() {
        this._withProgress(this.store.findAll('ccda-document-type').then(documentTypes => this._setPropertiesUnlessDestroyed({
            documentTypes: documentTypes,
            selectedType: documentTypes.get('firstObject.code')
        })));
    }),
    _loadCcdaComponents: observer('selectedType', function() {
        this._withProgress(this.store.query('ccda-template-component', { documentType: this.get('selectedType') }).then(sections => {
            sections.setEach('isChecked', true);
            this._setUnlessDestroyed('sections', sections);
        }));
    }),
    optionalSections: filterBy('sections', 'isOptional'),
    actions: {
        selectAll(value) {
            if (!this.get('isSelectionDisabled')) {
                let sections = this.get('optionalSections') || [];
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
            let url = `${this.get('config.clinicalDocumentBaseURL')}/ccda/patient`,
                data = {
                    ccdaGenerationType: this.get('selectedType').replace(' Summary', ''),
                    patientPracticeGuid: this.get('patientPracticeGuid'),
                    requestedCcdaSections: this.get('optionalSections').filterBy('isChecked').map(function(section) {
                        return section.get('id').replace(/_|Section/g, '');
                    })
                };
            this._withProgress(PFServer.promise(url, 'POST', data))
                .catch(() => toastr.error('There was a problem creating the document'))
                .finally(() => {
                    this._unlessDestroyed(() => {
                        this.set('isVisible', false);
                        this.sendAction('create');
                    });
                });
            this.get('analytics').track('Data Portability Patient Generate');
        }
    },
    _getSections() {
        return this.get('optionalSections').map(function(section) {
            return {
                name: section.get('id'),
                toUse: section.get('isChecked')
            };
        });
    }
});
