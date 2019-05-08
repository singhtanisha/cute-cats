import { run } from '@ember/runloop';
import { moduleForComponent, test } from 'ember-qunit';
import Medication from 'clinical/models/medication';
import { startMirage } from 'boot/initializers/ember-cli-mirage';

const analytics = {
    track: $.noop
};
const routing = {};
const erxOrder = {};
let medication;
moduleForComponent('medication-detail', 'Unit - Core - Clinical | Component - medication detail', {
    unit: true,
    beforeEach() {
        this.register('service:authorization', { isEntitledFor: () => true }, { instantiate: false });
        medication = Medication.wrap({});
        this.register('service:analytics', analytics, { instantiate: false });
        this.register('service:pf-routing', routing, { instantiate: false });
        this.register('service:erx-order', erxOrder, { instantiate: false });
        this.server = startMirage();
    },
    afterEach() {
        this.server.shutdown();
    }
});

test('encounter - canDelete', function (assert) {
    run(() => {
        // Creates the component instance
        const component = this.subject();
        const currentGuid = 'f671bd1a-b6ac-4c7e-baa7-24741e4cfc92';
        const anotherGuid = 'e9450f31-01a3-4210-984e-1392a5bbc6f5';

        component.set('newMedicationFromSearchResult', medication);
        // From the encounter we have a currentGuid
        component.set('transcriptGuid', currentGuid);
        assert.equal(component.get('canDelete'), true);

        medication.createDefaultTranscriptMedication();
        assert.equal(component.get('canDelete'), true);

        medication.attachToEncounter(currentGuid);
        assert.equal(component.get('canDelete'), true);

        medication.attachToEncounter(anotherGuid);
        assert.equal(component.get('canDelete'), false);

        medication.detachFromEncounter(currentGuid);
        assert.equal(component.get('canDelete'), false);
    });
});

test('summary - canDelete', function (assert) {
    run(() => {
        const component = this.subject();
        const anotherGuid = 'e9450f31-01a3-4210-984e-1392a5bbc6f5';
        component.set('newMedicationFromSearchResult', medication);
        assert.equal(component.get('canDelete'), true);
        medication.createDefaultTranscriptMedication();
        medication.createDefaultTranscriptMedication();

        medication.attachToEncounter(anotherGuid);
        assert.equal(component.get('canDelete'), false);
    });
});
