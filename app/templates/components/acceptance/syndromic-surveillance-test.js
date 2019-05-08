import { test } from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';
import de from 'boot/tests/helpers/data-element';

const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const ENCOUNTER_GUID = '82a597e5-b1b8-46e4-8a07-5c3a4f778e95';
const ENCOUNTER_URL = `/PF/charts/patients/${PATIENT_GUID}/encounter/${ENCOUNTER_GUID}`;
const ACTIONS_MENU_ITEM = `${de('actions-menu-options')} a:contains('Syndromic surveillance')`;
const MODAL_ELEMENT = '.charting-modal';
const SYNDROMIC_SURVEILLANCE_TEXT = 'The following is your syndromic surveillance text. You may view and copy this information';
const DOWNLOAD_INSTRUCTIONS = `, or click 'Save to file' to save a text file version of this information to your file system.`;
const TEST_RESPONSE_TEXT = 'MSH|^~\&|PracticeFusion|Yulias medical facility wootn^1d30f3e5-0e93-4968-90d2-e97b043dd902^UUID|||20160927194626||ADT^A01^ADT_A01|ae4966d1-aa0c-4eca-86df-e3b64689d30d|P|2.5.1|||||||||PH_SS-NoAck^SS Sender^2.16.840.1.114222.4.10.3^ISO' +
                        'EVN||20160920000000|||||Yulias medical facility wootn^1d30f3e5-0e93-4968-90d2-e97b043dd902^UUID' +
                        'PID|1||WS900842^^^^PI||Whatupyoyyy^Suhdude whatt^Jakui^^^^L||19950101|F|||1110 Yoyo Street^^San Francisco^CA^94107|||||||||||' +
                        'PV1|1||||||||||||||||||14333294^^^^VN|||||||||||||||||||||||||20160920000000' +
                        'OBX|1|NM|21612-7^^LN||21|a^YEAR^UCUM|||||F';

moduleForAcceptanceAuth('Acceptance - Core - Charting | Syndromic surveillance');

test('Syndromic surveillance renders properly on encounter', async assert => {
    let calledSyndromicSurveillance = false;
    server.get('ChartingEndpoint/api/v1/SyndromicSurveillance/:facilityGuid/:patientPracticeGuid/:transcriptGuid', () => {
        calledSyndromicSurveillance = true;
        return {
            responseText: TEST_RESPONSE_TEXT
        };
    });
    await visit(ENCOUNTER_URL);
    await click(de('actions-menu'));
    await click(ACTIONS_MENU_ITEM);
    assert.ok(calledSyndromicSurveillance, 'Syndromic Surveillance service was called');

    assert.ok(find(`${MODAL_ELEMENT} h3:contains('Syndromic surveillance')`).length > 0, 'Syndromic surveillance modal has correct title');
    assert.ok(find(`.charting-modal .message:contains(${SYNDROMIC_SURVEILLANCE_TEXT})`).length > 0, 'Syndromic surveillance modal contains default text');
    assert.ok(find(`.charting-modal .message:contains(${DOWNLOAD_INSTRUCTIONS})`).length > 0, 'Syndromic surveillance modal contains text instructions to download');
    assert.equal(find('.charting-modal .content-ss').text(), TEST_RESPONSE_TEXT, 'Syndromic surveillance modal renders syndromic surveillance text from service');
    assert.ok(find('.charting-modal .content-ss').scrollLeft(300).length > 0, 'Syndromic surveillance text area scrolls based on large text');
    assert.ok(find(`${MODAL_ELEMENT} #modalButtonSave`).length > 0, 'Syndromic surveillance save to file button renders properly');

    await click(`${MODAL_ELEMENT} #modalButtonDone`);
    assert.ok(find(`${MODAL_ELEMENT}:visible`).length < 1, 'Syndromic Surveillance modal closed properly');
});
