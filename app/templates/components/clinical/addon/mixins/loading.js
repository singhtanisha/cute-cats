/***
 * Provides helpers method set progress indicator flags when working with promises
 * and display errors notifications using toastr's as the result of promises
 */
// TODO: consider re-openining controller and this helper's there.
import { isPresent } from '@ember/utils';

import { gt } from '@ember/object/computed';
import Mixin from '@ember/object/mixin';
export default Mixin.create({
    __loadingCounter: 0,
    isLoading: gt('__loadingCounter', 0),
    /***
     * Evaluates a promise while setting up a loading indicator to show progress
     */
    _withProgress(promise) {
        var _this = this;
        this.incrementProperty('__loadingCounter');
        if (isPresent(promise)) {
            return promise.finally(function () {
                if (!_this.get('isDestroyed')) {
                    _this.decrementProperty('__loadingCounter');
                    if (_this.get('__loadingCounter') === 0 && _this.get('isLoading')) {
                        _this.notifyPropertyChange('isLoading');
                    }
                }
            });
        }
    }
});
