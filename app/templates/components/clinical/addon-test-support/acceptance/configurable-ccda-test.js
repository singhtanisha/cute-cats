import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';

const validateThreadDetailHasAttachments = assert => {
    assert.ok(find('.inbox-thread-view .thread-container').length, 'A message thread is selected and rendered in the right pane');
    assert.ok(find('.inbox-thread-view .thread-container .attachments a').length, 'Attachments shown');
};
moduleForAcceptanceAuth('Acceptance - Core - Clinical | Configurable CCDA preview');

test('View configurable CCDA from messages', async assert => {
    await visitWaitForAfterRender('/PF/messaging/inbox');
    await delayAsync(100);
    await click('.inbox-thread:contains(Referral for Norace OrEth) .preview-main');
    validateThreadDetailHasAttachments(assert);

    await click('.inbox-thread-view .thread-container .attachments a:first');
    await delayAsync(100);
    assert.throws(findWithAssert('.ccda-preview-modal'), 'CCDA Preview modal displays');
    assert.throws(findWithAssert(de('link-ccda-settings')), 'Settings link displays');
    assert.equal(find('.ccda-preview-modal footer .pull-right button').length, 2, 'Download buttons are displayed separately');
    assert.equal(find('.ccda-preview-modal .content-modal-title').text().trim(), 'Clinical Summary for Norace OrEth', 'The modal contains the correct title');
    assert.throws(findWithAssert(`${de('ccda-toc-component-Encounters')} a`), 'The encounters link exists in the right pane');
    assert.notOk(find(de('ccda-component-Encounters')).length, 'Encounters section not shown when turned off in settings');
    await click(`${de('ccda-toc-component-Encounters')} .d-checkbox-switch`);
    assert.throws(findWithAssert(de('ccda-component-Encounters')), 'Encounters section now shown after toggled on');
});
