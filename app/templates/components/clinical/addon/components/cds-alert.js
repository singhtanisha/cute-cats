import { isNone, isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import { alias, equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
const ENCOUNTER_MEDICATION_NEW_ROUTE = {
    route: 'encounter.medication',
    arg1: 'new'
};
const RESULT_NEW_ROUTE = {
    route: 'results.new',
    arg1: 'diagnostic'
};
const ACTION_LINK_TYPE_TO_EMBER_ROUTE_MAP = {
    addLabResult: RESULT_NEW_ROUTE,
    orderLabDiagnostic: {
        route: 'orders.new',
        arg1: 'diagnostic'
    },
    addVaccine: {
        route: 'patient.immunizations'
    },
    addMedication: ENCOUNTER_MEDICATION_NEW_ROUTE
};

export default Component.extend({
    analytics: service(),
    routing: service('pf-routing'),

    bubbleAction: null,
    cdsAlert: null,
    isExpanded: false,
    patientPracticeGuid: null,
    transcriptGuid: null,

    actionLinkText: alias('cdsAlert.actionLinkText'),
    actionLinkData: alias('cdsAlert.actionLinkData'),
    alertIdentifier: alias('cdsAlert.alertIdentifier'),
    ruleId: alias('cdsAlert.ruleId'),
    isExternalLink: equal('actionLinkType', 'resourceLink'),
    showInfobuttonLink: alias('cdsAlert.infobutton.length'),

    eventTypeGuid: computed('actionLinkData', function () {
        const actionLinkDataQueryString = this.get('actionLinkData');
        if (actionLinkDataQueryString) {
            return this._getParameterByName('eventTypeGuid', actionLinkDataQueryString);
        }
        return null;
    }),
    worksheetGuid: computed('actionLinkData', function () {
        const actionLinkDataQueryString = this.get('actionLinkData');
        if (actionLinkDataQueryString) {
            return this._getParameterByName('worksheetGuid', actionLinkDataQueryString);
        }
        return null;
    }),
    token: computed('actionLinkData', function () {
        const actionLinkDataQueryString = this.get('actionLinkData');
        if (actionLinkDataQueryString) {
            const name = this._getParameterByName('name', actionLinkDataQueryString);
            if (name) {
                return { name };
            }
        }
        return null;
    }),
    data: computed('actionLinkData', function () {
        const actionLinkDataQueryString = this.get('actionLinkData');
        if (actionLinkDataQueryString) {
            const data = {};
            const params = actionLinkDataQueryString.split('&');
            params.forEach(param => {
                const kvp = param.split('=');
                data[decodeURIComponent(kvp[0])] = decodeURIComponent(kvp[1] || '');
            });

            return data;
        }
        return null;
    }),
    externalLinkUri: computed('actionLinkData', function () {
        const actionLinkDataQueryString = this.get('actionLinkData');
        if (actionLinkDataQueryString) {
            return this._getParameterByName('uri', actionLinkDataQueryString);
        }
        return null;
    }),
    internalRouteLink: computed('alertIdentifier', function () {
        // Ugh, unfortunate necessary evil because we want ember route link information to be sourced on the client.
        const actionLinkType = this.get('actionLinkType');
        const vaccineSearchQuery = this.get('vaccineSearchQuery');
        const internalRouteParameters = ACTION_LINK_TYPE_TO_EMBER_ROUTE_MAP[actionLinkType];

        if (internalRouteParameters && isNone(vaccineSearchQuery)) {
            return internalRouteParameters;
        }

        if (actionLinkType === 'internalSupportLink') {
            return {
                route: 'supportInfo',
                arg1: this.get('actionLinkData')
            };
        }
        return null;
    }),
    isVaccineRoute: computed('pf-routing.currentRouteName', function () {
        const currentRouteName = this.get('routing').get('currentRouteName');
        if (currentRouteName === 'patient.immunizations') {
            return true;
        }
        return null;
    }),
    vaccineSearchQuery: computed('actionLinkData', function () {
        const actionLinkDataQueryString = this.get('actionLinkData');
        if (actionLinkDataQueryString) {
            return this._getParameterByName('searchQuery', actionLinkDataQueryString);
        }
        return null;
    }),
    ruleVersion: alias('cdsAlert.ruleVersion'),
    actionLinkType: computed('cdsAlert.actionLinkType', 'session.userEditLevel', function () {
        const actionLinkType = this.get('cdsAlert.actionLinkType');
        const userEditLevel = this.get('session.userEditLevel');
        if (actionLinkType === 'addQualityOfCareIndicator' && userEditLevel < 2) {
            return null;
        }
        return actionLinkType;
    }),
    _getParameterByName(name, queryString) {
        if (isEmpty(queryString)) {
            return null;
        }

        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp(name + '(=([^&#]*)|&|#|$)');
        const results = regex.exec(queryString);
        if (!results) {
            return null;
        }
        if (!results[2]) {
            return '';
        }
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },
    _track(text, data) {
        const trackingData = data || {};
        trackingData['CDS Alert Identifier'] = this.get('ruleId');
        trackingData['Transcript Guid'] = this.get('transcriptGuid');
        trackingData['Patient Practice Guid'] = this.get('patientPracticeGuid');
        this.get('analytics').track(text, trackingData);
    },
    actions: {
        dismiss() {
            this.attrs.cdsAlertDismissed(this.get('cdsAlert'));
            this._track('Cds Alert Dismissed');
        },
        toggleExpanded() {
            this.toggleProperty('isExpanded');

            if (this.get('isExpanded')) {
                this._track('Cds Alert Expanded');
            }
        },
        bubbleAction() {
            const cdsAction = {
                text: this.get('actionLinkText'),
                action: this.get('actionLinkType'),
                data: this.get('data'),
                worksheetGuid: this.get('worksheetGuid'),
                eventTypeGuid: this.get('eventTypeGuid'),
                // ruleId to be compatible with encounter code
                cdsRuleId: this.get('ruleId'),
                searchQuery: this.get('vaccineSearchQuery'),
                patientPracticeGuid: this.get('patientPracticeGuid')
            };
            const token = this.get('token');

            if (this.get('isVaccineRoute')) {
                cdsAction.preloadCode = cdsAction.searchQuery;
                cdsAction.preloadKeyword = cdsAction.searchQuery;
            } else if (cdsAction.action === 'addVaccine' && cdsAction.searchQuery) {
                cdsAction.action = 'preloadPatientImmunizations';
                cdsAction.arg1 = cdsAction.searchQuery;
            }
            if (token) {
                cdsAction.token = token;
                cdsAction.source = 'CDS Alert';
                // TODO: Extract out the defaults to be more generic when we get another clinical worksheet deal
                cdsAction.defaults = [{
                    key: 'proliaMedicationHistory',
                    property: 'value',
                    value: 'PreviousHistory'
                }];
            }

            this.attrs.bubbleAction(cdsAction);

            this._track('Cds Alert Custom Action Followed', {
                'CDS Alert Custom Action Text': cdsAction.text
            });
        },
        openUri(uri) {
            const usableUri = uri || this.get('cdsAlert.customAction.uri');
            this._track('Cds Alert External Deep Link Uri Opened');
            window.open(usableUri, '_blank');
        },
        routeLink(route, argument) {
            if (route) {
                this._track('Cds Alert Went To Internal Link', {
                    'CDS Alert Internal Link Route': route
                });

                if (argument) {
                    this.get('routing').transitionToRoute(route, argument);
                } else {
                    this.get('routing').transitionToRoute(route);
                }
            }
        },
        trackReferenceLinkClick() {
            this._track('Cds Alert Reference Information Click');
        }
    }
});
