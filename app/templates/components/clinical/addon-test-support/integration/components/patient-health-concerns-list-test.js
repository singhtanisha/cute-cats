import Service from '@ember/service';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import Mirage from 'ember-cli-mirage';
import setupStore from 'boot/tests/helpers/store';
import { startMirage } from 'boot/initializers/ember-cli-mirage';
import de from 'boot/tests/helpers/data-element';
import PatientHealthConcern from 'clinical/models/patient-health-concern';
import PatientHealthConcernAdapter from 'clinical/adapters/patient-health-concern';
import PatientHealthConcernSerializer from 'clinical/serializers/patient-health-concern';
import PatientAllergy from 'clinical/models/patient-allergy';
import PatientAllergyAdapter from 'clinical/adapters/patient-allergy';
import PatientAllergySerializer from 'clinical/serializers/patient-allergy';
import config from 'boot/config';

const ADD_NOTE_BUTTON = de('add-health-concern-note-button');
const PATIENT_PRACTICE_GUID = 'c5faffde-78e2-4924-acaf-2115bc686d5e';
const EMPTY_RESPONSE = {
    patientHealthConcerns: [],
    meta: { noKnownHealthConcerns: false }
};
const CLINICAL_HEALTH_CONCERNS = {
    patientHealthConcerns: [{
        patientHealthConcernGuid: 'HEALTH_CONCERN_GUID',
        patientPracticeGuid: PATIENT_PRACTICE_GUID,
        healthConcernReferenceGuid: 'b3da2472-d894-4b29-967e-c4aadade0841',
        healthConcernType: 'Diagnosis',
        effectiveDate: '2017-06-12T00:00:00.000Z',
        isActive: true
    }, {
        patientHealthConcernGuid: 'HEALTH_CONCERN_GUID_2',
        patientPracticeGuid: PATIENT_PRACTICE_GUID,
        healthConcernReferenceGuid: '3d26806e-aaa8-4092-87ba-944da229a299',
        effectiveDate: '2015-06-12T00:00:00.000Z',
        healthConcernType: 'Allergy',
        isActive: true
    }, {
        patientHealthConcernGuid: 'HEALTH_CONCERN_GUID_3',
        patientPracticeGuid: PATIENT_PRACTICE_GUID,
        healthConcernReferenceGuid: '437e31e2-dca5-4563-a74d-247b33433558',
        effectiveDate: '2015-06-12T00:00:00.000Z',
        healthConcernType: 'Allergy',
        isActive: false
    }]
};
const authorization = Service.extend({
    isEntitledFor(featureCode) {
        return featureCode === 'Chart.Encounter.Edit';
    }
});
const routing = Service.extend({
    currentRouteName: 'patient.summary'
});
moduleForComponent('patient-health-concerns-list', 'Integration - Core - Clinical | Component - patient-health-concerns-list', {
    integration: true,
    beforeEach() {
        this.register('service:authorization', authorization);
        this.inject.service('authorization');
        this.register('service:pf-routing', routing);
        this.inject.service('pf-routing');
        const env = setupStore({
            adapters: {
                'patient-health-concern': PatientHealthConcernAdapter,
                'patient-allergy': PatientAllergyAdapter
            },
            serializers: {
                'patient-health-concern': PatientHealthConcernSerializer,
                'patient-allergy': PatientAllergySerializer
            },
            models: {
                'patient-health-concern': PatientHealthConcern,
                'patient-allergy': PatientAllergy
            }
        });
        this.setProperties({
            store: env.store,
            patient: {
                patientPracticeGuid: PATIENT_PRACTICE_GUID
            },
            config
        });

        this.server = startMirage();
    },
    afterEach() {
        this.server.shutdown();
        this.set('store');
    }
});

