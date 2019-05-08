import { moduleFor, test } from 'ember-qunit';

const TRANSMIT_TEXT_FALSE = 'You will transmit all vaccination info including administered, historical and refused vaccination records for this patient.',
    TRANSMIT_TEXT_TRUE = 'The patient indicated to not transmit and share immunization information. Go to Patient Profile to change immunization registry settings.';

moduleFor('controller:patient.immunizations', 'Unit - Core - Clinical | Controller - Immunizations', {
    needs: ['controller:patient', 'service:authorization', 'service:analytics'],
    unit: true,
    afterEach() {
        let store = this.container.lookup('service:store');

        if (store) {
            store.destroy = function() {
                // Do nothing because this breaks pre ember-data beta 1.15
            };
        }
    }
});

test('Sets the correct transmitPopOverText when immunizationTransmitPreference is true', function(assert) {
    const controller = this.subject();

    controller.set('immunizationTransmitPreference', true);
    assert.equal(controller.get('transmitPopOverText'), TRANSMIT_TEXT_TRUE);
});

test('Sets the correct transmitPopOverText when immunizationTransmitPreference is false', function(assert) {
    const controller = this.subject();

    controller.set('immunizationTransmitPreference', false);
    assert.equal(controller.get('transmitPopOverText'), TRANSMIT_TEXT_FALSE);
});
