'use strict';

define('cute-cats-tanisha/tests/integration/components/image-row-test', ['qunit', 'ember-qunit', '@ember/test-helpers'], function (_qunit, _emberQunit, _testHelpers) {
  'use strict';

  (0, _qunit.module)('Integration | Component | image-row', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.set('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "04u9evSG",
        "block": "{\"symbols\":[],\"statements\":[[1,[21,\"image-row\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal(this.element.textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "oP5UXh34",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"image-row\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal(this.element.textContent.trim(), 'template block text');
    });
  });
});
define('cute-cats-tanisha/tests/integration/components/image-tile-test', ['qunit', 'ember-qunit', '@ember/test-helpers'], function (_qunit, _emberQunit, _testHelpers) {
  'use strict';

  (0, _qunit.module)('Integration | Component | image-tile', function (hooks) {
    (0, _emberQunit.setupRenderingTest)(hooks);

    (0, _qunit.test)('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.set('myAction', function(val) { ... });

      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "anSQorFW",
        "block": "{\"symbols\":[],\"statements\":[[1,[21,\"image-tile\"],false]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal(this.element.textContent.trim(), '');

      // Template block usage:
      await (0, _testHelpers.render)(Ember.HTMLBars.template({
        "id": "1qKrFfbq",
        "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"image-tile\",null,null,{\"statements\":[[0,\"        template block text\\n\"]],\"parameters\":[]},null],[0,\"    \"]],\"hasEval\":false}",
        "meta": {}
      }));

      assert.equal(this.element.textContent.trim(), 'template block text');
    });
  });
});
define('cute-cats-tanisha/tests/lint/app.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('components/image-row.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/image-row.js should pass ESLint\n\n');
  });

  QUnit.test('components/image-tile.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/image-tile.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/full-screen.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/full-screen.js should pass ESLint\n\n1:32 - \'controller\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('controllers/homepage.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/homepage.js should pass ESLint\n\n1:32 - \'controller\' is defined but never used. (no-unused-vars)\n8:11 - Use import { inject } from \'@ember/service\'; instead of using Ember.inject.service (ember/new-module-imports)\n8:11 - \'Ember\' is not defined. (no-undef)\n9:5 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n10:5 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n23:15 - \'$\' is not defined. (no-undef)\n29:13 - Don\'t use jQuery without Ember Run Loop (ember/jquery-ember-run)\n30:13 - Don\'t use jQuery without Ember Run Loop (ember/jquery-ember-run)\n31:18 - \'error\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });

  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'router.js should pass ESLint\n\n11:37 - Use snake case in dynamic segments of routes (ember/routes-segments-snake-case)');
  });

  QUnit.test('routes/full-screen.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/full-screen.js should pass ESLint\n\n');
  });

  QUnit.test('routes/homepage.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/homepage.js should pass ESLint\n\n2:8 - \'Ember\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('routes/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/index.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/acceptance/care-plan-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/care-plan-test.js should pass ESLint\n\n20:5 - \'server\' is not defined. (no-undef)\n20:90 - \'db\' is defined but never used. (no-unused-vars)\n30:11 - \'visit\' is not defined. (no-undef)\n32:11 - \'toggleEncounterSections\' is not defined. (no-undef)\n34:11 - \'click\' is not defined. (no-undef)\n38:5 - \'fillIn\' is not defined. (no-undef)\n43:11 - \'click\' is not defined. (no-undef)\n44:5 - \'fillIn\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/cds-alerts-deep-link-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/cds-alerts-deep-link-test.js should pass ESLint\n\n11:11 - \'visit\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/cds-alerts-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/cds-alerts-test.js should pass ESLint\n\n16:11 - \'visit\' is not defined. (no-undef)\n22:11 - \'visit\' is not defined. (no-undef)\n28:11 - \'click\' is not defined. (no-undef)\n35:11 - \'visit\' is not defined. (no-undef)\n41:11 - \'click\' is not defined. (no-undef)\n62:5 - \'server\' is not defined. (no-undef)\n64:5 - \'server\' is not defined. (no-undef)\n82:11 - \'visit\' is not defined. (no-undef)\n83:11 - \'click\' is not defined. (no-undef)\n86:19 - \'findWithAssert\' is not defined. (no-undef)\n90:11 - \'click\' is not defined. (no-undef)\n91:11 - \'click\' is not defined. (no-undef)\n92:11 - \'delayAsync\' is not defined. (no-undef)\n93:11 - \'click\' is not defined. (no-undef)\n96:11 - \'click\' is not defined. (no-undef)\n97:11 - \'click\' is not defined. (no-undef)\n98:11 - \'delayAsync\' is not defined. (no-undef)\n99:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/cognitive-status-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/cognitive-status-test.js should pass ESLint\n\n22:5 - \'server\' is not defined. (no-undef)\n22:105 - \'db\' is defined but never used. (no-unused-vars)\n45:11 - \'visit\' is not defined. (no-undef)\n46:11 - \'toggleEncounterSections\' is not defined. (no-undef)\n48:11 - \'click\' is not defined. (no-undef)\n50:5 - \'fillIn\' is not defined. (no-undef)\n52:11 - \'click\' is not defined. (no-undef)\n54:5 - \'fillIn\' is not defined. (no-undef)\n56:11 - \'click\' is not defined. (no-undef)\n58:11 - \'click\' is not defined. (no-undef)\n60:11 - \'click\' is not defined. (no-undef)\n61:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/copy-link-to-patient-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/copy-link-to-patient-test.js should pass ESLint\n\n14:11 - \'visit\' is not defined. (no-undef)\n15:11 - \'click\' is not defined. (no-undef)\n16:11 - \'click\' is not defined. (no-undef)\n22:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/customize-charting-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/customize-charting-test.js should pass ESLint\n\n47:11 - \'visit\' is not defined. (no-undef)\n49:11 - \'click\' is not defined. (no-undef)\n50:11 - \'click\' is not defined. (no-undef)\n61:11 - \'click\' is not defined. (no-undef)\n62:11 - \'click\' is not defined. (no-undef)\n64:11 - \'click\' is not defined. (no-undef)\n66:11 - \'click\' is not defined. (no-undef)\n67:11 - \'click\' is not defined. (no-undef)\n68:11 - \'click\' is not defined. (no-undef)\n73:11 - \'click\' is not defined. (no-undef)\n74:11 - \'click\' is not defined. (no-undef)\n75:11 - \'click\' is not defined. (no-undef)\n76:11 - \'click\' is not defined. (no-undef)\n78:11 - \'click\' is not defined. (no-undef)\n80:11 - \'click\' is not defined. (no-undef)\n81:11 - \'click\' is not defined. (no-undef)\n82:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/deprecated/copy-link-to-patient-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/deprecated/copy-link-to-patient-test.js should pass ESLint\n\n14:11 - \'visit\' is not defined. (no-undef)\n15:11 - \'click\' is not defined. (no-undef)\n16:11 - \'click\' is not defined. (no-undef)\n22:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/deprecated/encounter-creation-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/deprecated/encounter-creation-test.js should pass ESLint\n\n12:25 - \'moment\' is not defined. (no-undef)\n14:5 - \'server\' is not defined. (no-undef)\n14:88 - \'db\' is defined but never used. (no-unused-vars)\n20:5 - \'server\' is not defined. (no-undef)\n23:5 - \'server\' is not defined. (no-undef)\n23:107 - \'db\' is defined but never used. (no-unused-vars)\n27:11 - \'visit\' is not defined. (no-undef)\n28:11 - \'click\' is not defined. (no-undef)\n29:36 - \'moment\' is not defined. (no-undef)\n32:11 - \'fillIn\' is not defined. (no-undef)\n33:11 - \'click\' is not defined. (no-undef)\n34:5 - \'percySnapshot\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/deprecated/flowsheet-encounter-range-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/deprecated/flowsheet-encounter-range-test.js should pass ESLint\n\n21:5 - \'server\' is not defined. (no-undef)\n36:11 - \'visit\' is not defined. (no-undef)\n37:11 - \'click\' is not defined. (no-undef)\n38:11 - \'click\' is not defined. (no-undef)\n39:11 - \'click\' is not defined. (no-undef)\n40:11 - \'click\' is not defined. (no-undef)\n41:11 - \'click\' is not defined. (no-undef)\n42:11 - \'click\' is not defined. (no-undef)\n43:5 - \'click\' is not defined. (no-undef)\n48:23 - \'moment\' is not defined. (no-undef)\n49:21 - \'moment\' is not defined. (no-undef)\n52:5 - \'server\' is not defined. (no-undef)\n59:26 - \'moment\' is not defined. (no-undef)\n59:69 - \'moment\' is not defined. (no-undef)\n61:26 - \'moment\' is not defined. (no-undef)\n61:67 - \'moment\' is not defined. (no-undef)\n71:11 - \'visit\' is not defined. (no-undef)\n72:11 - \'click\' is not defined. (no-undef)\n73:11 - \'click\' is not defined. (no-undef)\n74:11 - \'click\' is not defined. (no-undef)\n76:11 - \'fillIn\' is not defined. (no-undef)\n77:11 - \'fillIn\' is not defined. (no-undef)\n78:11 - \'click\' is not defined. (no-undef)\n79:11 - \'click\' is not defined. (no-undef)\n80:11 - \'click\' is not defined. (no-undef)\n82:11 - \'fillIn\' is not defined. (no-undef)\n83:11 - \'fillIn\' is not defined. (no-undef)\n84:5 - \'click\' is not defined. (no-undef)\n89:5 - \'server\' is not defined. (no-undef)\n100:11 - \'visit\' is not defined. (no-undef)\n101:11 - \'click\' is not defined. (no-undef)\n102:11 - \'click\' is not defined. (no-undef)\n103:11 - \'click\' is not defined. (no-undef)\n105:11 - \'click\' is not defined. (no-undef)\n106:11 - \'fillIn\' is not defined. (no-undef)\n107:5 - \'click\' is not defined. (no-undef)\n112:5 - \'server\' is not defined. (no-undef)\n125:11 - \'visit\' is not defined. (no-undef)\n126:11 - \'click\' is not defined. (no-undef)\n127:11 - \'click\' is not defined. (no-undef)\n128:11 - \'click\' is not defined. (no-undef)\n129:11 - \'click\' is not defined. (no-undef)\n130:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/deprecated/medication-print-preview-summary-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/deprecated/medication-print-preview-summary-test.js should pass ESLint\n\n19:11 - \'visit\' is not defined. (no-undef)\n20:11 - \'click\' is not defined. (no-undef)\n21:11 - \'click\' is not defined. (no-undef)\n34:18 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n34:18 - \'$\' is not defined. (no-undef)\n50:5 - \'click\' is not defined. (no-undef)\n54:11 - \'visit\' is not defined. (no-undef)\n55:11 - \'click\' is not defined. (no-undef)\n56:11 - \'click\' is not defined. (no-undef)\n59:5 - \'click\' is not defined. (no-undef)\n63:11 - \'visit\' is not defined. (no-undef)\n64:11 - \'click\' is not defined. (no-undef)\n65:11 - \'click\' is not defined. (no-undef)\n68:5 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/deprecated/patient-list-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/deprecated/patient-list-test.js should pass ESLint\n\n32:19 - \'findWithAssert\' is not defined. (no-undef)\n46:5 - \'server\' is not defined. (no-undef)\n47:11 - \'visit\' is not defined. (no-undef)\n48:5 - \'percySnapshot\' is not defined. (no-undef)\n49:19 - \'findWithAssert\' is not defined. (no-undef)\n50:19 - \'findWithAssert\' is not defined. (no-undef)\n51:19 - \'findWithAssert\' is not defined. (no-undef)\n52:5 - \'click\' is not defined. (no-undef)\n53:5 - \'click\' is not defined. (no-undef)\n54:11 - \'click\' is not defined. (no-undef)\n57:9 - \'click\' is not defined. (no-undef)\n59:5 - \'click\' is not defined. (no-undef)\n60:11 - \'click\' is not defined. (no-undef)\n61:11 - \'wait\' is not defined. (no-undef)\n71:19 - \'findWithAssert\' is not defined. (no-undef)\n72:11 - \'click\' is not defined. (no-undef)\n73:18 - \'currentURL\' is not defined. (no-undef)\n74:11 - \'click\' is not defined. (no-undef)\n75:11 - \'click\' is not defined. (no-undef)\n77:11 - \'click\' is not defined. (no-undef)\n93:19 - \'moment\' is not defined. (no-undef)\n94:22 - \'moment\' is not defined. (no-undef)\n97:5 - \'server\' is not defined. (no-undef)\n106:5 - \'server\' is not defined. (no-undef)\n108:11 - \'visit\' is not defined. (no-undef)\n109:11 - \'click\' is not defined. (no-undef)\n111:52 - \'moment\' is not defined. (no-undef)\n122:11 - \'click\' is not defined. (no-undef)\n124:11 - \'click\' is not defined. (no-undef)\n128:11 - \'click\' is not defined. (no-undef)\n132:5 - \'click\' is not defined. (no-undef)\n133:11 - \'click\' is not defined. (no-undef)\n135:19 - \'findWithAssert\' is not defined. (no-undef)\n137:11 - \'click\' is not defined. (no-undef)\n139:5 - \'click\' is not defined. (no-undef)\n140:5 - \'click\' is not defined. (no-undef)\n141:5 - \'click\' is not defined. (no-undef)\n142:11 - \'click\' is not defined. (no-undef)\n143:18 - \'currentURL\' is not defined. (no-undef)\n149:5 - \'server\' is not defined. (no-undef)\n157:5 - \'server\' is not defined. (no-undef)\n159:11 - \'visit\' is not defined. (no-undef)\n163:5 - \'fillIn\' is not defined. (no-undef)\n164:11 - \'click\' is not defined. (no-undef)\n166:19 - \'findWithAssert\' is not defined. (no-undef)\n167:5 - \'click\' is not defined. (no-undef)\n168:5 - \'fillIn\' is not defined. (no-undef)\n169:11 - \'click\' is not defined. (no-undef)\n175:11 - \'click\' is not defined. (no-undef)\n179:11 - \'click\' is not defined. (no-undef)\n183:11 - \'click\' is not defined. (no-undef)\n184:19 - \'findWithAssert\' is not defined. (no-undef)\n185:11 - \'click\' is not defined. (no-undef)\n186:18 - \'currentURL\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/encounter-asthma-control-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/encounter-asthma-control-test.js should pass ESLint\n\n12:5 - \'server\' is not defined. (no-undef)\n14:11 - \'visit\' is not defined. (no-undef)\n16:11 - \'click\' is not defined. (no-undef)\n17:11 - \'fillIn\' is not defined. (no-undef)\n19:11 - \'keyEvent\' is not defined. (no-undef)\n20:11 - \'wait\' is not defined. (no-undef)\n21:11 - \'click\' is not defined. (no-undef)\n38:11 - \'click\' is not defined. (no-undef)\n39:11 - \'click\' is not defined. (no-undef)\n40:11 - \'click\' is not defined. (no-undef)\n41:11 - \'click\' is not defined. (no-undef)\n42:11 - \'click\' is not defined. (no-undef)\n47:11 - \'click\' is not defined. (no-undef)\n56:11 - \'click\' is not defined. (no-undef)\n57:11 - \'click\' is not defined. (no-undef)\n60:11 - \'click\' is not defined. (no-undef)\n62:11 - \'click\' is not defined. (no-undef)\n63:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/encounter-attachments-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/encounter-attachments-test.js should pass ESLint\n\n30:12 - \'click\' is not defined. (no-undef)\n36:12 - \'click\' is not defined. (no-undef)\n39:12 - \'click\' is not defined. (no-undef)\n47:5 - \'server\' is not defined. (no-undef)\n47:66 - \'db\' is defined but never used. (no-unused-vars)\n60:5 - \'server\' is not defined. (no-undef)\n60:110 - \'db\' is defined but never used. (no-unused-vars)\n65:5 - \'server\' is not defined. (no-undef)\n65:79 - \'db\' is defined but never used. (no-unused-vars)\n71:11 - \'visit\' is not defined. (no-undef)\n72:11 - \'click\' is not defined. (no-undef)\n73:19 - \'findWithAssert\' is not defined. (no-undef)\n76:19 - \'findWithAssert\' is not defined. (no-undef)\n80:11 - \'click\' is not defined. (no-undef)\n85:19 - \'findWithAssert\' is not defined. (no-undef)\n86:19 - \'findWithAssert\' is not defined. (no-undef)\n87:19 - \'findWithAssert\' is not defined. (no-undef)\n97:11 - \'click\' is not defined. (no-undef)\n98:19 - \'findWithAssert\' is not defined. (no-undef)\n99:11 - \'visit\' is not defined. (no-undef)\n100:5 - \'click\' is not defined. (no-undef)\n103:11 - \'click\' is not defined. (no-undef)\n105:19 - \'findWithAssert\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/encounter-copy-note-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/encounter-copy-note-test.js should pass ESLint\n\n31:5 - \'server\' is not defined. (no-undef)\n31:109 - \'db\' is defined but never used. (no-unused-vars)\n37:5 - \'server\' is not defined. (no-undef)\n37:58 - \'db\' is defined but never used. (no-unused-vars)\n45:11 - \'visit\' is not defined. (no-undef)\n47:11 - \'click\' is not defined. (no-undef)\n48:11 - \'fillInRichText\' is not defined. (no-undef)\n49:11 - \'click\' is not defined. (no-undef)\n50:11 - \'fillInRichText\' is not defined. (no-undef)\n51:11 - \'click\' is not defined. (no-undef)\n52:11 - \'fillInRichText\' is not defined. (no-undef)\n53:11 - \'click\' is not defined. (no-undef)\n54:11 - \'fillInRichText\' is not defined. (no-undef)\n55:11 - \'click\' is not defined. (no-undef)\n56:11 - \'click\' is not defined. (no-undef)\n58:11 - \'click\' is not defined. (no-undef)\n68:11 - \'click\' is not defined. (no-undef)\n82:5 - \'server\' is not defined. (no-undef)\n82:119 - \'db\' is defined but never used. (no-unused-vars)\n89:5 - \'server\' is not defined. (no-undef)\n89:58 - \'db\' is defined but never used. (no-unused-vars)\n97:11 - \'visit\' is not defined. (no-undef)\n105:11 - \'click\' is not defined. (no-undef)\n106:5 - \'fillIn\' is not defined. (no-undef)\n107:11 - \'click\' is not defined. (no-undef)\n108:11 - \'click\' is not defined. (no-undef)\n110:11 - \'click\' is not defined. (no-undef)\n121:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/encounter-creation-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/encounter-creation-test.js should pass ESLint\n\n12:25 - \'moment\' is not defined. (no-undef)\n14:5 - \'server\' is not defined. (no-undef)\n14:88 - \'db\' is defined but never used. (no-unused-vars)\n20:5 - \'server\' is not defined. (no-undef)\n21:5 - \'server\' is not defined. (no-undef)\n21:107 - \'db\' is defined but never used. (no-unused-vars)\n25:11 - \'visit\' is not defined. (no-undef)\n26:11 - \'click\' is not defined. (no-undef)\n27:36 - \'moment\' is not defined. (no-undef)\n30:11 - \'fillIn\' is not defined. (no-undef)\n31:11 - \'click\' is not defined. (no-undef)\n32:5 - \'percySnapshot\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/encounter-delete-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/encounter-delete-test.js should pass ESLint\n\n32:5 - \'server\' is not defined. (no-undef)\n32:71 - \'db\' is defined but never used. (no-unused-vars)\n38:11 - \'visit\' is not defined. (no-undef)\n40:11 - \'click\' is not defined. (no-undef)\n42:11 - \'click\' is not defined. (no-undef)\n44:11 - \'click\' is not defined. (no-undef)\n46:11 - \'click\' is not defined. (no-undef)\n47:11 - \'click\' is not defined. (no-undef)\n48:11 - \'click\' is not defined. (no-undef)\n56:5 - \'server\' is not defined. (no-undef)\n56:71 - \'db\' is defined but never used. (no-unused-vars)\n61:11 - \'visit\' is not defined. (no-undef)\n62:11 - \'click\' is not defined. (no-undef)\n69:5 - \'server\' is not defined. (no-undef)\n77:11 - \'visit\' is not defined. (no-undef)\n78:11 - \'click\' is not defined. (no-undef)\n79:11 - \'click\' is not defined. (no-undef)\n80:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/encounter-growth-chart-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/encounter-growth-chart-test.js should pass ESLint\n\n30:11 - \'visit\' is not defined. (no-undef)\n31:11 - \'click\' is not defined. (no-undef)\n32:11 - \'click\' is not defined. (no-undef)\n34:11 - \'click\' is not defined. (no-undef)\n36:11 - \'click\' is not defined. (no-undef)\n38:11 - \'click\' is not defined. (no-undef)\n40:11 - \'click\' is not defined. (no-undef)\n45:11 - \'visit\' is not defined. (no-undef)\n46:11 - \'click\' is not defined. (no-undef)\n47:11 - \'click\' is not defined. (no-undef)\n49:11 - \'click\' is not defined. (no-undef)\n51:11 - \'click\' is not defined. (no-undef)\n53:11 - \'click\' is not defined. (no-undef)\n55:11 - \'click\' is not defined. (no-undef)\n60:5 - \'server\' is not defined. (no-undef)\n67:11 - \'visit\' is not defined. (no-undef)\n68:11 - \'click\' is not defined. (no-undef)\n69:11 - \'click\' is not defined. (no-undef)\n71:11 - \'click\' is not defined. (no-undef)\n73:11 - \'click\' is not defined. (no-undef)\n75:11 - \'click\' is not defined. (no-undef)\n77:11 - \'click\' is not defined. (no-undef)\n82:5 - \'server\' is not defined. (no-undef)\n89:11 - \'visit\' is not defined. (no-undef)\n91:11 - \'click\' is not defined. (no-undef)\n93:11 - \'click\' is not defined. (no-undef)\n95:11 - \'click\' is not defined. (no-undef)\n97:11 - \'click\' is not defined. (no-undef)\n103:5 - \'server\' is not defined. (no-undef)\n103:78 - \'db\' is defined but never used. (no-unused-vars)\n113:11 - \'visit\' is not defined. (no-undef)\n114:11 - \'click\' is not defined. (no-undef)\n119:11 - \'click\' is not defined. (no-undef)\n121:11 - \'click\' is not defined. (no-undef)\n123:11 - \'click\' is not defined. (no-undef)\n125:11 - \'click\' is not defined. (no-undef)\n127:11 - \'click\' is not defined. (no-undef)\n131:11 - \'click\' is not defined. (no-undef)\n132:11 - \'click\' is not defined. (no-undef)\n134:11 - \'click\' is not defined. (no-undef)\n136:11 - \'click\' is not defined. (no-undef)\n138:11 - \'click\' is not defined. (no-undef)\n143:5 - \'server\' is not defined. (no-undef)\n144:11 - \'visit\' is not defined. (no-undef)\n145:11 - \'click\' is not defined. (no-undef)\n146:11 - \'click\' is not defined. (no-undef)\n147:11 - \'click\' is not defined. (no-undef)\n148:11 - \'click\' is not defined. (no-undef)\n150:11 - \'click\' is not defined. (no-undef)\n152:11 - \'click\' is not defined. (no-undef)\n154:11 - \'click\' is not defined. (no-undef)\n161:5 - \'server\' is not defined. (no-undef)\n162:5 - \'server\' is not defined. (no-undef)\n182:5 - \'server\' is not defined. (no-undef)\n200:11 - \'visit\' is not defined. (no-undef)\n201:11 - \'click\' is not defined. (no-undef)\n202:11 - \'click\' is not defined. (no-undef)\n203:11 - \'click\' is not defined. (no-undef)\n204:11 - \'wait\' is not defined. (no-undef)\n205:11 - \'click\' is not defined. (no-undef)\n207:11 - \'click\' is not defined. (no-undef)\n209:11 - \'click\' is not defined. (no-undef)\n211:11 - \'click\' is not defined. (no-undef)\n212:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/encounter-limited-access-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/encounter-limited-access-test.js should pass ESLint\n\n13:9 - \'server\' is not defined. (no-undef)\n67:11 - \'click\' is not defined. (no-undef)\n94:11 - \'click\' is not defined. (no-undef)\n101:11 - \'click\' is not defined. (no-undef)\n112:11 - \'click\' is not defined. (no-undef)\n123:11 - \'click\' is not defined. (no-undef)\n137:5 - \'click\' is not defined. (no-undef)\n138:11 - \'click\' is not defined. (no-undef)\n144:11 - \'click\' is not defined. (no-undef)\n157:11 - \'click\' is not defined. (no-undef)\n163:11 - \'click\' is not defined. (no-undef)\n174:11 - \'visit\' is not defined. (no-undef)\n181:5 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/encounter-migraine-assessment-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/encounter-migraine-assessment-test.js should pass ESLint\n\n22:5 - \'server\' is not defined. (no-undef)\n24:5 - \'server\' is not defined. (no-undef)\n24:66 - \'db\' is defined but never used. (no-unused-vars)\n31:11 - \'visit\' is not defined. (no-undef)\n33:11 - \'click\' is not defined. (no-undef)\n34:11 - \'fillIn\' is not defined. (no-undef)\n35:11 - \'keyEvent\' is not defined. (no-undef)\n36:11 - \'wait\' is not defined. (no-undef)\n37:11 - \'click\' is not defined. (no-undef)\n43:5 - \'click\' is not defined. (no-undef)\n44:5 - \'click\' is not defined. (no-undef)\n45:5 - \'click\' is not defined. (no-undef)\n46:5 - \'click\' is not defined. (no-undef)\n47:5 - \'click\' is not defined. (no-undef)\n48:11 - \'click\' is not defined. (no-undef)\n50:11 - \'click\' is not defined. (no-undef)\n52:11 - \'click\' is not defined. (no-undef)\n54:5 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/encounter-note-save-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/encounter-note-save-test.js should pass ESLint\n\n34:5 - \'server\' is not defined. (no-undef)\n39:5 - \'server\' is not defined. (no-undef)\n39:103 - \'db\' is defined but never used. (no-unused-vars)\n44:11 - \'visit\' is not defined. (no-undef)\n45:5 - \'click\' is not defined. (no-undef)\n46:11 - \'click\' is not defined. (no-undef)\n48:5 - \'fillInRichText\' is not defined. (no-undef)\n49:11 - \'click\' is not defined. (no-undef)\n51:5 - \'click\' is not defined. (no-undef)\n52:5 - \'click\' is not defined. (no-undef)\n53:11 - \'click\' is not defined. (no-undef)\n55:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/encounter-preview-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/encounter-preview-test.js should pass ESLint\n\n26:5 - \'visit\' is not defined. (no-undef)\n27:11 - \'click\' is not defined. (no-undef)\n28:19 - \'findWithAssert\' is not defined. (no-undef)\n29:19 - \'findWithAssert\' is not defined. (no-undef)\n30:19 - \'findWithAssert\' is not defined. (no-undef)\n31:19 - \'findWithAssert\' is not defined. (no-undef)\n32:19 - \'findWithAssert\' is not defined. (no-undef)\n33:19 - \'findWithAssert\' is not defined. (no-undef)\n34:19 - \'findWithAssert\' is not defined. (no-undef)\n36:11 - \'click\' is not defined. (no-undef)\n37:19 - \'findWithAssert\' is not defined. (no-undef)\n38:19 - \'findWithAssert\' is not defined. (no-undef)\n39:19 - \'findWithAssert\' is not defined. (no-undef)\n40:19 - \'findWithAssert\' is not defined. (no-undef)\n41:19 - \'findWithAssert\' is not defined. (no-undef)\n45:11 - \'click\' is not defined. (no-undef)\n46:11 - \'waitForPromise\' is not defined. (no-undef)\n63:11 - \'click\' is not defined. (no-undef)\n65:18 - \'currentURL\' is not defined. (no-undef)\n66:5 - \'click\' is not defined. (no-undef)\n70:5 - \'visit\' is not defined. (no-undef)\n71:11 - \'click\' is not defined. (no-undef)\n72:19 - \'findWithAssert\' is not defined. (no-undef)\n73:5 - \'click\' is not defined. (no-undef)\n74:11 - \'click\' is not defined. (no-undef)\n76:18 - \'currentURL\' is not defined. (no-undef)\n77:5 - \'click\' is not defined. (no-undef)\n81:5 - \'visit\' is not defined. (no-undef)\n82:11 - \'click\' is not defined. (no-undef)\n83:19 - \'findWithAssert\' is not defined. (no-undef)\n84:11 - \'click\' is not defined. (no-undef)\n86:11 - \'click\' is not defined. (no-undef)\n87:19 - \'findWithAssert\' is not defined. (no-undef)\n88:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/encounter-referral-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/encounter-referral-test.js should pass ESLint\n\n15:5 - \'server\' is not defined. (no-undef)\n15:76 - \'db\' is defined but never used. (no-unused-vars)\n20:11 - \'visit\' is not defined. (no-undef)\n25:11 - \'click\' is not defined. (no-undef)\n26:5 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/encounter-refresh-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/encounter-refresh-test.js should pass ESLint\n\n15:11 - \'visit\' is not defined. (no-undef)\n39:5 - \'server\' is not defined. (no-undef)\n43:5 - \'server\' is not defined. (no-undef)\n48:5 - \'server\' is not defined. (no-undef)\n53:5 - \'server\' is not defined. (no-undef)\n57:5 - \'server\' is not defined. (no-undef)\n62:5 - \'server\' is not defined. (no-undef)\n67:5 - \'server\' is not defined. (no-undef)\n72:5 - \'server\' is not defined. (no-undef)\n82:5 - \'server\' is not defined. (no-undef)\n86:5 - \'server\' is not defined. (no-undef)\n90:5 - \'server\' is not defined. (no-undef)\n95:5 - \'server\' is not defined. (no-undef)\n100:5 - \'server\' is not defined. (no-undef)\n104:5 - \'server\' is not defined. (no-undef)\n111:11 - \'click\' is not defined. (no-undef)\n145:11 - \'click\' is not defined. (no-undef)\n146:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/encounter-search-highlight-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/encounter-search-highlight-test.js should pass ESLint\n\n14:11 - \'visit\' is not defined. (no-undef)\n15:11 - \'fillIn\' is not defined. (no-undef)\n16:11 - \'click\' is not defined. (no-undef)\n21:11 - \'fillIn\' is not defined. (no-undef)\n22:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/encounter-sia-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/encounter-sia-test.js should pass ESLint\n\n34:9 - \'server\' is not defined. (no-undef)\n34:98 - \'db\' is defined but never used. (no-unused-vars)\n47:5 - \'server\' is not defined. (no-undef)\n50:23 - \'moment\' is not defined. (no-undef)\n51:21 - \'moment\' is not defined. (no-undef)\n55:11 - \'visit\' is not defined. (no-undef)\n58:11 - \'click\' is not defined. (no-undef)\n59:5 - \'fillIn\' is not defined. (no-undef)\n61:11 - \'keyEvent\' is not defined. (no-undef)\n62:11 - \'wait\' is not defined. (no-undef)\n63:11 - \'click\' is not defined. (no-undef)\n70:11 - \'click\' is not defined. (no-undef)\n71:11 - \'keyEvent\' is not defined. (no-undef)\n72:11 - \'click\' is not defined. (no-undef)\n74:5 - \'fillIn\' is not defined. (no-undef)\n75:5 - \'fillIn\' is not defined. (no-undef)\n77:11 - \'click\' is not defined. (no-undef)\n82:11 - \'click\' is not defined. (no-undef)\n86:18 - \'moment\' is not defined. (no-undef)\n90:11 - \'click\' is not defined. (no-undef)\n91:11 - \'keyEvent\' is not defined. (no-undef)\n92:11 - \'click\' is not defined. (no-undef)\n95:11 - \'click\' is not defined. (no-undef)\n96:11 - \'keyEvent\' is not defined. (no-undef)\n97:11 - \'click\' is not defined. (no-undef)\n100:5 - \'fillIn\' is not defined. (no-undef)\n101:5 - \'fillIn\' is not defined. (no-undef)\n104:11 - \'click\' is not defined. (no-undef)\n110:11 - \'click\' is not defined. (no-undef)\n113:18 - \'moment\' is not defined. (no-undef)\n117:11 - \'click\' is not defined. (no-undef)\n122:11 - \'visit\' is not defined. (no-undef)\n123:11 - \'click\' is not defined. (no-undef)\n124:5 - \'fillIn\' is not defined. (no-undef)\n126:11 - \'keyEvent\' is not defined. (no-undef)\n127:11 - \'wait\' is not defined. (no-undef)\n128:11 - \'click\' is not defined. (no-undef)\n135:11 - \'click\' is not defined. (no-undef)\n136:11 - \'keyEvent\' is not defined. (no-undef)\n137:11 - \'click\' is not defined. (no-undef)\n138:11 - \'click\' is not defined. (no-undef)\n144:11 - \'visit\' is not defined. (no-undef)\n145:11 - \'click\' is not defined. (no-undef)\n146:5 - \'fillIn\' is not defined. (no-undef)\n148:11 - \'keyEvent\' is not defined. (no-undef)\n149:11 - \'wait\' is not defined. (no-undef)\n160:11 - \'visit\' is not defined. (no-undef)\n161:11 - \'click\' is not defined. (no-undef)\n162:5 - \'fillIn\' is not defined. (no-undef)\n164:11 - \'keyEvent\' is not defined. (no-undef)\n165:11 - \'wait\' is not defined. (no-undef)\n166:11 - \'click\' is not defined. (no-undef)\n172:11 - \'click\' is not defined. (no-undef)\n173:11 - \'keyEvent\' is not defined. (no-undef)\n174:11 - \'click\' is not defined. (no-undef)\n175:11 - \'click\' is not defined. (no-undef)\n181:11 - \'visit\' is not defined. (no-undef)\n182:11 - \'click\' is not defined. (no-undef)\n183:11 - \'fillIn\' is not defined. (no-undef)\n184:11 - \'keyEvent\' is not defined. (no-undef)\n185:11 - \'wait\' is not defined. (no-undef)\n186:11 - \'click\' is not defined. (no-undef)\n193:5 - \'server\' is not defined. (no-undef)\n195:5 - \'server\' is not defined. (no-undef)\n197:11 - \'visit\' is not defined. (no-undef)\n198:11 - \'click\' is not defined. (no-undef)\n199:11 - \'fillIn\' is not defined. (no-undef)\n200:11 - \'keyEvent\' is not defined. (no-undef)\n201:11 - \'wait\' is not defined. (no-undef)\n202:11 - \'click\' is not defined. (no-undef)\n206:11 - \'click\' is not defined. (no-undef)\n207:11 - \'click\' is not defined. (no-undef)\n208:11 - \'click\' is not defined. (no-undef)\n212:11 - \'click\' is not defined. (no-undef)\n214:11 - \'click\' is not defined. (no-undef)\n221:11 - \'click\' is not defined. (no-undef)\n226:11 - \'visit\' is not defined. (no-undef)\n227:11 - \'click\' is not defined. (no-undef)\n228:5 - \'fillIn\' is not defined. (no-undef)\n229:11 - \'keyEvent\' is not defined. (no-undef)\n230:11 - \'wait\' is not defined. (no-undef)\n231:11 - \'click\' is not defined. (no-undef)\n232:5 - \'fillIn\' is not defined. (no-undef)\n233:5 - \'fillIn\' is not defined. (no-undef)\n234:11 - \'delayAsync\' is not defined. (no-undef)\n236:5 - \'fillIn\' is not defined. (no-undef)\n237:11 - \'delayAsync\' is not defined. (no-undef)\n239:11 - \'fillIn\' is not defined. (no-undef)\n240:11 - \'wait\' is not defined. (no-undef)\n241:11 - \'delayAsync\' is not defined. (no-undef)\n246:11 - \'visit\' is not defined. (no-undef)\n247:11 - \'click\' is not defined. (no-undef)\n251:11 - \'fillIn\' is not defined. (no-undef)\n260:5 - \'server\' is not defined. (no-undef)\n264:5 - \'server\' is not defined. (no-undef)\n267:5 - \'server\' is not defined. (no-undef)\n267:94 - \'db\' is defined but never used. (no-unused-vars)\n271:5 - \'server\' is not defined. (no-undef)\n271:94 - \'db\' is defined but never used. (no-unused-vars)\n276:11 - \'visit\' is not defined. (no-undef)\n278:11 - \'delayAsync\' is not defined. (no-undef)\n281:11 - \'delayAsync\' is not defined. (no-undef)\n283:11 - \'click\' is not defined. (no-undef)\n284:5 - \'fillIn\' is not defined. (no-undef)\n285:11 - \'keyEvent\' is not defined. (no-undef)\n286:11 - \'wait\' is not defined. (no-undef)\n287:11 - \'click\' is not defined. (no-undef)\n290:11 - \'click\' is not defined. (no-undef)\n294:11 - \'click\' is not defined. (no-undef)\n295:5 - \'fillIn\' is not defined. (no-undef)\n296:5 - \'fillIn\' is not defined. (no-undef)\n297:11 - \'click\' is not defined. (no-undef)\n299:11 - \'click\' is not defined. (no-undef)\n303:5 - \'fillIn\' is not defined. (no-undef)\n304:11 - \'delayAsync\' is not defined. (no-undef)\n307:11 - \'click\' is not defined. (no-undef)\n313:5 - \'server\' is not defined. (no-undef)\n319:11 - \'visit\' is not defined. (no-undef)\n320:11 - \'click\' is not defined. (no-undef)\n321:11 - \'click\' is not defined. (no-undef)\n326:23 - \'moment\' is not defined. (no-undef)\n327:21 - \'moment\' is not defined. (no-undef)\n329:5 - \'server\' is not defined. (no-undef)\n331:5 - \'server\' is not defined. (no-undef)\n335:11 - \'visit\' is not defined. (no-undef)\n336:11 - \'click\' is not defined. (no-undef)\n337:5 - \'fillIn\' is not defined. (no-undef)\n340:11 - \'keyEvent\' is not defined. (no-undef)\n341:11 - \'wait\' is not defined. (no-undef)\n342:11 - \'click\' is not defined. (no-undef)\n347:5 - \'click\' is not defined. (no-undef)\n348:5 - \'click\' is not defined. (no-undef)\n350:5 - \'fillIn\' is not defined. (no-undef)\n351:5 - \'fillIn\' is not defined. (no-undef)\n352:5 - \'fillIn\' is not defined. (no-undef)\n353:5 - \'click\' is not defined. (no-undef)\n354:11 - \'click\' is not defined. (no-undef)\n355:11 - \'click\' is not defined. (no-undef)\n359:11 - \'click\' is not defined. (no-undef)\n372:32 - \'$\' is not defined. (no-undef)\n379:23 - \'moment\' is not defined. (no-undef)\n380:21 - \'moment\' is not defined. (no-undef)\n382:5 - \'server\' is not defined. (no-undef)\n384:5 - \'server\' is not defined. (no-undef)\n388:11 - \'visit\' is not defined. (no-undef)\n390:11 - \'click\' is not defined. (no-undef)\n391:11 - \'fillIn\' is not defined. (no-undef)\n393:11 - \'keyEvent\' is not defined. (no-undef)\n394:11 - \'wait\' is not defined. (no-undef)\n395:11 - \'click\' is not defined. (no-undef)\n421:5 - \'fillIn\' is not defined. (no-undef)\n422:5 - \'fillIn\' is not defined. (no-undef)\n423:5 - \'fillIn\' is not defined. (no-undef)\n426:11 - \'click\' is not defined. (no-undef)\n427:11 - \'click\' is not defined. (no-undef)\n428:11 - \'click\' is not defined. (no-undef)\n429:11 - \'click\' is not defined. (no-undef)\n430:11 - \'click\' is not defined. (no-undef)\n435:11 - \'click\' is not defined. (no-undef)\n445:11 - \'click\' is not defined. (no-undef)\n453:11 - \'click\' is not defined. (no-undef)\n456:11 - \'click\' is not defined. (no-undef)\n458:11 - \'click\' is not defined. (no-undef)\n459:11 - \'click\' is not defined. (no-undef)\n464:23 - \'moment\' is not defined. (no-undef)\n465:21 - \'moment\' is not defined. (no-undef)\n469:5 - \'server\' is not defined. (no-undef)\n471:5 - \'server\' is not defined. (no-undef)\n471:66 - \'db\' is defined but never used. (no-unused-vars)\n474:22 - \'moment\' is not defined. (no-undef)\n475:22 - \'moment\' is not defined. (no-undef)\n483:11 - \'visit\' is not defined. (no-undef)\n485:11 - \'click\' is not defined. (no-undef)\n486:11 - \'fillIn\' is not defined. (no-undef)\n487:11 - \'keyEvent\' is not defined. (no-undef)\n488:11 - \'wait\' is not defined. (no-undef)\n489:11 - \'click\' is not defined. (no-undef)\n495:5 - \'fillIn\' is not defined. (no-undef)\n496:5 - \'fillIn\' is not defined. (no-undef)\n497:5 - \'fillIn\' is not defined. (no-undef)\n500:35 - \'fillIn\' is not defined. (no-undef)\n503:11 - \'fillIn\' is not defined. (no-undef)\n505:11 - \'fillIn\' is not defined. (no-undef)\n507:11 - \'click\' is not defined. (no-undef)\n509:11 - \'fillIn\' is not defined. (no-undef)\n511:11 - \'click\' is not defined. (no-undef)\n514:11 - \'click\' is not defined. (no-undef)\n515:5 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/encounter-smoking-status-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/encounter-smoking-status-test.js should pass ESLint\n\n16:5 - \'server\' is not defined. (no-undef)\n17:11 - \'visit\' is not defined. (no-undef)\n23:5 - \'server\' is not defined. (no-undef)\n23:76 - \'db\' is defined but never used. (no-unused-vars)\n31:5 - \'server\' is not defined. (no-undef)\n31:96 - \'db\' is defined but never used. (no-unused-vars)\n38:5 - \'server\' is not defined. (no-undef)\n38:96 - \'db\' is defined but never used. (no-unused-vars)\n42:5 - \'server\' is not defined. (no-undef)\n44:11 - \'visit\' is not defined. (no-undef)\n50:11 - \'click\' is not defined. (no-undef)\n53:5 - \'click\' is not defined. (no-undef)\n54:5 - \'fillIn\' is not defined. (no-undef)\n55:11 - \'click\' is not defined. (no-undef)\n61:11 - \'click\' is not defined. (no-undef)\n63:5 - \'click\' is not defined. (no-undef)\n64:5 - \'fillIn\' is not defined. (no-undef)\n65:11 - \'click\' is not defined. (no-undef)\n70:5 - \'click\' is not defined. (no-undef)\n71:5 - \'click\' is not defined. (no-undef)\n72:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/encounter-snapshots-error-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/encounter-snapshots-error-test.js should pass ESLint\n\n41:16 - \'click\' is not defined. (no-undef)\n43:11 - \'click\' is not defined. (no-undef)\n44:12 - \'click\' is not defined. (no-undef)\n48:5 - \'server\' is not defined. (no-undef)\n50:11 - \'visit\' is not defined. (no-undef)\n51:18 - \'currentURL\' is not defined. (no-undef)\n53:5 - \'click\' is not defined. (no-undef)\n54:11 - \'click\' is not defined. (no-undef)\n56:5 - \'click\' is not defined. (no-undef)\n57:5 - \'click\' is not defined. (no-undef)\n58:5 - \'click\' is not defined. (no-undef)\n61:11 - \'click\' is not defined. (no-undef)\n66:5 - \'server\' is not defined. (no-undef)\n68:11 - \'visit\' is not defined. (no-undef)\n69:5 - \'click\' is not defined. (no-undef)\n70:5 - \'click\' is not defined. (no-undef)\n71:5 - \'click\' is not defined. (no-undef)\n72:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/encounter-subjective-note-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/encounter-subjective-note-test.js should pass ESLint\n\n17:5 - \'server\' is not defined. (no-undef)\n17:73 - \'db\' is defined but never used. (no-unused-vars)\n30:5 - \'server\' is not defined. (no-undef)\n32:11 - \'visit\' is not defined. (no-undef)\n33:11 - \'click\' is not defined. (no-undef)\n34:5 - \'percySnapshot\' is not defined. (no-undef)\n35:11 - \'click\' is not defined. (no-undef)\n45:11 - \'click\' is not defined. (no-undef)\n49:11 - \'click\' is not defined. (no-undef)\n57:11 - \'click\' is not defined. (no-undef)\n62:5 - \'server\' is not defined. (no-undef)\n62:65 - \'db\' is defined but never used. (no-unused-vars)\n66:38 - Unnecessary escape character: \\". (no-useless-escape)\n66:52 - Unnecessary escape character: \\". (no-useless-escape)\n72:11 - \'visit\' is not defined. (no-undef)\n73:11 - \'click\' is not defined. (no-undef)\n74:5 - \'click\' is not defined. (no-undef)\n75:11 - \'click\' is not defined. (no-undef)\n77:11 - \'click\' is not defined. (no-undef)\n79:11 - \'click\' is not defined. (no-undef)\n83:11 - \'click\' is not defined. (no-undef)\n92:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/encounter-tabs-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/encounter-tabs-test.js should pass ESLint\n\n18:5 - \'server\' is not defined. (no-undef)\n41:11 - \'visit\' is not defined. (no-undef)\n42:11 - \'click\' is not defined. (no-undef)\n45:11 - \'click\' is not defined. (no-undef)\n46:11 - \'click\' is not defined. (no-undef)\n49:11 - \'click\' is not defined. (no-undef)\n52:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/encounter-template-usage-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/encounter-template-usage-test.js should pass ESLint\n\n16:5 - \'server\' is not defined. (no-undef)\n22:5 - \'server\' is not defined. (no-undef)\n30:11 - \'visit\' is not defined. (no-undef)\n31:11 - \'click\' is not defined. (no-undef)\n32:11 - \'click\' is not defined. (no-undef)\n33:11 - \'click\' is not defined. (no-undef)\n36:11 - \'click\' is not defined. (no-undef)\n45:11 - \'click\' is not defined. (no-undef)\n51:11 - \'click\' is not defined. (no-undef)\n55:11 - \'click\' is not defined. (no-undef)\n57:11 - \'click\' is not defined. (no-undef)\n67:11 - \'click\' is not defined. (no-undef)\n68:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/encounter-timeline-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/encounter-timeline-test.js should pass ESLint\n\n26:5 - \'server\' is not defined. (no-undef)\n30:11 - \'visit\' is not defined. (no-undef)\n35:5 - \'percySnapshot\' is not defined. (no-undef)\n43:19 - \'findWithAssert\' is not defined. (no-undef)\n45:11 - \'click\' is not defined. (no-undef)\n47:11 - \'click\' is not defined. (no-undef)\n48:19 - \'findWithAssert\' is not defined. (no-undef)\n49:19 - \'findWithAssert\' is not defined. (no-undef)\n50:11 - \'click\' is not defined. (no-undef)\n55:11 - \'visit\' is not defined. (no-undef)\n56:11 - \'click\' is not defined. (no-undef)\n57:18 - \'currentURL\' is not defined. (no-undef)\n62:5 - \'server\' is not defined. (no-undef)\n62:88 - \'db\' is defined but never used. (no-unused-vars)\n74:11 - \'visit\' is not defined. (no-undef)\n77:19 - \'findWithAssert\' is not defined. (no-undef)\n78:19 - \'findWithAssert\' is not defined. (no-undef)\n79:19 - \'findWithAssert\' is not defined. (no-undef)\n80:19 - \'findWithAssert\' is not defined. (no-undef)\n82:11 - \'click\' is not defined. (no-undef)\n83:18 - \'currentURL\' is not defined. (no-undef)\n84:11 - \'click\' is not defined. (no-undef)\n85:11 - \'click\' is not defined. (no-undef)\n86:18 - \'currentURL\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/flowsheet-encounter-range-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/flowsheet-encounter-range-test.js should pass ESLint\n\n21:5 - \'server\' is not defined. (no-undef)\n36:11 - \'visit\' is not defined. (no-undef)\n37:11 - \'click\' is not defined. (no-undef)\n38:11 - \'click\' is not defined. (no-undef)\n39:11 - \'click\' is not defined. (no-undef)\n40:11 - \'click\' is not defined. (no-undef)\n41:11 - \'click\' is not defined. (no-undef)\n42:11 - \'click\' is not defined. (no-undef)\n43:5 - \'click\' is not defined. (no-undef)\n48:23 - \'moment\' is not defined. (no-undef)\n49:21 - \'moment\' is not defined. (no-undef)\n52:5 - \'server\' is not defined. (no-undef)\n59:26 - \'moment\' is not defined. (no-undef)\n59:69 - \'moment\' is not defined. (no-undef)\n61:26 - \'moment\' is not defined. (no-undef)\n61:67 - \'moment\' is not defined. (no-undef)\n71:11 - \'visit\' is not defined. (no-undef)\n72:11 - \'click\' is not defined. (no-undef)\n73:11 - \'click\' is not defined. (no-undef)\n74:11 - \'click\' is not defined. (no-undef)\n76:11 - \'fillIn\' is not defined. (no-undef)\n77:11 - \'fillIn\' is not defined. (no-undef)\n78:11 - \'click\' is not defined. (no-undef)\n79:11 - \'click\' is not defined. (no-undef)\n80:11 - \'click\' is not defined. (no-undef)\n82:11 - \'fillIn\' is not defined. (no-undef)\n83:11 - \'fillIn\' is not defined. (no-undef)\n84:5 - \'click\' is not defined. (no-undef)\n89:5 - \'server\' is not defined. (no-undef)\n100:11 - \'visit\' is not defined. (no-undef)\n101:11 - \'click\' is not defined. (no-undef)\n102:11 - \'click\' is not defined. (no-undef)\n103:11 - \'click\' is not defined. (no-undef)\n105:11 - \'click\' is not defined. (no-undef)\n106:11 - \'fillIn\' is not defined. (no-undef)\n107:5 - \'click\' is not defined. (no-undef)\n112:5 - \'server\' is not defined. (no-undef)\n125:11 - \'visit\' is not defined. (no-undef)\n126:11 - \'click\' is not defined. (no-undef)\n127:11 - \'click\' is not defined. (no-undef)\n128:11 - \'click\' is not defined. (no-undef)\n129:11 - \'click\' is not defined. (no-undef)\n130:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/medication-print-preview-encounter-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/medication-print-preview-encounter-test.js should pass ESLint\n\n19:11 - \'visit\' is not defined. (no-undef)\n20:11 - \'click\' is not defined. (no-undef)\n21:11 - \'click\' is not defined. (no-undef)\n24:5 - \'click\' is not defined. (no-undef)\n28:11 - \'visit\' is not defined. (no-undef)\n29:11 - \'click\' is not defined. (no-undef)\n30:11 - \'click\' is not defined. (no-undef)\n33:5 - \'click\' is not defined. (no-undef)\n37:11 - \'visit\' is not defined. (no-undef)\n38:11 - \'click\' is not defined. (no-undef)\n39:11 - \'click\' is not defined. (no-undef)\n42:5 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/medication-print-preview-summary-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/medication-print-preview-summary-test.js should pass ESLint\n\n19:11 - \'visit\' is not defined. (no-undef)\n20:11 - \'click\' is not defined. (no-undef)\n21:11 - \'click\' is not defined. (no-undef)\n50:5 - \'click\' is not defined. (no-undef)\n54:11 - \'visit\' is not defined. (no-undef)\n55:11 - \'click\' is not defined. (no-undef)\n56:11 - \'click\' is not defined. (no-undef)\n59:5 - \'click\' is not defined. (no-undef)\n63:11 - \'visit\' is not defined. (no-undef)\n64:11 - \'click\' is not defined. (no-undef)\n65:11 - \'click\' is not defined. (no-undef)\n68:5 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/orders-attached-to-encounter-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/orders-attached-to-encounter-test.js should pass ESLint\n\n14:5 - \'server\' is not defined. (no-undef)\n15:11 - \'visit\' is not defined. (no-undef)\n16:11 - \'click\' is not defined. (no-undef)\n17:11 - \'click\' is not defined. (no-undef)\n55:5 - \'server\' is not defined. (no-undef)\n56:11 - \'visit\' is not defined. (no-undef)\n58:11 - \'click\' is not defined. (no-undef)\n82:5 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/past-medical-history-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/past-medical-history-test.js should pass ESLint\n\n12:5 - \'server\' is not defined. (no-undef)\n12:74 - \'db\' is defined but never used. (no-unused-vars)\n37:5 - \'server\' is not defined. (no-undef)\n41:11 - \'visit\' is not defined. (no-undef)\n56:11 - \'click\' is not defined. (no-undef)\n60:11 - \'fillIn\' is not defined. (no-undef)\n62:11 - \'click\' is not defined. (no-undef)\n65:11 - \'click\' is not defined. (no-undef)\n67:11 - \'fillIn\' is not defined. (no-undef)\n69:11 - \'click\' is not defined. (no-undef)\n72:11 - \'click\' is not defined. (no-undef)\n73:11 - \'fillIn\' is not defined. (no-undef)\n74:11 - \'click\' is not defined. (no-undef)\n76:11 - \'click\' is not defined. (no-undef)\n77:11 - \'fillIn\' is not defined. (no-undef)\n78:11 - \'click\' is not defined. (no-undef)\n80:11 - \'click\' is not defined. (no-undef)\n81:11 - \'fillIn\' is not defined. (no-undef)\n82:11 - \'click\' is not defined. (no-undef)\n84:11 - \'click\' is not defined. (no-undef)\n85:11 - \'click\' is not defined. (no-undef)\n87:11 - \'click\' is not defined. (no-undef)\n88:11 - \'fillIn\' is not defined. (no-undef)\n89:11 - \'click\' is not defined. (no-undef)\n91:11 - \'click\' is not defined. (no-undef)\n93:5 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/patient-access-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/patient-access-test.js should pass ESLint\n\n26:11 - \'visit\' is not defined. (no-undef)\n28:11 - \'click\' is not defined. (no-undef)\n30:11 - \'click\' is not defined. (no-undef)\n31:11 - \'wait\' is not defined. (no-undef)\n41:11 - \'click\' is not defined. (no-undef)\n50:11 - \'click\' is not defined. (no-undef)\n51:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/patient-list-limited-access-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/patient-list-limited-access-test.js should pass ESLint\n\n7:9 - \'server\' is not defined. (no-undef)\n14:5 - \'server\' is not defined. (no-undef)\n17:5 - \'server\' is not defined. (no-undef)\n18:11 - \'visit\' is not defined. (no-undef)\n20:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/patient-list-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/patient-list-test.js should pass ESLint\n\n32:19 - \'findWithAssert\' is not defined. (no-undef)\n38:26 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n38:26 - \'$\' is not defined. (no-undef)\n46:5 - \'server\' is not defined. (no-undef)\n47:11 - \'visit\' is not defined. (no-undef)\n48:5 - \'percySnapshot\' is not defined. (no-undef)\n49:19 - \'findWithAssert\' is not defined. (no-undef)\n50:19 - \'findWithAssert\' is not defined. (no-undef)\n51:19 - \'findWithAssert\' is not defined. (no-undef)\n52:5 - \'click\' is not defined. (no-undef)\n53:5 - \'click\' is not defined. (no-undef)\n54:11 - \'click\' is not defined. (no-undef)\n57:9 - \'click\' is not defined. (no-undef)\n59:5 - \'click\' is not defined. (no-undef)\n60:11 - \'click\' is not defined. (no-undef)\n61:11 - \'wait\' is not defined. (no-undef)\n71:19 - \'findWithAssert\' is not defined. (no-undef)\n72:11 - \'click\' is not defined. (no-undef)\n73:18 - \'currentURL\' is not defined. (no-undef)\n74:11 - \'click\' is not defined. (no-undef)\n75:11 - \'click\' is not defined. (no-undef)\n77:11 - \'click\' is not defined. (no-undef)\n93:19 - \'moment\' is not defined. (no-undef)\n94:22 - \'moment\' is not defined. (no-undef)\n97:5 - \'server\' is not defined. (no-undef)\n106:5 - \'server\' is not defined. (no-undef)\n108:11 - \'visit\' is not defined. (no-undef)\n109:11 - \'click\' is not defined. (no-undef)\n111:52 - \'moment\' is not defined. (no-undef)\n122:11 - \'click\' is not defined. (no-undef)\n124:11 - \'click\' is not defined. (no-undef)\n128:11 - \'click\' is not defined. (no-undef)\n132:5 - \'click\' is not defined. (no-undef)\n133:11 - \'click\' is not defined. (no-undef)\n135:19 - \'findWithAssert\' is not defined. (no-undef)\n137:11 - \'click\' is not defined. (no-undef)\n139:5 - \'click\' is not defined. (no-undef)\n140:5 - \'click\' is not defined. (no-undef)\n141:5 - \'click\' is not defined. (no-undef)\n142:11 - \'click\' is not defined. (no-undef)\n143:18 - \'currentURL\' is not defined. (no-undef)\n149:5 - \'server\' is not defined. (no-undef)\n157:5 - \'server\' is not defined. (no-undef)\n159:11 - \'visit\' is not defined. (no-undef)\n163:5 - \'fillIn\' is not defined. (no-undef)\n164:11 - \'click\' is not defined. (no-undef)\n166:19 - \'findWithAssert\' is not defined. (no-undef)\n167:5 - \'click\' is not defined. (no-undef)\n168:5 - \'fillIn\' is not defined. (no-undef)\n169:11 - \'click\' is not defined. (no-undef)\n175:11 - \'click\' is not defined. (no-undef)\n179:11 - \'click\' is not defined. (no-undef)\n183:11 - \'click\' is not defined. (no-undef)\n184:19 - \'findWithAssert\' is not defined. (no-undef)\n185:11 - \'click\' is not defined. (no-undef)\n186:18 - \'currentURL\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/print-chart-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/print-chart-test.js should pass ESLint\n\n20:12 - \'click\' is not defined. (no-undef)\n31:5 - \'server\' is not defined. (no-undef)\n31:58 - \'db\' is defined but never used. (no-unused-vars)\n39:11 - \'visit\' is not defined. (no-undef)\n40:11 - \'click\' is not defined. (no-undef)\n41:19 - \'findWithAssert\' is not defined. (no-undef)\n43:11 - \'click\' is not defined. (no-undef)\n45:5 - \'click\' is not defined. (no-undef)\n46:11 - \'click\' is not defined. (no-undef)\n49:11 - \'click\' is not defined. (no-undef)\n50:19 - \'findWithAssert\' is not defined. (no-undef)\n52:11 - \'click\' is not defined. (no-undef)\n53:19 - \'findWithAssert\' is not defined. (no-undef)\n62:11 - \'click\' is not defined. (no-undef)\n63:11 - \'click\' is not defined. (no-undef)\n64:11 - \'click\' is not defined. (no-undef)\n78:5 - \'click\' is not defined. (no-undef)\n84:16 - \'click\' is not defined. (no-undef)\n86:11 - \'click\' is not defined. (no-undef)\n87:12 - \'click\' is not defined. (no-undef)\n91:5 - \'server\' is not defined. (no-undef)\n91:58 - \'db\' is defined but never used. (no-unused-vars)\n98:11 - \'visit\' is not defined. (no-undef)\n99:11 - \'click\' is not defined. (no-undef)\n100:19 - \'findWithAssert\' is not defined. (no-undef)\n102:11 - \'click\' is not defined. (no-undef)\n104:11 - \'click\' is not defined. (no-undef)\n105:11 - \'click\' is not defined. (no-undef)\n109:11 - \'click\' is not defined. (no-undef)\n123:147 - \'moment\' is not defined. (no-undef)\n128:5 - \'click\' is not defined. (no-undef)\n133:5 - \'server\' is not defined. (no-undef)\n133:58 - \'db\' is defined but never used. (no-unused-vars)\n141:11 - \'visit\' is not defined. (no-undef)\n142:11 - \'click\' is not defined. (no-undef)\n144:5 - \'click\' is not defined. (no-undef)\n152:11 - \'click\' is not defined. (no-undef)\n168:5 - \'click\' is not defined. (no-undef)\n173:5 - \'server\' is not defined. (no-undef)\n173:58 - \'db\' is defined but never used. (no-unused-vars)\n181:11 - \'visit\' is not defined. (no-undef)\n182:11 - \'click\' is not defined. (no-undef)\n184:5 - \'click\' is not defined. (no-undef)\n186:11 - \'click\' is not defined. (no-undef)\n193:5 - \'click\' is not defined. (no-undef)\n197:11 - \'visit\' is not defined. (no-undef)\n198:11 - \'click\' is not defined. (no-undef)\n199:19 - \'findWithAssert\' is not defined. (no-undef)\n200:11 - \'delayAsync\' is not defined. (no-undef)\n201:19 - \'findWithAssert\' is not defined. (no-undef)\n202:5 - \'fillInCheckbox\' is not defined. (no-undef)\n203:11 - \'click\' is not defined. (no-undef)\n205:11 - \'click\' is not defined. (no-undef)\n206:19 - \'findWithAssert\' is not defined. (no-undef)\n207:11 - \'click\' is not defined. (no-undef)\n210:5 - \'click\' is not defined. (no-undef)\n214:11 - \'visit\' is not defined. (no-undef)\n215:11 - \'click\' is not defined. (no-undef)\n216:19 - \'findWithAssert\' is not defined. (no-undef)\n217:11 - \'delayAsync\' is not defined. (no-undef)\n218:19 - \'findWithAssert\' is not defined. (no-undef)\n219:11 - \'click\' is not defined. (no-undef)\n221:11 - \'click\' is not defined. (no-undef)\n222:11 - \'click\' is not defined. (no-undef)\n225:5 - \'click\' is not defined. (no-undef)\n229:11 - \'visit\' is not defined. (no-undef)\n230:11 - \'click\' is not defined. (no-undef)\n231:19 - \'findWithAssert\' is not defined. (no-undef)\n232:11 - \'delayAsync\' is not defined. (no-undef)\n233:19 - \'findWithAssert\' is not defined. (no-undef)\n234:11 - \'click\' is not defined. (no-undef)\n236:11 - \'click\' is not defined. (no-undef)\n237:11 - \'click\' is not defined. (no-undef)\n240:5 - \'click\' is not defined. (no-undef)\n244:11 - \'visit\' is not defined. (no-undef)\n245:11 - \'click\' is not defined. (no-undef)\n247:11 - \'click\' is not defined. (no-undef)\n250:5 - \'click\' is not defined. (no-undef)\n254:11 - \'visit\' is not defined. (no-undef)\n255:11 - \'click\' is not defined. (no-undef)\n257:11 - \'click\' is not defined. (no-undef)\n258:11 - \'click\' is not defined. (no-undef)\n259:11 - \'click\' is not defined. (no-undef)\n261:5 - \'click\' is not defined. (no-undef)\n265:11 - \'visit\' is not defined. (no-undef)\n266:11 - \'click\' is not defined. (no-undef)\n268:11 - \'click\' is not defined. (no-undef)\n269:11 - \'click\' is not defined. (no-undef)\n270:11 - \'click\' is not defined. (no-undef)\n272:5 - \'click\' is not defined. (no-undef)\n276:11 - \'visit\' is not defined. (no-undef)\n277:11 - \'click\' is not defined. (no-undef)\n278:11 - \'delayAsync\' is not defined. (no-undef)\n280:11 - \'click\' is not defined. (no-undef)\n282:11 - \'click\' is not defined. (no-undef)\n300:5 - \'click\' is not defined. (no-undef)\n304:11 - \'visit\' is not defined. (no-undef)\n305:11 - \'click\' is not defined. (no-undef)\n306:11 - \'delayAsync\' is not defined. (no-undef)\n307:11 - \'click\' is not defined. (no-undef)\n308:11 - \'click\' is not defined. (no-undef)\n309:11 - \'click\' is not defined. (no-undef)\n325:5 - \'click\' is not defined. (no-undef)\n329:11 - \'visit\' is not defined. (no-undef)\n330:11 - \'click\' is not defined. (no-undef)\n331:11 - \'delayAsync\' is not defined. (no-undef)\n333:11 - \'click\' is not defined. (no-undef)\n335:11 - \'click\' is not defined. (no-undef)\n336:11 - \'click\' is not defined. (no-undef)\n346:5 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/print-diagnoses-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/print-diagnoses-test.js should pass ESLint\n\n10:5 - \'server\' is not defined. (no-undef)\n11:5 - \'visit\' is not defined. (no-undef)\n12:11 - \'click\' is not defined. (no-undef)\n13:11 - \'click\' is not defined. (no-undef)\n14:11 - \'click\' is not defined. (no-undef)\n15:19 - \'findWithAssert\' is not defined. (no-undef)\n18:18 - \'$\' is not defined. (no-undef)\n18:18 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n19:18 - \'$\' is not defined. (no-undef)\n19:18 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n22:19 - \'findWithAssert\' is not defined. (no-undef)\n23:19 - \'findWithAssert\' is not defined. (no-undef)\n26:19 - \'findWithAssert\' is not defined. (no-undef)\n30:5 - \'click\' is not defined. (no-undef)\n34:5 - \'server\' is not defined. (no-undef)\n35:11 - \'visit\' is not defined. (no-undef)\n36:11 - \'click\' is not defined. (no-undef)\n37:11 - \'click\' is not defined. (no-undef)\n38:11 - \'click\' is not defined. (no-undef)\n39:19 - \'findWithAssert\' is not defined. (no-undef)\n41:5 - \'click\' is not defined. (no-undef)\n45:5 - \'server\' is not defined. (no-undef)\n46:5 - \'visit\' is not defined. (no-undef)\n47:11 - \'click\' is not defined. (no-undef)\n48:11 - \'click\' is not defined. (no-undef)\n49:11 - \'click\' is not defined. (no-undef)\n50:19 - \'findWithAssert\' is not defined. (no-undef)\n54:19 - \'findWithAssert\' is not defined. (no-undef)\n57:5 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/print-encounter-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/print-encounter-test.js should pass ESLint\n\n17:12 - \'click\' is not defined. (no-undef)\n27:5 - \'server\' is not defined. (no-undef)\n31:11 - \'visit\' is not defined. (no-undef)\n32:11 - \'click\' is not defined. (no-undef)\n34:5 - \'click\' is not defined. (no-undef)\n39:11 - \'click\' is not defined. (no-undef)\n75:5 - \'click\' is not defined. (no-undef)\n80:5 - \'server\' is not defined. (no-undef)\n84:11 - \'visit\' is not defined. (no-undef)\n85:11 - \'click\' is not defined. (no-undef)\n87:5 - \'click\' is not defined. (no-undef)\n89:11 - \'click\' is not defined. (no-undef)\n102:5 - \'click\' is not defined. (no-undef)\n107:5 - \'server\' is not defined. (no-undef)\n111:11 - \'visit\' is not defined. (no-undef)\n112:11 - \'click\' is not defined. (no-undef)\n132:5 - \'click\' is not defined. (no-undef)\n137:5 - \'server\' is not defined. (no-undef)\n141:11 - \'visit\' is not defined. (no-undef)\n142:11 - \'click\' is not defined. (no-undef)\n149:5 - \'click\' is not defined. (no-undef)\n158:5 - \'server\' is not defined. (no-undef)\n158:94 - \'db\' is defined but never used. (no-unused-vars)\n164:5 - \'server\' is not defined. (no-undef)\n167:11 - \'visit\' is not defined. (no-undef)\n168:11 - \'click\' is not defined. (no-undef)\n169:11 - \'fillIn\' is not defined. (no-undef)\n170:11 - \'keyEvent\' is not defined. (no-undef)\n171:11 - \'wait\' is not defined. (no-undef)\n172:11 - \'click\' is not defined. (no-undef)\n174:11 - \'click\' is not defined. (no-undef)\n175:11 - \'click\' is not defined. (no-undef)\n176:11 - \'click\' is not defined. (no-undef)\n178:11 - \'click\' is not defined. (no-undef)\n179:11 - \'click\' is not defined. (no-undef)\n181:11 - \'click\' is not defined. (no-undef)\n185:5 - \'click\' is not defined. (no-undef)\n189:5 - \'server\' is not defined. (no-undef)\n193:5 - \'server\' is not defined. (no-undef)\n201:11 - \'visit\' is not defined. (no-undef)\n202:11 - \'click\' is not defined. (no-undef)\n203:11 - \'click\' is not defined. (no-undef)\n205:11 - \'click\' is not defined. (no-undef)\n207:5 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/print-referral-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/print-referral-test.js should pass ESLint\n\n16:25 - \'moment\' is not defined. (no-undef)\n17:5 - \'visit\' is not defined. (no-undef)\n18:5 - \'click\' is not defined. (no-undef)\n19:11 - \'click\' is not defined. (no-undef)\n22:5 - \'click\' is not defined. (no-undef)\n23:11 - \'click\' is not defined. (no-undef)\n25:11 - \'click\' is not defined. (no-undef)\n27:11 - \'click\' is not defined. (no-undef)\n29:11 - \'click\' is not defined. (no-undef)\n107:79 - \'moment\' is not defined. (no-undef)\n109:5 - \'click\' is not defined. (no-undef)\n110:5 - \'click\' is not defined. (no-undef)\n114:5 - \'visit\' is not defined. (no-undef)\n115:5 - \'click\' is not defined. (no-undef)\n116:11 - \'click\' is not defined. (no-undef)\n119:5 - \'click\' is not defined. (no-undef)\n120:5 - \'click\' is not defined. (no-undef)\n121:11 - \'click\' is not defined. (no-undef)\n123:11 - \'click\' is not defined. (no-undef)\n125:11 - \'click\' is not defined. (no-undef)\n141:5 - \'click\' is not defined. (no-undef)\n142:5 - \'click\' is not defined. (no-undef)\n146:5 - \'server\' is not defined. (no-undef)\n153:5 - \'visit\' is not defined. (no-undef)\n154:5 - \'visit\' is not defined. (no-undef)\n155:5 - \'click\' is not defined. (no-undef)\n156:11 - \'click\' is not defined. (no-undef)\n159:5 - \'click\' is not defined. (no-undef)\n160:5 - \'click\' is not defined. (no-undef)\n161:11 - \'click\' is not defined. (no-undef)\n163:11 - \'click\' is not defined. (no-undef)\n165:11 - \'click\' is not defined. (no-undef)\n181:5 - \'click\' is not defined. (no-undef)\n182:5 - \'click\' is not defined. (no-undef)\n186:5 - \'visit\' is not defined. (no-undef)\n187:5 - \'click\' is not defined. (no-undef)\n188:11 - \'click\' is not defined. (no-undef)\n191:5 - \'click\' is not defined. (no-undef)\n192:11 - \'click\' is not defined. (no-undef)\n194:11 - \'click\' is not defined. (no-undef)\n196:11 - \'click\' is not defined. (no-undef)\n198:11 - \'click\' is not defined. (no-undef)\n226:79 - \'moment\' is not defined. (no-undef)\n228:5 - \'click\' is not defined. (no-undef)\n229:5 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/quality-of-care-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/quality-of-care-test.js should pass ESLint\n\n22:5 - \'server\' is not defined. (no-undef)\n22:95 - \'db\' is defined but never used. (no-unused-vars)\n28:5 - \'server\' is not defined. (no-undef)\n28:108 - \'db\' is defined but never used. (no-unused-vars)\n32:11 - \'visit\' is not defined. (no-undef)\n38:9 - \'startsChecked\' is assigned a value but never used. (no-unused-vars)\n40:11 - \'click\' is not defined. (no-undef)\n42:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/sign-encounter-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/sign-encounter-test.js should pass ESLint\n\n15:5 - \'server\' is not defined. (no-undef)\n19:11 - \'visit\' is not defined. (no-undef)\n22:11 - \'click\' is not defined. (no-undef)\n29:11 - \'click\' is not defined. (no-undef)\n35:11 - \'click\' is not defined. (no-undef)\n42:5 - \'server\' is not defined. (no-undef)\n45:5 - \'server\' is not defined. (no-undef)\n45:90 - \'db\' is defined but never used. (no-unused-vars)\n47:11 - \'visit\' is not defined. (no-undef)\n49:11 - \'toggleEncounterSections\' is not defined. (no-undef)\n53:11 - \'click\' is not defined. (no-undef)\n54:5 - \'fillIn\' is not defined. (no-undef)\n58:11 - \'toggleEncounterSections\' is not defined. (no-undef)\n64:11 - \'click\' is not defined. (no-undef)\n74:11 - \'click\' is not defined. (no-undef)\n81:11 - \'click\' is not defined. (no-undef)\n82:11 - \'click\' is not defined. (no-undef)\n88:11 - \'click\' is not defined. (no-undef)\n89:11 - \'click\' is not defined. (no-undef)\n93:5 - \'toggleEncounterSections\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/signed-encounter-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/signed-encounter-test.js should pass ESLint\n\n13:5 - \'server\' is not defined. (no-undef)\n13:112 - \'db\' is defined but never used. (no-unused-vars)\n19:11 - \'visit\' is not defined. (no-undef)\n40:11 - \'click\' is not defined. (no-undef)\n43:5 - \'fillIn\' is not defined. (no-undef)\n44:5 - \'click\' is not defined. (no-undef)\n48:5 - \'server\' is not defined. (no-undef)\n57:11 - \'visit\' is not defined. (no-undef)\n65:11 - \'click\' is not defined. (no-undef)\n66:11 - \'fillIn\' is not defined. (no-undef)\n67:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/signing-hidden-structured-observations-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/signing-hidden-structured-observations-test.js should pass ESLint\n\n12:5 - \'server\' is not defined. (no-undef)\n14:5 - \'visit\' is not defined. (no-undef)\n15:11 - \'toggleEncounterSections\' is not defined. (no-undef)\n17:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/structured-observations-limited-access-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/structured-observations-limited-access-test.js should pass ESLint\n\n12:9 - \'server\' is not defined. (no-undef)\n19:5 - \'server\' is not defined. (no-undef)\n20:11 - \'visit\' is not defined. (no-undef)\n22:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/structured-observations-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/structured-observations-test.js should pass ESLint\n\n17:5 - \'fillIn\' is not defined. (no-undef)\n18:11 - \'keyEvent\' is not defined. (no-undef)\n19:11 - \'wait\' is not defined. (no-undef)\n21:12 - \'click\' is not defined. (no-undef)\n25:11 - \'visit\' is not defined. (no-undef)\n31:11 - \'visit\' is not defined. (no-undef)\n35:11 - \'click\' is not defined. (no-undef)\n36:19 - \'findWithAssert\' is not defined. (no-undef)\n37:5 - \'click\' is not defined. (no-undef)\n43:5 - \'server\' is not defined. (no-undef)\n46:5 - \'server\' is not defined. (no-undef)\n51:11 - \'visit\' is not defined. (no-undef)\n53:11 - \'click\' is not defined. (no-undef)\n58:11 - \'click\' is not defined. (no-undef)\n70:11 - \'click\' is not defined. (no-undef)\n81:19 - \'findWithAssert\' is not defined. (no-undef)\n93:5 - \'server\' is not defined. (no-undef)\n95:5 - \'server\' is not defined. (no-undef)\n99:5 - \'server\' is not defined. (no-undef)\n104:11 - \'visit\' is not defined. (no-undef)\n107:11 - \'click\' is not defined. (no-undef)\n108:5 - \'fillIn\' is not defined. (no-undef)\n109:11 - \'keyEvent\' is not defined. (no-undef)\n111:11 - \'click\' is not defined. (no-undef)\n117:11 - \'click\' is not defined. (no-undef)\n119:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/syndromic-surveillance-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/syndromic-surveillance-test.js should pass ESLint\n\n12:35 - Unnecessary escape character: \\&. (no-useless-escape)\n22:5 - \'server\' is not defined. (no-undef)\n28:11 - \'visit\' is not defined. (no-undef)\n29:11 - \'click\' is not defined. (no-undef)\n30:11 - \'click\' is not defined. (no-undef)\n40:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/templates-encounter-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/templates-encounter-test.js should pass ESLint\n\n18:11 - \'delayAsync\' is not defined. (no-undef)\n21:5 - \'click\' is not defined. (no-undef)\n23:9 - \'fillIn\' is not defined. (no-undef)\n25:12 - \'click\' is not defined. (no-undef)\n36:5 - \'server\' is not defined. (no-undef)\n36:57 - \'db\' is defined but never used. (no-unused-vars)\n43:5 - \'server\' is not defined. (no-undef)\n43:77 - \'db\' is defined but never used. (no-unused-vars)\n54:5 - \'visit\' is not defined. (no-undef)\n55:5 - \'click\' is not defined. (no-undef)\n56:5 - \'click\' is not defined. (no-undef)\n57:5 - \'fillIn\' is not defined. (no-undef)\n58:11 - \'click\' is not defined. (no-undef)\n60:19 - \'findWithAssert\' is not defined. (no-undef)\n62:5 - \'click\' is not defined. (no-undef)\n63:5 - \'click\' is not defined. (no-undef)\n75:5 - \'server\' is not defined. (no-undef)\n75:72 - \'db\' is defined but never used. (no-unused-vars)\n95:5 - \'visit\' is not defined. (no-undef)\n96:5 - \'click\' is not defined. (no-undef)\n97:5 - \'click\' is not defined. (no-undef)\n99:11 - \'click\' is not defined. (no-undef)\n101:5 - \'fillIn\' is not defined. (no-undef)\n102:5 - \'fillIn\' is not defined. (no-undef)\n103:5 - \'click\' is not defined. (no-undef)\n104:5 - \'click\' is not defined. (no-undef)\n105:5 - \'click\' is not defined. (no-undef)\n106:5 - \'click\' is not defined. (no-undef)\n109:5 - \'click\' is not defined. (no-undef)\n113:5 - \'click\' is not defined. (no-undef)\n114:5 - \'delayAsync\' is not defined. (no-undef)\n115:11 - \'click\' is not defined. (no-undef)\n121:5 - \'server\' is not defined. (no-undef)\n129:5 - \'visit\' is not defined. (no-undef)\n130:5 - \'click\' is not defined. (no-undef)\n131:5 - \'click\' is not defined. (no-undef)\n133:5 - \'click\' is not defined. (no-undef)\n134:11 - \'click\' is not defined. (no-undef)\n140:5 - \'click\' is not defined. (no-undef)\n141:5 - \'click\' is not defined. (no-undef)\n142:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/templates-settings-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/templates-settings-test.js should pass ESLint\n\n31:5 - \'click\' is not defined. (no-undef)\n32:12 - \'delayAsync\' is not defined. (no-undef)\n39:5 - \'click\' is not defined. (no-undef)\n41:9 - \'fillIn\' is not defined. (no-undef)\n43:12 - \'click\' is not defined. (no-undef)\n46:12 - \'findWithAssert\' is not defined. (no-undef)\n52:11 - \'click\' is not defined. (no-undef)\n59:12 - \'click\' is not defined. (no-undef)\n62:5 - \'click\' is not defined. (no-undef)\n64:11 - \'fillIn\' is not defined. (no-undef)\n66:9 - \'triggerEvent\' is not defined. (no-undef)\n68:40 - \'$\' is not defined. (no-undef)\n73:11 - \'fillIn\' is not defined. (no-undef)\n75:9 - \'triggerEvent\' is not defined. (no-undef)\n77:52 - \'$\' is not defined. (no-undef)\n91:5 - \'server\' is not defined. (no-undef)\n130:11 - \'visit\' is not defined. (no-undef)\n131:5 - \'click\' is not defined. (no-undef)\n133:5 - \'fillIn\' is not defined. (no-undef)\n134:5 - \'click\' is not defined. (no-undef)\n135:5 - \'click\' is not defined. (no-undef)\n136:5 - \'click\' is not defined. (no-undef)\n147:11 - \'click\' is not defined. (no-undef)\n155:5 - \'server\' is not defined. (no-undef)\n182:5 - \'visit\' is not defined. (no-undef)\n183:11 - \'click\' is not defined. (no-undef)\n186:5 - \'fillIn\' is not defined. (no-undef)\n192:5 - \'click\' is not defined. (no-undef)\n194:11 - \'click\' is not defined. (no-undef)\n203:5 - \'server\' is not defined. (no-undef)\n208:5 - \'visit\' is not defined. (no-undef)\n209:5 - \'click\' is not defined. (no-undef)\n210:5 - \'click\' is not defined. (no-undef)\n211:5 - \'click\' is not defined. (no-undef)\n212:11 - \'click\' is not defined. (no-undef)\n221:5 - \'server\' is not defined. (no-undef)\n227:5 - \'visit\' is not defined. (no-undef)\n228:5 - \'click\' is not defined. (no-undef)\n229:5 - \'click\' is not defined. (no-undef)\n230:5 - \'click\' is not defined. (no-undef)\n231:11 - \'click\' is not defined. (no-undef)\n239:5 - \'server\' is not defined. (no-undef)\n244:5 - \'server\' is not defined. (no-undef)\n250:11 - \'visit\' is not defined. (no-undef)\n251:26 - \'findWithAssert\' is not defined. (no-undef)\n252:26 - \'findWithAssert\' is not defined. (no-undef)\n253:26 - \'findWithAssert\' is not defined. (no-undef)\n258:5 - \'click\' is not defined. (no-undef)\n260:11 - \'click\' is not defined. (no-undef)\n261:11 - \'click\' is not defined. (no-undef)\n263:11 - \'click\' is not defined. (no-undef)\n269:5 - \'server\' is not defined. (no-undef)\n274:5 - \'server\' is not defined. (no-undef)\n280:11 - \'visit\' is not defined. (no-undef)\n281:30 - \'findWithAssert\' is not defined. (no-undef)\n282:24 - \'findWithAssert\' is not defined. (no-undef)\n287:5 - \'click\' is not defined. (no-undef)\n288:11 - \'fillIn\' is not defined. (no-undef)\n290:11 - \'click\' is not defined. (no-undef)\n296:12 - \'click\' is not defined. (no-undef)\n309:5 - \'server\' is not defined. (no-undef)\n332:5 - \'visit\' is not defined. (no-undef)\n333:5 - \'click\' is not defined. (no-undef)\n334:5 - \'click\' is not defined. (no-undef)\n335:5 - \'click\' is not defined. (no-undef)\n336:11 - \'click\' is not defined. (no-undef)\n337:19 - \'findWithAssert\' is not defined. (no-undef)\n342:11 - \'click\' is not defined. (no-undef)\n345:11 - \'click\' is not defined. (no-undef)\n346:5 - \'click\' is not defined. (no-undef)\n347:5 - \'click\' is not defined. (no-undef)\n348:5 - \'click\' is not defined. (no-undef)\n349:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/acceptance/templates-timeout-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/acceptance/templates-timeout-test.js should pass ESLint\n\n9:9 - \'server\' is not defined. (no-undef)\n10:9 - \'server\' is not defined. (no-undef)\n23:5 - \'server\' is not defined. (no-undef)\n27:11 - \'visit\' is not defined. (no-undef)\n28:18 - \'currentURL\' is not defined. (no-undef)\n33:11 - \'click\' is not defined. (no-undef)\n34:11 - \'click\' is not defined. (no-undef)\n35:5 - \'click\' is not defined. (no-undef)\n36:11 - \'click\' is not defined. (no-undef)\n44:5 - \'server\' is not defined. (no-undef)\n45:5 - \'visit\' is not defined. (no-undef)\n46:11 - \'click\' is not defined. (no-undef)\n48:11 - \'click\' is not defined. (no-undef)\n49:18 - \'currentURL\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/acceptance/allergies-v3-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/acceptance/allergies-v3-test.js should pass ESLint\n\n58:5 - \'server\' is not defined. (no-undef)\n60:11 - \'visit\' is not defined. (no-undef)\n68:5 - \'server\' is not defined. (no-undef)\n68:87 - \'db\' is defined but never used. (no-unused-vars)\n69:5 - \'server\' is not defined. (no-undef)\n69:90 - \'db\' is defined but never used. (no-unused-vars)\n70:5 - \'server\' is not defined. (no-undef)\n70:90 - \'db\' is defined but never used. (no-unused-vars)\n72:11 - \'visit\' is not defined. (no-undef)\n73:9 - \'startingAllergyCount\' is assigned a value but never used. (no-unused-vars)\n77:11 - \'click\' is not defined. (no-undef)\n80:5 - \'click\' is not defined. (no-undef)\n81:5 - \'fillIn\' is not defined. (no-undef)\n82:11 - \'keyEvent\' is not defined. (no-undef)\n83:11 - \'wait\' is not defined. (no-undef)\n85:5 - \'click\' is not defined. (no-undef)\n86:5 - \'fillIn\' is not defined. (no-undef)\n87:5 - \'fillIn\' is not defined. (no-undef)\n88:5 - \'click\' is not defined. (no-undef)\n89:11 - \'click\' is not defined. (no-undef)\n94:11 - \'click\' is not defined. (no-undef)\n97:5 - \'fillIn\' is not defined. (no-undef)\n98:5 - \'fillIn\' is not defined. (no-undef)\n99:11 - \'click\' is not defined. (no-undef)\n102:11 - \'click\' is not defined. (no-undef)\n103:11 - \'click\' is not defined. (no-undef)\n105:11 - \'click\' is not defined. (no-undef)\n113:5 - \'server\' is not defined. (no-undef)\n113:87 - \'db\' is defined but never used. (no-unused-vars)\n114:5 - \'server\' is not defined. (no-undef)\n114:90 - \'db\' is defined but never used. (no-unused-vars)\n115:5 - \'server\' is not defined. (no-undef)\n115:90 - \'db\' is defined but never used. (no-unused-vars)\n117:11 - \'visit\' is not defined. (no-undef)\n118:9 - \'startingAllergyCount\' is assigned a value but never used. (no-unused-vars)\n122:11 - \'click\' is not defined. (no-undef)\n125:11 - \'click\' is not defined. (no-undef)\n126:5 - \'fillIn\' is not defined. (no-undef)\n127:11 - \'click\' is not defined. (no-undef)\n129:5 - \'click\' is not defined. (no-undef)\n130:5 - \'fillIn\' is not defined. (no-undef)\n131:5 - \'fillIn\' is not defined. (no-undef)\n132:5 - \'click\' is not defined. (no-undef)\n133:11 - \'click\' is not defined. (no-undef)\n138:11 - \'click\' is not defined. (no-undef)\n141:5 - \'fillIn\' is not defined. (no-undef)\n142:5 - \'fillIn\' is not defined. (no-undef)\n143:11 - \'click\' is not defined. (no-undef)\n146:11 - \'click\' is not defined. (no-undef)\n147:11 - \'click\' is not defined. (no-undef)\n149:11 - \'click\' is not defined. (no-undef)\n157:5 - \'server\' is not defined. (no-undef)\n157:87 - \'db\' is defined but never used. (no-unused-vars)\n158:5 - \'server\' is not defined. (no-undef)\n158:90 - \'db\' is defined but never used. (no-unused-vars)\n159:5 - \'server\' is not defined. (no-undef)\n159:90 - \'db\' is defined but never used. (no-unused-vars)\n161:11 - \'visit\' is not defined. (no-undef)\n162:9 - \'startingAllergyCount\' is assigned a value but never used. (no-unused-vars)\n166:11 - \'click\' is not defined. (no-undef)\n169:11 - \'click\' is not defined. (no-undef)\n170:5 - \'fillIn\' is not defined. (no-undef)\n171:11 - \'click\' is not defined. (no-undef)\n173:5 - \'click\' is not defined. (no-undef)\n174:5 - \'fillIn\' is not defined. (no-undef)\n175:5 - \'fillIn\' is not defined. (no-undef)\n176:5 - \'click\' is not defined. (no-undef)\n177:11 - \'click\' is not defined. (no-undef)\n182:11 - \'click\' is not defined. (no-undef)\n185:5 - \'fillIn\' is not defined. (no-undef)\n186:5 - \'fillIn\' is not defined. (no-undef)\n187:11 - \'click\' is not defined. (no-undef)\n190:11 - \'click\' is not defined. (no-undef)\n191:11 - \'click\' is not defined. (no-undef)\n193:11 - \'click\' is not defined. (no-undef)\n201:5 - \'server\' is not defined. (no-undef)\n201:87 - \'db\' is defined but never used. (no-unused-vars)\n203:11 - \'visit\' is not defined. (no-undef)\n204:9 - \'startingAllergyCount\' is assigned a value but never used. (no-unused-vars)\n208:11 - \'click\' is not defined. (no-undef)\n211:11 - \'click\' is not defined. (no-undef)\n212:5 - \'fillIn\' is not defined. (no-undef)\n214:11 - \'click\' is not defined. (no-undef)\n216:11 - \'fillIn\' is not defined. (no-undef)\n218:11 - \'click\' is not defined. (no-undef)\n219:5 - \'fillIn\' is not defined. (no-undef)\n220:5 - \'fillIn\' is not defined. (no-undef)\n221:5 - \'click\' is not defined. (no-undef)\n222:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/acceptance/assessment-modal-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/acceptance/assessment-modal-test.js should pass ESLint\n\n134:39 - \'moment\' is not defined. (no-undef)\n145:26 - \'$\' is not defined. (no-undef)\n158:9 - \'click\' is not defined. (no-undef)\n166:11 - \'visit\' is not defined. (no-undef)\n167:5 - \'click\' is not defined. (no-undef)\n168:5 - \'click\' is not defined. (no-undef)\n169:11 - \'fillIn\' is not defined. (no-undef)\n170:11 - \'wait\' is not defined. (no-undef)\n171:12 - \'click\' is not defined. (no-undef)\n199:5 - \'server\' is not defined. (no-undef)\n200:5 - \'server\' is not defined. (no-undef)\n200:89 - \'db\' is defined but never used. (no-unused-vars)\n201:5 - \'server\' is not defined. (no-undef)\n201:57 - \'db\' is defined but never used. (no-unused-vars)\n205:11 - \'click\' is not defined. (no-undef)\n206:11 - \'click\' is not defined. (no-undef)\n209:11 - \'click\' is not defined. (no-undef)\n213:5 - \'click\' is not defined. (no-undef)\n214:11 - \'click\' is not defined. (no-undef)\n218:5 - \'click\' is not defined. (no-undef)\n219:11 - \'click\' is not defined. (no-undef)\n224:5 - \'click\' is not defined. (no-undef)\n225:11 - \'click\' is not defined. (no-undef)\n228:11 - \'click\' is not defined. (no-undef)\n231:11 - \'click\' is not defined. (no-undef)\n254:5 - \'server\' is not defined. (no-undef)\n255:5 - \'server\' is not defined. (no-undef)\n255:89 - \'db\' is defined but never used. (no-unused-vars)\n256:5 - \'server\' is not defined. (no-undef)\n256:57 - \'db\' is defined but never used. (no-unused-vars)\n260:5 - \'click\' is not defined. (no-undef)\n261:11 - \'click\' is not defined. (no-undef)\n262:11 - \'click\' is not defined. (no-undef)\n268:5 - \'click\' is not defined. (no-undef)\n269:11 - \'click\' is not defined. (no-undef)\n272:11 - \'click\' is not defined. (no-undef)\n273:11 - \'click\' is not defined. (no-undef)\n275:5 - \'click\' is not defined. (no-undef)\n276:11 - \'click\' is not defined. (no-undef)\n299:5 - \'server\' is not defined. (no-undef)\n300:5 - \'server\' is not defined. (no-undef)\n300:89 - \'db\' is defined but never used. (no-unused-vars)\n301:5 - \'server\' is not defined. (no-undef)\n301:57 - \'db\' is defined but never used. (no-unused-vars)\n305:5 - \'click\' is not defined. (no-undef)\n306:11 - \'click\' is not defined. (no-undef)\n307:11 - \'click\' is not defined. (no-undef)\n313:11 - \'click\' is not defined. (no-undef)\n314:11 - \'click\' is not defined. (no-undef)\n315:11 - \'click\' is not defined. (no-undef)\n334:5 - \'server\' is not defined. (no-undef)\n335:5 - \'server\' is not defined. (no-undef)\n335:89 - \'db\' is defined but never used. (no-unused-vars)\n336:5 - \'server\' is not defined. (no-undef)\n336:57 - \'db\' is defined but never used. (no-unused-vars)\n340:11 - \'click\' is not defined. (no-undef)\n341:11 - \'click\' is not defined. (no-undef)\n343:5 - \'click\' is not defined. (no-undef)\n344:11 - \'click\' is not defined. (no-undef)\n348:5 - \'click\' is not defined. (no-undef)\n368:5 - \'server\' is not defined. (no-undef)\n383:5 - \'server\' is not defined. (no-undef)\n383:57 - \'db\' is defined but never used. (no-unused-vars)\n388:11 - \'visit\' is not defined. (no-undef)\n392:11 - \'click\' is not defined. (no-undef)\n395:11 - \'click\' is not defined. (no-undef)\n405:5 - \'server\' is not defined. (no-undef)\n420:5 - \'server\' is not defined. (no-undef)\n425:11 - \'visit\' is not defined. (no-undef)\n429:11 - \'click\' is not defined. (no-undef)\n430:11 - \'click\' is not defined. (no-undef)\n450:5 - \'server\' is not defined. (no-undef)\n452:5 - \'server\' is not defined. (no-undef)\n452:57 - \'db\' is defined but never used. (no-unused-vars)\n457:11 - \'visit\' is not defined. (no-undef)\n459:11 - \'click\' is not defined. (no-undef)\n460:11 - \'click\' is not defined. (no-undef)\n461:11 - \'click\' is not defined. (no-undef)\n480:5 - \'server\' is not defined. (no-undef)\n482:5 - \'server\' is not defined. (no-undef)\n482:57 - \'db\' is defined but never used. (no-unused-vars)\n487:11 - \'visit\' is not defined. (no-undef)\n489:11 - \'click\' is not defined. (no-undef)\n490:11 - \'click\' is not defined. (no-undef)\n491:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/acceptance/behavioral-health-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/acceptance/behavioral-health-test.js should pass ESLint\n\n31:5 - \'server\' is not defined. (no-undef)\n32:5 - \'server\' is not defined. (no-undef)\n33:5 - \'server\' is not defined. (no-undef)\n33:91 - \'db\' is defined but never used. (no-unused-vars)\n35:11 - \'visit\' is not defined. (no-undef)\n36:11 - \'click\' is not defined. (no-undef)\n39:9 - \'click\' is not defined. (no-undef)\n41:11 - \'click\' is not defined. (no-undef)\n52:11 - \'click\' is not defined. (no-undef)\n57:5 - \'server\' is not defined. (no-undef)\n58:5 - \'server\' is not defined. (no-undef)\n59:5 - \'server\' is not defined. (no-undef)\n59:91 - \'db\' is defined but never used. (no-unused-vars)\n60:5 - \'server\' is not defined. (no-undef)\n66:5 - \'server\' is not defined. (no-undef)\n66:88 - \'db\' is defined but never used. (no-unused-vars)\n73:11 - \'visit\' is not defined. (no-undef)\n74:11 - \'click\' is not defined. (no-undef)\n77:9 - \'click\' is not defined. (no-undef)\n79:11 - \'click\' is not defined. (no-undef)\n80:11 - \'click\' is not defined. (no-undef)\n84:11 - \'click\' is not defined. (no-undef)\n87:11 - \'click\' is not defined. (no-undef)\n104:5 - \'click\' is not defined. (no-undef)\n108:5 - \'server\' is not defined. (no-undef)\n109:5 - \'server\' is not defined. (no-undef)\n110:5 - \'server\' is not defined. (no-undef)\n110:91 - \'db\' is defined but never used. (no-unused-vars)\n111:5 - \'server\' is not defined. (no-undef)\n117:5 - \'server\' is not defined. (no-undef)\n117:88 - \'db\' is defined but never used. (no-unused-vars)\n123:11 - \'visit\' is not defined. (no-undef)\n124:11 - \'click\' is not defined. (no-undef)\n127:9 - \'click\' is not defined. (no-undef)\n129:11 - \'click\' is not defined. (no-undef)\n130:11 - \'click\' is not defined. (no-undef)\n134:11 - \'fillIn\' is not defined. (no-undef)\n137:11 - \'click\' is not defined. (no-undef)\n140:11 - \'click\' is not defined. (no-undef)\n143:5 - \'fillIn\' is not defined. (no-undef)\n144:5 - \'fillIn\' is not defined. (no-undef)\n145:5 - \'click\' is not defined. (no-undef)\n149:5 - \'server\' is not defined. (no-undef)\n150:5 - \'server\' is not defined. (no-undef)\n151:5 - \'server\' is not defined. (no-undef)\n151:91 - \'db\' is defined but never used. (no-unused-vars)\n152:5 - \'server\' is not defined. (no-undef)\n158:5 - \'server\' is not defined. (no-undef)\n158:88 - \'db\' is defined but never used. (no-unused-vars)\n163:11 - \'visit\' is not defined. (no-undef)\n164:11 - \'click\' is not defined. (no-undef)\n167:9 - \'click\' is not defined. (no-undef)\n169:11 - \'click\' is not defined. (no-undef)\n170:11 - \'click\' is not defined. (no-undef)\n173:11 - \'click\' is not defined. (no-undef)\n176:5 - \'click\' is not defined. (no-undef)\n180:5 - \'server\' is not defined. (no-undef)\n181:5 - \'server\' is not defined. (no-undef)\n182:5 - \'server\' is not defined. (no-undef)\n182:91 - \'db\' is defined but never used. (no-unused-vars)\n183:5 - \'server\' is not defined. (no-undef)\n189:5 - \'server\' is not defined. (no-undef)\n189:88 - \'db\' is defined but never used. (no-unused-vars)\n193:5 - \'server\' is not defined. (no-undef)\n194:11 - \'visit\' is not defined. (no-undef)\n195:11 - \'click\' is not defined. (no-undef)\n198:9 - \'click\' is not defined. (no-undef)\n200:11 - \'click\' is not defined. (no-undef)\n201:11 - \'click\' is not defined. (no-undef)\n208:11 - \'click\' is not defined. (no-undef)\n211:11 - \'click\' is not defined. (no-undef)\n226:11 - \'click\' is not defined. (no-undef)\n227:11 - \'fillIn\' is not defined. (no-undef)\n229:5 - \'click\' is not defined. (no-undef)\n233:5 - \'server\' is not defined. (no-undef)\n234:5 - \'server\' is not defined. (no-undef)\n235:5 - \'server\' is not defined. (no-undef)\n235:91 - \'db\' is defined but never used. (no-unused-vars)\n236:5 - \'server\' is not defined. (no-undef)\n242:5 - \'server\' is not defined. (no-undef)\n242:88 - \'db\' is defined but never used. (no-unused-vars)\n249:11 - \'visit\' is not defined. (no-undef)\n250:11 - \'click\' is not defined. (no-undef)\n253:9 - \'click\' is not defined. (no-undef)\n255:11 - \'click\' is not defined. (no-undef)\n256:11 - \'click\' is not defined. (no-undef)\n260:11 - \'click\' is not defined. (no-undef)\n263:11 - \'click\' is not defined. (no-undef)\n273:5 - \'click\' is not defined. (no-undef)\n277:5 - \'server\' is not defined. (no-undef)\n278:5 - \'server\' is not defined. (no-undef)\n279:5 - \'server\' is not defined. (no-undef)\n279:91 - \'db\' is defined but never used. (no-unused-vars)\n280:5 - \'server\' is not defined. (no-undef)\n280:90 - \'db\' is defined but never used. (no-unused-vars)\n285:11 - \'visit\' is not defined. (no-undef)\n286:11 - \'click\' is not defined. (no-undef)\n289:9 - \'click\' is not defined. (no-undef)\n291:11 - \'click\' is not defined. (no-undef)\n292:11 - \'click\' is not defined. (no-undef)\n295:11 - \'fillIn\' is not defined. (no-undef)\n297:11 - \'fillIn\' is not defined. (no-undef)\n298:5 - \'click\' is not defined. (no-undef)\n302:5 - \'server\' is not defined. (no-undef)\n303:5 - \'server\' is not defined. (no-undef)\n304:5 - \'server\' is not defined. (no-undef)\n304:91 - \'db\' is defined but never used. (no-unused-vars)\n305:5 - \'server\' is not defined. (no-undef)\n311:11 - \'visit\' is not defined. (no-undef)\n312:11 - \'click\' is not defined. (no-undef)\n315:9 - \'click\' is not defined. (no-undef)\n317:11 - \'click\' is not defined. (no-undef)\n318:11 - \'click\' is not defined. (no-undef)\n319:11 - \'click\' is not defined. (no-undef)\n324:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/acceptance/care-team-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/acceptance/care-team-test.js should pass ESLint\n\n29:19 - \'findWithAssert\' is not defined. (no-undef)\n37:5 - \'server\' is not defined. (no-undef)\n38:5 - \'server\' is not defined. (no-undef)\n38:54 - \'db\' is defined but never used. (no-unused-vars)\n47:5 - \'server\' is not defined. (no-undef)\n51:5 - \'server\' is not defined. (no-undef)\n51:92 - \'db\' is defined but never used. (no-unused-vars)\n85:11 - \'visit\' is not defined. (no-undef)\n86:18 - \'findWithAssert\' is not defined. (no-undef)\n87:5 - \'click\' is not defined. (no-undef)\n88:11 - \'click\' is not defined. (no-undef)\n93:5 - \'click\' is not defined. (no-undef)\n94:5 - \'fillIn\' is not defined. (no-undef)\n95:5 - \'fillIn\' is not defined. (no-undef)\n96:5 - \'fillIn\' is not defined. (no-undef)\n97:5 - \'click\' is not defined. (no-undef)\n98:11 - \'click\' is not defined. (no-undef)\n103:5 - \'click\' is not defined. (no-undef)\n104:5 - \'click\' is not defined. (no-undef)\n105:11 - \'click\' is not defined. (no-undef)\n108:11 - \'click\' is not defined. (no-undef)\n110:5 - \'click\' is not defined. (no-undef)\n111:11 - \'click\' is not defined. (no-undef)\n115:5 - \'click\' is not defined. (no-undef)\n116:5 - \'click\' is not defined. (no-undef)\n117:5 - \'click\' is not defined. (no-undef)\n118:11 - \'click\' is not defined. (no-undef)\n121:11 - \'click\' is not defined. (no-undef)\n127:5 - \'server\' is not defined. (no-undef)\n128:11 - \'visit\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/acceptance/clinical-documents-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/acceptance/clinical-documents-test.js should pass ESLint\n\n16:5 - \'server\' is not defined. (no-undef)\n16:68 - \'db\' is defined but never used. (no-unused-vars)\n27:11 - \'visit\' is not defined. (no-undef)\n28:5 - \'click\' is not defined. (no-undef)\n29:11 - \'click\' is not defined. (no-undef)\n30:18 - \'currentURL\' is not defined. (no-undef)\n31:5 - \'click\' is not defined. (no-undef)\n32:11 - \'click\' is not defined. (no-undef)\n35:19 - \'findWithAssert\' is not defined. (no-undef)\n36:11 - \'click\' is not defined. (no-undef)\n37:5 - \'click\' is not defined. (no-undef)\n38:5 - \'click\' is not defined. (no-undef)\n39:5 - \'click\' is not defined. (no-undef)\n40:11 - \'click\' is not defined. (no-undef)\n45:11 - \'visit\' is not defined. (no-undef)\n47:5 - \'click\' is not defined. (no-undef)\n48:11 - \'click\' is not defined. (no-undef)\n52:11 - \'click\' is not defined. (no-undef)\n55:19 - \'findWithAssert\' is not defined. (no-undef)\n56:19 - \'findWithAssert\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/acceptance/configurable-ccda-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/acceptance/configurable-ccda-test.js should pass ESLint\n\n12:11 - \'visitWaitForAfterRender\' is not defined. (no-undef)\n13:11 - \'delayAsync\' is not defined. (no-undef)\n14:11 - \'click\' is not defined. (no-undef)\n17:11 - \'click\' is not defined. (no-undef)\n18:11 - \'delayAsync\' is not defined. (no-undef)\n19:19 - \'findWithAssert\' is not defined. (no-undef)\n20:19 - \'findWithAssert\' is not defined. (no-undef)\n23:19 - \'findWithAssert\' is not defined. (no-undef)\n25:11 - \'click\' is not defined. (no-undef)\n26:19 - \'findWithAssert\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/acceptance/diagnoses-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/acceptance/diagnoses-test.js should pass ESLint\n\n16:5 - \'server\' is not defined. (no-undef)\n19:11 - \'visit\' is not defined. (no-undef)\n24:5 - \'server\' is not defined. (no-undef)\n24:91 - \'db\' is defined but never used. (no-unused-vars)\n53:11 - \'visit\' is not defined. (no-undef)\n54:11 - \'click\' is not defined. (no-undef)\n55:11 - \'click\' is not defined. (no-undef)\n56:11 - \'click\' is not defined. (no-undef)\n57:19 - \'findWithAssert\' is not defined. (no-undef)\n59:5 - \'click\' is not defined. (no-undef)\n60:11 - \'fillIn\' is not defined. (no-undef)\n61:11 - \'click\' is not defined. (no-undef)\n62:5 - \'fillIn\' is not defined. (no-undef)\n63:11 - \'click\' is not defined. (no-undef)\n64:5 - \'click\' is not defined. (no-undef)\n65:11 - \'fillIn\' is not defined. (no-undef)\n66:11 - \'click\' is not defined. (no-undef)\n67:5 - \'fillIn\' is not defined. (no-undef)\n68:5 - \'click\' is not defined. (no-undef)\n69:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/acceptance/encounter-assessment-diagnoses-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/acceptance/encounter-assessment-diagnoses-test.js should pass ESLint\n\n13:13 - \'moment\' is not defined. (no-undef)\n29:5 - \'server\' is not defined. (no-undef)\n29:87 - \'db\' is defined but never used. (no-unused-vars)\n52:5 - \'server\' is not defined. (no-undef)\n52:122 - \'db\' is defined but never used. (no-unused-vars)\n64:5 - \'server\' is not defined. (no-undef)\n64:140 - \'db\' is defined but never used. (no-unused-vars)\n69:5 - \'server\' is not defined. (no-undef)\n69:104 - \'db\' is defined but never used. (no-unused-vars)\n74:11 - \'visit\' is not defined. (no-undef)\n75:5 - \'click\' is not defined. (no-undef)\n76:5 - \'click\' is not defined. (no-undef)\n77:5 - \'click\' is not defined. (no-undef)\n78:11 - \'click\' is not defined. (no-undef)\n82:5 - \'click\' is not defined. (no-undef)\n83:11 - \'click\' is not defined. (no-undef)\n87:19 - \'findWithAssert\' is not defined. (no-undef)\n88:11 - \'click\' is not defined. (no-undef)\n91:11 - \'click\' is not defined. (no-undef)\n94:11 - \'click\' is not defined. (no-undef)\n95:19 - \'findWithAssert\' is not defined. (no-undef)\n96:5 - \'click\' is not defined. (no-undef)\n97:5 - \'fillIn\' is not defined. (no-undef)\n98:11 - \'click\' is not defined. (no-undef)\n99:11 - \'click\' is not defined. (no-undef)\n101:18 - \'currentURL\' is not defined. (no-undef)\n103:11 - \'click\' is not defined. (no-undef)\n105:11 - \'click\' is not defined. (no-undef)\n106:18 - \'currentURL\' is not defined. (no-undef)\n107:11 - \'click\' is not defined. (no-undef)\n108:18 - \'currentURL\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/acceptance/encounter-plan-medications-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/acceptance/encounter-plan-medications-test.js should pass ESLint\n\n17:13 - \'moment\' is not defined. (no-undef)\n38:5 - \'server\' is not defined. (no-undef)\n38:89 - \'db\' is defined but never used. (no-unused-vars)\n57:5 - \'server\' is not defined. (no-undef)\n57:127 - \'db\' is defined but never used. (no-unused-vars)\n69:5 - \'server\' is not defined. (no-undef)\n69:145 - \'db\' is defined but never used. (no-unused-vars)\n77:11 - \'visit\' is not defined. (no-undef)\n78:5 - \'click\' is not defined. (no-undef)\n79:5 - \'click\' is not defined. (no-undef)\n80:11 - \'click\' is not defined. (no-undef)\n82:11 - \'click\' is not defined. (no-undef)\n84:11 - \'click\' is not defined. (no-undef)\n86:11 - \'click\' is not defined. (no-undef)\n88:19 - \'findWithAssert\' is not defined. (no-undef)\n89:11 - \'click\' is not defined. (no-undef)\n92:11 - \'click\' is not defined. (no-undef)\n95:11 - \'click\' is not defined. (no-undef)\n96:19 - \'findWithAssert\' is not defined. (no-undef)\n97:5 - \'click\' is not defined. (no-undef)\n98:11 - \'fillIn\' is not defined. (no-undef)\n99:11 - \'wait\' is not defined. (no-undef)\n100:5 - \'click\' is not defined. (no-undef)\n101:11 - \'click\' is not defined. (no-undef)\n102:18 - \'currentURL\' is not defined. (no-undef)\n104:11 - \'click\' is not defined. (no-undef)\n106:11 - \'click\' is not defined. (no-undef)\n107:18 - \'currentURL\' is not defined. (no-undef)\n108:11 - \'click\' is not defined. (no-undef)\n109:18 - \'currentURL\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/acceptance/family-history-limited-access-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/acceptance/family-history-limited-access-test.js should pass ESLint\n\n26:9 - \'server\' is not defined. (no-undef)\n33:5 - \'server\' is not defined. (no-undef)\n34:5 - \'server\' is not defined. (no-undef)\n36:11 - \'visit\' is not defined. (no-undef)\n41:5 - \'server\' is not defined. (no-undef)\n43:5 - \'server\' is not defined. (no-undef)\n45:11 - \'visit\' is not defined. (no-undef)\n47:11 - \'click\' is not defined. (no-undef)\n58:5 - \'server\' is not defined. (no-undef)\n60:5 - \'server\' is not defined. (no-undef)\n62:11 - \'visit\' is not defined. (no-undef)\n63:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/acceptance/family-history-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/acceptance/family-history-test.js should pass ESLint\n\n26:5 - \'server\' is not defined. (no-undef)\n27:5 - \'server\' is not defined. (no-undef)\n35:11 - \'visit\' is not defined. (no-undef)\n36:11 - \'click\' is not defined. (no-undef)\n37:11 - \'click\' is not defined. (no-undef)\n38:5 - \'fillIn\' is not defined. (no-undef)\n39:5 - \'fillIn\' is not defined. (no-undef)\n40:5 - \'fillIn\' is not defined. (no-undef)\n41:11 - \'fillIn\' is not defined. (no-undef)\n42:5 - \'percySnapshot\' is not defined. (no-undef)\n43:11 - \'click\' is not defined. (no-undef)\n50:5 - \'server\' is not defined. (no-undef)\n51:5 - \'server\' is not defined. (no-undef)\n61:11 - \'visit\' is not defined. (no-undef)\n62:11 - \'click\' is not defined. (no-undef)\n63:5 - \'fillIn\' is not defined. (no-undef)\n64:11 - \'click\' is not defined. (no-undef)\n65:11 - \'click\' is not defined. (no-undef)\n67:11 - \'click\' is not defined. (no-undef)\n75:5 - \'server\' is not defined. (no-undef)\n82:5 - \'server\' is not defined. (no-undef)\n84:11 - \'visit\' is not defined. (no-undef)\n85:11 - \'click\' is not defined. (no-undef)\n86:11 - \'click\' is not defined. (no-undef)\n87:5 - \'fillIn\' is not defined. (no-undef)\n88:11 - \'click\' is not defined. (no-undef)\n89:11 - \'keyEvent\' is not defined. (no-undef)\n90:11 - \'click\' is not defined. (no-undef)\n91:5 - \'fillIn\' is not defined. (no-undef)\n92:11 - \'fillIn\' is not defined. (no-undef)\n93:5 - \'percySnapshot\' is not defined. (no-undef)\n94:11 - \'click\' is not defined. (no-undef)\n101:5 - \'server\' is not defined. (no-undef)\n102:5 - \'server\' is not defined. (no-undef)\n112:11 - \'visit\' is not defined. (no-undef)\n113:11 - \'click\' is not defined. (no-undef)\n114:5 - \'fillIn\' is not defined. (no-undef)\n115:11 - \'click\' is not defined. (no-undef)\n116:11 - \'click\' is not defined. (no-undef)\n118:11 - \'click\' is not defined. (no-undef)\n123:5 - \'server\' is not defined. (no-undef)\n125:11 - \'visit\' is not defined. (no-undef)\n126:11 - \'click\' is not defined. (no-undef)\n127:11 - \'click\' is not defined. (no-undef)\n143:11 - \'click\' is not defined. (no-undef)\n151:5 - \'server\' is not defined. (no-undef)\n155:5 - \'server\' is not defined. (no-undef)\n172:11 - \'visit\' is not defined. (no-undef)\n175:11 - \'click\' is not defined. (no-undef)\n178:5 - \'fillIn\' is not defined. (no-undef)\n179:11 - \'click\' is not defined. (no-undef)\n182:11 - \'visit\' is not defined. (no-undef)\n186:11 - \'click\' is not defined. (no-undef)\n190:5 - \'fillIn\' is not defined. (no-undef)\n191:11 - \'click\' is not defined. (no-undef)\n194:11 - \'visit\' is not defined. (no-undef)\n196:11 - \'click\' is not defined. (no-undef)\n197:5 - \'fillIn\' is not defined. (no-undef)\n198:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/acceptance/health-concerns-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/acceptance/health-concerns-test.js should pass ESLint\n\n67:5 - \'server\' is not defined. (no-undef)\n67:99 - \'db\' is defined but never used. (no-unused-vars)\n78:11 - \'visit\' is not defined. (no-undef)\n88:5 - \'click\' is not defined. (no-undef)\n89:11 - \'click\' is not defined. (no-undef)\n93:5 - \'fillIn\' is not defined. (no-undef)\n94:11 - \'click\' is not defined. (no-undef)\n97:11 - \'click\' is not defined. (no-undef)\n99:11 - \'click\' is not defined. (no-undef)\n105:5 - \'server\' is not defined. (no-undef)\n106:5 - \'server\' is not defined. (no-undef)\n106:104 - \'db\' is defined but never used. (no-unused-vars)\n115:11 - \'visit\' is not defined. (no-undef)\n123:5 - \'fillIn\' is not defined. (no-undef)\n124:11 - \'click\' is not defined. (no-undef)\n130:5 - \'server\' is not defined. (no-undef)\n131:5 - \'server\' is not defined. (no-undef)\n136:5 - \'server\' is not defined. (no-undef)\n137:5 - \'server\' is not defined. (no-undef)\n138:5 - \'server\' is not defined. (no-undef)\n138:101 - \'db\' is defined but never used. (no-unused-vars)\n143:11 - \'visit\' is not defined. (no-undef)\n149:19 - \'findWithAssert\' is not defined. (no-undef)\n150:19 - \'findWithAssert\' is not defined. (no-undef)\n151:5 - \'click\' is not defined. (no-undef)\n152:5 - \'click\' is not defined. (no-undef)\n153:11 - \'click\' is not defined. (no-undef)\n155:5 - \'click\' is not defined. (no-undef)\n156:5 - \'click\' is not defined. (no-undef)\n157:11 - \'click\' is not defined. (no-undef)\n163:5 - \'server\' is not defined. (no-undef)\n164:5 - \'server\' is not defined. (no-undef)\n169:5 - \'server\' is not defined. (no-undef)\n173:11 - \'visit\' is not defined. (no-undef)\n174:5 - \'click\' is not defined. (no-undef)\n175:11 - \'click\' is not defined. (no-undef)\n194:5 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/acceptance/healthcare-devices-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/acceptance/healthcare-devices-test.js should pass ESLint\n\n55:5 - \'server\' is not defined. (no-undef)\n55:115 - \'db\' is defined but never used. (no-unused-vars)\n62:11 - \'visit\' is not defined. (no-undef)\n63:19 - \'findWithAssert\' is not defined. (no-undef)\n64:11 - \'delayAsync\' is not defined. (no-undef)\n66:11 - \'click\' is not defined. (no-undef)\n68:11 - \'click\' is not defined. (no-undef)\n69:19 - \'findWithAssert\' is not defined. (no-undef)\n71:19 - \'findWithAssert\' is not defined. (no-undef)\n73:5 - \'fillIn\' is not defined. (no-undef)\n74:11 - \'click\' is not defined. (no-undef)\n80:5 - \'server\' is not defined. (no-undef)\n80:111 - \'db\' is defined but never used. (no-unused-vars)\n88:5 - \'server\' is not defined. (no-undef)\n88:96 - \'db\' is defined but never used. (no-unused-vars)\n95:11 - \'visit\' is not defined. (no-undef)\n96:11 - \'click\' is not defined. (no-undef)\n97:19 - \'findWithAssert\' is not defined. (no-undef)\n98:5 - \'fillIn\' is not defined. (no-undef)\n99:5 - \'fillIn\' is not defined. (no-undef)\n100:5 - \'click\' is not defined. (no-undef)\n101:19 - \'findWithAssert\' is not defined. (no-undef)\n102:5 - \'fillIn\' is not defined. (no-undef)\n103:11 - \'click\' is not defined. (no-undef)\n105:19 - \'findWithAssert\' is not defined. (no-undef)\n106:11 - \'click\' is not defined. (no-undef)\n107:5 - \'fillIn\' is not defined. (no-undef)\n108:11 - \'click\' is not defined. (no-undef)\n112:11 - \'click\' is not defined. (no-undef)\n114:19 - \'findWithAssert\' is not defined. (no-undef)\n116:11 - \'click\' is not defined. (no-undef)\n118:19 - \'findWithAssert\' is not defined. (no-undef)\n119:5 - \'fillIn\' is not defined. (no-undef)\n120:11 - \'click\' is not defined. (no-undef)\n125:5 - \'server\' is not defined. (no-undef)\n125:106 - \'db\' is defined but never used. (no-unused-vars)\n131:11 - \'visit\' is not defined. (no-undef)\n132:11 - \'click\' is not defined. (no-undef)\n133:19 - \'findWithAssert\' is not defined. (no-undef)\n134:11 - \'click\' is not defined. (no-undef)\n135:19 - \'findWithAssert\' is not defined. (no-undef)\n136:11 - \'click\' is not defined. (no-undef)\n142:11 - \'visit\' is not defined. (no-undef)\n143:19 - \'findWithAssert\' is not defined. (no-undef)\n144:11 - \'click\' is not defined. (no-undef)\n148:5 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/acceptance/limited-access-patient-header-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/acceptance/limited-access-patient-header-test.js should pass ESLint\n\n24:9 - \'server\' is not defined. (no-undef)\n31:5 - \'server\' is not defined. (no-undef)\n45:11 - \'visit\' is not defined. (no-undef)\n47:11 - \'click\' is not defined. (no-undef)\n49:11 - \'click\' is not defined. (no-undef)\n55:5 - \'server\' is not defined. (no-undef)\n103:11 - \'visit\' is not defined. (no-undef)\n105:11 - \'click\' is not defined. (no-undef)\n112:5 - \'server\' is not defined. (no-undef)\n140:11 - \'visit\' is not defined. (no-undef)\n142:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/acceptance/medications-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/acceptance/medications-test.js should pass ESLint\n\n8:15 - \'moment\' is not defined. (no-undef)\n56:5 - \'server\' is not defined. (no-undef)\n59:11 - \'visit\' is not defined. (no-undef)\n64:5 - \'server\' is not defined. (no-undef)\n66:5 - \'server\' is not defined. (no-undef)\n66:89 - \'db\' is defined but never used. (no-unused-vars)\n77:22 - \'moment\' is not defined. (no-undef)\n81:46 - \'moment\' is not defined. (no-undef)\n85:11 - \'visit\' is not defined. (no-undef)\n86:11 - \'click\' is not defined. (no-undef)\n87:19 - \'findWithAssert\' is not defined. (no-undef)\n89:5 - \'click\' is not defined. (no-undef)\n90:11 - \'fillIn\' is not defined. (no-undef)\n91:11 - \'wait\' is not defined. (no-undef)\n92:11 - \'click\' is not defined. (no-undef)\n93:5 - \'click\' is not defined. (no-undef)\n94:5 - \'fillIn\' is not defined. (no-undef)\n95:5 - \'fillIn\' is not defined. (no-undef)\n96:11 - \'click\' is not defined. (no-undef)\n102:5 - \'server\' is not defined. (no-undef)\n106:5 - \'server\' is not defined. (no-undef)\n106:89 - \'db\' is defined but never used. (no-unused-vars)\n109:46 - \'moment\' is not defined. (no-undef)\n112:11 - \'visit\' is not defined. (no-undef)\n113:11 - \'click\' is not defined. (no-undef)\n116:25 - \'findWithAssert\' is not defined. (no-undef)\n119:11 - \'click\' is not defined. (no-undef)\n121:11 - \'click\' is not defined. (no-undef)\n123:11 - \'click\' is not defined. (no-undef)\n125:11 - \'fillIn\' is not defined. (no-undef)\n126:19 - \'findWithAssert\' is not defined. (no-undef)\n127:5 - \'click\' is not defined. (no-undef)\n132:5 - \'server\' is not defined. (no-undef)\n132:92 - \'db\' is defined but never used. (no-unused-vars)\n135:22 - \'moment\' is not defined. (no-undef)\n139:46 - \'moment\' is not defined. (no-undef)\n142:5 - \'server\' is not defined. (no-undef)\n142:91 - \'db\' is defined but never used. (no-unused-vars)\n147:5 - \'visit\' is not defined. (no-undef)\n148:11 - \'click\' is not defined. (no-undef)\n149:19 - \'findWithAssert\' is not defined. (no-undef)\n151:11 - \'click\' is not defined. (no-undef)\n152:11 - \'click\' is not defined. (no-undef)\n154:11 - \'click\' is not defined. (no-undef)\n156:5 - \'fillIn\' is not defined. (no-undef)\n157:11 - \'click\' is not defined. (no-undef)\n158:5 - \'click\' is not defined. (no-undef)\n159:11 - \'click\' is not defined. (no-undef)\n160:5 - \'click\' is not defined. (no-undef)\n161:11 - \'click\' is not defined. (no-undef)\n168:11 - \'visit\' is not defined. (no-undef)\n169:11 - \'click\' is not defined. (no-undef)\n170:11 - \'click\' is not defined. (no-undef)\n177:5 - \'server\' is not defined. (no-undef)\n178:5 - \'server\' is not defined. (no-undef)\n178:89 - \'db\' is defined but never used. (no-unused-vars)\n181:46 - \'moment\' is not defined. (no-undef)\n184:5 - \'server\' is not defined. (no-undef)\n184:57 - \'db\' is defined but never used. (no-unused-vars)\n194:11 - \'visit\' is not defined. (no-undef)\n195:5 - \'click\' is not defined. (no-undef)\n197:5 - \'click\' is not defined. (no-undef)\n198:11 - \'fillIn\' is not defined. (no-undef)\n199:11 - \'wait\' is not defined. (no-undef)\n200:5 - \'click\' is not defined. (no-undef)\n201:11 - \'click\' is not defined. (no-undef)\n203:11 - \'click\' is not defined. (no-undef)\n215:5 - \'server\' is not defined. (no-undef)\n216:5 - \'server\' is not defined. (no-undef)\n216:89 - \'db\' is defined but never used. (no-unused-vars)\n219:46 - \'moment\' is not defined. (no-undef)\n222:5 - \'server\' is not defined. (no-undef)\n222:57 - \'db\' is defined but never used. (no-unused-vars)\n234:11 - \'visit\' is not defined. (no-undef)\n235:5 - \'click\' is not defined. (no-undef)\n236:5 - \'click\' is not defined. (no-undef)\n237:11 - \'fillIn\' is not defined. (no-undef)\n238:11 - \'wait\' is not defined. (no-undef)\n239:11 - \'click\' is not defined. (no-undef)\n240:5 - \'click\' is not defined. (no-undef)\n241:11 - \'click\' is not defined. (no-undef)\n242:11 - \'click\' is not defined. (no-undef)\n247:5 - \'server\' is not defined. (no-undef)\n247:89 - \'db\' is defined but never used. (no-unused-vars)\n250:46 - \'moment\' is not defined. (no-undef)\n254:5 - \'server\' is not defined. (no-undef)\n262:11 - \'visit\' is not defined. (no-undef)\n263:11 - \'click\' is not defined. (no-undef)\n264:19 - \'findWithAssert\' is not defined. (no-undef)\n265:11 - \'click\' is not defined. (no-undef)\n266:11 - \'fillIn\' is not defined. (no-undef)\n267:11 - \'wait\' is not defined. (no-undef)\n268:11 - \'click\' is not defined. (no-undef)\n272:11 - \'click\' is not defined. (no-undef)\n286:11 - \'click\' is not defined. (no-undef)\n287:11 - \'click\' is not defined. (no-undef)\n288:19 - \'findWithAssert\' is not defined. (no-undef)\n289:11 - \'click\' is not defined. (no-undef)\n290:11 - \'fillIn\' is not defined. (no-undef)\n291:11 - \'wait\' is not defined. (no-undef)\n292:11 - \'click\' is not defined. (no-undef)\n293:11 - \'click\' is not defined. (no-undef)\n294:11 - \'click\' is not defined. (no-undef)\n304:40 - \'moment\' is not defined. (no-undef)\n305:5 - \'click\' is not defined. (no-undef)\n309:5 - \'server\' is not defined. (no-undef)\n311:5 - \'server\' is not defined. (no-undef)\n311:89 - \'db\' is defined but never used. (no-unused-vars)\n313:5 - \'server\' is not defined. (no-undef)\n313:92 - \'db\' is defined but never used. (no-unused-vars)\n315:11 - \'visit\' is not defined. (no-undef)\n316:11 - \'click\' is not defined. (no-undef)\n322:5 - \'fillIn\' is not defined. (no-undef)\n323:5 - \'fillIn\' is not defined. (no-undef)\n324:5 - \'keyEvent\' is not defined. (no-undef)\n325:5 - \'fillIn\' is not defined. (no-undef)\n327:11 - \'click\' is not defined. (no-undef)\n328:11 - \'click\' is not defined. (no-undef)\n336:11 - \'visit\' is not defined. (no-undef)\n337:11 - \'click\' is not defined. (no-undef)\n339:11 - \'click\' is not defined. (no-undef)\n341:11 - \'click\' is not defined. (no-undef)\n343:11 - \'click\' is not defined. (no-undef)\n345:11 - \'click\' is not defined. (no-undef)\n347:11 - \'click\' is not defined. (no-undef)\n348:18 - \'currentURL\' is not defined. (no-undef)\n352:5 - \'server\' is not defined. (no-undef)\n353:11 - \'visit\' is not defined. (no-undef)\n354:11 - \'click\' is not defined. (no-undef)\n355:19 - \'findWithAssert\' is not defined. (no-undef)\n356:5 - \'click\' is not defined. (no-undef)\n357:11 - \'fillIn\' is not defined. (no-undef)\n358:11 - \'wait\' is not defined. (no-undef)\n359:11 - \'click\' is not defined. (no-undef)\n361:5 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/acceptance/osteoporosis-dexa-modal-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/acceptance/osteoporosis-dexa-modal-test.js should pass ESLint\n\n20:5 - \'server\' is not defined. (no-undef)\n34:11 - \'visit\' is not defined. (no-undef)\n38:11 - \'click\' is not defined. (no-undef)\n43:11 - \'click\' is not defined. (no-undef)\n44:15 - \'currentURL\' is not defined. (no-undef)\n52:5 - \'server\' is not defined. (no-undef)\n66:11 - \'visit\' is not defined. (no-undef)\n70:11 - \'click\' is not defined. (no-undef)\n75:11 - \'click\' is not defined. (no-undef)\n76:15 - \'currentURL\' is not defined. (no-undef)\n84:5 - \'server\' is not defined. (no-undef)\n98:11 - \'visit\' is not defined. (no-undef)\n102:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/acceptance/patient-goal-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/acceptance/patient-goal-test.js should pass ESLint\n\n19:5 - \'server\' is not defined. (no-undef)\n24:5 - \'server\' is not defined. (no-undef)\n24:94 - \'db\' is defined but never used. (no-unused-vars)\n30:42 - \'moment\' is not defined. (no-undef)\n30:53 - \'moment\' is not defined. (no-undef)\n35:5 - \'server\' is not defined. (no-undef)\n40:5 - \'server\' is not defined. (no-undef)\n44:11 - \'visit\' is not defined. (no-undef)\n45:11 - \'click\' is not defined. (no-undef)\n46:5 - \'fillIn\' is not defined. (no-undef)\n47:11 - \'click\' is not defined. (no-undef)\n51:11 - \'click\' is not defined. (no-undef)\n52:11 - \'fillIn\' is not defined. (no-undef)\n53:11 - \'click\' is not defined. (no-undef)\n56:11 - \'click\' is not defined. (no-undef)\n57:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/acceptance/patient-immunization-bidirectional-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/acceptance/patient-immunization-bidirectional-test.js should pass ESLint\n\n2:10 - \'run\' is defined but never used. (no-unused-vars)\n4:10 - \'get\' is defined but never used. (no-unused-vars)\n4:15 - \'set\' is defined but never used. (no-unused-vars)\n8:8 - \'config\' is defined but never used. (no-unused-vars)\n15:11 - \'visit\' is not defined. (no-undef)\n20:11 - \'visit\' is not defined. (no-undef)\n21:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/acceptance/patient-immunization-limited-access-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/acceptance/patient-immunization-limited-access-test.js should pass ESLint\n\n1:10 - \'run\' is defined but never used. (no-unused-vars)\n2:10 - \'get\' is defined but never used. (no-unused-vars)\n2:15 - \'set\' is defined but never used. (no-unused-vars)\n11:9 - \'server\' is not defined. (no-undef)\n18:11 - \'visit\' is not defined. (no-undef)\n25:11 - \'visit\' is not defined. (no-undef)\n26:11 - \'click\' is not defined. (no-undef)\n35:11 - \'visit\' is not defined. (no-undef)\n36:11 - \'click\' is not defined. (no-undef)\n45:11 - \'visit\' is not defined. (no-undef)\n46:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/acceptance/patient-summary-limited-access-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/acceptance/patient-summary-limited-access-test.js should pass ESLint\n\n9:9 - \'server\' is not defined. (no-undef)\n44:11 - \'click\' is not defined. (no-undef)\n62:11 - \'visit\' is not defined. (no-undef)\n65:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/acceptance/prolia-modal-limited-access-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/acceptance/prolia-modal-limited-access-test.js should pass ESLint\n\n102:9 - \'server\' is not defined. (no-undef)\n113:5 - \'server\' is not defined. (no-undef)\n128:11 - \'visit\' is not defined. (no-undef)\n137:5 - \'server\' is not defined. (no-undef)\n139:11 - \'visit\' is not defined. (no-undef)\n142:11 - \'visit\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/acceptance/recent-activity-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/acceptance/recent-activity-test.js should pass ESLint\n\n22:5 - \'visit\' is not defined. (no-undef)\n23:5 - \'click\' is not defined. (no-undef)\n24:11 - \'click\' is not defined. (no-undef)\n25:11 - \'wait\' is not defined. (no-undef)\n26:19 - \'findWithAssert\' is not defined. (no-undef)\n29:11 - \'click\' is not defined. (no-undef)\n31:18 - \'currentURL\' is not defined. (no-undef)\n36:5 - \'server\' is not defined. (no-undef)\n40:5 - \'visit\' is not defined. (no-undef)\n41:5 - \'click\' is not defined. (no-undef)\n42:11 - \'click\' is not defined. (no-undef)\n43:11 - \'click\' is not defined. (no-undef)\n45:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/acceptance/risk-score-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/acceptance/risk-score-test.js should pass ESLint\n\n12:19 - \'moment\' is not defined. (no-undef)\n19:22 - \'moment\' is not defined. (no-undef)\n38:5 - \'server\' is not defined. (no-undef)\n40:11 - \'visit\' is not defined. (no-undef)\n46:5 - \'server\' is not defined. (no-undef)\n47:5 - \'server\' is not defined. (no-undef)\n47:95 - \'db\' is defined but never used. (no-unused-vars)\n61:11 - \'visit\' is not defined. (no-undef)\n63:11 - \'delayAsync\' is not defined. (no-undef)\n65:19 - \'findWithAssert\' is not defined. (no-undef)\n66:11 - \'click\' is not defined. (no-undef)\n67:11 - \'delayAsync\' is not defined. (no-undef)\n68:19 - \'findWithAssert\' is not defined. (no-undef)\n70:11 - \'click\' is not defined. (no-undef)\n72:19 - \'findWithAssert\' is not defined. (no-undef)\n73:11 - \'click\' is not defined. (no-undef)\n74:11 - \'click\' is not defined. (no-undef)\n75:11 - \'click\' is not defined. (no-undef)\n77:19 - \'findWithAssert\' is not defined. (no-undef)\n78:5 - \'fillIn\' is not defined. (no-undef)\n79:11 - \'click\' is not defined. (no-undef)\n81:19 - \'findWithAssert\' is not defined. (no-undef)\n82:5 - \'fillIn\' is not defined. (no-undef)\n83:11 - \'click\' is not defined. (no-undef)\n86:19 - \'findWithAssert\' is not defined. (no-undef)\n92:5 - \'server\' is not defined. (no-undef)\n96:5 - \'server\' is not defined. (no-undef)\n96:95 - \'db\' is defined but never used. (no-unused-vars)\n106:11 - \'visit\' is not defined. (no-undef)\n108:11 - \'delayAsync\' is not defined. (no-undef)\n109:19 - \'findWithAssert\' is not defined. (no-undef)\n111:11 - \'click\' is not defined. (no-undef)\n112:11 - \'delayAsync\' is not defined. (no-undef)\n113:19 - \'findWithAssert\' is not defined. (no-undef)\n114:11 - \'click\' is not defined. (no-undef)\n115:11 - \'click\' is not defined. (no-undef)\n116:5 - \'fillIn\' is not defined. (no-undef)\n117:5 - \'fillIn\' is not defined. (no-undef)\n118:11 - \'click\' is not defined. (no-undef)\n121:19 - \'findWithAssert\' is not defined. (no-undef)\n122:19 - \'findWithAssert\' is not defined. (no-undef)\n123:19 - \'findWithAssert\' is not defined. (no-undef)\n128:5 - \'server\' is not defined. (no-undef)\n132:5 - \'server\' is not defined. (no-undef)\n132:86 - \'db\' is defined but never used. (no-unused-vars)\n137:11 - \'visit\' is not defined. (no-undef)\n139:11 - \'delayAsync\' is not defined. (no-undef)\n140:19 - \'findWithAssert\' is not defined. (no-undef)\n142:11 - \'click\' is not defined. (no-undef)\n143:11 - \'delayAsync\' is not defined. (no-undef)\n144:19 - \'findWithAssert\' is not defined. (no-undef)\n145:11 - \'click\' is not defined. (no-undef)\n146:19 - \'findWithAssert\' is not defined. (no-undef)\n147:11 - \'click\' is not defined. (no-undef)\n151:19 - \'findWithAssert\' is not defined. (no-undef)\n156:5 - \'server\' is not defined. (no-undef)\n161:11 - \'visit\' is not defined. (no-undef)\n162:19 - \'findWithAssert\' is not defined. (no-undef)\n163:11 - \'click\' is not defined. (no-undef)\n166:5 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/acceptance/social-health-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/acceptance/social-health-test.js should pass ESLint\n\n10:60 - \'click\' is not defined. (no-undef)\n18:11 - \'click\' is not defined. (no-undef)\n22:13 - \'fillIn\' is not defined. (no-undef)\n25:13 - \'click\' is not defined. (no-undef)\n26:13 - \'click\' is not defined. (no-undef)\n29:13 - \'click\' is not defined. (no-undef)\n34:19 - \'click\' is not defined. (no-undef)\n38:11 - \'click\' is not defined. (no-undef)\n55:11 - \'click\' is not defined. (no-undef)\n59:13 - \'fillIn\' is not defined. (no-undef)\n62:13 - \'click\' is not defined. (no-undef)\n63:13 - \'click\' is not defined. (no-undef)\n66:13 - \'click\' is not defined. (no-undef)\n71:13 - \'click\' is not defined. (no-undef)\n74:11 - \'click\' is not defined. (no-undef)\n89:11 - \'click\' is not defined. (no-undef)\n91:11 - \'click\' is not defined. (no-undef)\n96:5 - \'server\' is not defined. (no-undef)\n97:5 - \'server\' is not defined. (no-undef)\n97:77 - \'db\' is defined but never used. (no-unused-vars)\n98:11 - \'visit\' is not defined. (no-undef)\n99:11 - \'click\' is not defined. (no-undef)\n101:11 - \'click\' is not defined. (no-undef)\n103:86 - \'moment\' is not defined. (no-undef)\n104:95 - \'moment\' is not defined. (no-undef)\n110:5 - \'server\' is not defined. (no-undef)\n111:5 - \'server\' is not defined. (no-undef)\n111:77 - \'db\' is defined but never used. (no-unused-vars)\n112:11 - \'visit\' is not defined. (no-undef)\n113:11 - \'click\' is not defined. (no-undef)\n115:11 - \'click\' is not defined. (no-undef)\n117:97 - \'moment\' is not defined. (no-undef)\n117:128 - \'moment\' is not defined. (no-undef)\n118:111 - \'moment\' is not defined. (no-undef)\n118:142 - \'moment\' is not defined. (no-undef)\n124:5 - \'server\' is not defined. (no-undef)\n125:5 - \'server\' is not defined. (no-undef)\n126:5 - \'server\' is not defined. (no-undef)\n127:11 - \'visit\' is not defined. (no-undef)\n128:11 - \'click\' is not defined. (no-undef)\n130:11 - \'click\' is not defined. (no-undef)\n132:89 - \'moment\' is not defined. (no-undef)\n133:98 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/acceptance/social-history-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/acceptance/social-history-test.js should pass ESLint\n\n25:5 - \'server\' is not defined. (no-undef)\n26:5 - \'server\' is not defined. (no-undef)\n26:95 - \'db\' is defined but never used. (no-unused-vars)\n38:11 - \'visit\' is not defined. (no-undef)\n41:11 - \'click\' is not defined. (no-undef)\n42:19 - \'findWithAssert\' is not defined. (no-undef)\n44:11 - \'click\' is not defined. (no-undef)\n46:5 - \'fillIn\' is not defined. (no-undef)\n47:11 - \'click\' is not defined. (no-undef)\n54:5 - \'server\' is not defined. (no-undef)\n55:5 - \'server\' is not defined. (no-undef)\n55:95 - \'db\' is defined but never used. (no-unused-vars)\n67:11 - \'visit\' is not defined. (no-undef)\n70:11 - \'click\' is not defined. (no-undef)\n71:19 - \'findWithAssert\' is not defined. (no-undef)\n73:11 - \'click\' is not defined. (no-undef)\n75:5 - \'fillIn\' is not defined. (no-undef)\n76:11 - \'click\' is not defined. (no-undef)\n82:5 - \'server\' is not defined. (no-undef)\n86:11 - \'visit\' is not defined. (no-undef)\n87:19 - \'findWithAssert\' is not defined. (no-undef)\n88:11 - \'click\' is not defined. (no-undef)\n94:5 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/acceptance/summary-sia-list-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/acceptance/summary-sia-list-test.js should pass ESLint\n\n156:5 - \'server\' is not defined. (no-undef)\n174:11 - \'visit\' is not defined. (no-undef)\n180:11 - \'click\' is not defined. (no-undef)\n183:11 - \'click\' is not defined. (no-undef)\n185:5 - \'click\' is not defined. (no-undef)\n189:5 - \'server\' is not defined. (no-undef)\n204:5 - \'server\' is not defined. (no-undef)\n206:11 - \'visit\' is not defined. (no-undef)\n207:11 - \'click\' is not defined. (no-undef)\n208:18 - \'currentURL\' is not defined. (no-undef)\n218:11 - \'click\' is not defined. (no-undef)\n219:18 - \'currentURL\' is not defined. (no-undef)\n223:5 - \'server\' is not defined. (no-undef)\n238:5 - \'server\' is not defined. (no-undef)\n240:5 - \'server\' is not defined. (no-undef)\n246:11 - \'visit\' is not defined. (no-undef)\n247:11 - \'click\' is not defined. (no-undef)\n248:18 - \'currentURL\' is not defined. (no-undef)\n264:11 - \'click\' is not defined. (no-undef)\n265:18 - \'currentURL\' is not defined. (no-undef)\n269:5 - \'server\' is not defined. (no-undef)\n284:5 - \'server\' is not defined. (no-undef)\n286:5 - \'server\' is not defined. (no-undef)\n292:11 - \'visit\' is not defined. (no-undef)\n293:11 - \'click\' is not defined. (no-undef)\n294:18 - \'currentURL\' is not defined. (no-undef)\n307:11 - \'click\' is not defined. (no-undef)\n308:18 - \'currentURL\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/acceptance/using-my-dx-list-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/acceptance/using-my-dx-list-test.js should pass ESLint\n\n35:5 - \'server\' is not defined. (no-undef)\n36:11 - \'visit\' is not defined. (no-undef)\n37:5 - \'click\' is not defined. (no-undef)\n38:11 - \'click\' is not defined. (no-undef)\n40:19 - \'findWithAssert\' is not defined. (no-undef)\n45:5 - \'server\' is not defined. (no-undef)\n46:5 - \'server\' is not defined. (no-undef)\n53:11 - \'visit\' is not defined. (no-undef)\n54:5 - \'click\' is not defined. (no-undef)\n55:11 - \'click\' is not defined. (no-undef)\n57:19 - \'findWithAssert\' is not defined. (no-undef)\n58:11 - \'click\' is not defined. (no-undef)\n59:19 - \'findWithAssert\' is not defined. (no-undef)\n61:11 - \'click\' is not defined. (no-undef)\n63:11 - \'click\' is not defined. (no-undef)\n67:11 - \'click\' is not defined. (no-undef)\n68:11 - \'click\' is not defined. (no-undef)\n71:11 - \'click\' is not defined. (no-undef)\n77:5 - \'server\' is not defined. (no-undef)\n78:5 - \'server\' is not defined. (no-undef)\n85:11 - \'visit\' is not defined. (no-undef)\n86:5 - \'click\' is not defined. (no-undef)\n87:11 - \'click\' is not defined. (no-undef)\n89:11 - \'click\' is not defined. (no-undef)\n90:19 - \'findWithAssert\' is not defined. (no-undef)\n92:11 - \'click\' is not defined. (no-undef)\n97:9 - \'addDiagnosisCallCount\' is assigned a value but never used. (no-unused-vars)\n98:5 - \'server\' is not defined. (no-undef)\n99:5 - \'server\' is not defined. (no-undef)\n108:11 - \'visit\' is not defined. (no-undef)\n109:11 - \'click\' is not defined. (no-undef)\n110:11 - \'click\' is not defined. (no-undef)\n112:11 - \'click\' is not defined. (no-undef)\n114:11 - \'click\' is not defined. (no-undef)\n121:5 - \'server\' is not defined. (no-undef)\n122:5 - \'server\' is not defined. (no-undef)\n123:11 - \'visit\' is not defined. (no-undef)\n124:11 - \'click\' is not defined. (no-undef)\n125:11 - \'click\' is not defined. (no-undef)\n126:11 - \'wait\' is not defined. (no-undef)\n128:11 - \'click\' is not defined. (no-undef)\n129:19 - \'findWithAssert\' is not defined. (no-undef)\n130:11 - \'click\' is not defined. (no-undef)\n134:11 - \'click\' is not defined. (no-undef)\n135:11 - \'click\' is not defined. (no-undef)\n136:11 - \'click\' is not defined. (no-undef)\n137:11 - \'click\' is not defined. (no-undef)\n138:19 - \'findWithAssert\' is not defined. (no-undef)\n139:11 - \'click\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/integration/components/add-patient-photo-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon-test-support/integration/components/add-patient-photo-test.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon-test-support/integration/components/ccda-preview-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/integration/components/ccda-preview-test.js should pass ESLint\n\n135:5 - \'server\' is not defined. (no-undef)\n135:74 - \'db\' is defined but never used. (no-unused-vars)\n146:22 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n146:22 - \'$\' is not defined. (no-undef)\n147:19 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n147:19 - \'$\' is not defined. (no-undef)\n148:19 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n148:19 - \'$\' is not defined. (no-undef)\n149:22 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n149:22 - \'$\' is not defined. (no-undef)\n154:26 - \'$\' is not defined. (no-undef)\n154:26 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n172:5 - \'server\' is not defined. (no-undef)\n172:74 - \'db\' is defined but never used. (no-unused-vars)\n181:19 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n181:19 - \'$\' is not defined. (no-undef)\n182:22 - \'$\' is not defined. (no-undef)\n182:22 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n187:5 - \'server\' is not defined. (no-undef)\n187:74 - \'db\' is defined but never used. (no-unused-vars)\n201:22 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n201:22 - \'$\' is not defined. (no-undef)\n202:19 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n202:19 - \'$\' is not defined. (no-undef)\n203:22 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n203:22 - \'$\' is not defined. (no-undef)\n207:23 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n207:23 - \'$\' is not defined. (no-undef)\n208:26 - \'$\' is not defined. (no-undef)\n208:26 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n211:30 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n211:30 - \'$\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/integration/components/cds-alert-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon-test-support/integration/components/cds-alert-test.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon-test-support/integration/components/goals-section-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/integration/components/goals-section-test.js should pass ESLint\n\n39:5 - \'server\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/integration/components/patient-header-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon-test-support/integration/components/patient-header-test.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon-test-support/integration/components/patient-health-concerns-list-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/integration/components/patient-health-concerns-list-test.js should pass ESLint\n\n95:5 - \'server\' is not defined. (no-undef)\n96:5 - \'server\' is not defined. (no-undef)\n117:5 - \'server\' is not defined. (no-undef)\n123:5 - \'server\' is not defined. (no-undef)\n146:5 - \'server\' is not defined. (no-undef)\n147:5 - \'server\' is not defined. (no-undef)\n147:99 - \'db\' is defined but never used. (no-unused-vars)\n156:5 - \'server\' is not defined. (no-undef)\n156:104 - \'db\' is defined but never used. (no-unused-vars)\n197:5 - \'server\' is not defined. (no-undef)\n208:5 - \'server\' is not defined. (no-undef)\n234:5 - \'server\' is not defined. (no-undef)\n235:5 - \'server\' is not defined. (no-undef)\n263:5 - \'server\' is not defined. (no-undef)\n264:5 - \'server\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/unit/components/cds-alert-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon-test-support/unit/components/cds-alert-test.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon-test-support/unit/components/medication-detail-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/unit/components/medication-detail-test.js should pass ESLint\n\n7:12 - \'$\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/unit/components/patient-image-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/unit/components/patient-image-test.js should pass ESLint\n\n10:1 - Irregular whitespace not allowed. (no-irregular-whitespace)\n11:1 - Irregular whitespace not allowed. (no-irregular-whitespace)\n12:1 - Irregular whitespace not allowed. (no-irregular-whitespace)\n13:1 - Irregular whitespace not allowed. (no-irregular-whitespace)\n14:1 - Irregular whitespace not allowed. (no-irregular-whitespace)\n15:1 - Irregular whitespace not allowed. (no-irregular-whitespace)\n16:1 - Irregular whitespace not allowed. (no-irregular-whitespace)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/unit/controllers/favorite-diagnoses-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/unit/controllers/favorite-diagnoses-test.js should pass ESLint\n\n50:1 - Irregular whitespace not allowed. (no-irregular-whitespace)\n51:1 - Irregular whitespace not allowed. (no-irregular-whitespace)\n52:1 - Irregular whitespace not allowed. (no-irregular-whitespace)\n53:1 - Irregular whitespace not allowed. (no-irregular-whitespace)\n54:1 - Irregular whitespace not allowed. (no-irregular-whitespace)\n55:1 - Irregular whitespace not allowed. (no-irregular-whitespace)\n56:1 - Irregular whitespace not allowed. (no-irregular-whitespace)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/unit/controllers/immunizations-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/unit/controllers/immunizations-test.js should pass ESLint\n\n10:1 - Irregular whitespace not allowed. (no-irregular-whitespace)\n12:1 - Irregular whitespace not allowed. (no-irregular-whitespace)\n13:1 - Irregular whitespace not allowed. (no-irregular-whitespace)\n14:1 - Irregular whitespace not allowed. (no-irregular-whitespace)\n15:1 - Irregular whitespace not allowed. (no-irregular-whitespace)\n16:1 - Irregular whitespace not allowed. (no-irregular-whitespace)\n17:1 - Irregular whitespace not allowed. (no-irregular-whitespace)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/unit/models/allergen-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon-test-support/unit/models/allergen-test.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon-test-support/unit/models/diagnoses-array-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon-test-support/unit/models/diagnoses-array-test.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon-test-support/unit/models/diagnoses-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon-test-support/unit/models/diagnoses-test.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon-test-support/unit/models/immunization-search-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/unit/models/immunization-search-test.js should pass ESLint\n\n7:1 - Irregular whitespace not allowed. (no-irregular-whitespace)\n9:1 - Irregular whitespace not allowed. (no-irregular-whitespace)\n10:1 - Irregular whitespace not allowed. (no-irregular-whitespace)\n11:1 - Irregular whitespace not allowed. (no-irregular-whitespace)\n12:1 - Irregular whitespace not allowed. (no-irregular-whitespace)\n13:1 - Irregular whitespace not allowed. (no-irregular-whitespace)\n14:1 - Irregular whitespace not allowed. (no-irregular-whitespace)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/unit/models/medications-array-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/unit/models/medications-array-test.js should pass ESLint\n\n6:15 - \'moment\' is not defined. (no-undef)\n7:22 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/unit/models/medications-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/unit/models/medications-test.js should pass ESLint\n\n8:15 - \'moment\' is not defined. (no-undef)\n9:22 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/unit/models/patient-goal-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/unit/models/patient-goal-test.js should pass ESLint\n\n43:5 - \'server\' is not defined. (no-undef)\n67:5 - \'server\' is not defined. (no-undef)\n70:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n71:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n72:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n73:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n74:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n75:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n76:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n80:5 - \'server\' is not defined. (no-undef)\n85:5 - \'server\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/unit/models/patient-health-concern-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/unit/models/patient-health-concern-test.js should pass ESLint\n\n69:5 - \'server\' is not defined. (no-undef)\n69:98 - \'db\' is defined but never used. (no-unused-vars)\n106:5 - \'server\' is not defined. (no-undef)\n106:99 - \'db\' is defined but never used. (no-unused-vars)\n147:5 - \'server\' is not defined. (no-undef)\n148:5 - \'server\' is not defined. (no-undef)\n148:124 - \'db\' is defined but never used. (no-unused-vars)\n179:5 - \'server\' is not defined. (no-undef)\n180:5 - \'server\' is not defined. (no-undef)\n180:127 - \'db\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/unit/repositories/diagnoses-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon-test-support/unit/repositories/diagnoses-test.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon-test-support/unit/repositories/medications-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon-test-support/unit/repositories/medications-test.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon-test-support/unit/repositories/patient-demographics-test.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon-test-support/unit/repositories/patient-demographics-test.js should pass ESLint\n\n47:5 - \'server\' is not defined. (no-undef)\n73:5 - \'server\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon-test-support/unit/repositories/patients-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon-test-support/unit/repositories/patients-test.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon-test-support/unit/utils/patient-search-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon-test-support/unit/utils/patient-search-test.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/advanced-directive.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/advanced-directive.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/allergy-reaction.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/allergy-reaction.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/allergy-substance.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/allergy-substance.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/appointment.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/appointment.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/behavioral-health.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/behavioral-health.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/care-team-member.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/care-team-member.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/care-team.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/care-team.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/ccda-document-type.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/ccda-document-type.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/ccda-template-component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/ccda-template-component.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/clinical-document.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/clinical-document.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/ethnicity-option.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/ethnicity-option.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/favorite-diagnosis.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/favorite-diagnosis.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/immunization-drug.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/immunization-drug.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/immunization-registry-connection.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/immunization-registry-connection.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/immunization-registry-option.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/immunization-registry-option.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/immunization-registry-property.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/immunization-registry-property.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/immunization-registry-result.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/adapters/immunization-registry-result.js should pass ESLint\n\n9:50 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/adapters/immunization-registry.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/immunization-registry.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/immunization-transmission-status.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/immunization-transmission-status.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/immunization.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/immunization.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/patient-allergy.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/patient-allergy.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/patient-goal.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/patient-goal.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/patient-health-concern.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/patient-health-concern.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/patient-practice-guid.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/patient-practice-guid.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/patient-summary-sia.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/patient-summary-sia.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/patient-summary.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/patient-summary.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/personal-medical-history.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/personal-medical-history.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/race-option.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/race-option.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/recent-patient.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/recent-patient.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/relationshiptype.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/relationshiptype.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/smoking-status-type.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/smoking-status-type.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/smoking-status.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/smoking-status.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/social-health.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/social-health.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/social-history-option.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/social-history-option.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/social-history.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/social-history.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/vaccination.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/vaccination.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/vaccine-inventory.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/vaccine-inventory.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/vaccine-lookup-datum.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/vaccine-lookup-datum.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/vaccine-lot-usage.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/vaccine-lot-usage.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/vaccine-manufacturer.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/vaccine-manufacturer.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/adapters/vaccine-type.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/adapters/vaccine-type.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/add-patient-photo.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/add-patient-photo.js should pass ESLint\n\n17:9 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n17:9 - \'$\' is not defined. (no-undef)\n32:9 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n32:9 - \'$\' is not defined. (no-undef)\n33:9 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n33:9 - \'$\' is not defined. (no-undef)\n82:39 - Empty block statement. (no-empty)');
  });

  QUnit.test('templates/components/clinical/addon/components/advance-directive-detail.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/advance-directive-detail.js should pass ESLint\n\n13:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n16:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n19:13 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/advance-directives.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/advance-directives.js should pass ESLint\n\n65:32 - \'moment\' is not defined. (no-undef)\n73:17 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/allergen-search.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/allergen-search.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/allergies-list-item.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/allergies-list-item.js should pass ESLint\n\n11:9 - Use closure actions, unless you need bubbling (ember/closure-actions)\n18:13 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/allergies-list-section.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/allergies-list-section.js should pass ESLint\n\n26:13 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/allergies-list.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/allergies-list.js should pass ESLint\n\n58:13 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)\n95:17 - \'toastr\' is not defined. (no-undef)\n128:17 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/allergy-detail.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/allergy-detail.js should pass ESLint\n\n90:31 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)\n129:33 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)\n210:26 - \'moment\' is not defined. (no-undef)\n215:39 - \'moment\' is not defined. (no-undef)\n237:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n244:17 - \'toastr\' is not defined. (no-undef)\n247:17 - \'toastr\' is not defined. (no-undef)\n252:35 - \'moment\' is not defined. (no-undef)\n252:42 - \'moment\' is not defined. (no-undef)\n258:22 - Do not use this.attrs (ember/no-attrs-in-components)\n292:31 - Do not use this.attrs (ember/no-attrs-in-components)\n293:22 - Do not use this.attrs (ember/no-attrs-in-components)\n297:13 - \'toastr\' is not defined. (no-undef)\n326:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n341:18 - Do not use this.attrs (ember/no-attrs-in-components)\n342:18 - Do not use this.attrs (ember/no-attrs-in-components)');
  });

  QUnit.test('templates/components/clinical/addon/components/allergy-details-pane.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/allergy-details-pane.js should pass ESLint\n\n14:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n17:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n20:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n23:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n26:13 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/allergy-free-text-message.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/allergy-free-text-message.js should pass ESLint\n\n72:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n78:21 - \'toastr\' is not defined. (no-undef)\n90:76 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n90:76 - \'$\' is not defined. (no-undef)\n94:17 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n94:17 - \'$\' is not defined. (no-undef)\n96:17 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n96:17 - \'$\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/components/allergy-select.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/allergy-select.js should pass ESLint\n\n37:13 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/assessment-modal.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/assessment-modal.js should pass ESLint\n\n107:21 - \'toastr\' is not defined. (no-undef)\n109:21 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/card-field.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/card-field.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/care-team-contact-form.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/care-team-contact-form.js should pass ESLint\n\n4:22 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)');
  });

  QUnit.test('templates/components/clinical/addon/components/care-team-detail.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/care-team-detail.js should pass ESLint\n\n22:67 - Unnecessary escape character: \\+. (no-useless-escape)\n195:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n218:17 - Use closure actions, unless you need bubbling (ember/closure-actions)\n225:21 - \'toastr\' is not defined. (no-undef)\n323:26 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)\n330:31 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n330:31 - \'$\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/components/care-team-list.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/care-team-list.js should pass ESLint\n\n15:19 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)\n41:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n45:17 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/ccda-preview-modal.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/ccda-preview-modal.js should pass ESLint\n\n65:19 - Use brace expansion (ember/use-brace-expansion)\n123:13 - \'toastr\' is not defined. (no-undef)\n229:13 - \'toastr\' is not defined. (no-undef)\n251:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n280:13 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/cds-alert.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/cds-alert.js should pass ESLint\n\n134:31 - Unnecessary escape character: \\[. (no-useless-escape)\n154:18 - Do not use this.attrs (ember/no-attrs-in-components)\n196:18 - Do not use this.attrs (ember/no-attrs-in-components)');
  });

  QUnit.test('templates/components/clinical/addon/components/cds-alerts.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/cds-alerts.js should pass ESLint\n\n22:12 - Use brace expansion (ember/use-brace-expansion)\n54:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n58:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n83:45 - \'$\' is not defined. (no-undef)\n88:46 - \'$\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/components/create-clinical-document-modal.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/create-clinical-document-modal.js should pass ESLint\n\n20:25 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)\n56:30 - \'toastr\' is not defined. (no-undef)\n60:25 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/create-patient-clinical-document-modal.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/create-patient-clinical-document-modal.js should pass ESLint\n\n22:26 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)\n50:21 - Use closure actions, unless you need bubbling (ember/closure-actions)\n53:30 - \'toastr\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/components/datetime-formatted.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/datetime-formatted.js should pass ESLint\n\n4:34 - \'$\' is not defined. (no-undef)\n28:21 - \'moment\' is not defined. (no-undef)\n30:21 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/components/deprecated/allergy-free-text-message.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/deprecated/allergy-free-text-message.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/deprecated/diagnoses-summary-list-item.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/deprecated/diagnoses-summary-list-item.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/deprecated/diagnoses-summary-list-section.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/deprecated/diagnoses-summary-list-section.js should pass ESLint\n\n5:13 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/deprecated/diagnoses-summary-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/deprecated/diagnoses-summary-list.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/device-detail.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/device-detail.js should pass ESLint\n\n34:5 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n78:23 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)\n145:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n166:21 - Use closure actions, unless you need bubbling (ember/closure-actions)\n167:21 - \'toastr\' is not defined. (no-undef)\n169:32 - \'toastr\' is not defined. (no-undef)\n175:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n213:17 - Use closure actions, unless you need bubbling (ember/closure-actions)\n215:21 - \'toastr\' is not defined. (no-undef)\n221:17 - \'toastr\' is not defined. (no-undef)\n227:26 - \'moment\' is not defined. (no-undef)\n230:16 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/components/diagnoses-assessment-list-read-only.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/diagnoses-assessment-list-read-only.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/diagnoses-assessment-list.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/diagnoses-assessment-list.js should pass ESLint\n\n27:17 - Use closure actions, unless you need bubbling (ember/closure-actions)\n29:17 - \'toastr\' is not defined. (no-undef)\n38:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n41:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n68:19 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)');
  });

  QUnit.test('templates/components/clinical/addon/components/diagnoses-flyout.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/diagnoses-flyout.js should pass ESLint\n\n40:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n51:21 - \'toastr\' is not defined. (no-undef)\n56:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n59:13 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/diagnoses-summary-list-item.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/diagnoses-summary-list-item.js should pass ESLint\n\n11:14 - Do not use this.attrs (ember/no-attrs-in-components)');
  });

  QUnit.test('templates/components/clinical/addon/components/diagnoses-summary-list-section.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/diagnoses-summary-list-section.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/diagnoses-summary-list.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/diagnoses-summary-list.js should pass ESLint\n\n49:22 - Do not use this.attrs (ember/no-attrs-in-components)\n56:18 - Do not use this.attrs (ember/no-attrs-in-components)');
  });

  QUnit.test('templates/components/clinical/addon/components/diagnosis-codes.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/diagnosis-codes.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/diagnosis-description.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/diagnosis-description.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/diagnosis-detail-form-icd10.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/diagnosis-detail-form-icd10.js should pass ESLint\n\n41:18 - Use brace expansion (ember/use-brace-expansion)\n66:11 - Use closure actions, unless you need bubbling (ember/closure-actions)\n72:27 - \'moment\' is not defined. (no-undef)\n73:26 - \'moment\' is not defined. (no-undef)\n129:13 - Use brace expansion (ember/use-brace-expansion)\n164:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n167:45 - \'moment\' is not defined. (no-undef)\n170:44 - \'moment\' is not defined. (no-undef)\n175:17 - Use closure actions, unless you need bubbling (ember/closure-actions)\n179:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n182:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n187:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n194:13 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/diagnosis-detail-form.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/diagnosis-detail-form.js should pass ESLint\n\n40:18 - Use brace expansion (ember/use-brace-expansion)\n56:11 - Use closure actions, unless you need bubbling (ember/closure-actions)\n62:27 - \'moment\' is not defined. (no-undef)\n63:26 - \'moment\' is not defined. (no-undef)\n117:27 - Use brace expansion (ember/use-brace-expansion)\n118:16 - \'_\' is not defined. (no-undef)\n132:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n135:45 - \'moment\' is not defined. (no-undef)\n138:44 - \'moment\' is not defined. (no-undef)\n142:17 - Use closure actions, unless you need bubbling (ember/closure-actions)\n153:17 - Use closure actions, unless you need bubbling (ember/closure-actions)\n165:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n170:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n177:13 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/diagnosis-detail.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/diagnosis-detail.js should pass ESLint\n\n121:21 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)\n179:20 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)\n195:9 - Use closure actions, unless you need bubbling (ember/closure-actions)\n219:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n224:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n230:17 - Use closure actions, unless you need bubbling (ember/closure-actions)\n284:17 - Use closure actions, unless you need bubbling (ember/closure-actions)\n289:17 - Use closure actions, unless you need bubbling (ember/closure-actions)\n324:17 - \'toastr\' is not defined. (no-undef)\n326:17 - \'toastr\' is not defined. (no-undef)\n336:25 - \'toastr\' is not defined. (no-undef)\n392:27 - \'_\' is not defined. (no-undef)\n393:29 - \'_\' is not defined. (no-undef)\n401:13 - \'toastr\' is not defined. (no-undef)\n416:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n451:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n462:17 - \'toastr\' is not defined. (no-undef)\n463:26 - Do not use this.attrs (ember/no-attrs-in-components)\n464:26 - Do not use this.attrs (ember/no-attrs-in-components)\n471:9 - Use closure actions, unless you need bubbling (ember/closure-actions)\n485:9 - Use closure actions, unless you need bubbling (ember/closure-actions)\n496:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n499:13 - \'toastr\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/components/diagnosis-display-selector-v2.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/diagnosis-display-selector-v2.js should pass ESLint\n\n37:9 - Use closure actions, unless you need bubbling (ember/closure-actions)\n40:5 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)');
  });

  QUnit.test('templates/components/clinical/addon/components/diagnosis-display-selector.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/diagnosis-display-selector.js should pass ESLint\n\n34:9 - Use closure actions, unless you need bubbling (ember/closure-actions)\n37:5 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)');
  });

  QUnit.test('templates/components/clinical/addon/components/diagnosis-facets.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/diagnosis-facets.js should pass ESLint\n\n30:21 - \'_\' is not defined. (no-undef)\n31:21 - \'_\' is not defined. (no-undef)\n43:13 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/diagnosis-refine.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/diagnosis-refine.js should pass ESLint\n\n75:13 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/diagnosis-search-for-family-history.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/diagnosis-search-for-family-history.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/diagnosis-typeahead-icd10.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/diagnosis-typeahead-icd10.js should pass ESLint\n\n33:55 - Unnecessary escape character: \\". (no-useless-escape)\n33:59 - Unnecessary escape character: \\". (no-useless-escape)\n72:17 - Use closure actions, unless you need bubbling (ember/closure-actions)\n97:17 - Use closure actions, unless you need bubbling (ember/closure-actions)\n98:17 - Use closure actions, unless you need bubbling (ember/closure-actions)\n111:17 - Use closure actions, unless you need bubbling (ember/closure-actions)\n135:13 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/diagnosis-typeahead-item-icd10.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/diagnosis-typeahead-item-icd10.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/diagnosis-typeahead-item.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/diagnosis-typeahead-item.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/diagnosis-typeahead.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/diagnosis-typeahead.js should pass ESLint\n\n43:58 - Unnecessary escape character: \\". (no-useless-escape)\n43:62 - Unnecessary escape character: \\". (no-useless-escape)\n88:17 - Use closure actions, unless you need bubbling (ember/closure-actions)\n89:17 - Use closure actions, unless you need bubbling (ember/closure-actions)\n102:17 - Use closure actions, unless you need bubbling (ember/closure-actions)\n116:13 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/encounter-diagnoses-list-item.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/encounter-diagnoses-list-item.js should pass ESLint\n\n8:9 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/encounter-diagnoses-list-section.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/encounter-diagnoses-list-section.js should pass ESLint\n\n5:13 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/encounter-diagnoses-list.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/encounter-diagnoses-list.js should pass ESLint\n\n68:27 - Use brace expansion (ember/use-brace-expansion)\n72:31 - Use brace expansion (ember/use-brace-expansion)');
  });

  QUnit.test('templates/components/clinical/addon/components/eventing-radio-button.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/eventing-radio-button.js should pass ESLint\n\n13:13 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/family-health-history-card.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/family-health-history-card.js should pass ESLint\n\n45:9 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/family-history-diagnosis-detail.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/family-history-diagnosis-detail.js should pass ESLint\n\n14:14 - \'moment\' is not defined. (no-undef)\n52:43 - \'moment\' is not defined. (no-undef)\n64:30 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/components/family-history-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/family-history-list.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/family-history-relative-card.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/family-history-relative-card.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/family-history-relative-detail.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/family-history-relative-detail.js should pass ESLint\n\n13:14 - \'moment\' is not defined. (no-undef)\n28:45 - \'moment\' is not defined. (no-undef)\n41:32 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/components/favorite-diagnoses-toolbox.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/favorite-diagnoses-toolbox.js should pass ESLint\n\n58:13 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/favorite-diagnosis-detail.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/favorite-diagnosis-detail.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/frequent-diagnoses.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/frequent-diagnoses.js should pass ESLint\n\n14:28 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)\n31:13 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/frequent-medications.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/frequent-medications.js should pass ESLint\n\n65:13 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/goal-detail.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/goal-detail.js should pass ESLint\n\n25:13 - \'autosize\' is not defined. (no-undef)\n43:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n46:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n49:13 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/goals-section.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/goals-section.js should pass ESLint\n\n45:23 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)\n64:18 - Do not use this.attrs (ember/no-attrs-in-components)\n65:18 - Do not use this.attrs (ember/no-attrs-in-components)\n82:17 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/health-concern-detail.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/health-concern-detail.js should pass ESLint\n\n29:21 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)\n136:18 - Do not use this.attrs (ember/no-attrs-in-components)\n139:18 - Do not use this.attrs (ember/no-attrs-in-components)');
  });

  QUnit.test('templates/components/clinical/addon/components/immunization-select.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/immunization-select.js should pass ESLint\n\n134:17 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/immunizations/add-immunization-details.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/immunizations/add-immunization-details.js should pass ESLint\n\n46:20 - Use brace expansion (ember/use-brace-expansion)\n157:14 - Do not use this.attrs (ember/no-attrs-in-components)\n201:18 - Do not use this.attrs (ember/no-attrs-in-components)');
  });

  QUnit.test('templates/components/clinical/addon/components/immunizations/add-immunization-historical.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/immunizations/add-immunization-historical.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/immunizations/add-immunization-refused.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/immunizations/add-immunization-refused.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/immunizations/add-immunization.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/immunizations/add-immunization.js should pass ESLint\n\n48:14 - Use brace expansion (ember/use-brace-expansion)\n101:56 - \'moment\' is not defined. (no-undef)\n102:51 - \'moment\' is not defined. (no-undef)\n195:13 - \'toastr\' is not defined. (no-undef)\n206:17 - \'toastr\' is not defined. (no-undef)\n225:13 - \'toastr\' is not defined. (no-undef)\n314:106 - \'moment\' is not defined. (no-undef)\n315:111 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/components/immunizations/download-immunizations.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/immunizations/download-immunizations.js should pass ESLint\n\n43:13 - \'toastr\' is not defined. (no-undef)\n45:13 - \'toastr\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/components/immunizations/list-immunizations.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/immunizations/list-immunizations.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/immunizations/print-immunizations.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/immunizations/print-immunizations.js should pass ESLint\n\n4:10 - \'computed\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('templates/components/clinical/addon/components/immunizations/registry-results-forecast.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/immunizations/registry-results-forecast.js should pass ESLint\n\n3:10 - \'computed\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('templates/components/clinical/addon/components/immunizations/registry-results-history.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/immunizations/registry-results-history.js should pass ESLint\n\n3:10 - \'computed\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('templates/components/clinical/addon/components/immunizations/registry-search-form.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/immunizations/registry-search-form.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/immunizations/registry-search.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/immunizations/registry-search.js should pass ESLint\n\n70:18 - Do not use this.attrs (ember/no-attrs-in-components)\n73:18 - Do not use this.attrs (ember/no-attrs-in-components)\n91:14 - Do not use this.attrs (ember/no-attrs-in-components)\n138:18 - Do not use this.attrs (ember/no-attrs-in-components)');
  });

  QUnit.test('templates/components/clinical/addon/components/immunizations/transmission-errors.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/immunizations/transmission-errors.js should pass ESLint\n\n4:10 - \'computed\' is defined but never used. (no-unused-vars)\n4:20 - \'get\' is defined but never used. (no-unused-vars)\n4:25 - \'set\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('templates/components/clinical/addon/components/immunizations/vis-edition.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/immunizations/vis-edition.js should pass ESLint\n\n15:51 - \'_\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/components/interaction-alert-duplicate-therapies.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/interaction-alert-duplicate-therapies.js should pass ESLint\n\n17:39 - \'_\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/components/interaction-alert-item.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/interaction-alert-item.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/interaction-alerts.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/interaction-alerts.js should pass ESLint\n\n21:23 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)');
  });

  QUnit.test('templates/components/clinical/addon/components/medication-detail-duplicates.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/medication-detail-duplicates.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/medication-detail.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/medication-detail.js should pass ESLint\n\n74:5 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n94:31 - \'moment\' is not defined. (no-undef)\n95:30 - \'moment\' is not defined. (no-undef)\n143:53 - \'moment\' is not defined. (no-undef)\n143:94 - \'moment\' is not defined. (no-undef)\n157:28 - \'moment\' is not defined. (no-undef)\n243:20 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)\n252:27 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)\n311:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n375:17 - \'toastr\' is not defined. (no-undef)\n377:21 - Use closure actions, unless you need bubbling (ember/closure-actions)\n384:62 - \'moment\' is not defined. (no-undef)\n387:17 - \'toastr\' is not defined. (no-undef)\n395:39 - \'moment\' is not defined. (no-undef)\n399:38 - \'moment\' is not defined. (no-undef)\n427:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n459:26 - \'model\' is assigned a value but never used. (no-unused-vars)\n461:21 - \'model\' is assigned to itself. (no-self-assign)\n472:35 - \'moment\' is not defined. (no-undef)\n501:49 - Use closure actions, unless you need bubbling (ember/closure-actions)\n515:13 - \'toastr\' is not defined. (no-undef)\n555:17 - Use closure actions, unless you need bubbling (ember/closure-actions)\n580:21 - \'toastr\' is not defined. (no-undef)\n634:25 - \'toastr\' is not defined. (no-undef)\n636:25 - \'toastr\' is not defined. (no-undef)\n647:21 - Use closure actions, unless you need bubbling (ember/closure-actions)\n654:21 - Use closure actions, unless you need bubbling (ember/closure-actions)\n691:62 - \'moment\' is not defined. (no-undef)\n692:60 - \'moment\' is not defined. (no-undef)\n710:9 - Use closure actions, unless you need bubbling (ember/closure-actions)\n819:17 - Use closure actions, unless you need bubbling (ember/closure-actions)\n858:21 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/medication-select.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/medication-select.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/medication-sig-typeahead.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/medication-sig-typeahead.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/medication-typeahead-item.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/medication-typeahead-item.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/medication-typeahead.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/medication-typeahead.js should pass ESLint\n\n48:13 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)');
  });

  QUnit.test('templates/components/clinical/addon/components/medications-flyout.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/medications-flyout.js should pass ESLint\n\n73:17 - \'toastr\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/components/medications-grid.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/medications-grid.js should pass ESLint\n\n38:18 - Do not use this.attrs (ember/no-attrs-in-components)');
  });

  QUnit.test('templates/components/clinical/addon/components/medications-plan-list-read-only.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/medications-plan-list-read-only.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/medications-plan-list.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/medications-plan-list.js should pass ESLint\n\n40:21 - \'toastr\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/components/medications-summary-list-item.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/medications-summary-list-item.js should pass ESLint\n\n22:18 - Do not use this.attrs (ember/no-attrs-in-components)\n28:22 - Do not use this.attrs (ember/no-attrs-in-components)');
  });

  QUnit.test('templates/components/clinical/addon/components/medications-summary-list.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/medications-summary-list.js should pass ESLint\n\n37:18 - Do not use this.attrs (ember/no-attrs-in-components)');
  });

  QUnit.test('templates/components/clinical/addon/components/medline-plus-link.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/medline-plus-link.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/monograph-parser.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/monograph-parser.js should pass ESLint\n\n12:16 - \'$\' is not defined. (no-undef)\n12:16 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n12:18 - \'$\' is not defined. (no-undef)\n44:16 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)\n51:21 - \'$\' is not defined. (no-undef)\n52:28 - \'$\' is not defined. (no-undef)\n52:28 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n57:9 - \'$\' is not defined. (no-undef)\n57:9 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n58:24 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n58:24 - \'$\' is not defined. (no-undef)\n61:27 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n61:27 - \'$\' is not defined. (no-undef)\n83:33 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n83:33 - \'$\' is not defined. (no-undef)\n84:70 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n84:70 - \'$\' is not defined. (no-undef)\n101:28 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n101:28 - \'$\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/components/new-medication-assessment-card.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/new-medication-assessment-card.js should pass ESLint\n\n40:9 - Use closure actions, unless you need bubbling (ember/closure-actions)\n42:18 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)');
  });

  QUnit.test('templates/components/clinical/addon/components/osteoporosis-dexa-modal.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/osteoporosis-dexa-modal.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/patient-alert.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/patient-alert.js should pass ESLint\n\n59:9 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n59:9 - \'$\' is not defined. (no-undef)\n83:32 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)\n89:13 - \'Ember\' is not defined. (no-undef)\n90:13 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/patient-alerts-popover-modal.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/patient-alerts-popover-modal.js should pass ESLint\n\n51:23 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)\n52:76 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n52:76 - \'$\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/components/patient-education-link.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/patient-education-link.js should pass ESLint\n\n43:69 - Unnecessary escape character: \\/. (no-useless-escape)\n43:72 - Unnecessary escape character: \\+. (no-useless-escape)\n47:90 - Unnecessary escape character: \\/. (no-useless-escape)\n47:93 - Unnecessary escape character: \\+. (no-useless-escape)');
  });

  QUnit.test('templates/components/clinical/addon/components/patient-email-popover.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/patient-email-popover.js should pass ESLint\n\n44:21 - \'toastr\' is not defined. (no-undef)\n52:17 - \'toastr\' is not defined. (no-undef)\n60:9 - \'toastr\' is not defined. (no-undef)\n67:40 - Unnecessary escape character: \\". (no-useless-escape)\n67:65 - Unnecessary escape character: \\". (no-useless-escape)\n67:74 - Unnecessary escape character: \\". (no-useless-escape)\n67:78 - Unnecessary escape character: \\". (no-useless-escape)\n101:35 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n101:35 - \'$\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/components/patient-header-insurance-info.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/patient-header-insurance-info.js should pass ESLint\n\n12:13 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n12:13 - \'$\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/components/patient-header-phone-column.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/patient-header-phone-column.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/patient-header.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/patient-header.js should pass ESLint\n\n17:17 - \'_\' is not defined. (no-undef)\n31:17 - Use closure actions, unless you need bubbling (ember/closure-actions)\n35:13 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/patient-health-concern-note.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/patient-health-concern-note.js should pass ESLint\n\n16:18 - Do not use this.attrs (ember/no-attrs-in-components)');
  });

  QUnit.test('templates/components/clinical/addon/components/patient-health-concerns-list-section.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/patient-health-concerns-list-section.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/patient-health-concerns-list.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/patient-health-concerns-list.js should pass ESLint\n\n43:25 - Use brace expansion (ember/use-brace-expansion)\n105:25 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)\n124:18 - Do not use this.attrs (ember/no-attrs-in-components)\n125:18 - Do not use this.attrs (ember/no-attrs-in-components)\n126:25 - Do not use this.attrs (ember/no-attrs-in-components)\n127:18 - Do not use this.attrs (ember/no-attrs-in-components)\n170:13 - \'toastr\' is not defined. (no-undef)\n249:17 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/patient-image.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/patient-image.js should pass ESLint\n\n27:23 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)\n34:26 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)');
  });

  QUnit.test('templates/components/clinical/addon/components/patient-list-phone-number.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/patient-list-phone-number.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/patient-persistent-navigation.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/patient-persistent-navigation.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/patient-pinned-note-provider-section.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/patient-pinned-note-provider-section.js should pass ESLint\n\n23:16 - \'moment\' is not defined. (no-undef)\n38:25 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)\n43:42 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n43:42 - \'$\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/components/patient-pinned-note.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/patient-pinned-note.js should pass ESLint\n\n29:17 - \'moment\' is not defined. (no-undef)\n81:51 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n81:51 - \'$\' is not defined. (no-undef)\n92:17 - \'toastr\' is not defined. (no-undef)\n98:17 - \'toastr\' is not defined. (no-undef)\n120:18 - Do not use this.attrs (ember/no-attrs-in-components)');
  });

  QUnit.test('templates/components/clinical/addon/components/patient-preview-encounter.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/patient-preview-encounter.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/patient-preview-list.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/patient-preview-list.js should pass ESLint\n\n33:27 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)\n53:18 - Do not use this.attrs (ember/no-attrs-in-components)\n58:14 - Do not use this.attrs (ember/no-attrs-in-components)\n59:14 - Do not use this.attrs (ember/no-attrs-in-components)\n60:14 - Do not use this.attrs (ember/no-attrs-in-components)\n101:14 - Do not use this.attrs (ember/no-attrs-in-components)');
  });

  QUnit.test('templates/components/clinical/addon/components/patient-preview-order.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/patient-preview-order.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/patient-preview-result.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/patient-preview-result.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/patient-preview.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/patient-preview.js should pass ESLint\n\n39:28 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)\n61:18 - Do not use this.attrs (ember/no-attrs-in-components)\n65:18 - Do not use this.attrs (ember/no-attrs-in-components)\n93:17 - \'moment\' is not defined. (no-undef)\n124:18 - Do not use this.attrs (ember/no-attrs-in-components)\n153:22 - Do not use this.attrs (ember/no-attrs-in-components)\n178:22 - Do not use this.attrs (ember/no-attrs-in-components)');
  });

  QUnit.test('templates/components/clinical/addon/components/patient-previews.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/patient-previews.js should pass ESLint\n\n28:22 - Use brace expansion (ember/use-brace-expansion)\n42:42 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n42:42 - \'$\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/components/patient-risk-score.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/patient-risk-score.js should pass ESLint\n\n36:22 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)\n47:17 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/patient-search.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/patient-search.js should pass ESLint\n\n102:13 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n102:13 - \'$\' is not defined. (no-undef)\n112:13 - \'$\' is not defined. (no-undef)\n112:13 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n123:13 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n123:13 - \'$\' is not defined. (no-undef)\n163:21 - Use closure actions, unless you need bubbling (ember/closure-actions)\n172:25 - Use closure actions, unless you need bubbling (ember/closure-actions)\n180:22 - Do not use this.attrs (ember/no-attrs-in-components)\n192:26 - Do not use this.attrs (ember/no-attrs-in-components)\n193:26 - Do not use this.attrs (ember/no-attrs-in-components)\n196:26 - Do not use this.attrs (ember/no-attrs-in-components)\n197:26 - Do not use this.attrs (ember/no-attrs-in-components)\n213:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n236:18 - Do not use this.attrs (ember/no-attrs-in-components)\n237:18 - Do not use this.attrs (ember/no-attrs-in-components)\n301:5 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n320:24 - Use brace expansion (ember/use-brace-expansion)\n422:20 - Unnecessary escape character: \\A. (no-useless-escape)\n430:36 - Unnecessary escape character: \\/. (no-useless-escape)\n430:49 - Unnecessary escape character: \\/. (no-useless-escape)\n430:71 - Unnecessary escape character: \\/. (no-useless-escape)\n430:83 - Unnecessary escape character: \\/. (no-useless-escape)\n430:96 - Unnecessary escape character: \\/. (no-useless-escape)\n430:108 - Unnecessary escape character: \\/. (no-useless-escape)\n430:122 - Unnecessary escape character: \\/. (no-useless-escape)\n430:134 - Unnecessary escape character: \\/. (no-useless-escape)\n430:156 - Unnecessary escape character: \\/. (no-useless-escape)\n430:168 - Unnecessary escape character: \\/. (no-useless-escape)\n430:182 - Unnecessary escape character: \\/. (no-useless-escape)\n430:194 - Unnecessary escape character: \\/. (no-useless-escape)\n430:216 - Unnecessary escape character: \\/. (no-useless-escape)\n430:237 - Unnecessary escape character: \\/. (no-useless-escape)\n430:248 - Unnecessary escape character: \\/. (no-useless-escape)\n430:261 - Unnecessary escape character: \\/. (no-useless-escape)\n430:272 - Unnecessary escape character: \\/. (no-useless-escape)\n430:286 - Unnecessary escape character: \\/. (no-useless-escape)\n430:297 - Unnecessary escape character: \\/. (no-useless-escape)\n430:319 - Unnecessary escape character: \\/. (no-useless-escape)\n430:330 - Unnecessary escape character: \\/. (no-useless-escape)\n430:344 - Unnecessary escape character: \\/. (no-useless-escape)\n430:355 - Unnecessary escape character: \\/. (no-useless-escape)\n430:377 - Unnecessary escape character: \\/. (no-useless-escape)\n430:399 - Unnecessary escape character: \\/. (no-useless-escape)\n430:411 - Unnecessary escape character: \\/. (no-useless-escape)\n430:424 - Unnecessary escape character: \\/. (no-useless-escape)\n430:436 - Unnecessary escape character: \\/. (no-useless-escape)\n430:450 - Unnecessary escape character: \\/. (no-useless-escape)\n430:462 - Unnecessary escape character: \\/. (no-useless-escape)\n430:484 - Unnecessary escape character: \\/. (no-useless-escape)\n430:496 - Unnecessary escape character: \\/. (no-useless-escape)\n430:510 - Unnecessary escape character: \\/. (no-useless-escape)\n430:522 - Unnecessary escape character: \\/. (no-useless-escape)\n430:554 - Unnecessary escape character: \\/. (no-useless-escape)\n430:567 - Unnecessary escape character: \\/. (no-useless-escape)\n430:589 - Unnecessary escape character: \\/. (no-useless-escape)\n430:601 - Unnecessary escape character: \\/. (no-useless-escape)\n430:614 - Unnecessary escape character: \\/. (no-useless-escape)\n430:626 - Unnecessary escape character: \\/. (no-useless-escape)\n430:640 - Unnecessary escape character: \\/. (no-useless-escape)\n430:652 - Unnecessary escape character: \\/. (no-useless-escape)\n430:674 - Unnecessary escape character: \\/. (no-useless-escape)\n430:686 - Unnecessary escape character: \\/. (no-useless-escape)\n430:700 - Unnecessary escape character: \\/. (no-useless-escape)\n430:712 - Unnecessary escape character: \\/. (no-useless-escape)\n430:734 - Unnecessary escape character: \\/. (no-useless-escape)\n430:755 - Unnecessary escape character: \\/. (no-useless-escape)\n430:766 - Unnecessary escape character: \\/. (no-useless-escape)\n430:779 - Unnecessary escape character: \\/. (no-useless-escape)\n430:790 - Unnecessary escape character: \\/. (no-useless-escape)\n430:804 - Unnecessary escape character: \\/. (no-useless-escape)\n430:815 - Unnecessary escape character: \\/. (no-useless-escape)\n430:837 - Unnecessary escape character: \\/. (no-useless-escape)\n430:848 - Unnecessary escape character: \\/. (no-useless-escape)\n430:862 - Unnecessary escape character: \\/. (no-useless-escape)\n430:873 - Unnecessary escape character: \\/. (no-useless-escape)\n430:895 - Unnecessary escape character: \\/. (no-useless-escape)\n430:917 - Unnecessary escape character: \\/. (no-useless-escape)\n430:929 - Unnecessary escape character: \\/. (no-useless-escape)\n430:942 - Unnecessary escape character: \\/. (no-useless-escape)\n430:954 - Unnecessary escape character: \\/. (no-useless-escape)\n430:968 - Unnecessary escape character: \\/. (no-useless-escape)\n430:980 - Unnecessary escape character: \\/. (no-useless-escape)\n430:1002 - Unnecessary escape character: \\/. (no-useless-escape)\n430:1014 - Unnecessary escape character: \\/. (no-useless-escape)\n430:1028 - Unnecessary escape character: \\/. (no-useless-escape)\n430:1040 - Unnecessary escape character: \\/. (no-useless-escape)');
  });

  QUnit.test('templates/components/clinical/addon/components/patient-search2-item.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/patient-search2-item.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/patient-search2-selected-item.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/patient-search2-selected-item.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/patient-search2.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/patient-search2.js should pass ESLint\n\n73:17 - Use closure actions, unless you need bubbling (ember/closure-actions)\n83:9 - Use closure actions, unless you need bubbling (ember/closure-actions)\n103:13 - \'toastr\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/components/pmh-detail.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/pmh-detail.js should pass ESLint\n\n20:31 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)\n59:17 - \'toastr\' is not defined. (no-undef)\n62:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n73:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n83:9 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/pmh-section.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/pmh-section.js should pass ESLint\n\n21:17 - Use brace expansion (ember/use-brace-expansion)\n22:31 - \'_\' is not defined. (no-undef)\n86:18 - Do not use this.attrs (ember/no-attrs-in-components)\n92:18 - Do not use this.attrs (ember/no-attrs-in-components)\n97:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n102:17 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/prescription-item.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/prescription-item.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/prescriptions-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/prescriptions-list.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/previous-diagnoses.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/previous-diagnoses.js should pass ESLint\n\n42:13 - \'toastr\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/components/previous-diagnosis.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/previous-diagnosis.js should pass ESLint\n\n15:13 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/previous-medication.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/previous-medication.js should pass ESLint\n\n20:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n23:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n30:30 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/print-allergies-section.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/print-allergies-section.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/print-allergies.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/print-allergies.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/print-allergy-item.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/print-allergy-item.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/print-device.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/print-device.js should pass ESLint\n\n27:26 - Use brace expansion (ember/use-brace-expansion)\n43:33 - \'moment\' is not defined. (no-undef)\n43:55 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/components/print-devices-section.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/print-devices-section.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/print-diagnoses.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/print-diagnoses.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/print-dropdown.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/print-dropdown.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/print-external-image.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/print-external-image.js should pass ESLint\n\n4:23 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)\n6:31 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n6:31 - \'$\' is not defined. (no-undef)\n8:27 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n8:27 - \'$\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/components/print-family-health-history-section.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/print-family-health-history-section.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/print-family-health-history.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/print-family-health-history.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/print-goals-section.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/print-goals-section.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/print-goals.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/print-goals.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/print-health-concerns.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/print-health-concerns.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/print-immunizations-section.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/print-immunizations-section.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/print-medications-section.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/print-medications-section.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/print-medications.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/print-medications.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/print-patient-sia-section.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/print-patient-sia-section.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/print-social-behavioral-health-section.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/print-social-behavioral-health-section.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/print-worksheet.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/print-worksheet.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/recent-patient-activity.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/recent-patient-activity.js should pass ESLint\n\n29:17 - \'toastr\' is not defined. (no-undef)\n40:30 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/components/risk-score-detail.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/risk-score-detail.js should pass ESLint\n\n17:14 - \'moment\' is not defined. (no-undef)\n32:24 - \'moment\' is not defined. (no-undef)\n32:41 - \'moment\' is not defined. (no-undef)\n39:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n51:17 - Use closure actions, unless you need bubbling (ember/closure-actions)\n55:13 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/sia-worksheet/default-v2.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/sia-worksheet/default-v2.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/sia-worksheet/default.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/sia-worksheet/default.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/sia-worksheet/depression-phq-2-v2.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/sia-worksheet/depression-phq-2-v2.js should pass ESLint\n\n12:49 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/components/sia-worksheet/migraine-v2.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/sia-worksheet/migraine-v2.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/sia-worksheet/migraine.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/sia-worksheet/migraine.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/sia-worksheet/transcript-event-fields.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/sia-worksheet/transcript-event-fields.js should pass ESLint\n\n16:13 - \'_\' is not defined. (no-undef)\n17:18 - Do not use this.attrs (ember/no-attrs-in-components)\n19:18 - Do not use this.attrs (ember/no-attrs-in-components)');
  });

  QUnit.test('templates/components/clinical/addon/components/smoking-status-detail-v2.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/smoking-status-detail-v2.js should pass ESLint\n\n14:14 - \'moment\' is not defined. (no-undef)\n34:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n45:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n55:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n58:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n61:13 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/smoking-status-detail.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/smoking-status-detail.js should pass ESLint\n\n6:14 - \'moment\' is not defined. (no-undef)\n14:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n18:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n21:13 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/social-behavioral-health.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/social-behavioral-health.js should pass ESLint\n\n158:9 - Use closure actions, unless you need bubbling (ember/closure-actions)\n191:26 - Do not use this.attrs (ember/no-attrs-in-components)\n196:26 - Do not use this.attrs (ember/no-attrs-in-components)\n203:22 - Do not use this.attrs (ember/no-attrs-in-components)\n213:22 - Do not use this.attrs (ember/no-attrs-in-components)\n221:22 - Do not use this.attrs (ember/no-attrs-in-components)');
  });

  QUnit.test('templates/components/clinical/addon/components/social-health/field-details.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/social-health/field-details.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/social-health/gender-identity-details.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/social-health/gender-identity-details.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/social-health/sexual-orientation-details.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/social-health/sexual-orientation-details.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/social-history-detail.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/social-history-detail.js should pass ESLint\n\n89:19 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)\n99:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n104:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n119:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n122:13 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/summary-devices-list-item.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/summary-devices-list-item.js should pass ESLint\n\n23:14 - Do not use this.attrs (ember/no-attrs-in-components)\n26:26 - \'moment\' is not defined. (no-undef)\n29:16 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/components/summary-devices-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/summary-devices-list.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/summary-encounter-list.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/summary-encounter-list.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/summary-sia-list-item.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/summary-sia-list-item.js should pass ESLint\n\n10:14 - Do not use this.attrs (ember/no-attrs-in-components)');
  });

  QUnit.test('templates/components/clinical/addon/components/summary-sia-list.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/summary-sia-list.js should pass ESLint\n\n60:22 - Do not use this.attrs (ember/no-attrs-in-components)\n70:17 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/components/text-area-counter.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/text-area-counter.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/components/transcript-comment.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/components/transcript-comment.js should pass ESLint\n\n13:11 - Use brace expansion (ember/use-brace-expansion)');
  });

  QUnit.test('templates/components/clinical/addon/components/transcript-comments.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/components/transcript-comments.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/controllers/allergy.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/controllers/allergy.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/controllers/encounter/allergy.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/controllers/encounter/allergy.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/controllers/encounter/diagnosis.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/controllers/encounter/diagnosis.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/controllers/encounter/health-concern.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/controllers/encounter/health-concern.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/controllers/encounter/medication.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/controllers/encounter/medication.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/controllers/encounter/pmh.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/controllers/encounter/pmh.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/controllers/encounter/risk-score.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/controllers/encounter/risk-score.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/controllers/encounter/smoking.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/controllers/encounter/smoking.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/controllers/encounter/social.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/controllers/encounter/social.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/controllers/encounter/worksheet.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/controllers/encounter/worksheet.js should pass ESLint\n\n46:21 - Use brace expansion (ember/use-brace-expansion)\n48:100 - \'_\' is not defined. (no-undef)\n50:51 - \'_\' is not defined. (no-undef)\n102:21 - \'toastr\' is not defined. (no-undef)\n176:17 - \'toastr\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/controllers/health-concern.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/controllers/health-concern.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/controllers/patient.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/controllers/patient.js should pass ESLint\n\n59:29 - \'moment\' is not defined. (no-undef)\n67:16 - \'moment\' is not defined. (no-undef)\n76:17 - \'_\' is not defined. (no-undef)\n145:20 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)');
  });

  QUnit.test('templates/components/clinical/addon/controllers/patient/d-immunizations.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/controllers/patient/d-immunizations.js should pass ESLint\n\n138:25 - \'toastr\' is not defined. (no-undef)\n142:25 - \'toastr\' is not defined. (no-undef)\n168:17 - \'toastr\' is not defined. (no-undef)\n170:17 - \'toastr\' is not defined. (no-undef)\n244:21 - \'toastr\' is not defined. (no-undef)\n249:21 - \'toastr\' is not defined. (no-undef)\n258:17 - \'toastr\' is not defined. (no-undef)\n377:14 - \'Modernizr\' is not defined. (no-undef)\n461:17 - \'toastr\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/controllers/patient/familyhistory.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/controllers/patient/familyhistory.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/controllers/patient/growth/charts.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/controllers/patient/growth/charts.js should pass ESLint\n\n21:17 - \'toastr\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/controllers/patient/immunizations.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/controllers/patient/immunizations.js should pass ESLint\n\n60:44 - \'moment\' is not defined. (no-undef)\n62:48 - \'moment\' is not defined. (no-undef)\n65:27 - \'moment\' is not defined. (no-undef)\n71:27 - \'moment\' is not defined. (no-undef)\n103:13 - \'toastr\' is not defined. (no-undef)\n106:13 - \'toastr\' is not defined. (no-undef)\n162:13 - \'toastr\' is not defined. (no-undef)\n193:14 - \'Modernizr\' is not defined. (no-undef)\n234:47 - \'$\' is not defined. (no-undef)\n234:47 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n288:47 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n288:47 - \'$\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/controllers/patient/summary.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/controllers/patient/summary.js should pass ESLint\n\n22:19 - Use brace expansion (ember/use-brace-expansion)\n29:16 - \'_\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/controllers/practice-dashboard/clinical-trials-login-redirect.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/controllers/practice-dashboard/clinical-trials-login-redirect.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/controllers/practice-dashboard/clinical-trials.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/controllers/practice-dashboard/clinical-trials.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/controllers/settings/favorite-diagnoses.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/controllers/settings/favorite-diagnoses.js should pass ESLint\n\n79:17 - \'toastr\' is not defined. (no-undef)\n96:39 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n96:39 - \'$\' is not defined. (no-undef)\n100:17 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n100:17 - \'$\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/controllers/summary/allergy.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/controllers/summary/allergy.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/controllers/summary/behavioral.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/controllers/summary/behavioral.js should pass ESLint\n\n78:13 - \'toastr\' is not defined. (no-undef)\n89:13 - \'toastr\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/controllers/summary/device.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/controllers/summary/device.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/controllers/summary/diagnosis.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/controllers/summary/diagnosis.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/controllers/summary/family-health-history.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/controllers/summary/family-health-history.js should pass ESLint\n\n32:17 - \'toastr\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/controllers/summary/goal.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/controllers/summary/goal.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/controllers/summary/health-concern.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/controllers/summary/health-concern.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/controllers/summary/medication.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/controllers/summary/medication.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/controllers/summary/nutrition.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/controllers/summary/nutrition.js should pass ESLint\n\n36:13 - \'toastr\' is not defined. (no-undef)\n54:13 - \'toastr\' is not defined. (no-undef)\n68:13 - \'toastr\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/controllers/summary/pmh.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/controllers/summary/pmh.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/controllers/summary/risk-score.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/controllers/summary/risk-score.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/controllers/summary/sia.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/controllers/summary/sia.js should pass ESLint\n\n19:46 - \'moment\' is not defined. (no-undef)\n23:44 - \'moment\' is not defined. (no-undef)\n26:19 - Use brace expansion (ember/use-brace-expansion)');
  });

  QUnit.test('templates/components/clinical/addon/controllers/summary/smoking.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/controllers/summary/smoking.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/controllers/summary/social-health.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/controllers/summary/social-health.js should pass ESLint\n\n130:61 - \'moment\' is not defined. (no-undef)\n143:13 - \'toastr\' is not defined. (no-undef)\n169:13 - \'toastr\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/controllers/summary/social.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/controllers/summary/social.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/controllers/summary/summary-pmh.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/controllers/summary/summary-pmh.js should pass ESLint\n\n59:13 - \'toastr\' is not defined. (no-undef)\n79:17 - \'toastr\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/helpers/age-on-date.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/helpers/age-on-date.js should pass ESLint\n\n7:27 - \'moment\' is not defined. (no-undef)\n7:58 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/helpers/user-session-cache.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/helpers/user-session-cache.js should pass ESLint\n\n37:43 - \'$\' is not defined. (no-undef)\n41:54 - \'$\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/mixins/allergies-controller.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/mixins/allergies-controller.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/mixins/encounter-controller.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/mixins/encounter-controller.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/mixins/encounter-route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/mixins/encounter-route.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/mixins/immunizations-tooltip-support.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/mixins/immunizations-tooltip-support.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/mixins/loading.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/mixins/loading.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/mixins/patient-list-data.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/mixins/patient-list-data.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/mixins/pmh-controller.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/mixins/pmh-controller.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/mixins/row-height-hack.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/mixins/row-height-hack.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/mixins/social-history-controller.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/mixins/social-history-controller.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/mixins/summary-controller.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/mixins/summary-controller.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/mixins/summary-route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/mixins/summary-route.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/mixins/vaccination-form.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/mixins/vaccination-form.js should pass ESLint\n\n30:17 - Use closure actions, unless you need bubbling (ember/closure-actions)\n41:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n70:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n104:21 - \'toastr\' is not defined. (no-undef)\n106:21 - Use closure actions, unless you need bubbling (ember/closure-actions)\n109:17 - Use closure actions, unless you need bubbling (ember/closure-actions)\n132:17 - \'toastr\' is not defined. (no-undef)\n134:17 - Use closure actions, unless you need bubbling (ember/closure-actions)\n137:13 - Use closure actions, unless you need bubbling (ember/closure-actions)');
  });

  QUnit.test('templates/components/clinical/addon/mixins/with-allergies.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/mixins/with-allergies.js should pass ESLint\n\n74:26 - Do not use this.attrs (ember/no-attrs-in-components)\n75:26 - Do not use this.attrs (ember/no-attrs-in-components)');
  });

  QUnit.test('templates/components/clinical/addon/mixins/with-comments.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/mixins/with-comments.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/mixins/with-devices.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/mixins/with-devices.js should pass ESLint\n\n32:22 - Do not use this.attrs (ember/no-attrs-in-components)\n39:18 - Do not use this.attrs (ember/no-attrs-in-components)\n49:17 - Use closure actions, unless you need bubbling (ember/closure-actions)\n87:17 - \'DEBUG\' is not defined. (no-undef)\n117:13 - \'toastr\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/mixins/with-diagnoses.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/mixins/with-diagnoses.js should pass ESLint\n\n28:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n31:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n38:17 - Use closure actions, unless you need bubbling (ember/closure-actions)\n102:17 - \'DEBUG\' is not defined. (no-undef)\n126:17 - \'toastr\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/mixins/with-health-concerns.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/mixins/with-health-concerns.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/mixins/with-medications.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/mixins/with-medications.js should pass ESLint\n\n43:38 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n43:38 - \'$\' is not defined. (no-undef)\n43:92 - Do not use global `$` or `jQuery` (ember/no-global-jquery)\n43:92 - \'$\' is not defined. (no-undef)\n46:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n49:13 - Use closure actions, unless you need bubbling (ember/closure-actions)\n79:17 - Use closure actions, unless you need bubbling (ember/closure-actions)\n134:17 - \'DEBUG\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/mixins/with-pmh.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/mixins/with-pmh.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/advanced-directive.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/models/advanced-directive.js should pass ESLint\n\n11:49 - \'moment\' is not defined. (no-undef)\n16:20 - \'moment\' is not defined. (no-undef)\n19:39 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/models/allergen.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/allergen.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/allergies-array.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/allergies-array.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/allergy-reaction.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/allergy-reaction.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/allergy-substance.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/allergy-substance.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/appointment.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/appointment.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/assessment.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/models/assessment.js should pass ESLint\n\n10:12 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)');
  });

  QUnit.test('templates/components/clinical/addon/models/assessments/prolia-aesi-medication-history.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/assessments/prolia-aesi-medication-history.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/assessments/prolia-aesi-modal.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/assessments/prolia-aesi-modal.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/assessments/prolia-aesi-select-options.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/assessments/prolia-aesi-select-options.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/assessments/prolia-aesi-task.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/assessments/prolia-aesi-task.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/behavioral-health.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/behavioral-health.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/care-team-member.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/care-team-member.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/care-team.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/care-team.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/ccda-document-type.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/ccda-document-type.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/ccda-template-component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/ccda-template-component.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/clinical-document.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/clinical-document.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/contact-to-profile-adapter.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/contact-to-profile-adapter.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/demographic-option.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/demographic-option.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/diagnoses-array.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/models/diagnoses-array.js should pass ESLint\n\n96:31 - \'_\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/models/diagnosis.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/models/diagnosis.js should pass ESLint\n\n15:35 - \'moment\' is not defined. (no-undef)\n15:46 - \'moment\' is not defined. (no-undef)\n18:42 - \'moment\' is not defined. (no-undef)\n31:16 - \'_\' is not defined. (no-undef)\n82:30 - \'moment\' is not defined. (no-undef)\n82:56 - \'moment\' is not defined. (no-undef)\n165:16 - \'_\' is not defined. (no-undef)\n325:20 - Use brace expansion (ember/use-brace-expansion)');
  });

  QUnit.test('templates/components/clinical/addon/models/dx-search-result.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/models/dx-search-result.js should pass ESLint\n\n24:28 - \'_\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/models/ethnicity-option.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/ethnicity-option.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/familyhealthhistory/familyhealthhistory.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/familyhealthhistory/familyhealthhistory.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/familyhealthhistory/observation.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/familyhealthhistory/observation.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/familyhealthhistory/relative.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/familyhealthhistory/relative.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/favorite-diagnoses-settings.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/favorite-diagnoses-settings.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/favorite-diagnosis.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/favorite-diagnosis.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/immunization-drug.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/models/immunization-drug.js should pass ESLint\n\n5:10 - \'computed\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('templates/components/clinical/addon/models/immunization-funding-source.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/immunization-funding-source.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/immunization-option-notification.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/immunization-option-notification.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/immunization-option-protection.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/immunization-option-protection.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/immunization-option-status.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/immunization-option-status.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/immunization-registry-connection-property.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/immunization-registry-connection-property.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/immunization-registry-connection.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/immunization-registry-connection.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/immunization-registry-filter.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/immunization-registry-filter.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/immunization-registry-notification-preference.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/immunization-registry-notification-preference.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/immunization-registry-option.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/immunization-registry-option.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/immunization-registry-property.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/immunization-registry-property.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/immunization-registry-result.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/immunization-registry-result.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/immunization-registry.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/immunization-registry.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/immunization-search.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/immunization-search.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/immunization-transmission-status.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/models/immunization-transmission-status.js should pass ESLint\n\n4:10 - \'computed\' is defined but never used. (no-unused-vars)\n4:20 - \'get\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('templates/components/clinical/addon/models/immunization.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/immunization.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/medication-encounter.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/medication-encounter.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/medication.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/models/medication.js should pass ESLint\n\n2:10 - \'scheduleOnce\' is defined but never used. (no-unused-vars)\n40:30 - \'moment\' is not defined. (no-undef)\n40:56 - \'moment\' is not defined. (no-undef)\n44:31 - \'moment\' is not defined. (no-undef)\n44:57 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/models/medications-array.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/models/medications-array.js should pass ESLint\n\n52:19 - Use brace expansion (ember/use-brace-expansion)\n53:16 - \'_\' is not defined. (no-undef)\n66:23 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)');
  });

  QUnit.test('templates/components/clinical/addon/models/past-medical-history-section.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/models/past-medical-history-section.js should pass ESLint\n\n3:8 - \'config\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('templates/components/clinical/addon/models/patient-allergy.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/models/patient-allergy.js should pass ESLint\n\n58:28 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/models/patient-goal.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/patient-goal.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/patient-health-concern.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/patient-health-concern.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/patient-search-options.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/models/patient-search-options.js should pass ESLint\n\n24:43 - Unnecessary escape character: \\/. (no-useless-escape)\n24:56 - Unnecessary escape character: \\/. (no-useless-escape)\n24:78 - Unnecessary escape character: \\/. (no-useless-escape)\n24:90 - Unnecessary escape character: \\/. (no-useless-escape)\n24:103 - Unnecessary escape character: \\/. (no-useless-escape)\n24:115 - Unnecessary escape character: \\/. (no-useless-escape)\n24:129 - Unnecessary escape character: \\/. (no-useless-escape)\n24:141 - Unnecessary escape character: \\/. (no-useless-escape)\n24:163 - Unnecessary escape character: \\/. (no-useless-escape)\n24:175 - Unnecessary escape character: \\/. (no-useless-escape)\n24:189 - Unnecessary escape character: \\/. (no-useless-escape)\n24:201 - Unnecessary escape character: \\/. (no-useless-escape)\n24:223 - Unnecessary escape character: \\/. (no-useless-escape)\n24:244 - Unnecessary escape character: \\/. (no-useless-escape)\n24:255 - Unnecessary escape character: \\/. (no-useless-escape)\n24:268 - Unnecessary escape character: \\/. (no-useless-escape)\n24:279 - Unnecessary escape character: \\/. (no-useless-escape)\n24:293 - Unnecessary escape character: \\/. (no-useless-escape)\n24:304 - Unnecessary escape character: \\/. (no-useless-escape)\n24:326 - Unnecessary escape character: \\/. (no-useless-escape)\n24:337 - Unnecessary escape character: \\/. (no-useless-escape)\n24:351 - Unnecessary escape character: \\/. (no-useless-escape)\n24:362 - Unnecessary escape character: \\/. (no-useless-escape)\n24:384 - Unnecessary escape character: \\/. (no-useless-escape)\n24:406 - Unnecessary escape character: \\/. (no-useless-escape)\n24:418 - Unnecessary escape character: \\/. (no-useless-escape)\n24:431 - Unnecessary escape character: \\/. (no-useless-escape)\n24:443 - Unnecessary escape character: \\/. (no-useless-escape)\n24:457 - Unnecessary escape character: \\/. (no-useless-escape)\n24:469 - Unnecessary escape character: \\/. (no-useless-escape)\n24:491 - Unnecessary escape character: \\/. (no-useless-escape)\n24:503 - Unnecessary escape character: \\/. (no-useless-escape)\n24:517 - Unnecessary escape character: \\/. (no-useless-escape)\n24:529 - Unnecessary escape character: \\/. (no-useless-escape)\n24:561 - Unnecessary escape character: \\/. (no-useless-escape)\n24:574 - Unnecessary escape character: \\/. (no-useless-escape)\n24:596 - Unnecessary escape character: \\/. (no-useless-escape)\n24:608 - Unnecessary escape character: \\/. (no-useless-escape)\n24:621 - Unnecessary escape character: \\/. (no-useless-escape)\n24:633 - Unnecessary escape character: \\/. (no-useless-escape)\n24:647 - Unnecessary escape character: \\/. (no-useless-escape)\n24:659 - Unnecessary escape character: \\/. (no-useless-escape)\n24:681 - Unnecessary escape character: \\/. (no-useless-escape)\n24:693 - Unnecessary escape character: \\/. (no-useless-escape)\n24:707 - Unnecessary escape character: \\/. (no-useless-escape)\n24:719 - Unnecessary escape character: \\/. (no-useless-escape)\n24:741 - Unnecessary escape character: \\/. (no-useless-escape)\n24:762 - Unnecessary escape character: \\/. (no-useless-escape)\n24:773 - Unnecessary escape character: \\/. (no-useless-escape)\n24:786 - Unnecessary escape character: \\/. (no-useless-escape)\n24:797 - Unnecessary escape character: \\/. (no-useless-escape)\n24:811 - Unnecessary escape character: \\/. (no-useless-escape)\n24:822 - Unnecessary escape character: \\/. (no-useless-escape)\n24:844 - Unnecessary escape character: \\/. (no-useless-escape)\n24:855 - Unnecessary escape character: \\/. (no-useless-escape)\n24:869 - Unnecessary escape character: \\/. (no-useless-escape)\n24:880 - Unnecessary escape character: \\/. (no-useless-escape)\n24:902 - Unnecessary escape character: \\/. (no-useless-escape)\n24:924 - Unnecessary escape character: \\/. (no-useless-escape)\n24:936 - Unnecessary escape character: \\/. (no-useless-escape)\n24:949 - Unnecessary escape character: \\/. (no-useless-escape)\n24:961 - Unnecessary escape character: \\/. (no-useless-escape)\n24:975 - Unnecessary escape character: \\/. (no-useless-escape)\n24:987 - Unnecessary escape character: \\/. (no-useless-escape)\n24:1009 - Unnecessary escape character: \\/. (no-useless-escape)\n24:1021 - Unnecessary escape character: \\/. (no-useless-escape)\n24:1035 - Unnecessary escape character: \\/. (no-useless-escape)\n24:1047 - Unnecessary escape character: \\/. (no-useless-escape)');
  });

  QUnit.test('templates/components/clinical/addon/models/patient-summary-sia.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/models/patient-summary-sia.js should pass ESLint\n\n24:47 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/models/patient-summary.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/patient-summary.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/patient/activity-segment.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/patient/activity-segment.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/patient/order-preview.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/patient/order-preview.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/patient/preview.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/models/patient/preview.js should pass ESLint\n\n22:24 - \'moment\' is not defined. (no-undef)\n24:24 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/models/patient/result-preview.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/models/patient/result-preview.js should pass ESLint\n\n45:60 - \'Ember\' is not defined. (no-undef)\n60:43 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/models/personal-medical-history.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/personal-medical-history.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/provider-profile-to-profile-adapter.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/provider-profile-to-profile-adapter.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/race-option.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/race-option.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/recent-patient.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/recent-patient.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/relationshiptype.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/relationshiptype.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/smoking-status-type.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/smoking-status-type.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/smoking-status.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/models/smoking-status.js should pass ESLint\n\n22:20 - \'moment\' is not defined. (no-undef)\n25:39 - \'moment\' is not defined. (no-undef)\n25:46 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/models/social-health-field.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/social-health-field.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/social-health.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/social-health.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/social-history-option.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/social-history-option.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/social-history.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/social-history.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/sortable-array.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/sortable-array.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/sub-demographic-option.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/sub-demographic-option.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/vaccination-indication.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/vaccination-indication.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/vaccination-reaction.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/vaccination-reaction.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/vaccination-rejection.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/vaccination-rejection.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/vaccination-route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/vaccination-route.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/vaccination-site.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/vaccination-site.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/vaccination-source.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/vaccination-source.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/vaccination-unit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/vaccination-unit.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/vaccination.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/models/vaccination.js should pass ESLint\n\n58:16 - \'moment\' is not defined. (no-undef)\n65:20 - \'moment\' is not defined. (no-undef)\n71:23 - Use brace expansion (ember/use-brace-expansion)\n84:45 - \'moment\' is not defined. (no-undef)\n103:18 - Use brace expansion (ember/use-brace-expansion)');
  });

  QUnit.test('templates/components/clinical/addon/models/vaccine-inventory.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/models/vaccine-inventory.js should pass ESLint\n\n28:18 - Use brace expansion (ember/use-brace-expansion)\n39:16 - \'moment\' is not defined. (no-undef)\n43:16 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/models/vaccine-lookup-datum.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/vaccine-lookup-datum.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/vaccine-lot-usage.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/models/vaccine-lot-usage.js should pass ESLint\n\n22:20 - \'moment\' is not defined. (no-undef)\n25:46 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/models/vaccine-manufacturer.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/vaccine-manufacturer.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/vaccine-type.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/vaccine-type.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/vfc-status.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/models/vfc-status.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/models/vis-concept.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/models/vis-concept.js should pass ESLint\n\n15:19 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/models/worksheet-question.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/models/worksheet-question.js should pass ESLint\n\n122:24 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/models/worksheet-responses.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/models/worksheet-responses.js should pass ESLint\n\n125:17 - Use brace expansion (ember/use-brace-expansion)\n262:18 - Use brace expansion (ember/use-brace-expansion)\n269:12 - Use brace expansion (ember/use-brace-expansion)\n351:45 - \'moment\' is not defined. (no-undef)\n354:52 - \'moment\' is not defined. (no-undef)\n367:45 - \'moment\' is not defined. (no-undef)\n370:52 - \'moment\' is not defined. (no-undef)\n412:41 - Don\'t use .on() for component lifecycle events. (ember/no-on-calls-in-components)');
  });

  QUnit.test('templates/components/clinical/addon/repositories/assessments.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/repositories/assessments.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/repositories/ccda-preview.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/repositories/ccda-preview.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/repositories/devices.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/repositories/devices.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/repositories/diagnoses.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/repositories/diagnoses.js should pass ESLint\n\n309:46 - \'_\' is not defined. (no-undef)\n314:31 - \'_\' is not defined. (no-undef)\n316:31 - \'_\' is not defined. (no-undef)\n317:20 - \'_\' is not defined. (no-undef)\n346:34 - \'_\' is not defined. (no-undef)\n368:42 - \'_\' is not defined. (no-undef)\n372:32 - \'_\' is not defined. (no-undef)\n388:35 - \'_\' is not defined. (no-undef)\n389:33 - \'_\' is not defined. (no-undef)\n403:13 - \'toastr\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/repositories/family-health-history.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/repositories/family-health-history.js should pass ESLint\n\n1:10 - \'get\' is defined but never used. (no-unused-vars)');
  });

  QUnit.test('templates/components/clinical/addon/repositories/immunization-registry.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/repositories/immunization-registry.js should pass ESLint\n\n121:16 - \'$\' is not defined. (no-undef)\n136:31 - \'moment\' is not defined. (no-undef)\n140:43 - \'_\' is not defined. (no-undef)\n143:16 - \'_\' is not defined. (no-undef)\n158:20 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/repositories/immunization.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/repositories/immunization.js should pass ESLint\n\n24:28 - \'_\' is not defined. (no-undef)\n40:28 - \'_\' is not defined. (no-undef)\n96:16 - \'_\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/repositories/interaction-alerts.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/repositories/interaction-alerts.js should pass ESLint\n\n67:47 - \'$\' is not defined. (no-undef)\n186:35 - \'_\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/repositories/medications.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/repositories/medications.js should pass ESLint\n\n60:43 - \'moment\' is not defined. (no-undef)\n67:43 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/repositories/patient-demographics.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/repositories/patient-demographics.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/repositories/patient.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/repositories/patient.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/repositories/patients.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/repositories/patients.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/repositories/worksheets.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/repositories/worksheets.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/allergy.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/allergy.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/detail-pane.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/detail-pane.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/device.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/device.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/diagnosis.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/diagnosis.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/encounter/allergy.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/encounter/allergy.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/encounter/diagnosis.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/encounter/diagnosis.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/encounter/health-concern.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/encounter/health-concern.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/encounter/medication.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/encounter/medication.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/encounter/pmh.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/encounter/pmh.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/encounter/risk-score.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/encounter/risk-score.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/encounter/smoking.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/encounter/smoking.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/encounter/social.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/encounter/social.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/encounter/worksheet.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/encounter/worksheet.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/goal.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/routes/goal.js should pass ESLint\n\n17:32 - \'moment\' is not defined. (no-undef)\n45:21 - \'toastr\' is not defined. (no-undef)\n55:28 - \'moment\' is not defined. (no-undef)\n68:13 - \'toastr\' is not defined. (no-undef)\n75:13 - \'toastr\' is not defined. (no-undef)\n108:25 - \'toastr\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/routes/health-concern.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/routes/health-concern.js should pass ESLint\n\n38:13 - \'toastr\' is not defined. (no-undef)\n52:28 - \'moment\' is not defined. (no-undef)\n71:21 - \'toastr\' is not defined. (no-undef)\n75:25 - \'toastr\' is not defined. (no-undef)\n101:21 - \'toastr\' is not defined. (no-undef)\n103:32 - \'toastr\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/routes/medication.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/medication.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/patient.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/routes/patient.js should pass ESLint\n\n34:21 - \'toastr\' is not defined. (no-undef)\n245:17 - \'toastr\' is not defined. (no-undef)\n305:21 - \'toastr\' is not defined. (no-undef)\n325:21 - \'toastr\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/routes/patient/familyhealthhistory.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/patient/familyhealthhistory.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/patient/familyhistory.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/patient/familyhistory.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/patient/growth/charts.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/patient/growth/charts.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/patient/immunizations.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/routes/patient/immunizations.js should pass ESLint\n\n47:13 - \'toastr\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/routes/patient/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/patient/index.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/patient/summary.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/routes/patient/summary.js should pass ESLint\n\n87:17 - \'toastr\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/routes/patients.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/patients.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/patients/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/patients/index.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/pmh.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/pmh.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/practice-dashboard/clinical-trials.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/practice-dashboard/clinical-trials.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/risk-score.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/routes/risk-score.js should pass ESLint\n\n13:58 - \'moment\' is not defined. (no-undef)\n17:105 - \'moment\' is not defined. (no-undef)\n56:21 - \'toastr\' is not defined. (no-undef)\n64:21 - \'toastr\' is not defined. (no-undef)\n92:17 - \'toastr\' is not defined. (no-undef)\n96:17 - \'toastr\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/routes/settings/favorite-diagnoses.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/settings/favorite-diagnoses.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/smoking.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/routes/smoking.js should pass ESLint\n\n24:28 - \'moment\' is not defined. (no-undef)\n24:35 - \'moment\' is not defined. (no-undef)\n99:21 - \'toastr\' is not defined. (no-undef)\n163:21 - \'toastr\' is not defined. (no-undef)\n166:26 - \'toastr\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/routes/social.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/routes/social.js should pass ESLint\n\n46:21 - \'toastr\' is not defined. (no-undef)\n59:21 - \'toastr\' is not defined. (no-undef)\n89:21 - \'toastr\' is not defined. (no-undef)\n103:21 - \'toastr\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/routes/summary/advance-directive.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/routes/summary/advance-directive.js should pass ESLint\n\n15:28 - \'moment\' is not defined. (no-undef)\n39:21 - \'toastr\' is not defined. (no-undef)\n71:21 - \'toastr\' is not defined. (no-undef)\n74:26 - \'toastr\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/routes/summary/allergy.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/summary/allergy.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/summary/behavioral.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/summary/behavioral.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/summary/device.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/summary/device.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/summary/diagnosis.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/summary/diagnosis.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/summary/family-health-history.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/summary/family-health-history.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/summary/goal.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/summary/goal.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/summary/health-concern.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/summary/health-concern.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/summary/medication.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/summary/medication.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/summary/nutrition.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/summary/nutrition.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/summary/pmh.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/summary/pmh.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/summary/risk-score.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/summary/risk-score.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/summary/sia.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/routes/summary/sia.js should pass ESLint\n\n29:17 - \'toastr\' is not defined. (no-undef)\n33:13 - \'toastr\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/routes/summary/smoking.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/summary/smoking.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/summary/social-health.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/summary/social-health.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/summary/social.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/summary/social.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/summary/summary-pmh.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/routes/summary/summary-pmh.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/routes/support-info.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/routes/support-info.js should pass ESLint\n\n21:5 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)\n23:5 - Only string, number, symbol, boolean, null, undefined, and function are allowed as default properties (ember/avoid-leaking-state-in-ember-objects)');
  });

  QUnit.test('templates/components/clinical/addon/serializers/advanced-directive.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/advanced-directive.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/allergy-reaction.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/allergy-reaction.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/allergy-substance.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/allergy-substance.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/appointment.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/appointment.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/behavioral-health.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/behavioral-health.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/care-team-member.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/care-team-member.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/care-team.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/care-team.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/ccda-document-type.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/ccda-document-type.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/ccda-template-component.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/ccda-template-component.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/clinical-document.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/clinical-document.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/demographic-option.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/demographic-option.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/ethnicity-option.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/ethnicity-option.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/favorite-diagnosis.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/favorite-diagnosis.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/immunization-drug.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/immunization-drug.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/immunization-funding-source.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/immunization-funding-source.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/immunization-option-notification.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/immunization-option-notification.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/immunization-option-protection.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/immunization-option-protection.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/immunization-option-status.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/immunization-option-status.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/immunization-registry-connection-property.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/immunization-registry-connection-property.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/immunization-registry-connection.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/immunization-registry-connection.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/immunization-registry-filter.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/immunization-registry-filter.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/immunization-registry-notification-preference.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/immunization-registry-notification-preference.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/immunization-registry-option.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/immunization-registry-option.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/immunization-registry-property.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/immunization-registry-property.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/immunization-registry-result.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/immunization-registry-result.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/immunization-registry.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/immunization-registry.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/immunization-transmission-status.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/immunization-transmission-status.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/immunization.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/immunization.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/patient-allergy.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/patient-allergy.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/patient-goal.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/patient-goal.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/patient-health-concern.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/patient-health-concern.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/patient-summary-sia.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/patient-summary-sia.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/patient-summary.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/patient-summary.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/personal-medical-history.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/personal-medical-history.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/race-option.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/race-option.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/recent-patient.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/recent-patient.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/smoking-status-type.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/smoking-status-type.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/smoking-status.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/serializers/smoking-status.js should pass ESLint\n\n9:37 - \'moment\' is not defined. (no-undef)\n24:30 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/serializers/social-health-field.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/social-health-field.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/social-health.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/serializers/social-health.js should pass ESLint\n\n40:34 - \'_\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/serializers/social-history-option.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/social-history-option.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/social-history.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/serializers/social-history.js should pass ESLint\n\n10:46 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/serializers/sub-demographic-option.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/sub-demographic-option.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/vaccination-indication.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/vaccination-indication.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/vaccination-reaction.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/vaccination-reaction.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/vaccination-rejection.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/vaccination-rejection.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/vaccination-route.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/vaccination-route.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/vaccination-site.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/vaccination-site.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/vaccination-source.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/vaccination-source.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/vaccination-unit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/vaccination-unit.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/vaccination.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/serializers/vaccination.js should pass ESLint\n\n42:20 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/serializers/vaccine-inventory.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/serializers/vaccine-inventory.js should pass ESLint\n\n21:55 - \'moment\' is not defined. (no-undef)\n25:58 - \'moment\' is not defined. (no-undef)\n27:58 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/serializers/vaccine-lookup-datum.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/serializers/vaccine-lookup-datum.js should pass ESLint\n\n30:25 - \'_\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/serializers/vaccine-lot-usage.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/serializers/vaccine-lot-usage.js should pass ESLint\n\n11:36 - \'moment\' is not defined. (no-undef)');
  });

  QUnit.test('templates/components/clinical/addon/serializers/vaccine-manufacturer.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/vaccine-manufacturer.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/vaccine-type.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/vaccine-type.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/vfc-status.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/vfc-status.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/serializers/vis-concept.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/serializers/vis-concept.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/services/transcript-comments.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/addon/services/transcript-comments.js should pass ESLint\n\n7:5 - Call this._super(...arguments) in init hook (ember/require-super-in-init)');
  });

  QUnit.test('templates/components/clinical/addon/transforms/patient-activity-segment-array.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/transforms/patient-activity-segment-array.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/util/assessments/prolia-aesi-modal.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/util/assessments/prolia-aesi-modal.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/util/patient-search.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/util/patient-search.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/addon/util/transcript-comments.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'templates/components/clinical/addon/util/transcript-comments.js should pass ESLint\n\n');
  });

  QUnit.test('templates/components/clinical/index.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'templates/components/clinical/index.js should pass ESLint\n\n1:21 - \'require\' is not defined. (no-undef)\n4:1 - \'module\' is not defined. (no-undef)');
  });
});
define('cute-cats-tanisha/tests/lint/tests.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | tests');

  QUnit.test('integration/components/image-row-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/image-row-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/image-tile-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/image-tile-test.js should pass ESLint\n\n');
  });

  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/homepage-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/homepage-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/index-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/index-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/services/ajax-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/ajax-test.js should pass ESLint\n\n');
  });
});
define('cute-cats-tanisha/tests/test-helper', ['cute-cats-tanisha/app', 'cute-cats-tanisha/config/environment', '@ember/test-helpers', 'ember-qunit'], function (_app, _environment, _testHelpers, _emberQunit) {
  'use strict';

  (0, _testHelpers.setApplication)(_app.default.create(_environment.default.APP));

  (0, _emberQunit.start)();
});
define('cute-cats-tanisha/tests/unit/routes/homepage-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | homepage', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:homepage');
      assert.ok(route);
    });
  });
});
define('cute-cats-tanisha/tests/unit/routes/index-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Route | index', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    (0, _qunit.test)('it exists', function (assert) {
      let route = this.owner.lookup('route:index');
      assert.ok(route);
    });
  });
});
define('cute-cats-tanisha/tests/unit/services/ajax-test', ['qunit', 'ember-qunit'], function (_qunit, _emberQunit) {
  'use strict';

  (0, _qunit.module)('Unit | Service | ajax', function (hooks) {
    (0, _emberQunit.setupTest)(hooks);

    // Replace this with your real tests.
    (0, _qunit.test)('it exists', function (assert) {
      let service = this.owner.lookup('service:ajax');
      assert.ok(service);
    });
  });
});
define('cute-cats-tanisha/config/environment', [], function() {
  var prefix = 'cute-cats-tanisha';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

require('cute-cats-tanisha/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map