test('No known health concerns checkbox appears when health concerns list is empty', function (assert) {
    const done = assert.async();
    let noKnownPostCalled = false;
    server.get('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/patientHealthConcerns', () => EMPTY_RESPONSE);
    server.post('ClinicalEndpoint/api/v1/PatientConditions/:patientPracticeGuid/NoKnownHealthConcerns', () => {
        noKnownPostCalled = true;
    });

    this.render(hbs`{{patient-health-concerns-list patient=patient config=config store=store}}`);

    wait().then(() => {
        const $checkboxComponent = this.$('.check-box');
        assert.ok($checkboxComponent.length, 'The no known checkbox appears when list is empty');
        assert.equal($checkboxComponent.find('label').text().trim(), 'Patient has no health concerns', 'The checkbox label is correct');
        $checkboxComponent.find('input').click();
        wait().then(() => {
            assert.ok(noKnownPostCalled, 'The NoKnownHealthConcerns endpoint was POSTed to when the checkbox was checked');
            done();
        });
    });
});

test('Unchecking no known health concerns will call DELETE on the patient conditions endpoint', function (assert) {
    const done = assert.async();
    let noKnownDeleteCalled = false;
    server.get('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/patientHealthConcerns', () => {
        return {
            patientHealthConcerns: [],
            meta: { noKnownHealthConcerns: true }
        };
    });
    server.delete('ClinicalEndpoint/api/v1/PatientConditions/:patientPracticeGuid/NoKnownHealthConcerns', () => {
        noKnownDeleteCalled = true;
    });

    this.render(hbs`{{patient-health-concerns-list patient=patient config=config store=store}}`);

    wait().then(() => {
        const $checkbox = this.$('.check-box__input');
        assert.ok($checkbox[0].checked, 'The checkbox is checked when noKnownHealthConcerns is true on GET response');
        $checkbox.click();
        wait().then(() => {
            assert.ok(noKnownDeleteCalled, 'DELETE was called when checkbox unchecked');
            done();
        });
    });
});

test('Adding/editing note health concern', function (assert) {
    const done = assert.async();
    const newNoteText = 'A new note!';
    const editNoteText = 'An edited note';
    let postCalled = false;
    let putCalled = false;
    server.get('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/patientHealthConcerns', () => EMPTY_RESPONSE);
    server.post('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/patientHealthConcerns', ({ db }, request) => {
        postCalled = true;
        const data = JSON.parse(request.requestBody);
        data.patientHealthConcernGuid = 'ANOTHER_GUID';
        assert.equal(data.healthConcernNote, newNoteText, 'The note value is correct on POST');
        return {
            patientHealthConcern: data
        };
    });
    server.put('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/patientHealthConcerns/:guid', ({ db }, request) => {
        putCalled = true;
        const data = JSON.parse(request.requestBody);
        assert.equal(data.healthConcernNote, editNoteText, 'The note value is correct on POST');
        return {
            patientHealthConcern: data
        };
    });
    this.render(hbs`{{patient-health-concerns-list patient=patient config=config store=store}}`);

    wait().then(() => {
        const $addButton = this.$(ADD_NOTE_BUTTON);
        $addButton.click();
        wait().then(() => {
            let $textArea = this.$('textarea');
            assert.ok($textArea.length, 'The note text area appears after clicking the add note button');
            $textArea.val(newNoteText);
            $textArea.change();
            this.$(de('btn-save-health-concern-note')).click();
            wait().then(() => {
                assert.ok(postCalled, 'The POST endpoint was called when note was added');
                this.$(de('edit-health-concern-note-button')).click();
                wait().then(() => {
                    $textArea = this.$('textarea');
                    $textArea.val(editNoteText);
                    $textArea.change();
                    this.$(de('btn-save-health-concern-note')).click();
                    wait().then(() => {
                        assert.ok(putCalled, 'The PUT endpoint was called when note was edited');
                        done();
                    });
                });
            });
        });
    });
});

