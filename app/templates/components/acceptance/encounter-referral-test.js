import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';

const ENCOUNTER_GUID = '7022d94f-d70a-4722-a205-dac898cf9f69';
const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const CONFIRM_RECEIPT_CHECKBOX_SELECTOR = `.referrals-in-encounter .referral-receipt-on .referral-row:first-child ${de('confirm-receipt-checkbox')} input`;
const CONFIRM_COMPLETE_CHECKBOX_SELECTOR = `.referrals-in-encounter .referral-receipt-on .referral-row:first-child ${de('confirm-complete-checkbox')} input`;

moduleForAcceptanceAuth('Acceptance - Core - Charting | Encounter referral compliance', {
});

test('Can utilize referral compliance checkboxes from encounter', async assert => {
    assert.expect(4);
    server.put('ReferralEndpoint/api/v2/referral/:referralGuid/status', ({ db }, request) => {
        const requestBody = JSON.parse(request.requestBody);
        assert.ok(requestBody, 'Checkbox endpoint called.');
    });

    await visit('/PF/charts/patients/' + PATIENT_GUID + '/encounter/' + ENCOUNTER_GUID);
    assert.ok(find(CONFIRM_RECEIPT_CHECKBOX_SELECTOR).length === 1, 'There is one confirm receipt checkbox.');
    assert.ok(find(CONFIRM_COMPLETE_CHECKBOX_SELECTOR).length === 1, 'There is one confirm complete checkbox.');


    await click(CONFIRM_COMPLETE_CHECKBOX_SELECTOR);
    click(CONFIRM_RECEIPT_CHECKBOX_SELECTOR);
});
