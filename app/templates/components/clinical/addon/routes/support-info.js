import { isEmpty } from '@ember/utils';
import $ from 'jquery';
import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';
import AuthenticatedBaseRoute from 'boot/routes/authenticated-base';
import pfStringUtil from 'boot/util/pf-string-util';

const SUPPORT_RESOURCES = [
        {
            id: 'pompeTestingInfo',
            title: 'Pompe rare disease program',
            tabTitle: 'Pompe information',
            tagline: 'Clinical decision support in your EHR can help you identify patients with Pompe',
            template: 'support/pompe',
            trackingKey: 'Pompe Link Clicked'
        }
    ];
export default AuthenticatedBaseRoute.extend({
    analytics: service(),
    tabRoute: 'support-info',
    selectedResource: {},
    previousRoute: 'charts.list',
    previousRouteArguments: {},

    model(params, transition, queryParams) {
        queryParams = params.queryParams || transition.queryParams || queryParams || {};

        if (queryParams.returnRoute) {
            this.setProperties({
                previousRoute: queryParams.returnRoute,
                previousRouteArguments: pfStringUtil.parseIfArray(queryParams.returnRouteArguments)
            });
        }

        if (isEmpty(params.resourceId)) {
            return null;
        }
        return EmberObject.create(SUPPORT_RESOURCES.findBy('id', params.resourceId));
    },
    setupController(controller, model) {
        let chartsController = this.controllerFor('charts'),
            previousRoute = this.get('previousRoute'),
            previousRouteArguments = this.get('previousRouteArguments');

        controller.set('model', model);
        this.set('selectedResource', model);

        // Set up top navigation
        chartsController.send('openTab', EmberObject.create({
            label: model.tabTitle || 'Support information',
            route: 'supportInfo',
            arg1: model.id,
            transitionOnCloseRoute: previousRoute,
            transitionOnCloseArguments: previousRouteArguments,
            dismissible: true,
            dupeOk: false
        }));

        this._super(controller, model);
    },
    actions: {
        trackClick(id) {
            let element = $('#' + id),
                href = element.attr('href'),
                key = this.get('selectedResource.trackingKey'),
                data = null;

            if(key) {
                if(element) {
                    data = {
                        'Link Id': id,
                        'Link Url': element.attr('href')
                    };
                }
                this.get('analytics').track(key, data);
            }
            window.open(href, '_blank');
        }
    }
});