test('Deleting the note health concern', function (assert) {
    const done = assert.async();
    const noteText = 'Existing note here';
    let deleteCalled = false;
    server.get('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/patientHealthConcerns', () => {
        return {
            patientHealthConcerns: [{
                patientHealthConcernGuid: 'NOTE_GUID',
                patientPracticeGuid: PATIENT_PRACTICE_GUID,
                healthConcernNote: noteText,
                healthConcernType: 'Note'
            }],
            meta: { noKnownHealthConcerns: false }
        };
    });
    server.delete('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/patientHealthConcerns/:guid', () => {
        deleteCalled = true;
        return new Mirage.Response(204, {}, null);
    });

    this.render(hbs`{{patient-health-concerns-list patient=patient config=config store=store}}`);
    wait().then(() => {
        assert.dom(de('saved-health-concern-note-text')).hasText(noteText, 'The existing note text is rendered correctly on load');
        this.$(de('edit-health-concern-note-button')).click();
        wait().then(() => {
            const $textArea = this.$('textarea');
            $textArea.val('');
            $textArea.change();
            this.$(de('btn-save-health-concern-note')).click();
            wait().then(() => {
                assert.ok(deleteCalled, 'The DELETE health concern');
                assert.dom(de('saved-health-concern-note-text')).doesNotExist('The note text was cleared');
                assert.dom(de('add-health-concern-note-button')).exists('The note text was cleared');
                done();
            });
        });
    });
});

test('Showing/hiding inactive health concerns', function (assert) {
    const done = assert.async();
    server.get('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/patientHealthConcerns', () => CLINICAL_HEALTH_CONCERNS);
    server.get('ClinicalEndpoint/api/v3/patients/:id/allergies', ({ db }) => {
        const [allergies] = db.patientAllergies;
        allergies.patientAllergies.setEach('patientPracticeGuid', PATIENT_PRACTICE_GUID);
        return allergies;
    });
    this.render(hbs`{{patient-health-concerns-list patient=patient config=config store=store}}`);
    wait().then(() => {
        const $inactiveLink = this.$(de('health-concerns-toggle-inactive'));
        assert.ok($inactiveLink.length, 'The show inactive link is visible when there are inactive health concerns');
        assert.equal($inactiveLink.text(), 'Show inactive (1)', 'The show inactive link contains the number of inactive health concerns');
        assert.equal(this.$('ul.list').length, 1, 'The inactive section is hidden by default');
        $inactiveLink.click();
        wait().then(() => {
            assert.equal(this.$('ul.list').length, 2, 'The inactive section is visible after clicking the show inactive link');
            assert.equal($inactiveLink.text(), 'Hide inactive', 'The link now says "Hide inactive"');
            assert.equal(this.$('ul.list:eq(1) li').length, 1, 'The inactive health concern is now visible');
            $inactiveLink.click();
            wait().then(() => {
                assert.equal(this.$('ul.list').length, 1, 'The inactive section is hidden again');
                assert.equal($inactiveLink.text(), 'Show inactive (1)', 'The show inactive link contains the number of inactive health concerns');
                done();
            });
        });
    });
});

test('Rendering allergy and diagnosis health concerns', function (assert) {
    const done = assert.async();
    server.get('ClinicalEndpoint/api/v1/patients/:patientPracticeGuid/patientHealthConcerns', () => CLINICAL_HEALTH_CONCERNS);
    server.get('ClinicalEndpoint/api/v3/patients/:id/allergies', ({ db }) => {
        const [allergies] = db.patientAllergies;
        allergies.patientAllergies.setEach('patientPracticeGuid', PATIENT_PRACTICE_GUID);
        return allergies;
    });
    this.render(hbs`{{patient-health-concerns-list patient=patient config=config store=store}}`);
    wait().then(() => {
        const item = 'ul.list li';
        const diagnosisItem = de('health-concern-item-0');
        const allergyItem = de('health-concern-item-1');
        assert.equal(this.$(item).length, 2, 'Only the active health concerns are rendered by default');
        assert.equal(this.$(`${diagnosisItem} ${de('health-concern-title')}`).text(), '(E845.9) Accident involving spacecraft injuring other person', 'The title renders correctly for diagnoses');
        assert.equal(this.$(`${diagnosisItem} ${de('health-concern-effective-date')}`).text(), '06/12/2017', 'The effective date renders correctly');
        assert.equal(this.$(`${allergyItem} ${de('health-concern-title')}`).text(), 'AA&C', 'The title renders correctly for allergies');
        assert.equal(this.$(`${allergyItem} ${de('severity-text')}`).text().trim(), 'Mild', 'The allergy severity is rendered correctly');
        done();
    });
});
