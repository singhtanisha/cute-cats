import { isPresent } from '@ember/utils';
import config from 'boot/config';
import PFServer from 'boot/util/pf-server';

export default {
    loadCcda(params) {
        const isOutboundCcda = params.isOutbound;
        let url = `${config.clinicalDocumentBaseURL}/ccda/${params.documentGuid}`;

        if (!isOutboundCcda) {
            url = `${config.defaultHost}${config.clinicalDocumentBaseURL_v2}/incomingCcda/${params.documentGuid}`;
        } else {
            url = `${config.defaultHost}${config.clinicalDocumentBaseURL_v2}/ccda/${params.documentGuid}`;
        }
        if (params.threadGuid) {
            url += `/${params.threadGuid}`;
        }
        if (params.patientPracticeGuid) {
            url += `?patientPracticeGuid=${params.patientPracticeGuid}`;
        }

        return PFServer.promise(url).then(data => {
            const ccda = data.clinicalDocument || {};
            const components = ccda.components || [];

            components.forEach(component => {
                component.dataElement = 'ccda-component-' + component.title.replace(/\W/g, '');
                component.dataElementToc = 'ccda-toc-component-' + component.title.replace(/\W/g, '');
                component.dataElementClass = `.${component.dataElement}`;
                // For PF generated outbound ccdas, show all components by default
                component.isDisplayActive = component.isDisplayActive || isOutboundCcda;

                const sortingTemplateOid = component.sortingTemplateOid;
                component.sortingTemplateOid = sortingTemplateOid;
                component.isChild = isPresent(sortingTemplateOid) && sortingTemplateOid !== component.templateOid;
                if (component.isChild) {
                    const parentComponent = components.findBy('templateOid', component.sortingTemplateOid);
                    if (isPresent(parentComponent)) {
                        component.isDisplayActive = parentComponent.isDisplayActive;
                    }
                }
            });

            ccda.validationErrors = this.getValidationErrors(data.clinicalDocumentValidationError || null);
            return ccda;
        });
    },
    validateCcda(params) {
        let url = `${config.defaultHost}${config.clinicalDocumentBaseURL_v2}/incomingCcdaValidation/${params.documentGuid}`;
        if (params.threadGuid) {
            url += `/${params.threadGuid}`;
        }
        if (params.patientPracticeGuid) {
            url += `?patientPracticeGuid=${params.patientPracticeGuid}`;
        }

        return PFServer.promise(url).then(data => {
            return this.getValidationErrors(data);
        });
    },
    getValidationErrors(data) {
        if (isPresent(data) && isPresent(data.errorList)) {
            data.errorList.forEach((errorItem, index) => {
                const errorTypeText = isPresent(errorItem.type) ? errorItem.type.toLowerCase() : '';
                let errorIndicator = errorTypeText.indexOf('error') > -1 ? 'Error' : 'Info';
                if (errorTypeText.indexOf('warning') > -1) {
                    errorIndicator = 'Warning';
                }
                errorItem.dataElement = `ccda-error-${index}`;
                errorItem.dataElementClass = `.ccda-error-${index}`;
                errorItem.errorTypeIndicator = errorIndicator;
            });
        }
        return data;
    },
    auditPrint(data) {
        return PFServer.promise(`${config.clinicalDocumentBaseURL}/ccda/auditPrint`, 'POST', data);
    }
};
