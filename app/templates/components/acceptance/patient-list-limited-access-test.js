import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';

moduleForAcceptanceAuth('Acceptance - Visual - Core - Charting | Patient list limited access', {
    beforeLogin() {
        server.get('AuthzEndpoint/api/v1/users/:id/rights', () => ({
            entitledFeatures: ['ERX.Send', 'Chart.Sign', 'EPCS.Send']
        }));
    }
});

test('Patient list in limited access', async assert => {
    server.get('ChartingEndpoint/api/v2/Appointment', () => {
        return [];
    });
    server.get('PracticeEndpoint/api/v1/preferences/provider', () => ({ preferences: {} }));
    await visit('/PF/charts/list/all/recent');
    assert.dom(de('new-patient-button')).doesNotExist('add patient button is removed in recent patient list');
    await click(`${de('patient-list-scheduled-recent-toggle-0')}`);
    assert.dom(de('new-patient-button')).doesNotExist('add patient button is removed in scheduled patient list');
    assert.dom('.no-appointments a').doesNotExist('add patient link is removed scheduled patient list when list is empty');
});
