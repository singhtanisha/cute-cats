import { moduleForComponent, test } from 'ember-qunit';
import session from 'boot/models/session';

const defaultImageUrl = 'assets/images/default_profile.png',
    testPatientPracticeGuid = 'TEST_PPG',
    testAuthCookie = 'TEST_AUTH_COOKIE';
moduleForComponent('patient-image', 'Unit - Core - Clinical | Component - patient-image', {
    unit: true,
    afterEach() {
        const store = this.container.lookup('service:store');
        if (store) {
            store.destroy = function() {
                // Do nothing because this breaks pre ember-data beta 1.15
            };
        }
    }
});

test('Image attributes are correct when hasPatientImage is false', function (assert) {
    let component = this.subject({
        hasPatientImage: false
    });
    assert.equal(component.get('src'), defaultImageUrl, 'The default image url is used for src when the patient has no image');
    assert.notOk(component.get('onerror'), 'The onerror attribute is empty when the patient has no image');
});

test('Image attributes are correct when hasPatientImage is true', function (assert) {
    session.set('authCookie', testAuthCookie);
    let component = this.subject({
        hasPatientImage: true,
        patientPracticeGuid: testPatientPracticeGuid
    });
    let src = component.get('src');
    assert.ok(src.indexOf(testPatientPracticeGuid) > 0, 'The image src contains the patient practice guid');
    assert.ok(src.indexOf(testAuthCookie) > 0, 'The image src contains the auth cookie from the session');
});
