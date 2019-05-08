import { inject as service } from '@ember/service';
import Component from '@ember/component';
export default Component.extend({
    routing: service('pf-routing'),
    classNames: ['list', 'list--hover', 'list--selectable'],
    tagName: 'ul',
    actions: {
        edit(healthConcern) {
            const route = this.get('healthConcernRoute');
            if (route === 'summary.health-concern') {
                this.get('routing').transitionToRoute(route, healthConcern.get('patientPracticeGuid'), healthConcern);
            } else {
                this.get('routing').transitionToRoute(route, healthConcern);
            }
        }
    }
});
