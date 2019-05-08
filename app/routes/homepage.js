import Route from '@ember/routing/route';
import Ember from 'ember';

export default Route.extend({
    ajax: Ember.inject.service(),
    model() {
        return null;
    }
});
