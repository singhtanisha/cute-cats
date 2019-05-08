import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import de from 'boot/tests/helpers/data-element';

moduleForComponent('cds-alert', 'Integration - Core - Clinical | Component - cds alert', {
    integration: true
});

test('Component renders ruleVersion contained in metadata', function (assert) {
    this.set('cdsAlert', {
        alertIdentifier: 'Documentation.MedicationDocumentation',
        ruleId: 3,
        alertText: 'Documentation: Confirm documentation of current medication list.',
        citations: ['American Medical Association (2007). The physician’s role in medication reconciliation: Issues, strategies and safety principles.; Stock, R., Scott, J., & Gurtel, S. (2009). Using an Electronic Prescribing System to Ensure Accurate Medication Lists in a Large Multidisciplinary Medical Group. The Joint Commission Journal on Quality and Patient Safety; 35(5): 271-277'],
        developer: 'Practice Fusion, Inc.',
        sponsor: 'None',
        link: 'http://www.qualityforum.org/QPS/0419',
        source: 'Practice Fusion, Inc.',
        actionLinkType: 'addQualityOfCareIndicator',
        actionLinkData: 'eventTypeGuid=7269b64b-8eb8-4893-bc01-23c6b58a85ac',
        actionLinkText: 'Mark as complete',
        ruleVersion: '2.0'
    });
    this.render(hbs`{{cds-alert cdsAlert=cdsAlert config=config isExpanded=true}}`);

    const $version = this.$(de('cds-version'));
    assert.equal($version.text(), 'Release Version: 2.0');
});
