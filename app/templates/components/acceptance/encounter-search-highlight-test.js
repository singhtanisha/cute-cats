import {
    test
} from 'qunit';
import moduleForAcceptanceAuth from 'boot/tests/helpers/module-for-acceptance-auth';

const ENCOUNTER_GUID = '7022d94f-d70a-4722-a205-dac898cf9f69';
const PATIENT_GUID = 'ecd212c3-5c99-499e-b3c6-b2645b8a4c98';
const SEARCH_BUTTON = '.input-group-addon';
const SEARCH_INPUT = '.section-search input';

moduleForAcceptanceAuth('Acceptance - Core - Charting | Encounter search highlight');

test('Encounter search highlight', async assert => {
    await visit('/PF/charts/patients/' + PATIENT_GUID + '/encounter/' + ENCOUNTER_GUID);
    await fillIn(find('.section-search input')[0], 'encounter');
    await click(find(SEARCH_BUTTON));

    const searchResult = parseInt(find('.search-found')[0].innerText.split(' ')[0]);
    assert.equal(searchResult, 11, 'Right number of search results for search term');
    assert.equal(find('.highlight').length, searchResult, 'Number of highlighted items are equal to search result.');
    await fillIn(find(SEARCH_INPUT)[0], 'testing');
    await click(find(SEARCH_BUTTON));
    assert.equal(find('.no-results')[0].innerText, 'no results found', '\'no results\' alert renders next to search box correctly');
});
