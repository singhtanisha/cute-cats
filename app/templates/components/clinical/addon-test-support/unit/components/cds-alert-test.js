import { run } from '@ember/runloop';
import { moduleForComponent, test } from 'ember-qunit';

const getDefaultCdsAlert = function () {
    return {
        actionLinkText: 'Record',
        actionLinkData: ''
    };
};

moduleForComponent('cds-alert', 'Unit - Core - Clinical | Component - cds-alert', {
    needs: ['service:analytics', 'service:pf-routing'],
    unit: true,
    afterEach() {
        const store = this.container.lookup('service:store');

        if (store) {
            store.destroy = function () {
                // Do nothing because this breaks pre ember-data beta 1.15
            };
        }
    }
});

test('valid data property parsing', function (assert) {
    run(() => {
        const component = this.subject();

        const cdsAlert = getDefaultCdsAlert();
        cdsAlert.actionLinkData = 'isValid=true&name=something&option=';
        component.set('cdsAlert', cdsAlert);

        const data = component.get('data');
        assert.equal(data.isValid, 'true');
        assert.equal(data.name, 'something');
        assert.equal(data.option, '');
    });
});

test('null data property', function (assert) {
    run(() => {
        const component = this.subject();

        const cdsAlert = getDefaultCdsAlert();
        cdsAlert.actionLinkData = '';
        component.set('cdsAlert', cdsAlert);

        let data = component.get('data');
        assert.equal(data, null);

        component.set('cdsAlert.actionLinkData', null);
        data = component.get('data');
        assert.equal(data, null);
    });
});
