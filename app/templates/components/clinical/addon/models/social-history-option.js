import Model from 'ember-data/model';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
    genderIdentityOptions: hasMany('demographic-option', { async: false }),
    sexualOrientationOptions: hasMany('demographic-option', { async: false }),
    riskScoreOptions: hasMany('demographic-option', { async: false })
});
