import { empty } from '@ember/object/computed';
import Component from "@ember/component";
import WithPatientPrintTitleMixin from 'charting/mixins/with-patient-print-title';
import { computed } from '@ember/object';

export default Component.extend(WithPatientPrintTitleMixin, {
    isVisible: false,
    isRegistryRecord: false,
    hasNoForecastResults: empty('registryContent.forecast'),
    hasNoHistoryResults: empty('registryContent.history')
});
