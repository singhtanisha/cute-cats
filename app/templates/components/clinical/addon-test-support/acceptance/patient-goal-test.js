import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';

const PATIENT_PRACTICE_GUID = 'c5faffde-78e2-4924-acaf-2115bc686d5e';
const PATIENT_GOAL_GUID = '3efd9363-66e9-49a1-b9da-2a5e51f1b197';
const ADD_GOAL = de('add-goal-button');
const DESCRIPTION = '.goal-detail textarea';
const SAVE = de('btn-save');

moduleForAcceptanceAuth('Acceptance - Core - Clinical | Patient Goals - v2');

test('Add/Edit/Delete a goal', async assert => {
    let getCalled;
    let postCalled;
    let putCalled;
    let deleteCalled;

    server.get(`ClinicalEndpoint/api/v1/patients/${PATIENT_PRACTICE_GUID}/patientGoals`, () => {
        getCalled = true;
        return {'patientGoals':[]};
    });

    server.post(`ClinicalEndpoint/api/v1/patients/${PATIENT_PRACTICE_GUID}/patientGoals`, ({ db }, request) => {
        const goal = JSON.parse(request.requestBody);

        postCalled = true;
        assert.equal(goal.description, 'Some text here', 'Post requests contains description');
        assert.equal(goal.isActive, true, 'Post request contains the correct active status');
        assert.equal(goal.effectiveDate, moment.utc(moment().format('MM/DD/YYYY')).toISOString(), 'Post requests contains the correct date');
        goal.patientGoalGuid = '3efd9363-66e9-49a1-b9da-2a5e51f1b197';
        return { 'patientGoal': goal };
    });

    server.put(`ClinicalEndpoint/api/v1/patients/${PATIENT_PRACTICE_GUID}/patientGoals/${PATIENT_GOAL_GUID}`, () => {
        putCalled = true;
        return {};
    });

    server.delete(`ClinicalEndpoint/api/v1/patients/${PATIENT_PRACTICE_GUID}/patientGoals/${PATIENT_GOAL_GUID}`, () => {
        deleteCalled = true;
    });

    await visit(`/PF/charts/patients/${PATIENT_PRACTICE_GUID}/summary`);
    await click(ADD_GOAL);
    fillIn(DESCRIPTION, 'Some text here');
    await click(SAVE);
    assert.ok(getCalled, 'GET call to load goals was made');
    assert.ok(postCalled, 'POST call to save goal was made');
    assert.dom(de('goal-description')).hasText('Some text here', 'Goal was added under the goal section');
    await click(de('goal-description'));
    await fillIn(DESCRIPTION, 'edited goal');
    await click(SAVE);
    assert.ok(putCalled, 'PUT call to save edited goal was made');
    assert.dom(de('goal-description')).hasText('edited goal', 'Edited goal appears under goal section');
    await click(de('goal-description'));
    await click(de('btn-delete'));
    assert.ok(deleteCalled, 'DELETE call to delete goal was made');
    assert.dom(de('no-goals-placeholder')).hasText('No patient goals recorded', 'Goal was successfully deleted and disappears from goal section');
});
