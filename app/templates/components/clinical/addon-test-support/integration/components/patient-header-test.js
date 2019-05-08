import Service from '@ember/service';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import de from 'boot/tests/helpers/data-element';

const authorization = Service.extend({
    isEntitledFor() {
        return true;
    }
});
const COMPONENT = '.patient-header-component';
const PATIENT_AGE = '2 yrs';
const PATIENT_DOB = '10/01/2016';

moduleForComponent('patient-header', 'Integration - Core - Clinical | Component - patient-header', {
    integration: true,
    beforeEach() {
        this.register('service:authorization', authorization);
        this.inject.service('authorization');
    }
});

test('Renders missing patient state', function (assert) {
    this.render(hbs`{{patient-header patientMissingMessage="No patient" patientMissingMessageDetail="No patient details"}}`);

    assert.dom(`${COMPONENT} .patient-photo`).doesNotExist();
    assert.dom(de('patient-ribbon-no-patient-message')).hasText('No patient');
    assert.dom(de('patient-ribbon-no-patient-details')).hasText('No patient details');
});

test('Renders inactive patient state', function (assert) {
    const displayName = 'Ina ctive';
    this.set('patient', {
        isActive: false,
        genderString: 'male',
        displayName,
        age: PATIENT_AGE,
        birthDate: PATIENT_DOB
    });
    this.render(hbs`{{patient-header patient=patient isPhrStatusVisible=false}}`);

    assert.dom(COMPONENT).hasClass('inactive-patient');
    assert.dom(de('patient-ribbon-prn')).hasText('n/a');
    assert.dom(de('patient-ribbon-patient-name')).hasText(displayName);
    assert.dom(de('patient-ribbon-age-gender')).hasText(`${PATIENT_AGE} M`);
    assert.dom(de('patient-ribbon-dob')).hasText(PATIENT_DOB);
    assert.dom(de('patient-ribbon-mobile-phone')).doesNotExist();
});

test('Expand/collapse states', async function (assert) {
    this.set('patient', {
        isActive: true,
        genderString: 'male',
        displayName: 'Some baby',
        age: PATIENT_AGE,
        birthDate: PATIENT_DOB,
        mobilePhone: '5555555555',
        homePhone: '5555555556',
        officePhone: '5555555557'
    });
    this.render(hbs`{{patient-header patient=patient isPhrStatusVisible=false}}`);

    assert.dom(COMPONENT).doesNotHaveClass('inactive-patient');
    assert.dom(COMPONENT).doesNotHaveClass('is-expanded');
    assert.dom(de('patient-ribbon-mobile-phone')).hasText('M: (555) 555-5555');
    assert.dom(de('patient-ribbon-second-row')).doesNotExist();
    assert.dom(de('patient-ribbon-third-row')).doesNotExist();

    this.$(de('patient-ribbon-ellipsis')).click();
    await wait();
    assert.dom(COMPONENT).hasClass('is-expanded');
    assert.dom(de('patient-ribbon-second-row')).exists();
    assert.dom(de('patient-ribbon-third-row')).exists();
    assert.dom(de('patient-ribbon-home-phone')).hasText('H: (555) 555-5556');
    assert.dom(de('patient-ribbon-work-phone')).hasText('W: (555) 555-5557');

    this.$(de('patient-ribbon-ellipsis')).click();
    await wait();
    assert.dom(COMPONENT).doesNotHaveClass('is-expanded');
});
